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
import { pickRandom } from "@/lib/booth/random";
import { PromptCategoryId, PromptId } from "@/lib/booth/types";

export default function PromptsPage() {
  const { content, remainingPrompts, goToStep, selectPrompt, skipRemainingPrompts } =
    useBooth();
  const router = useRouter();
  const categoryIcon: Record<PromptCategoryId, string> = {
    belonging: "⌂",
    courage: "✦",
    "life-story": "◉",
  };

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

  async function chooseCategory(categoryId: PromptCategoryId) {
    const availableInCategory = remainingPrompts.filter(
      (promptId) => promptById[promptId].categoryId === categoryId,
    );

    if (availableInCategory.length === 0) {
      return;
    }

    const randomPromptId = pickRandom(availableInCategory);
    if (!randomPromptId) {
      return;
    }
    await choosePrompt(randomPromptId);
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
            {content.promptCategories
              .filter((category) =>
                remainingPrompts.some(
                  (promptId) => promptById[promptId].categoryId === category.id,
                ),
              )
              .map((category) => {
                const count = remainingPrompts.filter(
                  (promptId) => promptById[promptId].categoryId === category.id,
                ).length;

              return (
                <DoorCard
                  key={category.id}
                  title={category.label}
                  icon={categoryIcon[category.id]}
                  count={count}
                  onClick={() => chooseCategory(category.id)}
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
