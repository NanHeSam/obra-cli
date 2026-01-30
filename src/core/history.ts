import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { getConfigPath } from './config.js';
import type { TaskOutput } from './types.js';

export interface HistoryEntry {
  taskId: string;
  command: 'image:generate' | 'video:generate' | 'music:generate' | 'music:lyrics' | 'music:video';
  model: string;
  prompt: string;
  params: Record<string, unknown>;
  provider: string;
  timestamp: string;
  status: 'pending' | 'success' | 'fail';
  outputs?: TaskOutput[];
  error?: string;
}

const MAX_ENTRIES = 1000;

export function getHistoryPath(): string {
  const configDir = dirname(getConfigPath());
  return join(configDir, 'history.json');
}

function readHistory(): HistoryEntry[] {
  try {
    const path = getHistoryPath();
    if (!existsSync(path)) return [];
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]): void {
  try {
    const path = getHistoryPath();
    const dir = dirname(path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(entries, null, 2));
  } catch {
    // Best-effort — never crash generation
  }
}

export function addHistoryEntry(entry: HistoryEntry): void {
  try {
    const entries = readHistory();
    entries.push(entry);
    // Cap at MAX_ENTRIES, trim oldest
    if (entries.length > MAX_ENTRIES) {
      entries.splice(0, entries.length - MAX_ENTRIES);
    }
    writeHistory(entries);
  } catch {
    // Best-effort
  }
}

export function updateHistoryEntry(
  taskId: string,
  update: { status?: HistoryEntry['status']; outputs?: TaskOutput[]; error?: string }
): void {
  try {
    const entries = readHistory();
    const entry = entries.find((e) => e.taskId === taskId);
    if (!entry) return;
    if (update.status !== undefined) entry.status = update.status;
    if (update.outputs !== undefined) entry.outputs = update.outputs;
    if (update.error !== undefined) entry.error = update.error;
    writeHistory(entries);
  } catch {
    // Best-effort
  }
}

export function getHistoryEntry(taskId: string): HistoryEntry | undefined {
  try {
    const entries = readHistory();
    return entries.find((e) => e.taskId === taskId);
  } catch {
    return undefined;
  }
}

export function queryHistory(options?: {
  type?: string;
  limit?: number;
  status?: string;
}): HistoryEntry[] {
  try {
    let entries = readHistory();
    // Newest first
    entries.reverse();

    if (options?.type) {
      const prefix = options.type + ':';
      entries = entries.filter((e) => e.command.startsWith(prefix));
    }
    if (options?.status) {
      entries = entries.filter((e) => e.status === options.status);
    }
    if (options?.limit) {
      entries = entries.slice(0, options.limit);
    }
    return entries;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    writeHistory([]);
  } catch {
    // Best-effort
  }
}
