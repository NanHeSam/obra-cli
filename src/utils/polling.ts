import type { TaskStatus, PollOptions } from '../core/types.js';

const DEFAULT_INTERVAL = 2000; // 2 seconds
const DEFAULT_MAX_ATTEMPTS = 300; // 10 minutes at 2s intervals
const DEFAULT_TIMEOUT = 600000; // 10 minutes

/**
 * Poll a status function until completion or timeout
 */
export async function poll<T extends TaskStatus>(
  getStatus: () => Promise<T>,
  options: PollOptions = {}
): Promise<T> {
  const {
    interval = DEFAULT_INTERVAL,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    timeout = DEFAULT_TIMEOUT,
    onProgress,
  } = options;

  const startTime = Date.now();
  let attempts = 0;
  let currentInterval = interval;

  while (attempts < maxAttempts) {
    // Check timeout
    if (Date.now() - startTime > timeout) {
      throw new Error(`Polling timed out after ${timeout}ms`);
    }

    const status = await getStatus();

    // Notify progress callback
    if (onProgress) {
      onProgress(status);
    }

    // Check for terminal states
    if (status.status === 'success' || status.status === 'fail') {
      return status;
    }

    // Apply exponential backoff (max 10s)
    currentInterval = Math.min(currentInterval * 1.2, 10000);

    // Wait before next poll
    await sleep(currentInterval);
    attempts++;
  }

  throw new Error(`Polling exceeded maximum attempts (${maxAttempts})`);
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a polling controller that can be cancelled
 */
export function createPollingController() {
  let cancelled = false;

  return {
    cancel: () => {
      cancelled = true;
    },
    isCancelled: () => cancelled,
    poll: async <T extends TaskStatus>(
      getStatus: () => Promise<T>,
      options: PollOptions = {}
    ): Promise<T> => {
      const {
        interval = DEFAULT_INTERVAL,
        maxAttempts = DEFAULT_MAX_ATTEMPTS,
        timeout = DEFAULT_TIMEOUT,
        onProgress,
      } = options;

      const startTime = Date.now();
      let attempts = 0;
      let currentInterval = interval;

      while (attempts < maxAttempts && !cancelled) {
        if (Date.now() - startTime > timeout) {
          throw new Error(`Polling timed out after ${timeout}ms`);
        }

        const status = await getStatus();

        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'success' || status.status === 'fail') {
          return status;
        }

        currentInterval = Math.min(currentInterval * 1.2, 10000);
        await sleep(currentInterval);
        attempts++;
      }

      if (cancelled) {
        throw new Error('Polling was cancelled');
      }

      throw new Error(`Polling exceeded maximum attempts (${maxAttempts})`);
    },
  };
}
