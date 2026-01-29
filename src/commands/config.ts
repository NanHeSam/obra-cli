import { Command } from 'commander';
import {
  getConfig,
  setConfig,
  deleteConfig,
  getAllConfig,
  getConfigPath,
  resetConfig,
  getConfigForDisplay,
  maskSensitiveValue,
} from '../core/config.js';
import { success, error, info, keyValue, heading, printJson } from '../core/output.js';

export function registerConfigCommand(program: Command): void {
  const configCmd = program
    .command('config')
    .description('Manage configuration');

  // config set <key> <value>
  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action((key: string, value: string) => {
      try {
        // Parse value (handle booleans and numbers)
        let parsedValue: unknown = value;
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);

        // Normalize provider API key paths: "kie.apiKey" → "providers.kie.apiKey"
        const normalizedKey = normalizeConfigKey(key);

        setConfig(normalizedKey, parsedValue);
        success(`Set ${normalizedKey}`);
      } catch (err) {
        error(`Failed to set config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // config get <key>
  configCmd
    .command('get <key>')
    .description('Get a configuration value')
    .option('--unmask', 'Show full value without masking')
    .action((key: string, options: { unmask?: boolean }) => {
      try {
        const value = getConfig(key);
        if (value === undefined) {
          info(`${key} is not set`);
        } else {
          // Mask sensitive values
          let displayValue = String(value);
          if (key.toLowerCase().includes('apikey') && !options.unmask) {
            displayValue = maskSensitiveValue(displayValue);
          }
          console.log(displayValue);
        }
      } catch (err) {
        error(`Failed to get config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // config delete <key>
  configCmd
    .command('delete <key>')
    .description('Delete a configuration value')
    .action((key: string) => {
      try {
        deleteConfig(key);
        success(`Deleted ${key}`);
      } catch (err) {
        error(`Failed to delete config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // config list
  configCmd
    .command('list')
    .description('List all configuration')
    .option('--json', 'Output as JSON')
    .option('--unmask', 'Show full values without masking')
    .action((options: { json?: boolean; unmask?: boolean }) => {
      try {
        const config = options.unmask ? getAllConfig() : getConfigForDisplay();

        if (options.json) {
          printJson(config);
        } else {
          heading('Configuration:');
          console.log();
          printConfigObject(config as Record<string, unknown>, '');
        }
      } catch (err) {
        error(`Failed to list config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // config path
  configCmd
    .command('path')
    .description('Show configuration file path')
    .action(() => {
      console.log(getConfigPath());
    });

  // config reset
  configCmd
    .command('reset')
    .description('Reset configuration to defaults')
    .option('-y, --yes', 'Skip confirmation')
    .action((options: { yes?: boolean }) => {
      if (!options.yes) {
        info('This will reset all configuration to defaults.');
        info('Use --yes to confirm.');
        return;
      }

      try {
        resetConfig();
        success('Configuration reset to defaults');
      } catch (err) {
        error(`Failed to reset config: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}

/**
 * Recursively print a configuration object
 */
function printConfigObject(obj: Record<string, unknown>, prefix: string): void {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      heading(`  ${fullKey}:`);
      printConfigObject(value as Record<string, unknown>, fullKey);
    } else {
      keyValue(fullKey, String(value));
    }
  }
}

/**
 * Normalize config key shortcuts
 * - "kie.apiKey" → "providers.kie.apiKey"
 * - "replicate.apiKey" → "providers.replicate.apiKey"
 */
function normalizeConfigKey(key: string): string {
  // Known provider names
  const providers = ['kie', 'replicate', 'elevenlabs', 'openai'];

  // Check if key starts with a provider name but not "providers."
  for (const provider of providers) {
    if (key.startsWith(`${provider}.`) && !key.startsWith('providers.')) {
      return `providers.${key}`;
    }
  }

  return key;
}
