"use client";

import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

export default function GoodbyePage() {
  const { content, finishExperience, resetSession, goToStep } = useBooth();
  const router = useRouter();

  async function restart() {
    await finishExperience();
    await resetSession();
    await goToStep("welcome");
    router.push(routeForStep("welcome"));
  }

  return (
    <BoothStepGate expectedStep="goodbye">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack center quote">
          <h1>{content.copy.goodbye.title}</h1>
          <p className="lead">
            &quot;Do not go where the path may lead, go instead where there is no path and
            leave a trail.&quot;
          </p>
          <p className="quote-author">{content.copy.goodbye.quoteAuthor}</p>
          <p className="lead">{content.copy.goodbye.body}</p>
          <PrimaryButton onClick={restart}>Start Over</PrimaryButton>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
