import { AssemblyAI } from "assemblyai";

export class TranscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranscriptionError";
  }
}

export async function transcribeAudio(audio: Buffer): Promise<string> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error("ASSEMBLYAI_API_KEY is not configured.");
  }

  const client = new AssemblyAI({ apiKey });

  const result = await client.transcripts.transcribe({
    audio,
    speech_models: ["universal-3-pro", "universal-2"],
  });

  if (result.status === "error") {
    throw new TranscriptionError("Audio transcription failed.");
  }

  const text = result.text?.trim();

  if (!text) {
    throw new TranscriptionError("No speech was detected in the recording.");
  }

  return text;
}
