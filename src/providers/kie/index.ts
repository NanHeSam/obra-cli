import type {
  TaskType,
  Task,
  TaskStatus,
  TaskResult,
  ModelInfo,
  PollOptions,
} from '../../core/types.js';
import { BaseProvider } from '../interface.js';
import { KieClient } from './client.js';
import {
  getStaticModelsByType,
  getStaticModelById,
  mapParamsToKieInput,
} from './static-models.js';
import { getKieModelById, getKieModelsByType, toModelInfo } from './model-registry.js';
import { buildModelInput } from './model-validation.js';
import { poll } from '../../utils/polling.js';

/**
 * Kie.ai provider implementation
 */
export class KieProvider extends BaseProvider {
  readonly name = 'kie';
  readonly displayName = 'Kie.ai';
  readonly capabilities: TaskType[] = ['image', 'video', 'music'];

  private client: KieClient;

  constructor() {
    super();
    this.client = new KieClient();
  }

  async createTask(
    type: TaskType,
    model: string,
    params: Record<string, unknown>
  ): Promise<Task> {
    if (type === 'image' || type === 'video') {
      const kieModel = getKieModelById(model);
      if (!kieModel) {
        throw new Error(`Model "${model}" not found. Run: kai ${type} list`);
      }

      if (kieModel.category !== type) {
        throw new Error(
          `Model "${model}" is a ${kieModel.category} model, not a ${type} model`
        );
      }

      const { input, callBackUrl } = buildModelInput(kieModel, params);
      const response = await this.client.createTask({
        model,
        input,
        callBackUrl,
      });

      return {
        id: response.data.taskId,
        provider: this.name,
        type,
        model,
        status: response.data.status as Task['status'],
        createdAt: new Date(),
        params,
      };
    }

    // Non image/video tasks (static model list)
    const modelInfo = getStaticModelById(model);
    if (!modelInfo) {
      throw new Error(`Model "${model}" not found. Run: kai ${type} list`);
    }

    if (modelInfo.type !== type) {
      throw new Error(
        `Model "${model}" is a ${modelInfo.type} model, not a ${type} model`
      );
    }

    const input = mapParamsToKieInput(params);
    const response = await this.client.createTask({
      model,
      input,
    });

    return {
      id: response.data.taskId,
      provider: this.name,
      type,
      model,
      status: response.data.status as Task['status'],
      createdAt: new Date(),
      params,
    };
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await this.client.getTaskStatus(taskId);

    return {
      id: taskId,
      status: response.data.state,
      message: response.data.failMsg || undefined,
    };
  }

  async waitForCompletion(
    taskId: string,
    options?: PollOptions
  ): Promise<TaskResult> {
    const finalStatus = await poll(
      () => this.getTaskStatus(taskId),
      options
    );

    // Get the full result with outputs
    const response = await this.client.getTaskStatus(taskId);

    // Parse resultJson to get output URLs
    const outputs: TaskResult['outputs'] = [];
    if (response.data.resultJson) {
      try {
        const result = JSON.parse(response.data.resultJson);
        if (result.resultUrls && Array.isArray(result.resultUrls)) {
          for (const url of result.resultUrls) {
            outputs.push({
              url,
              type: this.inferOutputType(url),
            });
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    return {
      id: taskId,
      status: finalStatus.status === 'success' ? 'success' : 'fail',
      outputs,
      error: response.data.failMsg || undefined,
    };
  }

  /**
   * Infer output type from URL
   */
  private inferOutputType(url: string): 'image' | 'video' | 'audio' | 'text' {
    const lower = url.toLowerCase();
    if (lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov')) {
      return 'video';
    }
    if (lower.includes('.mp3') || lower.includes('.wav') || lower.includes('.ogg')) {
      return 'audio';
    }
    if (lower.includes('.txt') || lower.includes('.srt') || lower.includes('.vtt')) {
      return 'text';
    }
    return 'image';
  }

  async listModels(type: TaskType): Promise<ModelInfo[]> {
    if (type === 'image' || type === 'video') {
      return getKieModelsByType(type).map(toModelInfo);
    }
    return getStaticModelsByType(type);
  }

  async getModelInfo(model: string): Promise<ModelInfo> {
    const kieModel = getKieModelById(model);
    if (kieModel) {
      return toModelInfo(kieModel);
    }
    const info = getStaticModelById(model);
    if (!info) {
      throw new Error(`Model "${model}" not found`);
    }
    return info;
  }

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.client.isConfigured()) {
      errors.push('API key not configured. Run: kai config set kie.apiKey <your-api-key>');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
