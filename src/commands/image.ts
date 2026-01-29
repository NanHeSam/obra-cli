import { Command } from 'commander';
import { getProvider } from '../providers/registry.js';
import { getTaskDefaults } from '../core/config.js';
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

export function registerImageCommand(program: Command): void {
  const imageCmd = program
    .command('image')
    .description('Image generation commands');

  // image generate [prompt]
  imageCmd
    .command('generate [prompt]')
    .description('Generate an image from a text prompt')
    .option('-m, --model <model>', 'Model to use')
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
        const defaults = getTaskDefaults('image');

        // Validate provider is configured
        const validation = provider.validateConfig();
        if (!validation.valid) {
          for (const err of validation.errors) {
            error(err);
          }
          process.exit(1);
        }

        const model = options.model || defaults.model || 'flux-2/pro-text-to-image';
        const params: Record<string, unknown> = {};
        if (prompt) params.prompt = prompt;
        if (options.callbackUrl) params.callBackUrl = options.callbackUrl;

        const jsonParams = parseJsonParams(options.paramsJson);
        const paramPairs = parseParamPairs(options.param);
        const mergedParams = { ...params, ...jsonParams, ...paramPairs };

        spin = spinner('Creating image generation task...');
        spin.start();

        const task = await provider.createTask('image', model, mergedParams);

        spin.succeed(`Task created: ${task.id}`);

        if (options.wait) {
          const waitSpin = spinner('Generating image...');
          waitSpin.start();

          const result = await provider.waitForCompletion(task.id, {
            onProgress: (status) => {
              if (status.progress !== undefined) {
                waitSpin.text = `Generating image... ${status.progress}%`;
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
                info(`Download the image using: obra download ${task.id} --output ${options.output}`);
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
          printKieModelValidationError(err, { command: 'image' });
          process.exit(1);
        }
        error(`Failed to generate image: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // image list
  imageCmd
    .command('list')
    .description('List available image models')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--flat', 'Show flat list instead of grouped by family')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const models = getKieModelsByType('image');
        if (options.json) {
          printJson(models);
          return;
        }

        if (options.flat) {
          console.log('\nAvailable image models:\n');
          printModelList(getModelInfoByType('image'));
          return;
        }

        console.log('\nAvailable image models:');
        printModelListGrouped(groupModelsByFamily('image'));
      } catch (err) {
        error(`Failed to list models: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // image info <model>
  imageCmd
    .command('info <model>')
    .description('Show model details and available flags')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (model: string, options) => {
      try {
        const modelInfo = getKieModelById(model);
        if (!modelInfo) {
          throw new Error(`Model "${model}" not found. Run: obra image list`);
        }

        if (options.json) {
          printJson(modelInfo);
        } else {
          printKieModelDocumentation(modelInfo, { command: 'image' });
        }
      } catch (err) {
        error(`Failed to get model info: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
