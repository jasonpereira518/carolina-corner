"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface StartOptions {
  maxSeconds: number;
  onComplete: (blob: Blob, durationSeconds: number) => void;
  onError: (message: string) => void;
}

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [supportsMediaRecorder, setSupportsMediaRecorder] = useState(true);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopTimer();
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, [stopTimer]);

  const start = useCallback(
    async ({ maxSeconds, onComplete, onError }: StartOptions) => {
      setSecondsRemaining(maxSeconds);
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        if (typeof window.MediaRecorder === "undefined") {
          setSupportsMediaRecorder(false);
          onError("MediaRecorder is not supported on this browser.");
          return;
        }

        setSupportsMediaRecorder(true);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          onComplete(blob, elapsed);
          stopStream();
        };

        recorder.start(250);
        setIsRecording(true);
        intervalRef.current = window.setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              stop();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch {
        onError("Camera or microphone permission was denied.");
      }
    },
    [stop, stopStream],
  );

  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();
    };
  }, [stopStream, stopTimer]);

  return {
    videoRef,
    isRecording,
    secondsRemaining,
    supportsMediaRecorder,
    start,
    stop,
  };
}
