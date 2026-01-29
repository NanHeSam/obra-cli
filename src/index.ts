import { Command } from 'commander';
import { registerConfigCommand } from './commands/config.js';
import { registerImageCommand } from './commands/image.js';
import { registerVideoCommand } from './commands/video.js';
import { registerMusicCommand } from './commands/music.js';
import { registerStatusCommand } from './commands/status.js';
import { registerProviderCommand } from './commands/provider.js';
import { registerDownloadCommand } from './commands/download.js';

const program = new Command();

program
  .name('kai')
  .description('Multi-Provider Creative AI CLI for generating images, videos, and music')
  .version('0.1.0');

// Register all commands
registerConfigCommand(program);
registerImageCommand(program);
registerVideoCommand(program);
registerMusicCommand(program);
registerStatusCommand(program);
registerProviderCommand(program);
registerDownloadCommand(program);

export function run() {
  program.parse(process.argv);
}
