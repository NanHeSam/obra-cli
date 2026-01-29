import { describe, test, expect, mock } from 'bun:test';
import { poll, sleep, createPollingController } from '../../src/utils/polling.js';
import type { TaskStatus } from '../../src/core/types.js';

describe('poll', () => {
  test('returns immediately on success status', async () => {
    const getStatus = mock(() =>
      Promise.resolve({
        id: 'task-1',
        status: 'success' as const,
      })
    );

    const result = await poll(getStatus);

    expect(result.status).toBe('success');
    expect(getStatus).toHaveBeenCalledTimes(1);
  });

  test('returns immediately on fail status', async () => {
    const getStatus = mock(() =>
      Promise.resolve({
        id: 'task-1',
        status: 'fail' as const,
        message: 'Task failed',
      })
    );

    const result = await poll(getStatus);

    expect(result.status).toBe('fail');
    expect(getStatus).toHaveBeenCalledTimes(1);
  });

  test('polls until success', async () => {
    let callCount = 0;
    const getStatus = mock(() => {
      callCount++;
      return Promise.resolve({
        id: 'task-1',
        status: callCount < 3 ? ('generating' as const) : ('success' as const),
        progress: callCount * 33,
      });
    });

    const result = await poll(getStatus, { interval: 10 });

    expect(result.status).toBe('success');
    expect(callCount).toBe(3);
  });

  test('calls onProgress callback', async () => {
    let callCount = 0;
    const progressValues: number[] = [];

    const getStatus = mock(() => {
      callCount++;
      return Promise.resolve({
        id: 'task-1',
        status: callCount < 3 ? ('generating' as const) : ('success' as const),
        progress: callCount * 33,
      });
    });

    await poll(getStatus, {
      interval: 10,
      onProgress: (status) => {
        if (status.progress !== undefined) {
          progressValues.push(status.progress);
        }
      },
    });

    expect(progressValues).toContain(33);
    expect(progressValues).toContain(66);
  });

  test('throws on timeout', async () => {
    const getStatus = mock(() =>
      Promise.resolve({
        id: 'task-1',
        status: 'generating' as const,
      })
    );

    await expect(
      poll(getStatus, { interval: 10, timeout: 50 })
    ).rejects.toThrow('timed out');
  });

  test('throws on max attempts', async () => {
    const getStatus = mock(() =>
      Promise.resolve({
        id: 'task-1',
        status: 'generating' as const,
      })
    );

    await expect(
      poll(getStatus, { interval: 10, maxAttempts: 3, timeout: 10000 })
    ).rejects.toThrow('maximum attempts');
  });
});

describe('sleep', () => {
  test('sleeps for specified time', async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some tolerance
    expect(elapsed).toBeLessThan(100);
  });
});

describe('createPollingController', () => {
  test('creates controller with cancel method', () => {
    const controller = createPollingController();
    expect(typeof controller.cancel).toBe('function');
    expect(typeof controller.isCancelled).toBe('function');
    expect(typeof controller.poll).toBe('function');
  });

  test('isCancelled returns false initially', () => {
    const controller = createPollingController();
    expect(controller.isCancelled()).toBe(false);
  });

  test('isCancelled returns true after cancel', () => {
    const controller = createPollingController();
    controller.cancel();
    expect(controller.isCancelled()).toBe(true);
  });

  test('poll stops when cancelled', async () => {
    const controller = createPollingController();
    let callCount = 0;

    const getStatus = mock(() => {
      callCount++;
      if (callCount >= 2) {
        controller.cancel();
      }
      return Promise.resolve({
        id: 'task-1',
        status: 'generating' as const,
      });
    });

    await expect(
      controller.poll(getStatus, { interval: 10 })
    ).rejects.toThrow('cancelled');

    expect(callCount).toBeLessThanOrEqual(3);
  });

  test('controller poll returns on success', async () => {
    const controller = createPollingController();

    const getStatus = mock(() =>
      Promise.resolve({
        id: 'task-1',
        status: 'success' as const,
      })
    );

    const result = await controller.poll(getStatus);

    expect(result.status).toBe('success');
    expect(controller.isCancelled()).toBe(false);
  });
});
