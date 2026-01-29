import { describe, test, expect } from 'bun:test';
import { mkdtemp, rm, stat } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { KieProvider } from '../../src/providers/kie/index.js';
import { downloadTaskOutputs } from '../../src/core/download.js';
import * as config from '../../src/core/config.js';

const shouldRun = process.env.KAI_INTEGRATION_TESTS === '1';
const apiKey = config.getProviderConfig('kie')?.apiKey;
const runIntegration = shouldRun && typeof apiKey === 'string' && apiKey.length > 0;
const integrationTest = runIntegration ? test : test.skip;

describe('Kie integration (real API)', () => {
  integrationTest(
    'creates, waits, and downloads an image',
    { timeout: 8 * 60 * 1000 },
    async () => {
      const provider = new KieProvider();
      const outputDir = await mkdtemp(join(tmpdir(), 'kai-int-image-'));

      try {
        const task = await provider.createTask('image', 'qwen/text-to-image', {
          prompt: 'A cat wearing a hat, studio lighting, sharp focus',
          image_size: 'square_hd',
        });

        const result = await provider.waitForCompletion(task.id, {
          timeout: 5 * 60 * 1000,
        });

        if (result.status !== 'success') {
          throw new Error(result.error ?? 'Image task failed');
        }

        expect(result.outputs.length).toBeGreaterThan(0);
        expect(result.outputs[0].type).toBe('image');

        const outputs = result.outputs.slice(0, 1);
        const downloadedFiles = await downloadTaskOutputs(outputs, outputDir, task.id);
        expect(downloadedFiles.length).toBe(outputs.length);

        const fileStats = await stat(downloadedFiles[0]);
        expect(fileStats.size).toBeGreaterThan(0);
      } finally {
        await rm(outputDir, { recursive: true, force: true });
      }
    }
  );

  integrationTest(
    'creates, waits, and downloads a video',
    { timeout: 15 * 60 * 1000 },
    async () => {
      const provider = new KieProvider();
      const outputDir = await mkdtemp(join(tmpdir(), 'kai-int-video-'));

      try {
        const task = await provider.createTask('video', 'grok-imagine/text-to-video', {
          prompt: 'A short cinematic pan across a mountain lake at sunrise.',
          aspect_ratio: '16:9',
        });

        const result = await provider.waitForCompletion(task.id, {
          timeout: 12 * 60 * 1000,
        });

        if (result.status !== 'success') {
          throw new Error(result.error ?? 'Video task failed');
        }

        expect(result.outputs.length).toBeGreaterThan(0);
        expect(result.outputs[0].type).toBe('video');

        const outputs = result.outputs.slice(0, 1);
        const downloadedFiles = await downloadTaskOutputs(outputs, outputDir, task.id);
        expect(downloadedFiles.length).toBe(outputs.length);

        const fileStats = await stat(downloadedFiles[0]);
        expect(fileStats.size).toBeGreaterThan(0);
      } finally {
        await rm(outputDir, { recursive: true, force: true });
      }
    }
  );
});
