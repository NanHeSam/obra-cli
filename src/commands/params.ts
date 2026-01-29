export function parseParamPairs(values?: string[]): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (!values) return params;

  for (const entry of values) {
    const [key, ...rest] = entry.split('=');
    const value = rest.join('=');
    if (!key || value === undefined) {
      throw new Error(`Invalid --param format "${entry}". Use key=value.`);
    }
    params[key] = value;
  }

  return params;
}

export function parseJsonParams(value?: string): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected a JSON object');
    }
    return parsed as Record<string, unknown>;
  } catch (err) {
    throw new Error(`Invalid --params-json: ${(err as Error).message}`);
  }
}
