import type { Provider } from './interface.js';
import type { TaskType } from '../core/types.js';
import { getDefaultProvider } from '../core/config.js';
import { KieProvider } from './kie/index.js';

/**
 * Registry for managing providers
 */
class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();

  /**
   * Register a provider
   */
  register(provider: Provider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Get a provider by name
   */
  get(name: string): Provider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get the default provider
   */
  getDefault(): Provider {
    const defaultName = getDefaultProvider();
    const provider = this.providers.get(defaultName);
    if (!provider) {
      throw new Error(
        `Default provider "${defaultName}" not found. Available providers: ${this.list().join(', ')}`
      );
    }
    return provider;
  }

  /**
   * List all registered provider names
   */
  list(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * List all registered providers
   */
  listProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Find providers that support a given task type
   */
  findByCapability(type: TaskType): Provider[] {
    return this.listProviders().filter(p => p.capabilities.includes(type));
  }

  /**
   * Check if a provider is registered
   */
  has(name: string): boolean {
    return this.providers.has(name);
  }
}

// Create singleton instance
export const registry = new ProviderRegistry();

// Register built-in providers
registry.register(new KieProvider());

/**
 * Get a provider by name, or the default if not specified
 */
export function getProvider(name?: string): Provider {
  if (name) {
    const provider = registry.get(name);
    if (!provider) {
      throw new Error(
        `Provider "${name}" not found. Available providers: ${registry.list().join(', ')}`
      );
    }
    return provider;
  }
  return registry.getDefault();
}

/**
 * Get providers that support a task type
 */
export function getProvidersForType(type: TaskType): Provider[] {
  return registry.findByCapability(type);
}
