import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import {
  getConfig,
  setConfig,
  deleteConfig,
  getAllConfig,
  resetConfig,
  getConfigPath,
  getProviderConfig,
  setProviderApiKey,
  getDefaultProvider,
  setDefaultProvider,
  getTaskDefaults,
  setTaskDefault,
  maskSensitiveValue,
  getConfigForDisplay,
} from '../../src/core/config.js';

describe('Config Management', () => {
  // Store original values to restore after tests
  let originalDefaultProvider: string;

  beforeEach(() => {
    originalDefaultProvider = getDefaultProvider();
  });

  afterEach(() => {
    // Restore original state
    setDefaultProvider(originalDefaultProvider);
  });

  test('getConfig returns undefined for missing key', () => {
    const value = getConfig('nonexistent.key.path');
    expect(value).toBeUndefined();
  });

  test('setConfig and getConfig work correctly', () => {
    setConfig('test.key', 'test-value');
    expect(getConfig('test.key')).toBe('test-value');
    deleteConfig('test.key');
  });

  test('setConfig handles nested paths', () => {
    setConfig('test.nested.deep.key', 'deep-value');
    expect(getConfig('test.nested.deep.key')).toBe('deep-value');
    deleteConfig('test.nested');
  });

  test('deleteConfig removes key', () => {
    setConfig('test.delete', 'value');
    deleteConfig('test.delete');
    expect(getConfig('test.delete')).toBeUndefined();
  });

  test('getAllConfig returns entire config', () => {
    const config = getAllConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
    expect(config.defaultProvider).toBeDefined();
  });

  test('getConfigPath returns a path', () => {
    const path = getConfigPath();
    expect(typeof path).toBe('string');
    expect(path.length).toBeGreaterThan(0);
    expect(path).toContain('obra');
  });

  test('getDefaultProvider returns default provider', () => {
    const provider = getDefaultProvider();
    expect(typeof provider).toBe('string');
    expect(provider.length).toBeGreaterThan(0);
  });

  test('setDefaultProvider changes default provider', () => {
    setDefaultProvider('test-provider');
    expect(getDefaultProvider()).toBe('test-provider');
  });
});

describe('Provider Config', () => {
  afterEach(() => {
    deleteConfig('providers.test-provider');
  });

  test('getProviderConfig returns undefined for unconfigured provider', () => {
    const config = getProviderConfig('unconfigured-provider');
    expect(config).toBeUndefined();
  });

  test('setProviderApiKey sets API key', () => {
    setProviderApiKey('test-provider', 'test-api-key');
    const config = getProviderConfig('test-provider');
    expect(config?.apiKey).toBe('test-api-key');
  });
});

describe('Task Defaults', () => {
  afterEach(() => {
    // Clean up test defaults
    deleteConfig('defaults.image.testKey');
  });

  test('getTaskDefaults returns defaults for type', () => {
    const defaults = getTaskDefaults('image');
    expect(defaults).toBeDefined();
    expect(typeof defaults).toBe('object');
  });

  test('setTaskDefault sets a default value', () => {
    setTaskDefault('image', 'testKey', 'testValue');
    const defaults = getTaskDefaults('image');
    expect(defaults.testKey).toBe('testValue');
  });
});

describe('maskSensitiveValue', () => {
  test('masks short values completely', () => {
    expect(maskSensitiveValue('short')).toBe('*****');
    expect(maskSensitiveValue('12345678')).toBe('********');
  });

  test('shows first and last 4 chars for longer values', () => {
    const masked = maskSensitiveValue('sk-1234567890abcdef');
    expect(masked.startsWith('sk-1')).toBe(true);
    expect(masked.endsWith('cdef')).toBe(true);
    expect(masked.includes('*')).toBe(true);
  });

  test('handles empty string', () => {
    expect(maskSensitiveValue('')).toBe('');
  });
});

describe('getConfigForDisplay', () => {
  beforeEach(() => {
    setProviderApiKey('display-test', 'sk-very-long-api-key-1234');
  });

  afterEach(() => {
    deleteConfig('providers.display-test');
  });

  test('masks API keys in output', () => {
    const display = getConfigForDisplay();
    const providers = display.providers as Record<string, { apiKey?: string }>;
    if (providers?.['display-test']?.apiKey) {
      expect(providers['display-test'].apiKey).toContain('*');
      expect(providers['display-test'].apiKey).not.toBe('sk-very-long-api-key-1234');
    }
  });
});
