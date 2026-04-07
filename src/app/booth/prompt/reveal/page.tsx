"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function PromptRevealPage() {
  const { content, selectedPrompt, goToStep } = useBooth();
  const router = useRouter();

  if (!selectedPrompt) {
    return null;
  }

  async function next() {
    await goToStep("prompt-quote");
    router.push(routeForStep("prompt-quote"));
  }

  return (
    <BoothStepGate expectedStep="prompt-reveal">
      <BoothShell tone={selectedPrompt.phaseTone}>
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center">
          <p className="eyebrow">{selectedPrompt.title}</p>
          <h1>{selectedPrompt.revealText}</h1>
          <PrimaryButton onClick={next}>Next</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
