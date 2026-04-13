"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton, TimeDisplay } from "@/components/booth/BoothUI";
import { useRecorder } from "@/components/booth/useRecorder";
import { analyticsEventMap, trackEvent } from "@/lib/booth/analytics";
import { routeForStep } from "@/lib/booth/flow";

export default function PromptRecordPage() {
  const { content, selectedPrompt, session, saveRecording, goToStep, setBackOverride } =
    useBooth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    videoRef,
    isRecording,
    secondsRemaining,
    start: startRecording,
    stop: stopRecording,
    cancel: cancelRecording,
  } = useRecorder();

  useEffect(() => {
    setBackOverride(async () => {
      if (isRecording) {
        const confirmed = window.confirm(
          "You are currently recording. Going back now will discard this take. Continue?",
        );
        if (!confirmed) {
          return "stay";
        }
        cancelRecording();
      }
      return "prompt-preview";
    });

    return () => {
      setBackOverride(null);
    };
  }, [cancelRecording, isRecording, setBackOverride]);

  useEffect(() => {
    if (!selectedPrompt) {
      return;
    }

    trackEvent({
      name: analyticsEventMap.recordingStarted,
      payload: { sessionId: session.id, promptId: selectedPrompt.id },
    });

    void startRecording({
      maxSeconds: content.recordingSecondsLimit,
      onComplete: async (blob, durationSeconds) => {
        const blobUrl = URL.createObjectURL(blob);
        await saveRecording({
          id: `recording_${crypto.randomUUID()}`,
          promptId: selectedPrompt.id,
          createdAt: new Date().toISOString(),
          durationSeconds,
          blobUrl,
          status: "local",
        });
        trackEvent({
          name: analyticsEventMap.recordingStopped,
          payload: { sessionId: session.id, promptId: selectedPrompt.id, durationSeconds },
        });
        await goToStep("prompt-review");
        router.push(routeForStep("prompt-review"));
      },
      onError: async (message) => {
        setError(message);
        trackEvent({
          name: analyticsEventMap.mediaError,
          payload: { sessionId: session.id, message },
        });
        await goToStep("prompt-preview");
        router.push(routeForStep("prompt-preview"));
      },
    });
  }, [
    content.recordingSecondsLimit,
    goToStep,
    router,
    saveRecording,
    selectedPrompt,
    session.id,
    startRecording,
  ]);

  if (!selectedPrompt) {
    return null;
  }

  return (
    <BoothStepGate expectedStep="prompt-record">
      <BoothShell tone={selectedPrompt.phaseTone}>
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center">
          <h1>Now recording.</h1>
          <p className="lead">Speak clearly and keep your eyes near the camera.</p>
          <div className="camera-frame">
            <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
          </div>
          <div className="button-row">
            <TimeDisplay secondsRemaining={secondsRemaining} />
            <PrimaryButton onClick={stopRecording}>Stop</PrimaryButton>
          </div>
          {error ? <p className="camera-error">{error}</p> : null}
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
