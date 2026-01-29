import { describe, test, expect, beforeEach, afterEach, mock, spyOn } from 'bun:test';
import { KieClient, KieApiError } from '../../src/providers/kie/client.js';
import { KieProvider } from '../../src/providers/kie/index.js';
import {
  getKieModelsByType,
  getKieModelById,
} from '../../src/providers/kie/model-registry.js';
import {
  getStaticModelsByType,
  getStaticModelById,
  mapParamsToKieInput,
} from '../../src/providers/kie/static-models.js';
import * as config from '../../src/core/config.js';

// Mock the config module
const mockGetProviderConfig = spyOn(config, 'getProviderConfig');

describe('KieClient', () => {
  let client: KieClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = new KieClient();
    mockGetProviderConfig.mockReturnValue({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mockGetProviderConfig.mockReset();
  });

  test('createTask sends correct request', async () => {
    const mockResponse = {
      code: 0,
      message: 'success',
      data: {
        taskId: 'task-123',
        status: 'waiting',
      },
    };

    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await client.createTask({
      model: 'flux-2',
      input: { prompt: 'test prompt' },
    });

    expect(result.data.taskId).toBe('task-123');
    expect(result.data.status).toBe('waiting');

    // Verify fetch was called with correct parameters
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (globalThis.fetch as ReturnType<typeof mock>).mock.calls[0];
    expect(url).toBe('https://api.kie.ai/api/v1/jobs/createTask');
    expect(options.method).toBe('POST');
    expect(options.headers['Authorization']).toBe('Bearer test-api-key');
  });

  test('getTaskStatus returns correct status', async () => {
    const mockResponse = {
      code: 0,
      message: 'success',
      data: {
        taskId: 'task-123',
        status: 'generating',
        progress: 50,
      },
    };

    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await client.getTaskStatus('task-123');

    expect(result.data.taskId).toBe('task-123');
    expect(result.data.status).toBe('generating');
    expect(result.data.progress).toBe(50);
  });

  test('throws KieApiError on API error', async () => {
    const mockResponse = {
      code: 400,
      message: 'Invalid request',
    };

    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    await expect(client.createTask({
      model: 'flux-2',
      input: {},
    })).rejects.toThrow(KieApiError);
  });

  test('throws error when not configured', async () => {
    mockGetProviderConfig.mockReturnValue(undefined);

    await expect(client.createTask({
      model: 'flux-2',
      input: {},
    })).rejects.toThrow('API key not configured');
  });

  test('isConfigured returns true when API key is set', () => {
    mockGetProviderConfig.mockReturnValue({ apiKey: 'test-key' });
    expect(client.isConfigured()).toBe(true);
  });

  test('isConfigured returns false when API key is not set', () => {
    mockGetProviderConfig.mockReturnValue(undefined);
    expect(client.isConfigured()).toBe(false);
  });
});

describe('KieProvider', () => {
  let provider: KieProvider;

  beforeEach(() => {
    provider = new KieProvider();
    mockGetProviderConfig.mockReturnValue({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    mockGetProviderConfig.mockReset();
  });

  test('has correct name and capabilities', () => {
    expect(provider.name).toBe('kie');
    expect(provider.displayName).toBe('Kie.ai');
    expect(provider.capabilities).toContain('image');
    expect(provider.capabilities).toContain('video');
    expect(provider.capabilities).toContain('music');
  });

  test('listModels returns models for type', async () => {
    const imageModels = await provider.listModels('image');
    expect(imageModels.length).toBeGreaterThan(0);
    expect(imageModels.every(m => m.type === 'image')).toBe(true);

    const videoModels = await provider.listModels('video');
    expect(videoModels.length).toBeGreaterThan(0);
    expect(videoModels.every(m => m.type === 'video')).toBe(true);
  });

  test('getModelInfo returns model info', async () => {
    const model = await provider.getModelInfo('flux-2/pro-text-to-image');
    expect(model.id).toBe('flux-2/pro-text-to-image');
    expect(model.type).toBe('image');
    expect(model.provider).toBe('Black Forest Labs');
  });

  test('getModelInfo throws for unknown model', async () => {
    await expect(provider.getModelInfo('unknown-model')).rejects.toThrow('not found');
  });

  test('validateConfig returns errors when not configured', () => {
    mockGetProviderConfig.mockReturnValue(undefined);
    const result = provider.validateConfig();
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('validateConfig returns valid when configured', () => {
    mockGetProviderConfig.mockReturnValue({ apiKey: 'test-key' });
    const result = provider.validateConfig();
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});

describe('Kie Models', () => {
  test('getKieModelsByType returns correct models', () => {
    const imageModels = getKieModelsByType('image');
    expect(imageModels.every(m => m.category === 'image')).toBe(true);

    const videoModels = getKieModelsByType('video');
    expect(videoModels.every(m => m.category === 'video')).toBe(true);
  });

  test('getStaticModelsByType returns correct models', () => {
    const musicModels = getStaticModelsByType('music');
    expect(musicModels.every(m => m.type === 'music')).toBe(true);
  });

  test('getKieModelById returns model', () => {
    const model = getKieModelById('flux-2/pro-text-to-image');
    expect(model).toBeDefined();
    expect(model?.modelId).toBe('flux-2/pro-text-to-image');
  });

  test('getStaticModelById returns model', () => {
    const model = getStaticModelById('V4');
    expect(model).toBeDefined();
    expect(model?.id).toBe('V4');
  });

  test('getKieModelById returns undefined for unknown model', () => {
    const model = getKieModelById('unknown');
    expect(model).toBeUndefined();
  });

  test('mapParamsToKieInput maps parameters correctly', () => {
    const params = {
      prompt: 'test prompt',
      'aspect-ratio': '16:9',
      style: 'realistic',
      'negative-prompt': 'blurry',
      seed: 12345,
    };

    const input = mapParamsToKieInput(params);

    expect(input.prompt).toBe('test prompt');
    expect(input.aspect_ratio).toBe('16:9');
    expect(input.style).toBe('realistic');
    expect(input.negative_prompt).toBe('blurry');
    expect(input.seed).toBe(12345);
  });

  test('mapParamsToKieInput handles video parameters', () => {
    const params = {
      prompt: 'video prompt',
      duration: 5,
      fps: 30,
      image: '/path/to/image.png',
    };

    const input = mapParamsToKieInput(params);

    expect(input.prompt).toBe('video prompt');
    expect(input.duration).toBe(5);
    expect(input.fps).toBe(30);
    expect(input.image).toBe('/path/to/image.png');
  });

  test('mapParamsToKieInput handles music parameters', () => {
    const params = {
      prompt: 'jazz music',
      duration: 60,
      instrumental: true,
      lyrics: 'custom lyrics',
    };

    const input = mapParamsToKieInput(params);

    expect(input.prompt).toBe('jazz music');
    expect(input.duration).toBe(60);
    expect(input.instrumental).toBe(true);
    expect(input.lyrics).toBe('custom lyrics');
  });

  test('mapParamsToKieInput handles TTS parameters', () => {
    const params = {
      text: 'Hello world',
      voice: 'alloy',
      speed: 1.5,
      pitch: 5,
    };

    const input = mapParamsToKieInput(params);

    expect(input.text).toBe('Hello world');
    expect(input.voice).toBe('alloy');
    expect(input.speed).toBe(1.5);
    expect(input.pitch).toBe(5);
  });
});
