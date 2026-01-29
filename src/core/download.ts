import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, basename, join } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import type { TaskOutput } from './types.js';
import { spinner as createSpinner, success, error } from './output.js';

/**
 * Download a file from a URL to a local path
 */
export async function downloadFile(
  url: string,
  outputPath: string,
  options: { onProgress?: (percent: number) => void } = {}
): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  // Get content length for progress
  const contentLength = response.headers.get('content-length');
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

  const fileStream = createWriteStream(outputPath);
  const body = response.body;

  if (!body) {
    throw new Error('No response body');
  }

  if (totalBytes > 0 && options.onProgress) {
    let downloadedBytes = 0;
    const reader = body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          downloadedBytes += value.length;
          const percent = Math.round((downloadedBytes / totalBytes) * 100);
          options.onProgress?.(percent);
          controller.enqueue(value);
        }
      },
    });

    const nodeStream = Readable.fromWeb(stream as ReadableStream<Uint8Array>);
    nodeStream.pipe(fileStream);
    await finished(nodeStream);
  } else {
    const nodeStream = Readable.fromWeb(body as ReadableStream<Uint8Array>);
    nodeStream.pipe(fileStream);
    await finished(nodeStream);
  }
}

/**
 * Generate a filename from a URL
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return basename(pathname) || 'output';
  } catch {
    return 'output';
  }
}

/**
 * Generate a filename for a task output
 */
export function generateOutputFilename(
  output: TaskOutput,
  index: number,
  taskId: string
): string {
  if (output.filename) {
    return output.filename;
  }

  const urlFilename = getFilenameFromUrl(output.url);
  if (urlFilename !== 'output') {
    return urlFilename;
  }

  // Generate based on type
  const extensions: Record<string, string> = {
    image: 'png',
    video: 'mp4',
    audio: 'mp3',
    text: 'txt',
  };

  const ext = extensions[output.type] || 'bin';
  return `${taskId}_${index + 1}.${ext}`;
}

/**
 * Download task outputs to a directory
 */
export async function downloadTaskOutputs(
  outputs: TaskOutput[],
  outputDir: string,
  taskId: string
): Promise<string[]> {
  const downloadedFiles: string[] = [];

  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    const filename = generateOutputFilename(output, i, taskId);
    const outputPath = join(outputDir, filename);

    const spin = createSpinner(`Downloading ${filename}...`);
    spin.start();

    try {
      await downloadFile(output.url, outputPath, {
        onProgress: (percent) => {
          spin.text = `Downloading ${filename}... ${percent}%`;
        },
      });

      spin.succeed(`Downloaded: ${outputPath}`);
      downloadedFiles.push(outputPath);
    } catch (err) {
      spin.fail(`Failed to download ${filename}: ${(err as Error).message}`);
    }
  }

  return downloadedFiles;
}
