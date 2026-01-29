import chalk from 'chalk';
import { error, heading, info, keyValue } from '../../core/output.js';
import type { KieModel, KieParam } from './interface.js';
import type { KieModelValidationError } from './model-validation.js';

export function printKieModelDocumentation(
  model: KieModel,
  options?: { command?: string }
): void {
  const command = options?.command ?? model.category;
  const promptRequired = model.params.input.some(
    param => param.name === 'prompt' && param.required
  );
  const usagePrompt = promptRequired ? '<prompt>' : '[prompt]';

  heading(`\n${model.modelName}`);
  console.log(`  ${chalk.dim(model.modelId)}`);
  if (model.description) {
    console.log(`  ${model.description}`);
  }

  console.log('');
  keyValue('Category', model.category);
  keyValue('Provider', model.provider);
  keyValue('Doc URL', model.docUrl);
  keyValue('Endpoint', `${model.method} ${model.endpoint}`);

  console.log(`\n${chalk.bold('Usage:')}`);
  const requiredParams = model.params.input.filter(
    param => param.required && param.name !== 'prompt'
  );
  const requiredFlags = requiredParams
    .map(param => `--param ${param.name}=<${param.type}>`)
    .join(' ');
  const usageLine = `kai ${command} generate ${usagePrompt} --model ${model.modelId}` +
    (requiredFlags ? ` ${requiredFlags}` : '');
  console.log(`  ${chalk.cyan(usageLine)}`);

  console.log(`\n${chalk.bold('Parameters:')}`);
  for (const param of model.params.input) {
    printParam(param);
  }
}

export function printKieModelValidationError(
  errorInput: KieModelValidationError,
  options?: { command?: string }
): void {
  error('Input validation failed. Please review the issues below.');
  for (const issue of errorInput.issues) {
    console.log(`  ${chalk.red('•')} ${issue.field}: ${issue.message}`);
  }
  printKieModelDocumentation(errorInput.model, options);
  info('Tip: You can pass model fields with --param key=value or --params-json.');
}

function printParam(param: KieParam): void {
  const required = param.required ? chalk.red('*') : '';
  const defaultVal =
    param.default !== undefined ? chalk.dim(` (default: ${param.default})`) : '';
  console.log(`  ${chalk.cyan(param.name)}${required} <${param.type}>${defaultVal}`);
  if (param.description) {
    console.log(`    ${chalk.dim(param.description)}`);
  }
  if (param.options && param.options.length > 0) {
    console.log(`    ${chalk.dim('Options:')} ${param.options.join(', ')}`);
  }
  if (param.min !== undefined || param.max !== undefined) {
    const min = param.min !== undefined ? param.min : '-';
    const max = param.max !== undefined ? param.max : '-';
    console.log(`    ${chalk.dim('Range:')} ${min} to ${max}`);
  }
}
