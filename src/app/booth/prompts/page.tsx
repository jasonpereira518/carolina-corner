"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import {
  BrandHeader,
  BoothShell,
  DoorCard,
  PrimaryButton,
} from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";
import { promptById } from "@/lib/booth/content";
import { PromptId } from "@/lib/booth/types";

export default function PromptsPage() {
  const { content, remainingPrompts, goToStep, selectPrompt, skipRemainingPrompts } =
    useBooth();
  const router = useRouter();

  useEffect(() => {
    if (remainingPrompts.length === 0) {
      void goToStep("email").then(() => router.replace(routeForStep("email")));
    }
  }, [remainingPrompts.length, goToStep, router]);

  async function choosePrompt(promptId: PromptId) {
    await selectPrompt(promptId);
    await goToStep("prompt-reveal");
    router.push(routeForStep("prompt-reveal"));
  }

  async function skip() {
    await skipRemainingPrompts();
    await goToStep("email");
    router.push(routeForStep("email"));
  }

  return (
    <BoothStepGate expectedStep="prompts">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack">
          <h1>{content.copy.prompts.title}</h1>
          <p className="lead">{content.copy.prompts.body}</p>
          <div className="door-grid">
            {remainingPrompts.map((promptId) => {
              const prompt = promptById[promptId];
              return (
                <DoorCard
                  key={promptId}
                  title={prompt.title}
                  promptLabel={prompt.revealText}
                  onClick={() => choosePrompt(promptId)}
                />
              );
            })}
          </div>
          <PrimaryButton onClick={skip}>{content.copy.prompts.skipCta}</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
