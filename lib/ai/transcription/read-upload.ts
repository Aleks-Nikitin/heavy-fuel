import {
  AudioValidationError,
  MAX_MULTIPART_SIZE,
} from "@/lib/ai/transcription/audio-validation";

export async function readLimitedBody(
  request: Request,
  maxBytes = MAX_MULTIPART_SIZE,
): Promise<Uint8Array> {
  if (!request.body) {
    throw new AudioValidationError("Request body is missing.", 400);
  }

  const reader = request.body.getReader();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > maxBytes) {
        await reader.cancel();

        throw new AudioValidationError(
          "Upload exceeds the maximum allowed size.",
          413,
        );
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const result = new Uint8Array(totalBytes);

  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return result;
}
