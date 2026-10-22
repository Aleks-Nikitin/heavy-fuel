import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { checkTranscriptionRateLimit } from "@/lib/ai/rate-limit";
import {
  validateAudio,
  AudioValidationError,
  MAX_AUDIO_SIZE,
  MAX_MULTIPART_SIZE,
} from "@/lib/ai/transcription/audio-validation";

import { readLimitedBody } from "@/lib/ai/transcription/read-upload";

import {
  transcribeAudio,
  TranscriptionError,
} from "@/lib/ai/transcription/assemblyai";

export const runtime = "nodejs";

const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
]);

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
    const contentLength = request.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_MULTIPART_SIZE) {
      return NextResponse.json(
        { error: "Upload exceeds the maximum allowed size." },
        { status: 413 },
      );
    }
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data." },
        { status: 415 },
      );
    }

    const rateLimit = await checkTranscriptionRateLimit(session.user.id);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many transcription requests.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    const body = await readLimitedBody(request);

    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers: {
        "content-type": request.headers.get("content-type") ?? "",
      },
      body: Buffer.from(body),
    });

    const formData = await boundedRequest.formData();

    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        { error: "An audio file is required." },
        { status: 400 },
      );
    }

    if (audio.size === 0 || audio.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: "Invalid audio file size." },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    await validateAudio(buffer);
    const transcript = await transcribeAudio(buffer);
    if (transcript.length > 1000) {
      return NextResponse.json(
        {
          error:
            "Your recording contains too much speech. Please use a shorter question.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      transcript,
    });
  } catch (error) {
    if (error instanceof AudioValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        },
      );
    }
    if (error instanceof TranscriptionError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 422 },
      );
    }
    console.error("Transcription API error:", error);
    return NextResponse.json(
      {
        error: "Transcription is temporarily unavailable.",
      },
      { status: 503 },
    );
  }
}
