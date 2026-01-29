import { Command } from 'commander';
import { getProvider } from '../providers/registry.js';
import {
  error,
  info,
  spinner,
  printTaskResult,
  printModelList,
  printModelListGrouped,
  printJson,
} from '../core/output.js';
import { getKieModelById, getKieModelsByType, groupModelsByFamily, getModelInfoByType } from '../providers/kie/model-registry.js';
import { printKieModelDocumentation, printKieModelValidationError } from '../providers/kie/output.js';
import { KieModelValidationError } from '../providers/kie/model-validation.js';
import { parseJsonParams, parseParamPairs } from './params.js';

export function registerVideoCommand(program: Command): void {
  const videoCmd = program
    .command('video')
    .description('Video generation commands');

  // video generate [prompt]
  const generateCmd = videoCmd
    .command('generate [prompt]')
    .description('Generate a video from a text prompt')
    .option('--prompt <prompt>', 'Prompt text (alternative to positional argument)')
    .option('-m, --model <model>', 'Model to use')
    .option('-i, --image <path>', 'Reference image for image-to-video')
    .option('-o, --output <path>', 'Output file path')
    .option('--param <key=value>', 'Model parameter override (repeatable)', (value, previous) => {
      previous.push(value);
      return previous;
    }, [] as string[])
    .option('--params-json <json>', 'JSON object of model parameters')
    .option('--callback-url <url>', 'Callback URL for task completion updates')
    .option('-w, --wait', 'Wait for completion')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (prompt: string | undefined, options) => {
      let spin: ReturnType<typeof spinner> | undefined;
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

        const model = options.model || 'grok-imagine/text-to-video';
        const params: Record<string, unknown> = {};
        const resolvedPrompt = options.prompt ?? prompt;
        if (!resolvedPrompt) {
          error('Missing prompt. Provide a positional prompt or use --prompt.');
          generateCmd.outputHelp();
          process.exit(1);
        }
        params.prompt = resolvedPrompt;
        if (options.image) params.image_url = options.image;
        if (options.callbackUrl) params.callBackUrl = options.callbackUrl;

        const jsonParams = parseJsonParams(options.paramsJson);
        const paramPairs = parseParamPairs(options.param);
        const mergedParams = { ...params, ...jsonParams, ...paramPairs };

        spin = spinner('Creating video generation task...');
        spin.start();

        const task = await provider.createTask('video', model, mergedParams);

        spin.succeed(`Task created: ${task.id}`);

        if (options.wait) {
          const waitSpin = spinner('Generating video...');
          waitSpin.start();

          const result = await provider.waitForCompletion(task.id, {
            onProgress: (status) => {
              if (status.progress !== undefined) {
                waitSpin.text = `Generating video... ${status.progress}%`;
              } else if (status.queuePosition !== undefined) {
                waitSpin.text = `Waiting in queue (position ${status.queuePosition})...`;
              }
            },
          });

          waitSpin.stop();

          if (options.json) {
            printJson(result);
          } else {
            printTaskResult(result);

            if (result.status === 'success' && result.outputs.length > 0) {
              if (options.output) {
                info(`Download the video using: obra download ${task.id} --output ${options.output}`);
              }
            }
          }

          if (result.status === 'fail') {
            process.exit(1);
          }
        } else {
          if (options.json) {
            printJson({ taskId: task.id, status: task.status });
          } else {
            info(`Check status: obra status ${task.id}`);
            info(`Wait for completion: obra status ${task.id} --wait`);
          }
        }
      } catch (err) {
        spin?.stop();
        if (err instanceof KieModelValidationError) {
          printKieModelValidationError(err, { command: 'video' });
          process.exit(1);
        }
        error(`Failed to generate video: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // video list
  videoCmd
    .command('list')
    .description('List available video models')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--flat', 'Show flat list instead of grouped by family')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const models = getKieModelsByType('video');
        if (options.json) {
          printJson(models);
          return;
        }

        if (options.flat) {
          console.log('\nAvailable video models:\n');
          printModelList(getModelInfoByType('video'));
          return;
        }

        console.log('\nAvailable video models:');
        printModelListGrouped(groupModelsByFamily('video'));
      } catch (err) {
        error(`Failed to list models: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // video info <model>
  videoCmd
    .command('info <model>')
    .description('Show model details and available flags')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (model: string, options) => {
      try {
        const modelInfo = getKieModelById(model);
        if (!modelInfo) {
          throw new Error(`Model "${model}" not found. Run: obra video list`);
        }

        if (options.json) {
          printJson(modelInfo);
        } else {
          printKieModelDocumentation(modelInfo, { command: 'video' });
        }
      } catch (err) {
        error(`Failed to get model info: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
