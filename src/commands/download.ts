import { Command } from 'commander';
import { getProvider } from '../providers/registry.js';
import { downloadTaskOutputs } from '../core/download.js';
import { error, info, spinner } from '../core/output.js';

export function registerDownloadCommand(program: Command): void {
  program
    .command('download <taskId>')
    .description('Download task outputs')
    .option('-o, --output <dir>', 'Output directory', '.')
    .option('-p, --provider <name>', 'Provider to use')
    .action(async (taskId: string, options: { output: string; provider?: string }) => {
      try {
        const provider = getProvider(options.provider);

        const spin = spinner('Fetching task result...');
        spin.start();

        const result = await provider.waitForCompletion(taskId);

        if (result.status === 'fail') {
          spin.fail('Task failed');
          if (result.error) {
            error(result.error);
          }
          process.exit(1);
        }

        if (result.outputs.length === 0) {
          spin.fail('No outputs to download');
          process.exit(1);
        }

        spin.succeed(`Found ${result.outputs.length} output(s)`);

        const downloadedFiles = await downloadTaskOutputs(
          result.outputs,
          options.output,
          taskId
        );

        if (downloadedFiles.length > 0) {
          info(`Downloaded ${downloadedFiles.length} file(s) to ${options.output}`);
        }
      } catch (err) {
        error(`Failed to download: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
