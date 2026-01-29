import Conf from 'conf';
import type { AppConfig, ProviderConfig, TaskDefaults, TaskType } from './types.js';

const defaultConfig: AppConfig = {
  defaultProvider: 'kie',
  providers: {},
  defaults: {
    image: {
      model: 'google/imagen4-fast',
      aspectRatio: '16:9',
    },
    video: {
      model: 'grok-imagine/text-to-video',
      duration: 5,
    },
    music: {
      model: 'V4_5',
      duration: 60,
    },
  },
};

const config = new Conf<AppConfig>({
  projectName: 'obra',
  defaults: defaultConfig,
});

/**
 * Get a configuration value by dot-notation path
 */
export function getConfig<T = unknown>(path: string): T | undefined {
  return config.get(path) as T | undefined;
}

/**
 * Set a configuration value by dot-notation path
 */
export function setConfig(path: string, value: unknown): void {
  config.set(path, value);
}

/**
 * Delete a configuration value
 */
export function deleteConfig(path: string): void {
  config.delete(path);
}

/**
 * Get all configuration
 */
export function getAllConfig(): AppConfig {
  return config.store;
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
  config.clear();
}

/**
 * Get the config file path
 */
export function getConfigPath(): string {
  return config.path;
}

/**
 * Get provider configuration
 */
export function getProviderConfig(provider: string): ProviderConfig | undefined {
  return config.get(`providers.${provider}`) as ProviderConfig | undefined;
}

/**
 * Set provider API key
 */
export function setProviderApiKey(provider: string, apiKey: string): void {
  config.set(`providers.${provider}.apiKey`, apiKey);
}

/**
 * Get default provider name
 */
export function getDefaultProvider(): string {
  return config.get('defaultProvider') as string;
}

/**
 * Set default provider
 */
export function setDefaultProvider(provider: string): void {
  config.set('defaultProvider', provider);
}

/**
 * Get task defaults for a specific type
 */
export function getTaskDefaults(type: TaskType): TaskDefaults {
  return (config.get(`defaults.${type}`) as TaskDefaults) || {};
}

/**
 * Set a task default value
 */
export function setTaskDefault(type: TaskType, key: string, value: unknown): void {
  config.set(`defaults.${type}.${key}`, value);
}

/**
 * Mask sensitive values (like API keys)
 */
export function maskSensitiveValue(value: string): string {
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  return value.slice(0, 4) + '*'.repeat(value.length - 8) + value.slice(-4);
}

/**
 * Get config with masked sensitive values for display
 */
export function getConfigForDisplay(): Record<string, unknown> {
  const store = config.store;
  const masked = JSON.parse(JSON.stringify(store));

  // Mask API keys in providers
  if (masked.providers) {
    for (const provider of Object.keys(masked.providers)) {
      if (masked.providers[provider]?.apiKey) {
        masked.providers[provider].apiKey = maskSensitiveValue(
          masked.providers[provider].apiKey
        );
      }
    }
  }

  return masked;
}
