import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import {
  getHistoryPath,
  addHistoryEntry,
  updateHistoryEntry,
  getHistoryEntry,
  queryHistory,
  clearHistory,
} from '../../src/core/history.js';
import type { HistoryEntry } from '../../src/core/history.js';

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    taskId: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    command: 'image:generate',
    model: 'google/imagen4-fast',
    prompt: 'a cat on a roof',
    params: { prompt: 'a cat on a roof' },
    provider: 'kie',
    timestamp: new Date().toISOString(),
    status: 'pending',
    ...overrides,
  };
}

describe('History Module', () => {
  beforeEach(() => {
    clearHistory();
  });

  afterEach(() => {
    clearHistory();
  });

  test('getHistoryPath returns a path containing obra', () => {
    const path = getHistoryPath();
    expect(path).toContain('obra');
    expect(path).toEndWith('history.json');
  });

  test('addHistoryEntry and getHistoryEntry', () => {
    const entry = makeEntry({ taskId: 'test-add-1' });
    addHistoryEntry(entry);

    const found = getHistoryEntry('test-add-1');
    expect(found).toBeDefined();
    expect(found!.taskId).toBe('test-add-1');
    expect(found!.command).toBe('image:generate');
    expect(found!.prompt).toBe('a cat on a roof');
  });

  test('getHistoryEntry returns undefined for missing taskId', () => {
    const found = getHistoryEntry('nonexistent-task');
    expect(found).toBeUndefined();
  });

  test('updateHistoryEntry updates status and outputs', () => {
    const entry = makeEntry({ taskId: 'test-update-1' });
    addHistoryEntry(entry);

    updateHistoryEntry('test-update-1', {
      status: 'success',
      outputs: [{ url: 'https://example.com/img.png', type: 'image' }],
    });

    const found = getHistoryEntry('test-update-1');
    expect(found!.status).toBe('success');
    expect(found!.outputs).toHaveLength(1);
    expect(found!.outputs![0].url).toBe('https://example.com/img.png');
  });

  test('updateHistoryEntry sets error', () => {
    const entry = makeEntry({ taskId: 'test-update-err' });
    addHistoryEntry(entry);

    updateHistoryEntry('test-update-err', {
      status: 'fail',
      error: 'Something went wrong',
    });

    const found = getHistoryEntry('test-update-err');
    expect(found!.status).toBe('fail');
    expect(found!.error).toBe('Something went wrong');
  });

  test('updateHistoryEntry is a no-op for missing taskId', () => {
    // Should not throw
    updateHistoryEntry('nonexistent', { status: 'success' });
  });

  test('queryHistory returns newest first', () => {
    addHistoryEntry(makeEntry({ taskId: 'first', timestamp: '2024-01-01T00:00:00Z' }));
    addHistoryEntry(makeEntry({ taskId: 'second', timestamp: '2024-01-02T00:00:00Z' }));
    addHistoryEntry(makeEntry({ taskId: 'third', timestamp: '2024-01-03T00:00:00Z' }));

    const entries = queryHistory();
    expect(entries).toHaveLength(3);
    expect(entries[0].taskId).toBe('third');
    expect(entries[2].taskId).toBe('first');
  });

  test('queryHistory filters by type', () => {
    addHistoryEntry(makeEntry({ taskId: 'img1', command: 'image:generate' }));
    addHistoryEntry(makeEntry({ taskId: 'vid1', command: 'video:generate' }));
    addHistoryEntry(makeEntry({ taskId: 'mus1', command: 'music:generate' }));

    const images = queryHistory({ type: 'image' });
    expect(images).toHaveLength(1);
    expect(images[0].taskId).toBe('img1');

    const music = queryHistory({ type: 'music' });
    expect(music).toHaveLength(1);
    expect(music[0].taskId).toBe('mus1');
  });

  test('queryHistory filters by status', () => {
    addHistoryEntry(makeEntry({ taskId: 'p1', status: 'pending' }));
    addHistoryEntry(makeEntry({ taskId: 's1', status: 'success' }));
    addHistoryEntry(makeEntry({ taskId: 'f1', status: 'fail' }));

    const successes = queryHistory({ status: 'success' });
    expect(successes).toHaveLength(1);
    expect(successes[0].taskId).toBe('s1');
  });

  test('queryHistory respects limit', () => {
    for (let i = 0; i < 10; i++) {
      addHistoryEntry(makeEntry({ taskId: `lim-${i}` }));
    }

    const entries = queryHistory({ limit: 3 });
    expect(entries).toHaveLength(3);
  });

  test('clearHistory removes all entries', () => {
    addHistoryEntry(makeEntry({ taskId: 'clear-1' }));
    addHistoryEntry(makeEntry({ taskId: 'clear-2' }));

    clearHistory();

    const entries = queryHistory();
    expect(entries).toHaveLength(0);
  });

  test('addHistoryEntry caps at 1000 entries', () => {
    // Add 1002 entries
    for (let i = 0; i < 1002; i++) {
      addHistoryEntry(makeEntry({ taskId: `cap-${i}` }));
    }

    const entries = queryHistory({ limit: 1100 });
    expect(entries.length).toBeLessThanOrEqual(1000);
    // Oldest entries should have been trimmed
    expect(getHistoryEntry('cap-0')).toBeUndefined();
    expect(getHistoryEntry('cap-1')).toBeUndefined();
    expect(getHistoryEntry('cap-2')).toBeDefined();
  });
});
