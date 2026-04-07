import { canTransition, nextStepAfterPromptSubmit, routeForStep } from "@/lib/booth/flow";

describe("booth flow", () => {
  it("allows legal branching", () => {
    expect(canTransition("legal", "prompts")).toBe(true);
    expect(canTransition("legal", "decline")).toBe(true);
    expect(canTransition("legal", "goodbye")).toBe(false);
  });

  it("computes next step after prompt submission", () => {
    expect(nextStepAfterPromptSubmit(1, 3)).toBe("prompts");
    expect(nextStepAfterPromptSubmit(3, 3)).toBe("email");
  });

  it("maps steps to route paths", () => {
    expect(routeForStep("prompt-record")).toBe("/booth/prompt/record");
  });
});
