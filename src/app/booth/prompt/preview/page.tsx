"use client";

import { useRouter } from "next/navigation";
import { CameraPreview } from "@/components/booth/CameraPreview";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import {
  BrandHeader,
  BoothShell,
  PrimaryButton,
  SecondaryButton,
  TimeDisplay,
} from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function PromptPreviewPage() {
  const { content, selectedPrompt, goToStep } = useBooth();
  const router = useRouter();

  if (!selectedPrompt) {
    return null;
  }

  async function start() {
    await goToStep("prompt-record");
    router.push(routeForStep("prompt-record"));
  }

  async function endNow() {
    await goToStep("prompts");
    router.push(routeForStep("prompts"));
  }

  return (
    <BoothStepGate expectedStep="prompt-preview">
      <BoothShell tone={selectedPrompt.phaseTone}>
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack">
          <h1>{selectedPrompt.revealText}</h1>
          <CameraPreview />
          <div className="button-row">
            <PrimaryButton onClick={start}>
              Start <TimeDisplay secondsRemaining={content.recordingSecondsLimit} />
            </PrimaryButton>
            <SecondaryButton onClick={endNow}>End</SecondaryButton>
          </div>
          <p className="lead">{selectedPrompt.previewGuidance}</p>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
