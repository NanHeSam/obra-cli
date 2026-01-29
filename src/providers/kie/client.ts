import { getProviderConfig } from '../../core/config.js';

const BASE_URL = 'https://api.kie.ai';

/**
 * Request interface for creating a task
 */
export interface KieCreateTaskRequest {
  model: string;
  input: Record<string, unknown>;
  callBackUrl?: string;
}

export interface KieCreateTaskResponse {
  code: number;
  message: string;
  data: {
    taskId: string;
    status: string;
  };
}

export interface KieTaskStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    model: string;
    state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';
    resultJson?: string; // JSON string with { resultUrls: string[] }
    failCode?: string | null;
    failMsg?: string | null;
    costTime?: number;
    completeTime?: number;
    createTime?: number;
  };
}

export interface KieTaskOutput {
  url: string;
  type: 'image' | 'video' | 'audio' | 'text';
  duration?: number;
  width?: number;
  height?: number;
}

export class KieApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'KieApiError';
  }
}

/**
 * Kie.ai API client
 */
export class KieClient {
  private baseUrl: string;

  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the API key from config
   */
  private getApiKey(): string {
    const config = getProviderConfig('kie');
    if (!config?.apiKey) {
      throw new Error(
        'Kie.ai API key not configured. Run: obra config set kie.apiKey <your-api-key>'
      );
    }
    return config.apiKey;
  }

  /**
   * Make an authenticated request to the Kie.ai API
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: KieCreateTaskRequest
  ): Promise<T> {
    const apiKey = this.getApiKey();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new KieApiError(
        response.status,
        `API request failed: ${response.statusText}`,
        error
      );
    }

    const data = (await response.json()) as { code?: number; message?: string; msg?: string };

    // Check for API-level errors
    if (data.code !== 0 && data.code !== 200) {
      const errorMsg = data.message || data.msg || JSON.stringify(data);
      throw new KieApiError(data.code || 500, errorMsg, data);
    }

    return data as T;
  }

  /**
   * Create a new task
   */
  async createTask(request: KieCreateTaskRequest): Promise<KieCreateTaskResponse> {
    return this.request<KieCreateTaskResponse>(
      'POST',
      '/api/v1/jobs/createTask',
      request
    );
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<KieTaskStatusResponse> {
    return this.request<KieTaskStatusResponse>(
      'GET',
      `/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`
    );
  }

  /**
   * Check if the client is configured
   */
  isConfigured(): boolean {
    const config = getProviderConfig('kie');
    return !!config?.apiKey;
  }

  /**
   * Make a generic request (for Suno endpoints that don't fit the standard pattern)
   */
  private async requestRaw<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>,
    queryParams?: Record<string, string>
  ): Promise<T> {
    const apiKey = this.getApiKey();

    let url = `${this.baseUrl}${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new KieApiError(
        response.status,
        `API request failed: ${response.statusText}`,
        error
      );
    }

    const data = (await response.json()) as { code?: number; message?: string; msg?: string };

    // Check for API-level errors
    if (data.code !== 0 && data.code !== 200) {
      const errorMsg = data.message || data.msg || JSON.stringify(data);
      throw new KieApiError(data.code || 500, errorMsg, data);
    }

    return data as T;
  }

  // ========== Suno API Methods ==========

  /**
   * Generate music using Suno API
   */
  async generateMusic(params: {
    prompt: string;
    customMode: boolean;
    instrumental: boolean;
    model: string;
    callBackUrl: string;
    style?: string;
    title?: string;
    negativeTags?: string;
    vocalGender?: 'm' | 'f';
    styleWeight?: number;
    weirdnessConstraint?: number;
    audioWeight?: number;
    personaId?: string;
  }): Promise<{ code: number; msg: string; data: { taskId: string } }> {
    return this.requestRaw(
      'POST',
      '/api/v1/generate',
      params
    );
  }

  /**
   * Get music generation status
   */
  async getMusicStatus(taskId: string): Promise<{
    code: number;
    msg: string;
    data: {
      taskId: string;
      parentMusicId?: string;
      param?: string;
      response?: {
        taskId: string;
        sunoData?: Array<{
          id: string;
          audioUrl?: string;
          streamAudioUrl?: string;
          imageUrl?: string;
          prompt?: string;
          modelName?: string;
          title?: string;
          tags?: string;
          createTime?: string;
          duration?: number;
        }>;
      };
      status: 'PENDING' | 'TEXT_SUCCESS' | 'FIRST_SUCCESS' | 'SUCCESS' | 'CREATE_TASK_FAILED' | 'GENERATE_AUDIO_FAILED' | 'CALLBACK_EXCEPTION' | 'SENSITIVE_WORD_ERROR';
      type?: string;
      errorCode?: string | null;
      errorMessage?: string | null;
    };
  }> {
    return this.requestRaw(
      'GET',
      '/api/v1/generate/record-info',
      undefined,
      { taskId }
    );
  }

  /**
   * Generate lyrics using Suno API
   */
  async generateLyrics(params: {
    prompt: string;
    callBackUrl: string;
  }): Promise<{ code: number; msg: string; data: { taskId: string } }> {
    return this.requestRaw(
      'POST',
      '/api/v1/lyrics',
      params
    );
  }

  /**
   * Get lyrics generation status
   */
  async getLyricsStatus(taskId: string): Promise<{
    code: number;
    msg: string;
    data: {
      taskId: string;
      param?: string;
      response?: {
        taskId: string;
        data?: Array<{
          text: string;
          title: string;
          status: string;
          errorMessage?: string;
        }>;
      };
      status: 'PENDING' | 'SUCCESS' | 'CREATE_TASK_FAILED' | 'GENERATE_LYRICS_FAILED' | 'CALLBACK_EXCEPTION' | 'SENSITIVE_WORD_ERROR';
      type?: string;
      errorCode?: string | null;
      errorMessage?: string | null;
    };
  }> {
    return this.requestRaw(
      'GET',
      '/api/v1/lyrics/record-info',
      undefined,
      { taskId }
    );
  }

  /**
   * Get timestamped lyrics for a music track
   */
  async getTimestampedLyrics(params: {
    taskId: string;
    audioId: string;
  }): Promise<{
    code: number;
    msg: string;
    data: {
      alignedWords: Array<{
        word: string;
        success: boolean;
        startS: number;
        endS: number;
        palign: number;
      }>;
      waveformData: number[];
      hootCer: number;
      isStreamed: boolean;
    };
  }> {
    return this.requestRaw(
      'POST',
      '/api/v1/generate/get-timestamped-lyrics',
      params
    );
  }

  /**
   * Create music video
   */
  async createMusicVideo(params: {
    taskId: string;
    audioId: string;
    callBackUrl: string;
    author?: string;
    domainName?: string;
  }): Promise<{ code: number; msg: string; data: { taskId: string } }> {
    return this.requestRaw(
      'POST',
      '/api/v1/mp4/generate',
      params
    );
  }

  /**
   * Get music video generation status
   */
  async getMusicVideoStatus(taskId: string): Promise<{
    code: number;
    msg: string;
    data: {
      taskId: string;
      musicId?: string;
      callbackUrl?: string;
      musicIndex?: number;
      completeTime?: string;
      response?: {
        videoUrl?: string;
      };
      successFlag: 'PENDING' | 'SUCCESS' | 'CREATE_TASK_FAILED' | 'GENERATE_MP4_FAILED';
      createTime?: string;
      errorCode?: string | null;
      errorMessage?: string | null;
    };
  }> {
    return this.requestRaw(
      'GET',
      '/api/v1/mp4/record-info',
      undefined,
      { taskId }
    );
  }
}
