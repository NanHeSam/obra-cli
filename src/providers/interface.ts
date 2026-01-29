import type {
  TaskType,
  Task,
  TaskStatus,
  TaskResult,
  ModelInfo,
  PollOptions,
} from '../core/types.js';

/**
 * Provider interface that all AI providers must implement
 */
export interface Provider {
  /** Unique provider identifier */
  readonly name: string;

  /** Display name for the provider */
  readonly displayName: string;

  /** Capabilities supported by this provider */
  readonly capabilities: TaskType[];

  /**
   * Create a new task
   * @param type The type of task to create
   * @param model The model to use
   * @param params Task-specific parameters
   * @returns The created task
   */
  createTask(
    type: TaskType,
    model: string,
    params: Record<string, unknown>
  ): Promise<Task>;

  /**
   * Get the current status of a task
   * @param taskId The task ID
   * @returns The current task status
   */
  getTaskStatus(taskId: string): Promise<TaskStatus>;

  /**
   * Wait for a task to complete
   * @param taskId The task ID
   * @param options Polling options
   * @returns The final task result
   */
  waitForCompletion(taskId: string, options?: PollOptions): Promise<TaskResult>;

  /**
   * List available models for a task type
   * @param type The task type
   * @returns List of available models
   */
  listModels(type: TaskType): Promise<ModelInfo[]>;

  /**
   * Get detailed information about a model
   * @param model The model ID
   * @returns Model information
   */
  getModelInfo(model: string): Promise<ModelInfo>;

  /**
   * Check if the provider is configured (has API key, etc.)
   * @returns True if configured
   */
  isConfigured(): boolean;

  /**
   * Validate the provider configuration
   * @returns Validation result with any errors
   */
  validateConfig(): { valid: boolean; errors: string[] };
}

/**
 * Base class for providers with common functionality
 */
export abstract class BaseProvider implements Provider {
  abstract readonly name: string;
  abstract readonly displayName: string;
  abstract readonly capabilities: TaskType[];

  abstract createTask(
    type: TaskType,
    model: string,
    params: Record<string, unknown>
  ): Promise<Task>;

  abstract getTaskStatus(taskId: string): Promise<TaskStatus>;
  abstract waitForCompletion(taskId: string, options?: PollOptions): Promise<TaskResult>;
  abstract listModels(type: TaskType): Promise<ModelInfo[]>;
  abstract getModelInfo(model: string): Promise<ModelInfo>;
  abstract isConfigured(): boolean;
  abstract validateConfig(): { valid: boolean; errors: string[] };

  /**
   * Check if this provider supports a given task type
   */
  supportsType(type: TaskType): boolean {
    return this.capabilities.includes(type);
  }
}
