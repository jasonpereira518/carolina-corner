"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { boothContent, promptById } from "@/lib/booth/content";
import {
  createInitialSession,
  mockBoothAdapters,
} from "@/lib/booth/adapters";
import { analyticsEventMap, trackEvent } from "@/lib/booth/analytics";
import { nextStepAfterPromptSubmit, transitionStep } from "@/lib/booth/flow";
import { getRemainingPrompts } from "@/lib/booth/selectors";
import {
  clearSessionStorage,
  readSessionFromStorage,
  writeSessionToStorage,
} from "@/lib/booth/storage";
import {
  BoothSession,
  BoothStep,
  PromptId,
  RecordingArtifact,
  UserProfile,
} from "@/lib/booth/types";

type BoothAction =
  | { type: "hydrate"; payload: BoothSession }
  | { type: "set-user"; payload: UserProfile }
  | { type: "set-legal"; payload: boolean }
  | { type: "select-prompt"; payload: PromptId }
  | { type: "set-step"; payload: BoothStep }
  | { type: "save-recording"; payload: RecordingArtifact }
  | { type: "submit-prompt"; payload: PromptId }
  | { type: "retry-prompt"; payload: PromptId }
  | { type: "reset-session" };

interface BoothContextValue {
  session: BoothSession;
  content: typeof boothContent;
  remainingPrompts: PromptId[];
  selectedPrompt: (typeof boothContent.prompts)[number] | null;
  setUser(profile: UserProfile): Promise<void>;
  setLegalDecision(accepted: boolean): Promise<void>;
  goToStep(step: BoothStep): Promise<void>;
  selectPrompt(promptId: PromptId): Promise<void>;
  saveRecording(recording: RecordingArtifact): Promise<void>;
  submitCurrentPrompt(): Promise<BoothStep>;
  retryCurrentPrompt(): Promise<void>;
  skipRemainingPrompts(): Promise<void>;
  finishExperience(): Promise<void>;
  resetSession(): Promise<void>;
}

const BoothContext = createContext<BoothContextValue | null>(null);

function reducer(state: BoothSession, action: BoothAction): BoothSession {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "set-user":
      return {
        ...state,
        userProfile: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case "set-legal":
      return {
        ...state,
        legalAccepted: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case "select-prompt":
      return {
        ...state,
        selectedPromptId: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case "set-step":
      return transitionStep(state, action.payload);
    case "save-recording":
      return {
        ...state,
        recordings: {
          ...state.recordings,
          [action.payload.promptId]: action.payload,
        },
        updatedAt: new Date().toISOString(),
      };
    case "submit-prompt":
      return {
        ...state,
        completedPromptIds: Array.from(
          new Set([...state.completedPromptIds, action.payload]),
        ),
        selectedPromptId: null,
        updatedAt: new Date().toISOString(),
      };
    case "retry-prompt": {
      const updated = { ...state.recordings };
      delete updated[action.payload];
      return {
        ...state,
        recordings: updated,
        updatedAt: new Date().toISOString(),
      };
    }
    case "reset-session":
      return createInitialSession();
    default:
      return state;
  }
}

export function BoothProvider({ children }: { children: React.ReactNode }) {
  const [session, dispatch] = useReducer(reducer, undefined, createInitialSession);

  useEffect(() => {
    const fromStorage = readSessionFromStorage();
    if (fromStorage) {
      dispatch({ type: "hydrate", payload: fromStorage });
    } else {
      trackEvent({
        name: analyticsEventMap.sessionStarted,
        payload: { sessionId: session.id },
      });
    }
  }, [session.id]);

  useEffect(() => {
    writeSessionToStorage(session);
    void mockBoothAdapters.sessionStore.updateSession(session);
  }, [session]);

  const remainingPrompts = useMemo(
    () =>
      getRemainingPrompts(
        boothContent.prompts.map((prompt) => prompt.id),
        session.completedPromptIds,
        session.recordings,
      ),
    [session.completedPromptIds, session.recordings],
  );

  const value = useMemo<BoothContextValue>(() => {
    const selectedPrompt = session.selectedPromptId
      ? promptById[session.selectedPromptId]
      : null;

    return {
      session,
      content: boothContent,
      remainingPrompts,
      selectedPrompt,
      async setUser(profile) {
        dispatch({ type: "set-user", payload: profile });
        trackEvent({
          name: analyticsEventMap.userInfoCaptured,
          payload: { sessionId: session.id },
        });
      },
      async setLegalDecision(accepted) {
        dispatch({ type: "set-legal", payload: accepted });
        trackEvent({
          name: accepted
            ? analyticsEventMap.legalAccepted
            : analyticsEventMap.legalDeclined,
          payload: { sessionId: session.id },
        });
      },
      async goToStep(step) {
        dispatch({ type: "set-step", payload: step });
      },
      async selectPrompt(promptId) {
        dispatch({ type: "select-prompt", payload: promptId });
        trackEvent({
          name: analyticsEventMap.promptChosen,
          payload: { sessionId: session.id, promptId },
        });
      },
      async saveRecording(recording) {
        dispatch({ type: "save-recording", payload: recording });
        await mockBoothAdapters.recordingStore.saveLocal(recording);
      },
      async submitCurrentPrompt() {
        if (!session.selectedPromptId) {
          return session.step;
        }

        const recording = session.recordings[session.selectedPromptId];
        if (recording) {
          await mockBoothAdapters.recordingStore.submit(recording.id);
        }
        dispatch({ type: "submit-prompt", payload: session.selectedPromptId });

        trackEvent({
          name: analyticsEventMap.recordingSubmitted,
          payload: { sessionId: session.id, promptId: session.selectedPromptId },
        });

        const completedCount = new Set([
          ...session.completedPromptIds,
          session.selectedPromptId,
        ]).size;

        return nextStepAfterPromptSubmit(completedCount, boothContent.prompts.length);
      },
      async retryCurrentPrompt() {
        if (!session.selectedPromptId) {
          return;
        }
        dispatch({ type: "retry-prompt", payload: session.selectedPromptId });
        trackEvent({
          name: analyticsEventMap.recordingRetried,
          payload: { sessionId: session.id, promptId: session.selectedPromptId },
        });
      },
      async skipRemainingPrompts() {
        trackEvent({
          name: analyticsEventMap.promptSkipped,
          payload: { sessionId: session.id },
        });
      },
      async finishExperience() {
        const email = session.userProfile?.email;
        if (email) {
          await mockBoothAdapters.email.queueDelivery(session.id, email);
        }
        await mockBoothAdapters.sessionStore.markComplete(session.id);
        trackEvent({
          name: analyticsEventMap.sessionFinished,
          payload: { sessionId: session.id },
        });
      },
      async resetSession() {
        clearSessionStorage();
        dispatch({ type: "reset-session" });
      },
    };
  }, [
    remainingPrompts,
    session,
  ]);

  return <BoothContext.Provider value={value}>{children}</BoothContext.Provider>;
}

export function useBooth() {
  const context = useContext(BoothContext);
  if (!context) {
    throw new Error("useBooth must be used within BoothProvider");
  }
  return context;
}
