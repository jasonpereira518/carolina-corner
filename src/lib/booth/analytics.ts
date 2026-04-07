import { AnalyticsEvent } from "@/lib/booth/types";

export const analyticsEventMap = {
  sessionStarted: "booth_session_started",
  userInfoCaptured: "booth_user_info_captured",
  legalAccepted: "booth_legal_accepted",
  legalDeclined: "booth_legal_declined",
  promptChosen: "booth_prompt_chosen",
  recordingStarted: "booth_recording_started",
  recordingStopped: "booth_recording_stopped",
  recordingSubmitted: "booth_recording_submitted",
  recordingRetried: "booth_recording_retried",
  promptSkipped: "booth_prompt_skipped",
  sessionFinished: "booth_session_finished",
  mediaError: "booth_media_error",
} as const;

export function trackEvent(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event.name, event.payload);
  }
}
