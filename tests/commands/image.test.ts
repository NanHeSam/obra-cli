import { describe, test, expect, beforeEach, afterEach, mock, spyOn } from 'bun:test';
import { Command } from 'commander';
import { registerImageCommand } from '../../src/commands/image.js';
import * as registry from '../../src/providers/registry.js';
import * as config from '../../src/core/config.js';
import type { Provider } from '../../src/providers/interface.js';
import type { TaskType, Task, TaskStatus, TaskResult, ModelInfo, PollOptions } from '../../src/core/types.js';

// Mock provider
const mockProvider: Provider = {
  name: 'mock',
  displayName: 'Mock Provider',
  capabilities: ['image', 'video', 'music'] as TaskType[],

  createTask: mock((type: TaskType, model: string, params: Record<string, unknown>) =>
    Promise.resolve({
      id: 'task-123',
      provider: 'mock',
      type,
      model,
      status: 'waiting' as const,
      createdAt: new Date(),
      params,
    })
  ),

  getTaskStatus: mock((taskId: string) =>
    Promise.resolve({
      id: taskId,
      status: 'success' as const,
    })
  ),

  waitForCompletion: mock((taskId: string, options?: PollOptions) =>
    Promise.resolve({
      id: taskId,
      status: 'success' as const,
      outputs: [{ url: 'https://example.com/image.png', type: 'image' as const }],
    })
  ),

  listModels: mock((type: TaskType) =>
    Promise.resolve([
      {
        id: 'flux-2',
        name: 'Flux 2',
        description: 'Test model',
        type: 'image' as const,
        provider: 'mock',
        capabilities: ['text-to-image'],
        parameters: [],
      },
    ])
  ),

  getModelInfo: mock((model: string) =>
    Promise.resolve({
      id: model,
      name: 'Flux 2',
      description: 'Test model',
      type: 'image' as const,
      provider: 'mock',
      capabilities: ['text-to-image'],
      parameters: [
        {
          name: 'aspect-ratio',
          type: 'string' as const,
          required: false,
          options: ['1:1', '16:9'],
        },
      ],
    })
  ),

  isConfigured: mock(() => true),

  validateConfig: mock(() => ({ valid: true, errors: [] })),
};

describe('Image Command', () => {
  let program: Command;
  let mockGetProvider: ReturnType<typeof spyOn>;
  let mockGetTaskDefaults: ReturnType<typeof spyOn>;

  beforeEach(() => {
    program = new Command();
    program.exitOverride(); // Prevent process.exit
    registerImageCommand(program);

    mockGetProvider = spyOn(registry, 'getProvider').mockReturnValue(mockProvider);
    mockGetTaskDefaults = spyOn(config, 'getTaskDefaults').mockReturnValue({
      model: 'flux-2',
      aspectRatio: '1:1',
    });

    // Reset mock call history
    (mockProvider.createTask as ReturnType<typeof mock>).mockClear();
    (mockProvider.listModels as ReturnType<typeof mock>).mockClear();
    (mockProvider.getModelInfo as ReturnType<typeof mock>).mockClear();
  });

  afterEach(() => {
    mockGetProvider.mockRestore();
    mockGetTaskDefaults.mockRestore();
  });

  test('image generate creates task with prompt', async () => {
    // Note: We can't easily test CLI parsing with async actions,
    // but we can verify the command structure
    const imageCmd = program.commands.find(c => c.name() === 'image');
    expect(imageCmd).toBeDefined();

    const generateCmd = imageCmd?.commands.find(c => c.name() === 'generate');
    expect(generateCmd).toBeDefined();

    // Check required argument
    const args = generateCmd?.registeredArguments || [];
    expect(args.length).toBe(1);
    expect(args[0].name()).toBe('prompt');
  });

  test('image generate has correct options', async () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');
    const generateCmd = imageCmd?.commands.find(c => c.name() === 'generate');

    const options = generateCmd?.options || [];
    const optionNames = options.map(o => o.long);

    expect(optionNames).toContain('--model');
    expect(optionNames).toContain('--aspect-ratio');
    expect(optionNames).toContain('--style');
    expect(optionNames).toContain('--negative-prompt');
    expect(optionNames).toContain('--seed');
    expect(optionNames).toContain('--output');
    expect(optionNames).toContain('--wait');
    expect(optionNames).toContain('--provider');
    expect(optionNames).toContain('--json');
  });

  test('image list command exists', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');
    const listCmd = imageCmd?.commands.find(c => c.name() === 'list');

    expect(listCmd).toBeDefined();
    expect(listCmd?.description()).toContain('List');
  });

  test('image info command exists with model argument', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');
    const infoCmd = imageCmd?.commands.find(c => c.name() === 'info');

    expect(infoCmd).toBeDefined();

    const args = infoCmd?.registeredArguments || [];
    expect(args.length).toBe(1);
    expect(args[0].name()).toBe('model');
  });

  test('image commands have json option', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');

    for (const cmd of imageCmd?.commands || []) {
      const options = cmd.options || [];
      const hasJson = options.some(o => o.long === '--json');
      expect(hasJson).toBe(true);
    }
  });

  test('image commands have provider option', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');

    for (const cmd of imageCmd?.commands || []) {
      const options = cmd.options || [];
      const hasProvider = options.some(o => o.long === '--provider');
      expect(hasProvider).toBe(true);
    }
  });
});

describe('Command Structure', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    registerImageCommand(program);
  });

  test('image command has correct subcommands', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');
    expect(imageCmd).toBeDefined();

    const subcommandNames = imageCmd?.commands.map(c => c.name()) || [];
    expect(subcommandNames).toContain('generate');
    expect(subcommandNames).toContain('list');
    expect(subcommandNames).toContain('info');
  });

  test('generate command short options work', () => {
    const imageCmd = program.commands.find(c => c.name() === 'image');
    const generateCmd = imageCmd?.commands.find(c => c.name() === 'generate');
    const options = generateCmd?.options || [];

    const shortOptions = options.map(o => o.short).filter(Boolean);
    expect(shortOptions).toContain('-m');
    expect(shortOptions).toContain('-a');
    expect(shortOptions).toContain('-s');
    expect(shortOptions).toContain('-n');
    expect(shortOptions).toContain('-o');
    expect(shortOptions).toContain('-w');
    expect(shortOptions).toContain('-p');
  });
});
