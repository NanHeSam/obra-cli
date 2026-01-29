import { Command } from 'commander';
import { getProvider } from '../providers/registry.js';
import {
  error,
  spinner,
  printTaskStatus,
  printTaskResult,
  printJson,
} from '../core/output.js';

export function registerStatusCommand(program: Command): void {
  // status <task-id>
  program
    .command('status <taskId>')
    .description('Check task status')
    .option('-w, --wait', 'Wait for completion')
    .option('-p, --provider <name>', 'Provider to use')
    .option('--json', 'Output as JSON')
    .action(async (taskId: string, options) => {
      try {
        const provider = getProvider(options.provider);

        if (options.wait) {
          const spin = spinner('Waiting for task completion...');
          spin.start();

          const result = await provider.waitForCompletion(taskId, {
            onProgress: (status) => {
              if (status.progress !== undefined) {
                spin.text = `Processing... ${status.progress}%`;
              } else if (status.queuePosition !== undefined) {
                spin.text = `Waiting in queue (position ${status.queuePosition})...`;
              } else {
                spin.text = `Status: ${status.status}`;
              }
            },
          });

          spin.stop();

          if (options.json) {
            printJson(result);
          } else {
            printTaskResult(result);
          }

          if (result.status === 'fail') {
            process.exit(1);
          }
        } else {
          const status = await provider.getTaskStatus(taskId);

          if (options.json) {
            printJson(status);
          } else {
            printTaskStatus(status);
          }
        }
      } catch (err) {
        error(`Failed to get task status: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
