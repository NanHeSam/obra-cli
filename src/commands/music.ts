import { Command } from 'commander';
import { getProvider } from '../providers/registry.js';
import { getTaskDefaults } from '../core/config.js';
import {
  error,
  info,
  spinner,
  printTaskResult,
  printModelList,
  printModelInfo,
  printJson,
  keyValue,
} from '../core/output.js';
import { KieClient } from '../providers/kie/client.js';
import { poll } from '../utils/polling.js';
import type { TaskStatus, TaskResult } from '../core/types.js';

// Default callback URL (placeholder - Suno requires it but CLI doesn't use callbacks)
const DEFAULT_CALLBACK_URL = 'https://api.example.com/callback';

/**
 * Map Suno music status to TaskStatus
 */
function mapMusicStatusToTaskStatus(
  taskId: string,
  sunoStatus: string,
  errorMessage?: string | null
): TaskStatus {
  let status: TaskStatus['status'];
  
  if (sunoStatus === 'SUCCESS') {
    status = 'success';
  } else if (
    sunoStatus === 'CREATE_TASK_FAILED' ||
    sunoStatus === 'GENERATE_AUDIO_FAILED' ||
    sunoStatus === 'CALLBACK_EXCEPTION' ||
    sunoStatus === 'SENSITIVE_WORD_ERROR'
  ) {
    status = 'fail';
  } else {
    status = 'generating'; // PENDING, TEXT_SUCCESS, FIRST_SUCCESS
  }

  return {
    id: taskId,
    status,
    message: errorMessage || undefined,
  };
}

/**
 * Convert Suno music response to TaskResult
 */
function convertMusicResponseToTaskResult(
  taskId: string,
  response: {
    taskId: string;
    sunoData?: Array<{
      id: string;
      audioUrl?: string;
      streamAudioUrl?: string;
      imageUrl?: string;
      title?: string;
      duration?: number;
    }>;
  },
  status: string
): TaskResult {
  const outputs: TaskResult['outputs'] = [];
  const metadata: Record<string, unknown> = {};

  if (response.sunoData) {
    for (const track of response.sunoData) {
      if (track.audioUrl) {
        outputs.push({
          url: track.audioUrl,
          type: 'audio',
          duration: track.duration,
        });
      }
      if (track.imageUrl) {
        outputs.push({
          url: track.imageUrl,
          type: 'image',
        });
      }
      metadata[track.id] = {
        audioId: track.id,
        title: track.title,
        duration: track.duration,
        audioUrl: track.audioUrl,
        streamAudioUrl: track.streamAudioUrl,
        imageUrl: track.imageUrl,
      };
    }
  }

  return {
    id: taskId,
    status: status === 'SUCCESS' ? 'success' : 'fail',
    outputs,
    metadata,
  };
}

/**
 * Convert Suno lyrics response to TaskResult
 */
function convertLyricsResponseToTaskResult(
  taskId: string,
  response: {
    taskId: string;
    data?: Array<{
      text: string;
      title: string;
      status: string;
      errorMessage?: string;
    }>;
  },
  status: string
): TaskResult {
  const outputs: TaskResult['outputs'] = [];
  const metadata: Record<string, unknown> = { lyrics: [] };

  if (response.data) {
    for (const lyric of response.data) {
      outputs.push({
        url: '', // Lyrics don't have URLs
        type: 'text',
      });
      (metadata.lyrics as unknown[]).push({
        text: lyric.text,
        title: lyric.title,
        status: lyric.status,
      });
    }
  }

  return {
    id: taskId,
    status: status === 'SUCCESS' ? 'success' : 'fail',
    outputs,
    metadata,
  };
}

export function registerMusicCommand(program: Command): void {
  const musicCmd = program
    .command('music')
    .description('Music generation commands');

  // music generate <prompt>
  musicCmd
    .command('generate <prompt>')
    .description('Generate music from a text prompt using Suno API')
    .option('-m, --model <model>', 'Suno model to use (V3_5, V4, V4_5, V4_5PLUS, V4_5ALL, V5)', 'V4_5')
    .option('-c, --custom-mode', 'Enable custom mode (requires style and title)')
    .option('-i, --instrumental', 'Generate instrumental only (no vocals)')
    .option('-s, --style <style>', 'Music style/genre (required in custom mode)')
    .option('-t, --title <title>', 'Track title (required in custom mode)')
    .option('--negative-tags <tags>', 'Music styles to exclude')
    .option('--vocal-gender <gender>', 'Vocal gender (m or f)', /^(m|f)$/i)
    .option('--style-weight <weight>', 'Style adherence strength (0-1)', parseFloat)
    .option('--weirdness-constraint <constraint>', 'Creative deviation control (0-1)', parseFloat)
    .option('--audio-weight <weight>', 'Audio feature balance (0-1)', parseFloat)
    .option('--persona-id <id>', 'Persona ID to apply')
    .option('--callback-url <url>', 'Callback URL (default: placeholder)', DEFAULT_CALLBACK_URL)
    .option('-w, --wait', 'Wait for completion')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (prompt: string, options) => {
      try {
        const provider = getProvider(options.provider);
        const defaults = getTaskDefaults('music');

        // Validate provider is configured
        const validation = provider.validateConfig();
        if (!validation.valid) {
          for (const err of validation.errors) {
            error(err);
          }
          process.exit(1);
        }

        const client = new KieClient();
        const model = options.model || defaults.model || 'V4_5';
        const customMode = options.customMode || false;
        const instrumental = options.instrumental || false;
        const callBackUrl = options.callbackUrl || DEFAULT_CALLBACK_URL;

        // Validate custom mode requirements
        if (customMode) {
          if (instrumental) {
            if (!options.style || !options.title) {
              error('Custom mode with instrumental requires --style and --title');
              process.exit(1);
            }
          } else {
            if (!options.style || !options.title || !prompt) {
              error('Custom mode with vocals requires --style, --title, and prompt');
              process.exit(1);
            }
          }
        }

        const spin = spinner('Creating music generation task...');
        spin.start();

        const response = await client.generateMusic({
          prompt: customMode && !instrumental ? prompt : prompt,
          customMode,
          instrumental,
          model,
          callBackUrl,
          style: options.style,
          title: options.title,
          negativeTags: options.negativeTags,
          vocalGender: options.vocalGender as 'm' | 'f' | undefined,
          styleWeight: options.styleWeight,
          weirdnessConstraint: options.weirdnessConstraint,
          audioWeight: options.audioWeight,
          personaId: options.personaId,
        });

        const taskId = response.data.taskId;
        spin.succeed(`Task created: ${taskId}`);

        if (callBackUrl === DEFAULT_CALLBACK_URL) {
          info(`Note: Using default callback URL. Set --callback-url for production use.`);
        }

        if (options.wait) {
          const waitSpin = spinner('Generating music...');
          waitSpin.start();

          const finalStatus = await poll(
            async () => {
              const statusResponse = await client.getMusicStatus(taskId);
              return mapMusicStatusToTaskStatus(
                taskId,
                statusResponse.data.status,
                statusResponse.data.errorMessage
              );
            },
            {
              onProgress: (status) => {
                waitSpin.text = `Generating music... Status: ${status.status}`;
              },
            }
          );

          waitSpin.stop();

          // Get final result
          const finalResponse = await client.getMusicStatus(taskId);
          const result = convertMusicResponseToTaskResult(
            taskId,
            finalResponse.data.response || { taskId },
            finalResponse.data.status
          );

          if (options.json) {
            printJson({
              ...result,
              rawResponse: finalResponse.data,
            });
          } else {
            printTaskResult(result);
            
            // Print additional metadata
            if (result.metadata) {
              console.log('\nGenerated tracks:');
              for (const [audioId, trackData] of Object.entries(result.metadata)) {
                const track = trackData as { title?: string; duration?: number; audioUrl?: string };
                keyValue('Audio ID', audioId);
                if (track.title) keyValue('Title', track.title);
                if (track.duration) keyValue('Duration', `${track.duration}s`);
                if (track.audioUrl) keyValue('Audio URL', track.audioUrl);
                console.log('');
              }
            }

            if (result.status === 'success' && result.outputs.length > 0) {
              info(`Use 'kai music timestamps ${taskId} <audioId>' to get synchronized lyrics`);
            }
          }

          if (result.status === 'fail') {
            process.exit(1);
          }
        } else {
          if (options.json) {
            printJson({ taskId, status: 'pending' });
          } else {
            info(`Check status: kai status ${taskId}`);
            info(`Wait for completion: kai music generate <prompt> --wait`);
          }
        }
      } catch (err) {
        error(`Failed to generate music: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // music lyrics <prompt>
  musicCmd
    .command('lyrics <prompt>')
    .description('Generate lyrics from a prompt using Suno API')
    .option('--callback-url <url>', 'Callback URL (default: placeholder)', DEFAULT_CALLBACK_URL)
    .option('-w, --wait', 'Wait for completion (default: true)', true)
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (prompt: string, options) => {
      try {
        const provider = getProvider(options.provider);

        // Validate provider is configured
        const validation = provider.validateConfig();
        if (!validation.valid) {
          for (const err of validation.errors) {
            error(err);
          }
          process.exit(1);
        }

        const client = new KieClient();
        const callBackUrl = options.callbackUrl || DEFAULT_CALLBACK_URL;

        const spin = spinner('Generating lyrics...');
        spin.start();

        const response = await client.generateLyrics({
          prompt,
          callBackUrl,
        });

        const taskId = response.data.taskId;

        if (callBackUrl === DEFAULT_CALLBACK_URL) {
          info(`Note: Using default callback URL. Set --callback-url for production use.`);
        }

        if (options.wait !== false) {
          const finalStatus = await poll(
            async () => {
              const statusResponse = await client.getLyricsStatus(taskId);
              const sunoStatus = statusResponse.data.status;
              let status: TaskStatus['status'];
              
              if (sunoStatus === 'SUCCESS') {
                status = 'success';
              } else if (
                sunoStatus === 'CREATE_TASK_FAILED' ||
                sunoStatus === 'GENERATE_LYRICS_FAILED' ||
                sunoStatus === 'CALLBACK_EXCEPTION' ||
                sunoStatus === 'SENSITIVE_WORD_ERROR'
              ) {
                status = 'fail';
              } else {
                status = 'generating';
              }

              return {
                id: taskId,
                status,
                message: statusResponse.data.errorMessage || undefined,
              };
            },
            {
              onProgress: (status) => {
                spin.text = `Generating lyrics... Status: ${status.status}`;
              },
            }
          );

          spin.stop();

          // Get final result
          const finalResponse = await client.getLyricsStatus(taskId);
          const result = convertLyricsResponseToTaskResult(
            taskId,
            finalResponse.data.response || { taskId },
            finalResponse.data.status
          );

          if (options.json) {
            printJson({
              ...result,
              rawResponse: finalResponse.data,
            });
          } else {
            printTaskResult(result);
            
            // Print lyrics content
            if (result.metadata?.lyrics) {
              console.log('\nGenerated lyrics:');
              for (const lyric of result.metadata.lyrics as Array<{ text: string; title: string }>) {
                console.log(`\n${lyric.title}:`);
                console.log(lyric.text);
              }
            }
          }

          if (result.status === 'fail') {
            process.exit(1);
          }
        } else {
          spin.succeed(`Task created: ${taskId}`);
          if (options.json) {
            printJson({ taskId, status: 'pending' });
          } else {
            info(`Check status: kai status ${taskId}`);
          }
        }
      } catch (err) {
        error(`Failed to generate lyrics: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // music timestamps <taskId> <audioId>
  musicCmd
    .command('timestamps <taskId> <audioId>')
    .description('Get time-synchronized lyrics for a music track')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (taskId: string, audioId: string, options) => {
      try {
        const provider = getProvider(options.provider);

        // Validate provider is configured
        const validation = provider.validateConfig();
        if (!validation.valid) {
          for (const err of validation.errors) {
            error(err);
          }
          process.exit(1);
        }

        const client = new KieClient();
        const spin = spinner('Fetching timestamped lyrics...');
        spin.start();

        const response = await client.getTimestampedLyrics({ taskId, audioId });

        spin.stop();

        if (options.json) {
          printJson(response.data);
        } else {
          console.log('\nTimestamped Lyrics:');
          keyValue('Task ID', taskId);
          keyValue('Audio ID', audioId);
          keyValue('Confidence', `${(response.data.hootCer * 100).toFixed(2)}%`);
          keyValue('Streamed', response.data.isStreamed ? 'Yes' : 'No');
          
          if (response.data.alignedWords.length > 0) {
            console.log('\nAligned Words:');
            for (const word of response.data.alignedWords.slice(0, 20)) {
              console.log(`  [${word.startS.toFixed(2)}s - ${word.endS.toFixed(2)}s] ${word.word}`);
            }
            if (response.data.alignedWords.length > 20) {
              console.log(`  ... and ${response.data.alignedWords.length - 20} more words`);
            }
          }

          if (response.data.waveformData.length > 0) {
            console.log(`\nWaveform data: ${response.data.waveformData.length} samples`);
          }
        }
      } catch (err) {
        error(`Failed to get timestamped lyrics: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // music video <taskId> <audioId>
  musicCmd
    .command('video <taskId> <audioId>')
    .description('Create a music video from a generated music track')
    .option('--author <name>', 'Author name for the video')
    .option('--domain <domain>', 'Domain name for branding')
    .option('--callback-url <url>', 'Callback URL (default: placeholder)', DEFAULT_CALLBACK_URL)
    .option('-w, --wait', 'Wait for completion')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (taskId: string, audioId: string, options) => {
      try {
        const provider = getProvider(options.provider);

        // Validate provider is configured
        const validation = provider.validateConfig();
        if (!validation.valid) {
          for (const err of validation.errors) {
            error(err);
          }
          process.exit(1);
        }

        const client = new KieClient();
        const callBackUrl = options.callbackUrl || DEFAULT_CALLBACK_URL;

        const spin = spinner('Creating music video task...');
        spin.start();

        const response = await client.createMusicVideo({
          taskId,
          audioId,
          callBackUrl,
          author: options.author,
          domainName: options.domain,
        });

        const videoTaskId = response.data.taskId;
        spin.succeed(`Video task created: ${videoTaskId}`);

        if (callBackUrl === DEFAULT_CALLBACK_URL) {
          info(`Note: Using default callback URL. Set --callback-url for production use.`);
        }

        if (options.wait) {
          const waitSpin = spinner('Generating music video...');
          waitSpin.start();

          const finalStatus = await poll(
            async () => {
              const statusResponse = await client.getMusicVideoStatus(videoTaskId);
              const sunoStatus = statusResponse.data.successFlag;
              let status: TaskStatus['status'];
              
              if (sunoStatus === 'SUCCESS') {
                status = 'success';
              } else if (
                sunoStatus === 'CREATE_TASK_FAILED' ||
                sunoStatus === 'GENERATE_MP4_FAILED'
              ) {
                status = 'fail';
              } else {
                status = 'generating';
              }

              return {
                id: videoTaskId,
                status,
                message: statusResponse.data.errorMessage || undefined,
              };
            },
            {
              onProgress: (status) => {
                waitSpin.text = `Generating music video... Status: ${status.status}`;
              },
            }
          );

          waitSpin.stop();

          // Get final result
          const finalResponse = await client.getMusicVideoStatus(videoTaskId);
          const videoUrl = finalResponse.data.response?.videoUrl;

          if (options.json) {
            printJson({
              taskId: videoTaskId,
              status: finalStatus.status,
              videoUrl,
              rawResponse: finalResponse.data,
            });
          } else {
            console.log('\nMusic Video Result:');
            keyValue('Task ID', videoTaskId);
            keyValue('Status', finalStatus.status === 'success' ? 'success' : 'fail');
            if (videoUrl) {
              keyValue('Video URL', videoUrl);
            }
            if (finalResponse.data.errorMessage) {
              keyValue('Error', finalResponse.data.errorMessage);
            }
          }

          if (finalStatus.status === 'fail') {
            process.exit(1);
          }
        } else {
          if (options.json) {
            printJson({ taskId: videoTaskId, status: 'pending' });
          } else {
            info(`Check status: kai status ${videoTaskId}`);
            info(`Wait for completion: kai music video ${taskId} ${audioId} --wait`);
          }
        }
      } catch (err) {
        error(`Failed to create music video: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // music list
  musicCmd
    .command('list')
    .description('List available music models')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--flat', 'Show flat list instead of grouped by family')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const provider = getProvider(options.provider);
        const models = await provider.listModels('music');

        if (options.json) {
          printJson(models);
        } else {
          console.log('\nAvailable music models:\n');
          printModelList(models);
        }
      } catch (err) {
        error(`Failed to list models: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // music info <model>
  musicCmd
    .command('info <model>')
    .description('Show model details and available flags')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (model: string, options) => {
      try {
        const provider = getProvider(options.provider);
        const modelInfo = await provider.getModelInfo(model);

        if (options.json) {
          printJson(modelInfo);
        } else {
          printModelInfo(modelInfo);
        }
      } catch (err) {
        error(`Failed to get model info: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
