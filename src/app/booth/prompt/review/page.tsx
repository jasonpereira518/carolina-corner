"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import {
  BrandHeader,
  BoothShell,
  PrimaryButton,
  SecondaryButton,
} from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function PromptReviewPage() {
  const { content, selectedPrompt, session, submitCurrentPrompt, retryCurrentPrompt, goToStep } =
    useBooth();
  const router = useRouter();

  if (!selectedPrompt) {
    return null;
  }

  const recording = session.recordings[selectedPrompt.id];
  if (!recording) {
    return null;
  }

  async function submit() {
    const next = await submitCurrentPrompt();
    await goToStep(next);
    router.push(routeForStep(next));
  }

  async function retry() {
    await retryCurrentPrompt();
    await goToStep("prompt-preview");
    router.push(routeForStep("prompt-preview"));
  }

  return (
    <BoothStepGate expectedStep="prompt-review">
      <BoothShell tone={selectedPrompt.phaseTone}>
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center">
          <h1>{selectedPrompt.reviewHeadline}</h1>
          <video controls className="camera-video playback" src={recording.blobUrl} />
          <p className="lead">{selectedPrompt.reviewBody}</p>
          <div className="button-row">
            <PrimaryButton onClick={submit}>Submit</PrimaryButton>
            <SecondaryButton onClick={retry}>Try Again</SecondaryButton>
          </div>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
