import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import type { TaskStatus, TaskResult, ModelInfo } from './types.js';

/**
 * Create a spinner with a message
 */
export function spinner(text: string): Ora {
  return ora({
    text,
    spinner: 'dots',
  });
}

/**
 * Print a success message
 */
export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

/**
 * Print an error message
 */
export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

/**
 * Print a warning message
 */
export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * Print an info message
 */
export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

/**
 * Print a dim message
 */
export function dim(message: string): void {
  console.log(chalk.dim(message));
}

/**
 * Print a key-value pair
 */
export function keyValue(key: string, value: string | number | boolean | undefined): void {
  console.log(`  ${chalk.dim(key + ':')} ${value ?? chalk.dim('(not set)')}`);
}

/**
 * Print a heading
 */
export function heading(text: string): void {
  console.log(chalk.bold(text));
}

/**
 * Print task status
 */
export function printTaskStatus(status: TaskStatus): void {
  const statusColors: Record<string, typeof chalk.green> = {
    waiting: chalk.yellow,
    queuing: chalk.yellow,
    generating: chalk.blue,
    success: chalk.green,
    fail: chalk.red,
  };

  const colorFn = statusColors[status.status] || chalk.white;
  console.log(`\n${chalk.bold('Task Status:')}`);
  keyValue('ID', status.id);
  keyValue('Status', colorFn(status.status));

  if (status.progress !== undefined) {
    const progressBar = createProgressBar(status.progress);
    console.log(`  ${chalk.dim('Progress:')} ${progressBar} ${status.progress}%`);
  }

  if (status.queuePosition !== undefined) {
    keyValue('Queue Position', status.queuePosition);
  }

  if (status.estimatedTime !== undefined) {
    keyValue('Estimated Time', `${status.estimatedTime}s`);
  }

  if (status.message) {
    keyValue('Message', status.message);
  }
}

/**
 * Print task result
 */
export function printTaskResult(result: TaskResult): void {
  console.log(`\n${chalk.bold('Task Result:')}`);
  keyValue('ID', result.id);
  keyValue('Status', result.status === 'success' ? chalk.green('success') : chalk.red('fail'));

  if (result.error) {
    keyValue('Error', chalk.red(result.error));
  }

  if (result.outputs.length > 0) {
    console.log(`\n${chalk.bold('Outputs:')}`);
    for (const output of result.outputs) {
      console.log(`  ${chalk.dim('•')} ${output.url}`);
      if (output.filename) {
        console.log(`    ${chalk.dim('Filename:')} ${output.filename}`);
      }
      if (output.duration) {
        console.log(`    ${chalk.dim('Duration:')} ${output.duration}s`);
      }
      if (output.width && output.height) {
        console.log(`    ${chalk.dim('Size:')} ${output.width}x${output.height}`);
      }
    }
  }
}

/**
 * Print model info
 */
export function printModelInfo(model: ModelInfo): void {
  console.log(`\n${chalk.bold(model.name)} ${chalk.dim(`(${model.id})`)}`);

  if (model.description) {
    console.log(`  ${model.description}`);
  }

  console.log(`\n  ${chalk.dim('Type:')} ${model.type}`);
  console.log(`  ${chalk.dim('Provider:')} ${model.provider}`);

  if (model.capabilities.length > 0) {
    console.log(`  ${chalk.dim('Capabilities:')} ${model.capabilities.join(', ')}`);
  }

  if (model.parameters.length > 0) {
    console.log(`\n  ${chalk.bold('Parameters:')}`);
    for (const param of model.parameters) {
      const required = param.required ? chalk.red('*') : '';
      const defaultVal = param.default !== undefined ? chalk.dim(` (default: ${param.default})`) : '';
      console.log(`    ${chalk.cyan('--' + param.name)}${required} <${param.type}>${defaultVal}`);
      if (param.description) {
        console.log(`      ${chalk.dim(param.description)}`);
      }
      if (param.options) {
        console.log(`      ${chalk.dim('Options:')} ${param.options.join(', ')}`);
      }
    }
  }
}

/**
 * Print a list of models
 */
export function printModelList(models: ModelInfo[]): void {
  if (models.length === 0) {
    info('No models available');
    return;
  }

  for (const model of models) {
    console.log(`  ${chalk.cyan(model.id)} - ${model.name}`);
    if (model.description) {
      console.log(`    ${chalk.dim(model.description)}`);
    }
  }
}

/**
 * Model family with variants for grouped display
 */
export interface ModelFamilyDisplay {
  family: string;
  provider: string;
  models: {
    id: string;
    variant: string;
    credits?: number;
    creditsUnit?: string;
    price?: number;
  }[];
}

/**
 * Print models grouped by family
 */
export function printModelListGrouped(families: ModelFamilyDisplay[]): void {
  if (families.length === 0) {
    info('No models available');
    return;
  }

  for (const family of families) {
    // Print family header
    const providerLabel = family.provider ? chalk.dim(` (${family.provider})`) : '';

    if (family.models.length === 1 && family.models[0].variant === family.family) {
      // Single model with no variant - show on one line
      const model = family.models[0];
      const priceStr =
        model.price !== undefined && model.price > 0
          ? chalk.green(`$${model.price.toFixed(3)}`)
          : chalk.dim('-');
      const creditsStr =
        model.credits !== undefined && model.credits > 0
          ? chalk.yellow(`${model.credits} ${model.creditsUnit || 'cr'}`)
          : chalk.dim('-');
      console.log(`\n${chalk.cyan(family.family)}${providerLabel}  ${creditsStr} ${chalk.dim('|')} ${priceStr}`);
    } else {
      // Multiple models or distinct variant
      console.log(`\n${chalk.bold.cyan(family.family)}${providerLabel}`);

      for (const model of family.models) {
        const priceStr =
          model.price !== undefined && model.price > 0
            ? chalk.green(`$${model.price.toFixed(3)}`)
            : chalk.dim('-');
        const creditsStr =
          model.credits !== undefined && model.credits > 0
            ? chalk.yellow(`${model.credits} ${model.creditsUnit || 'cr'}`)
            : chalk.dim('-');
        console.log(`  ${chalk.white(model.variant)}  ${creditsStr} ${chalk.dim('|')} ${priceStr}`);
      }
    }
  }
  console.log('');
}

/**
 * Create a progress bar
 */
function createProgressBar(percent: number, width = 20): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
}

/**
 * Print JSON output
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Print a table
 */
export function printTable(headers: string[], rows: string[][]): void {
  // Calculate column widths
  const widths = headers.map((h, i) => {
    const maxRow = Math.max(...rows.map(r => (r[i] || '').length));
    return Math.max(h.length, maxRow);
  });

  // Print header
  console.log(headers.map((h, i) => chalk.bold(h.padEnd(widths[i]))).join('  '));
  console.log(chalk.dim('-'.repeat(widths.reduce((a, b) => a + b, 0) + (widths.length - 1) * 2)));

  // Print rows
  for (const row of rows) {
    console.log(row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  '));
  }
}
