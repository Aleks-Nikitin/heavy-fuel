import { fileTypeFromBuffer } from "file-type";
import { parseBuffer } from "music-metadata";

export const MAX_AUDIO_SIZE = 5 * 1024 * 1024;
export const MAX_AUDIO_DURATION_SECONDS = 30;

export const MAX_MULTIPART_SIZE = MAX_AUDIO_SIZE + 64 * 1024;

export class AudioValidationError extends Error {
  constructor(
    message: string,
    public readonly status: number = 422,
  ) {
    super(message);
    this.name = "AudioValidationError";
  }
}

const ALLOWED_FORMATS = new Set([
  "audio/webm",
  "video/webm",
  "audio/mp4",
  "video/mp4",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
]);

export async function validateAudio(buffer: Buffer): Promise<void> {
  if (buffer.length === 0) {
    throw new AudioValidationError("The audio recording is empty.", 400);
  }

  if (buffer.length > MAX_AUDIO_SIZE) {
    throw new AudioValidationError(
      "Audio recording exceeds the 5 MB limit.",
      413,
    );
  }

  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !ALLOWED_FORMATS.has(detected.mime)) {
    throw new AudioValidationError("Unsupported or invalid audio format.", 415);
  }
  let duration: number | undefined;

  try {
    const metadata = await parseBuffer(
      buffer,
      {
        mimeType: detected.mime,
        size: buffer.length,
      },
      {
        duration: true,
      },
    );

    duration = metadata.format.duration;
  } catch {
    throw new AudioValidationError("Unable to read audio metadata.");
  }

  if (duration === undefined || !Number.isFinite(duration) || duration <= 0) {
    throw new AudioValidationError("Unable to determine recording duration.");
  }

  if (duration > MAX_AUDIO_DURATION_SECONDS) {
    throw new AudioValidationError("Recordings must be 30 seconds or shorter.");
  }
}
