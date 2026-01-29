import type { ModelInfo, ModelParameter, TaskType } from '../../core/types.js';
import type { KieModel, KieParam } from './interface.js';
import { KIE_MODELS as KIE_IMAGE_MODELS } from './image-models.js';
import { KIE_VIDEO_MODELS } from './video-models.js';

const KIE_MODEL_MAP: Record<string, KieModel> = {
  ...KIE_IMAGE_MODELS,
  ...KIE_VIDEO_MODELS,
};

const IMAGE_TYPES: TaskType[] = ['image'];
const VIDEO_TYPES: TaskType[] = ['video'];

export function getKieModelById(modelId: string): KieModel | undefined {
  return KIE_MODEL_MAP[modelId];
}

export function getKieModelsByType(type: TaskType): KieModel[] {
  if (IMAGE_TYPES.includes(type)) {
    return Object.values(KIE_IMAGE_MODELS);
  }
  if (VIDEO_TYPES.includes(type)) {
    return Object.values(KIE_VIDEO_MODELS);
  }
  return [];
}

export function getAllKieModels(): KieModel[] {
  return Object.values(KIE_MODEL_MAP);
}

export function toModelInfo(model: KieModel): ModelInfo {
  return {
    id: model.modelId,
    name: model.modelName,
    description: model.description,
    type: model.category,
    provider: model.provider,
    capabilities: [],
    parameters: model.params.input.map(toModelParameter),
  };
}

export function getModelInfoByType(type: TaskType): ModelInfo[] {
  return getKieModelsByType(type).map(toModelInfo);
}

export function groupModelsByFamily(type: TaskType): Array<{
  family: string;
  provider: string;
  models: { id: string; variant: string; credits?: number; creditsUnit?: string; price?: number }[];
}> {
  const families = new Map<
    string,
    {
      family: string;
      provider: string;
      models: { id: string; variant: string; credits?: number; creditsUnit?: string; price?: number }[];
    }
  >();

  for (const model of getKieModelsByType(type)) {
    const { family, variant } = parseModelId(model.modelId);
    if (!families.has(family)) {
      families.set(family, {
        family,
        provider: model.provider,
        models: [],
      });
    }

    families.get(family)!.models.push({
      id: model.modelId,
      variant: variant || family,
      credits: model.pricing?.credits,
      creditsUnit: model.pricing?.credits ? 'cr' : undefined,
      price: model.pricing?.kieUsd,
    });
  }

  return Array.from(families.values()).sort((a, b) =>
    a.family.localeCompare(b.family)
  );
}

function parseModelId(modelId: string): { family: string; variant: string } {
  const slashIndex = modelId.indexOf('/');
  if (slashIndex === -1) {
    return { family: modelId, variant: '' };
  }
  return {
    family: modelId.substring(0, slashIndex),
    variant: modelId.substring(slashIndex + 1),
  };
}

function toModelParameter(param: KieParam): ModelParameter {
  const normalizedType = normalizeParamType(param.type);
  return {
    name: param.name,
    type: normalizedType,
    description: param.description,
    required: param.required,
    default: param.default,
    options: param.options,
    min: param.min,
    max: param.max,
  };
}

function normalizeParamType(
  type: KieParam['type']
): ModelParameter['type'] {
  if (type === 'integer') return 'integer';
  if (type === 'enum') return 'enum';
  if (type === 'array') return 'array';
  return type;
}
