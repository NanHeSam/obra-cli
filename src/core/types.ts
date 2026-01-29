/**
 * Types of tasks that can be created
 */
export type TaskType = 'image' | 'video' | 'music';

/**
 * Task status states
 */
export type TaskState = 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';

/**
 * Task created by a provider
 */
export interface Task {
  id: string;
  provider: string;
  type: TaskType;
  model: string;
  status: TaskState;
  createdAt: Date;
  params: Record<string, unknown>;
}

/**
 * Task status with progress information
 */
export interface TaskStatus {
  id: string;
  status: TaskState;
  progress?: number;
  message?: string;
  estimatedTime?: number;
  queuePosition?: number;
}

/**
 * Result of a completed task
 */
export interface TaskResult {
  id: string;
  status: 'success' | 'fail';
  outputs: TaskOutput[];
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Single output from a task (e.g., one image, one audio file)
 */
export interface TaskOutput {
  url: string;
  type: 'image' | 'video' | 'audio' | 'text';
  filename?: string;
  size?: number;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Model information
 */
export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  provider: string;
  capabilities: string[];
  parameters: ModelParameter[];
}

/**
 * Model parameter definition
 */
export interface ModelParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'integer' | 'enum' | 'array';
  description?: string;
  required: boolean;
  default?: unknown;
  options?: string[] | number[];
  min?: number;
  max?: number;
}

/**
 * Polling options
 */
export interface PollOptions {
  interval?: number;
  maxAttempts?: number;
  timeout?: number;
  onProgress?: (status: TaskStatus) => void;
}

/**
 * Configuration for a provider
 */
export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  [key: string]: unknown;
}

/**
 * Default settings for task types
 */
export interface TaskDefaults {
  model?: string;
  aspectRatio?: string;
  duration?: number;
  voice?: string;
  [key: string]: unknown;
}

/**
 * Application configuration
 */
export interface AppConfig {
  defaultProvider: string;
  providers: Record<string, ProviderConfig>;
  defaults: Record<TaskType, TaskDefaults>;
}
