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

export default function LegalPage() {
  const { content, setLegalDecision, goToStep } = useBooth();
  const router = useRouter();

  async function handleDecision(accepted: boolean) {
    await setLegalDecision(accepted);
    const next = accepted ? "prompts" : "decline";
    await goToStep(next);
    router.push(routeForStep(next));
  }

  return (
    <BoothStepGate expectedStep="legal">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack legal">
          <h1>{content.legal.title}</h1>
          <p className="lead">{content.legal.intro}</p>
          {content.legal.sections.map((section) => (
            <article key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
          <p className="lead">{content.legal.agreement}</p>
          <div className="button-row">
            <PrimaryButton onClick={() => handleDecision(true)}>Accept</PrimaryButton>
            <SecondaryButton onClick={() => handleDecision(false)}>
              Decline
            </SecondaryButton>
          </div>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
