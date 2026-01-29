import { Command } from 'commander';
import { registry } from '../providers/registry.js';
import { getDefaultProvider, setDefaultProvider } from '../core/config.js';
import {
  success,
  error,
  info,
  heading,
  printJson,
  printTable,
} from '../core/output.js';

export function registerProviderCommand(program: Command): void {
  const providerCmd = program
    .command('provider')
    .description('Provider management commands');

  // provider list
  providerCmd
    .command('list')
    .description('List available providers')
    .option('--json', 'Output as JSON')
    .action((options) => {
      const providers = registry.listProviders();
      const defaultProvider = getDefaultProvider();

      if (options.json) {
        printJson(
          providers.map(p => ({
            name: p.name,
            displayName: p.displayName,
            capabilities: p.capabilities,
            configured: p.isConfigured(),
            default: p.name === defaultProvider,
          }))
        );
      } else {
        heading('\nAvailable providers:\n');

        const headers = ['Name', 'Capabilities', 'Configured', 'Default'];
        const rows = providers.map(p => [
          p.displayName,
          p.capabilities.join(', '),
          p.isConfigured() ? 'Yes' : 'No',
          p.name === defaultProvider ? '*' : '',
        ]);

        printTable(headers, rows);

        console.log();
        info('Set API key: obra config set <provider>.apiKey <key>');
        info('Set default: obra provider use <name>');
      }
    });

  // provider use <name>
  providerCmd
    .command('use <name>')
    .description('Set default provider')
    .action((name: string) => {
      try {
        if (!registry.has(name)) {
          error(`Provider "${name}" not found. Available: ${registry.list().join(', ')}`);
          process.exit(1);
        }

        setDefaultProvider(name);
        success(`Default provider set to: ${name}`);
      } catch (err) {
        error(`Failed to set provider: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // provider info <name>
  providerCmd
    .command('info <name>')
    .description('Show provider details')
    .option('--json', 'Output as JSON')
    .action((name: string, options) => {
      try {
        const provider = registry.get(name);

        if (!provider) {
          error(`Provider "${name}" not found. Available: ${registry.list().join(', ')}`);
          process.exit(1);
        }

        const validation = provider.validateConfig();

        if (options.json) {
          printJson({
            name: provider.name,
            displayName: provider.displayName,
            capabilities: provider.capabilities,
            configured: provider.isConfigured(),
            validation,
          });
        } else {
          heading(`\n${provider.displayName}`);
          console.log();
          console.log(`  Name: ${provider.name}`);
          console.log(`  Capabilities: ${provider.capabilities.join(', ')}`);
          console.log(`  Configured: ${provider.isConfigured() ? 'Yes' : 'No'}`);

          if (!validation.valid) {
            console.log();
            heading('  Issues:');
            for (const err of validation.errors) {
              console.log(`    - ${err}`);
            }
          }
        }
      } catch (err) {
        error(`Failed to get provider info: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
