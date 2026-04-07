"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function DeclinePage() {
  const { content, resetSession, goToStep } = useBooth();
  const router = useRouter();

  async function handleBack() {
    await resetSession();
    await goToStep("welcome");
    router.push(routeForStep("welcome"));
  }

  return (
    <BoothStepGate expectedStep="decline">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center">
          <h1>{content.copy.decline.title}</h1>
          <p className="lead">{content.copy.decline.body}</p>
          <PrimaryButton onClick={handleBack}>{content.copy.decline.cta}</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
