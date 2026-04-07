"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function WelcomePage() {
  const { content, goToStep } = useBooth();
  const router = useRouter();

  async function handleContinue() {
    await goToStep("user-info");
    router.push(routeForStep("user-info"));
  }

  return (
    <BoothStepGate expectedStep="welcome">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="hero-grid">
          <p className="eyebrow">{content.copy.welcome.eyebrow}</p>
          <h1>{content.copy.welcome.title}</h1>
          <p className="lead">{content.copy.welcome.body}</p>
          <ul className="bullet-list">
            {content.copy.welcome.bulletList.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <PrimaryButton onClick={handleContinue}>{content.copy.welcome.cta}</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
