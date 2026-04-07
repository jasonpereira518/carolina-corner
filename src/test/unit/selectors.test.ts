import { getRemainingPrompts } from "@/lib/booth/selectors";

describe("prompt selectors", () => {
  it("hides completed and submitted prompts", () => {
    const all = ["prompt-1", "prompt-2", "prompt-3"] as const;
    const result = getRemainingPrompts(
      [...all],
      ["prompt-1"],
      {
        "prompt-2": {
          id: "r2",
          promptId: "prompt-2",
          createdAt: new Date().toISOString(),
          durationSeconds: 77,
          blobUrl: "blob:example",
          status: "submitted",
        },
      },
    );

    expect(result).toEqual(["prompt-3"]);
  });
});
