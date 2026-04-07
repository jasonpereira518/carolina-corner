"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function EmailPage() {
  const { content, goToStep } = useBooth();
  const router = useRouter();

  async function finishUp() {
    await goToStep("goodbye");
    router.push(routeForStep("goodbye"));
  }

  return (
    <BoothStepGate expectedStep="email">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center">
          <h1>{content.copy.emailComing.title}</h1>
          <p className="lead">{content.copy.emailComing.body}</p>
          <PrimaryButton onClick={finishUp}>{content.copy.emailComing.cta}</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
