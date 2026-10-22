"use client";

import { useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";

type Props = {
  disabled?: boolean;
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
};

export default function AIVoiceRecorder({
  disabled = false,
  onTranscript,
  onError,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  function cleanup() {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
  }

  async function startRecording() {
    try {
      onError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Your browser does not support microphone recording.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

      const supportedType = mimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );

      const recorder = new MediaRecorder(
        stream,
        supportedType ? { mimeType: supportedType } : undefined,
      );

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audio = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });

        cleanup();

        if (audio.size === 0) {
          onError("No audio was recorded. Please try again.");
          return;
        }

        setIsTranscribing(true);

        try {
          const formData = new FormData();

          const extension = recorder.mimeType.includes("mp4") ? "mp4" : "webm";

          formData.append(
            "audio",
            new File([audio], `recording.${extension}`, {
              type: recorder.mimeType,
            }),
          );

          const response = await fetch("/api/ai/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = (await response.json()) as {
            transcript?: string;
            error?: string;
          };

          if (!response.ok) {
            throw new Error(data.error || "Transcription failed.");
          }

          if (!data.transcript) {
            throw new Error("No speech detected. Please try again.");
          }

          onTranscript(data.transcript);
        } catch (error) {
          onError(
            error instanceof Error
              ? error.message
              : "Unable to transcribe your recording.",
          );
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.onerror = () => {
        cleanup();
        onError("Recording failed. Please try again.");
      };

      recorder.start();
      setIsRecording(true);
      recordingTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 25_000);
    } catch (error) {
      cleanup();
      onError(
        error instanceof Error
          ? error.message
          : "Unable to access your microphone.",
      );
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    }
  }

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      aria-label={isRecording ? "Stop recording" : "Record voice message"}
      title={isRecording ? "Stop recording" : "Record voice message"}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:opacity-40 ${
        isRecording
          ? "border-red-500 bg-red-500/10 text-red-400"
          : "border-white/10 bg-[#13161C] text-white hover:text-[#CCFF00]"
      }`}
    >
      {isTranscribing ? (
        <Loader2 size={19} className="animate-spin" />
      ) : isRecording ? (
        <Square size={18} fill="currentColor" />
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
}
