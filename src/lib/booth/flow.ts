import { BoothSession, BoothStep } from "@/lib/booth/types";

export const stepRoutes: Record<BoothStep, string> = {
  welcome: "/booth/welcome",
  "user-info": "/booth/user-info",
  legal: "/booth/legal",
  decline: "/booth/decline",
  prompts: "/booth/prompts",
  "prompt-reveal": "/booth/prompt/reveal",
  "prompt-quote": "/booth/prompt/quote",
  "prompt-preview": "/booth/prompt/preview",
  "prompt-record": "/booth/prompt/record",
  "prompt-review": "/booth/prompt/review",
  email: "/booth/email",
  goodbye: "/booth/goodbye",
};

const transitionMap: Record<BoothStep, BoothStep[]> = {
  welcome: ["user-info"],
  "user-info": ["legal"],
  legal: ["decline", "prompts"],
  decline: ["welcome"],
  prompts: ["prompt-reveal", "email"],
  "prompt-reveal": ["prompt-quote"],
  "prompt-quote": ["prompt-preview"],
  "prompt-preview": ["prompt-record"],
  "prompt-record": ["prompt-review"],
  "prompt-review": ["prompt-preview", "prompts", "email"],
  email: ["goodbye"],
  goodbye: ["welcome"],
};

export function canTransition(from: BoothStep, to: BoothStep): boolean {
  return transitionMap[from].includes(to);
}

export function transitionStep(
  session: BoothSession,
  nextStep: BoothStep,
): BoothSession {
  if (!canTransition(session.step, nextStep)) {
    return session;
  }

  return {
    ...session,
    step: nextStep,
    updatedAt: new Date().toISOString(),
  };
}

export function routeForStep(step: BoothStep): string {
  return stepRoutes[step];
}

export function previousStepFor(step: BoothStep): BoothStep {
  switch (step) {
    case "welcome":
      return "welcome";
    case "user-info":
      return "welcome";
    case "legal":
      return "user-info";
    case "decline":
      return "legal";
    case "prompts":
      return "legal";
    case "prompt-reveal":
      return "prompts";
    case "prompt-quote":
      return "prompt-reveal";
    case "prompt-preview":
      return "prompt-quote";
    case "prompt-record":
      return "prompt-preview";
    case "prompt-review":
      return "prompt-preview";
    case "email":
      return "prompts";
    case "goodbye":
      return "email";
    default:
      return "welcome";
  }
}

export function nextStepAfterPromptSubmit(
  completedCount: number,
  totalPrompts: number,
): BoothStep {
  return completedCount >= totalPrompts ? "email" : "prompts";
}
