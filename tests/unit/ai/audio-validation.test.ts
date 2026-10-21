import { describe, expect, it } from "vitest";

import {
  validateAudio,
  AudioValidationError,
  MAX_AUDIO_SIZE,
} from "../../../lib/ai/transcription/audio-validation";

function createWav(durationSeconds: number): Buffer {
  const sampleRate = 8000;
  const channels = 1;
  const bitsPerSample = 16;

  const sampleCount = Math.floor(sampleRate * durationSeconds);

  const dataSize = sampleCount * channels * (bitsPerSample / 8);

  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);

  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);

  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);

  buffer.writeUInt16LE(bitsPerSample, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

describe("Audio validation", () => {
  it("accepts a valid 10-second WAV recording", async () => {
    const audio = createWav(10);

    await expect(validateAudio(audio)).resolves.toBeUndefined();
  });

  it("accepts a recording exactly 30 seconds long", async () => {
    const audio = createWav(30);

    await expect(validateAudio(audio)).resolves.toBeUndefined();
  });

  it("rejects recordings longer than 30 seconds", async () => {
    const audio = createWav(31);

    await expect(validateAudio(audio)).rejects.toThrow(
      "Recordings must be 30 seconds or shorter.",
    );
  });

  it("rejects empty files", async () => {
    await expect(validateAudio(Buffer.alloc(0))).rejects.toBeInstanceOf(
      AudioValidationError,
    );
  });

  it("rejects fake audio files", async () => {
    const fakeAudio = Buffer.from("This is not an audio recording.");

    await expect(validateAudio(fakeAudio)).rejects.toThrow(
      "Unsupported or invalid audio format.",
    );
  });

  it("rejects files larger than 5 MB", async () => {
    const oversized = Buffer.alloc(MAX_AUDIO_SIZE + 1);

    await expect(validateAudio(oversized)).rejects.toThrow(
      "Audio recording exceeds the 5 MB limit.",
    );
  });
});
