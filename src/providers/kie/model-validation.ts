import type { KieModel, KieParam } from './interface.js';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class KieModelValidationError extends Error {
  readonly model: KieModel;
  readonly issues: ValidationIssue[];

  constructor(model: KieModel, issues: ValidationIssue[]) {
    super(`Input validation failed for model "${model.modelId}"`);
    this.name = 'KieModelValidationError';
    this.model = model;
    this.issues = issues;
  }
}

export function buildModelInput(
  model: KieModel,
  params: Record<string, unknown>
): { input: Record<string, unknown>; callBackUrl?: string } {
  const issues: ValidationIssue[] = [];
  const input: Record<string, unknown> = {};
  const callBackUrl = resolveCallBackUrl(params);

  const paramMap = new Map<string, KieParam>(
    model.params.input.map(param => [param.name, param])
  );

  for (const param of model.params.input) {
    const raw = params[param.name];
    if (raw === undefined || raw === null || raw === '') {
      if (param.required && param.default === undefined) {
        issues.push({
          field: param.name,
          message: 'Required parameter is missing',
        });
      } else if (param.default !== undefined) {
        input[param.name] = param.default;
      }
      continue;
    }

    const coerced = coerceParamValue(param, raw, issues);
    if (coerced !== undefined) {
      input[param.name] = coerced;
    }
  }

  const unknownFields = Object.keys(params).filter(
    key => !paramMap.has(key) && !isReservedKey(key)
  );
  for (const field of unknownFields) {
    issues.push({
      field,
      message: 'Unknown parameter for this model',
    });
  }

  if (issues.length > 0) {
    throw new KieModelValidationError(model, issues);
  }

  return { input, callBackUrl };
}

function coerceParamValue(
  param: KieParam,
  rawValue: unknown,
  issues: ValidationIssue[]
): unknown | undefined {
  const value = rawValue;

  if (param.type === 'string') {
    if (typeof value !== 'string') {
      return recordTypeError(param, 'string', issues);
    }
    return validateString(param, value, issues);
  }

  if (param.type === 'number') {
    const numberValue = toNumber(value);
    if (numberValue === undefined) {
      return recordTypeError(param, 'number', issues);
    }
    return validateNumber(param, numberValue, issues);
  }

  if (param.type === 'integer') {
    const numberValue = toNumber(value);
    if (numberValue === undefined || !Number.isInteger(numberValue)) {
      return recordTypeError(param, 'integer', issues);
    }
    return validateNumber(param, numberValue, issues);
  }

  if (param.type === 'boolean') {
    const boolValue = toBoolean(value);
    if (boolValue === undefined) {
      return recordTypeError(param, 'boolean', issues);
    }
    return boolValue;
  }

  if (param.type === 'enum') {
    const enumValue = String(value);
    if (param.options && !param.options.includes(enumValue)) {
      issues.push({
        field: param.name,
        message: `Value must be one of: ${param.options.join(', ')}`,
      });
      return undefined;
    }
    return enumValue;
  }

  if (param.type === 'array') {
    const arrayValue = toArray(value);
    if (!arrayValue) {
      return recordTypeError(param, 'array', issues);
    }
    if (param.min !== undefined && arrayValue.length < param.min) {
      issues.push({
        field: param.name,
        message: `Must contain at least ${param.min} item(s)`,
      });
    }
    if (param.max !== undefined && arrayValue.length > param.max) {
      issues.push({
        field: param.name,
        message: `Must contain at most ${param.max} item(s)`,
      });
    }
    return arrayValue;
  }

  return value;
}

function validateString(
  param: KieParam,
  value: string,
  issues: ValidationIssue[]
): string | undefined {
  if (param.maxLength !== undefined && value.length > param.maxLength) {
    issues.push({
      field: param.name,
      message: `Must be at most ${param.maxLength} characters`,
    });
    return undefined;
  }
  if (param.options && !param.options.includes(value)) {
    issues.push({
      field: param.name,
      message: `Value must be one of: ${param.options.join(', ')}`,
    });
    return undefined;
  }
  return value;
}

function validateNumber(
  param: KieParam,
  value: number,
  issues: ValidationIssue[]
): number | undefined {
  if (param.min !== undefined && value < param.min) {
    issues.push({
      field: param.name,
      message: `Must be at least ${param.min}`,
    });
  }
  if (param.max !== undefined && value > param.max) {
    issues.push({
      field: param.name,
      message: `Must be at most ${param.max}`,
    });
  }
  if (param.options && !param.options.includes(String(value))) {
    issues.push({
      field: param.name,
      message: `Value must be one of: ${param.options.join(', ')}`,
    });
  }
  return value;
}

function recordTypeError(
  param: KieParam,
  expectedType: string,
  issues: ValidationIssue[]
): undefined {
  issues.push({
    field: param.name,
    message: `Expected ${expectedType}`,
  });
  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function toArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    if (trimmed.length === 0) {
      return [];
    }
    return trimmed.split(',').map(item => item.trim()).filter(Boolean);
  }
  return undefined;
}

function resolveCallBackUrl(params: Record<string, unknown>): string | undefined {
  const candidates = ['callBackUrl', 'callbackUrl', 'callback_url'];
  for (const key of candidates) {
    const value = params[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return undefined;
}

function isReservedKey(key: string): boolean {
  return key === 'callBackUrl' || key === 'callbackUrl' || key === 'callback_url';
}
