import { Command } from 'commander';
import chalk from 'chalk';
import {
  queryHistory,
  getHistoryEntry,
  getHistoryPath,
  clearHistory,
} from '../core/history.js';
import type { HistoryEntry } from '../core/history.js';
import { error, info, success, keyValue, heading, printJson, printTable } from '../core/output.js';

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

function statusColor(status: string): string {
  if (status === 'success') return chalk.green(status);
  if (status === 'fail') return chalk.red(status);
  return chalk.yellow(status);
}

function extractType(command: string): string {
  return command.split(':')[0];
}

function printEntryDetail(entry: HistoryEntry): void {
  heading('\nHistory Entry');
  keyValue('Task ID', entry.taskId);
  keyValue('Command', entry.command);
  keyValue('Model', entry.model);
  keyValue('Provider', entry.provider);
  keyValue('Prompt', entry.prompt);
  keyValue('Status', statusColor(entry.status));
  keyValue('Timestamp', formatTimestamp(entry.timestamp));

  if (Object.keys(entry.params).length > 0) {
    console.log(`\n${chalk.bold('Parameters:')}`);
    for (const [k, v] of Object.entries(entry.params)) {
      keyValue(k, String(v));
    }
  }

  if (entry.outputs && entry.outputs.length > 0) {
    console.log(`\n${chalk.bold('Outputs:')}`);
    for (const output of entry.outputs) {
      console.log(`  ${chalk.dim('•')} ${output.url}`);
      if (output.duration) console.log(`    ${chalk.dim('Duration:')} ${output.duration}s`);
      if (output.width && output.height) console.log(`    ${chalk.dim('Size:')} ${output.width}x${output.height}`);
    }
  }

  if (entry.error) {
    keyValue('Error', chalk.red(entry.error));
  }
}

export function registerHistoryCommand(program: Command): void {
  const historyCmd = program
    .command('history')
    .description('View generation history');

  // history list (default)
  historyCmd
    .command('list', { isDefault: true })
    .description('List recent generations')
    .option('-l, --limit <n>', 'Number of entries to show', '20')
    .option('-t, --type <type>', 'Filter by type (image, video, music)')
    .option('-s, --status <status>', 'Filter by status (pending, success, fail)')
    .option('--json', 'Output as JSON')
    .action((options) => {
      try {
        const limit = parseInt(options.limit, 10) || 20;
        const entries = queryHistory({
          type: options.type,
          limit,
          status: options.status,
        });

        if (entries.length === 0) {
          info('No history entries found.');
          return;
        }

        if (options.json) {
          printJson(entries);
          return;
        }

        const headers = ['#', 'TIMESTAMP', 'TYPE', 'MODEL', 'TASK ID', 'STATUS', 'PROMPT'];
        const rows = entries.map((entry, i) => [
          String(i + 1),
          formatTimestamp(entry.timestamp),
          extractType(entry.command),
          truncate(entry.model, 25),
          entry.taskId,
          statusColor(entry.status),
          truncate(entry.prompt, 40),
        ]);

        printTable(headers, rows);
      } catch (err) {
        error(`Failed to list history: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // history show <ref>
  historyCmd
    .command('show <ref>')
    .description('Show details of a history entry (row number or task ID)')
    .option('--json', 'Output as JSON')
    .action((ref: string, options) => {
      try {
        let entry: HistoryEntry | undefined;

        const num = parseInt(ref, 10);
        if (!isNaN(num) && num > 0 && String(num) === ref) {
          // Treat as row number from most recent list
          const entries = queryHistory();
          if (num <= entries.length) {
            entry = entries[num - 1];
          }
        }

        if (!entry) {
          // Treat as task ID
          entry = getHistoryEntry(ref);
        }

        if (!entry) {
          error(`No history entry found for "${ref}"`);
          process.exit(1);
        }

        if (options.json) {
          printJson(entry);
        } else {
          printEntryDetail(entry);
        }
      } catch (err) {
        error(`Failed to show history entry: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // history clear
  historyCmd
    .command('clear')
    .description('Clear all history')
    .option('-y, --yes', 'Skip confirmation')
    .action((options) => {
      if (!options.yes) {
        info('This will clear all generation history.');
        info('Use --yes to confirm.');
        return;
      }

      try {
        clearHistory();
        success('History cleared');
      } catch (err) {
        error(`Failed to clear history: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // history path
  historyCmd
    .command('path')
    .description('Show history file path')
    .action(() => {
      console.log(getHistoryPath());
    });
}
