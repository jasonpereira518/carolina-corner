import { PromptId, RecordingArtifact } from "@/lib/booth/types";

export function getRemainingPrompts(
  allPromptIds: PromptId[],
  completedPromptIds: PromptId[],
  recordings: Partial<Record<PromptId, RecordingArtifact>>,
): PromptId[] {
  return allPromptIds.filter(
    (promptId) =>
      !completedPromptIds.includes(promptId) &&
      !(recordings[promptId]?.status === "submitted"),
  );
}
