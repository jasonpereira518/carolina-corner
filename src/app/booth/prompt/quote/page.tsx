"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function PromptQuotePage() {
  const { content, selectedPrompt, goToStep } = useBooth();
  const router = useRouter();

  if (!selectedPrompt) {
    return null;
  }

  async function next() {
    await goToStep("prompt-preview");
    router.push(routeForStep("prompt-preview"));
  }

  return (
    <BoothStepGate expectedStep="prompt-quote">
      <BoothShell tone={selectedPrompt.phaseTone}>
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center quote">
          <p className="lead">{selectedPrompt.quoteText}</p>
          <p className="quote-author">{selectedPrompt.quoteAuthor}</p>
          <PrimaryButton onClick={next}>Next</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
