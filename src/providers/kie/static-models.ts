import type { ModelInfo, TaskType } from '../../core/types.js';

export const STATIC_MODELS: ModelInfo[] = [
  // Music Models - Suno
  {
    id: 'V3_5',
    name: 'Suno V3.5',
    description: 'Better song structure, max 4 minutes, improved song organization',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 3000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 200 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
    ],
  },
  {
    id: 'V4',
    name: 'Suno V4',
    description: 'Improved vocals, max 4 minutes, enhanced vocal quality',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 3000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 200 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
      {
        name: 'vocalGender',
        type: 'string',
        description: 'Vocal gender preference (m or f)',
        required: false,
        options: ['m', 'f'],
      },
    ],
  },
  {
    id: 'V4_5',
    name: 'Suno V4.5',
    description: 'Smart prompts, faster generations, max 8 minutes',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 5000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 1000 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
      {
        name: 'vocalGender',
        type: 'string',
        description: 'Vocal gender preference (m or f)',
        required: false,
        options: ['m', 'f'],
      },
      {
        name: 'styleWeight',
        type: 'number',
        description: 'Style adherence strength (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'weirdnessConstraint',
        type: 'number',
        description: 'Creative deviation control (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'audioWeight',
        type: 'number',
        description: 'Audio feature balance (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
    ],
  },
  {
    id: 'V4_5PLUS',
    name: 'Suno V4.5+',
    description: 'Richer sound, new creative ways, max 8 minutes',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 5000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 1000 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
      {
        name: 'vocalGender',
        type: 'string',
        description: 'Vocal gender preference (m or f)',
        required: false,
        options: ['m', 'f'],
      },
      {
        name: 'styleWeight',
        type: 'number',
        description: 'Style adherence strength (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'weirdnessConstraint',
        type: 'number',
        description: 'Creative deviation control (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'audioWeight',
        type: 'number',
        description: 'Audio feature balance (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
    ],
  },
  {
    id: 'V4_5ALL',
    name: 'Suno V4.5ALL',
    description: 'Smart and fast, smarter prompts, faster generations, max 8 minutes',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 5000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 1000 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
      {
        name: 'vocalGender',
        type: 'string',
        description: 'Vocal gender preference (m or f)',
        required: false,
        options: ['m', 'f'],
      },
      {
        name: 'styleWeight',
        type: 'number',
        description: 'Style adherence strength (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'weirdnessConstraint',
        type: 'number',
        description: 'Creative deviation control (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'audioWeight',
        type: 'number',
        description: 'Audio feature balance (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
    ],
  },
  {
    id: 'V5',
    name: 'Suno V5',
    description: 'Faster generation, superior musicality, improved speed, max 8 minutes',
    type: 'music',
    provider: 'kie',
    capabilities: ['text-to-music', 'lyrics-generation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'Music description or lyrics (500 chars non-custom, 5000 chars custom)',
        required: true,
      },
      {
        name: 'customMode',
        type: 'boolean',
        description: 'Enable advanced customization (requires style and title)',
        required: true,
        default: false,
      },
      {
        name: 'instrumental',
        type: 'boolean',
        description: 'Generate instrumental only (no vocals)',
        required: true,
        default: false,
      },
      {
        name: 'style',
        type: 'string',
        description: 'Music style/genre (required in custom mode, max 1000 chars)',
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Track title (required in custom mode, max 80 chars)',
        required: false,
      },
      {
        name: 'negativeTags',
        type: 'string',
        description: 'Music styles to exclude',
        required: false,
      },
      {
        name: 'vocalGender',
        type: 'string',
        description: 'Vocal gender preference (m or f)',
        required: false,
        options: ['m', 'f'],
      },
      {
        name: 'styleWeight',
        type: 'number',
        description: 'Style adherence strength (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'weirdnessConstraint',
        type: 'number',
        description: 'Creative deviation control (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
      {
        name: 'audioWeight',
        type: 'number',
        description: 'Audio feature balance (0-1)',
        required: false,
        min: 0,
        max: 1,
      },
    ],
  },
];

export function getStaticModelsByType(type: TaskType): ModelInfo[] {
  return STATIC_MODELS.filter(model => model.type === type);
}

export function getStaticModelById(id: string): ModelInfo | undefined {
  return STATIC_MODELS.find(model => model.id === id);
}

export function getAllStaticModelIds(): string[] {
  return STATIC_MODELS.map(model => model.id);
}

export function mapParamsToKieInput(
  params: Record<string, unknown>
): Record<string, unknown> {
  const input: Record<string, unknown> = {};

  if (params.prompt) {
    input.prompt = params.prompt;
  }
  if (params['aspect-ratio'] || params.aspectRatio) {
    input.aspect_ratio = params['aspect-ratio'] || params.aspectRatio;
  }
  if (params.duration !== undefined) {
    input.duration = params.duration;
  }
  if (params.style) {
    input.style = params.style;
  }
  if (params['negative-prompt'] || params.negativePrompt) {
    input.negative_prompt = params['negative-prompt'] || params.negativePrompt;
  }
  if (params.seed !== undefined) {
    input.seed = params.seed;
  }
  if (params.image) {
    input.image = params.image;
  }
  if (params.fps !== undefined) {
    input.fps = params.fps;
  }
  if (params.instrumental !== undefined) {
    input.instrumental = params.instrumental;
  }
  if (params.lyrics) {
    input.lyrics = params.lyrics;
  }
  if (params.voice) {
    input.voice = params.voice;
  }
  if (params.speed !== undefined) {
    input.speed = params.speed;
  }
  if (params.pitch !== undefined) {
    input.pitch = params.pitch;
  }
  if (params.language) {
    input.language = params.language;
  }
  if (params.format) {
    input.format = params.format;
  }
  if (params.text) {
    input.text = params.text;
  }
  if (params.audio) {
    input.audio = params.audio;
  }

  return input;
}
