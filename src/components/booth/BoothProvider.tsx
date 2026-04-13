"use client";

import {
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { boothContent, promptById } from "@/lib/booth/content";
import {
  createInitialSession,
} from "@/lib/booth/adapters";
import {
  getBoothAdapters,
  isSupabaseModeEnabled,
  setAdapterSession,
} from "@/lib/booth/adapterFactory";
import { analyticsEventMap, trackEvent } from "@/lib/booth/analytics";
import {
  nextStepAfterPromptSubmit,
  previousStepFor,
  transitionStep,
} from "@/lib/booth/flow";
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
  | { type: "force-step"; payload: BoothStep }
  | { type: "save-recording"; payload: RecordingArtifact }
  | { type: "submit-prompt"; payload: PromptId }
  | { type: "retry-prompt"; payload: PromptId }
  | { type: "reset-session" };

interface BoothContextValue {
  session: BoothSession;
  syncError: string | null;
  content: typeof boothContent;
  remainingPrompts: PromptId[];
  selectedPrompt: (typeof boothContent.prompts)[number] | null;
  clearSyncError(): void;
  retrySync(): Promise<void>;
  setBackOverride(handler: (() => Promise<BoothStep | "stay" | null>) | null): void;
  setUser(profile: UserProfile): Promise<void>;
  setLegalDecision(accepted: boolean): Promise<void>;
  goToStep(step: BoothStep): Promise<void>;
  goBack(): Promise<BoothStep>;
  selectPrompt(promptId: PromptId): Promise<void>;
  saveRecording(recording: RecordingArtifact): Promise<void>;
  submitCurrentPrompt(): Promise<BoothStep>;
  retryCurrentPrompt(): Promise<void>;
  skipRemainingPrompts(): Promise<void>;
  finishExperience(): Promise<boolean>;
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
    case "force-step":
      return {
        ...state,
        step: action.payload,
        updatedAt: new Date().toISOString(),
      };
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
  const [syncError, setSyncError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const initialSession = useRef(session);
  const retryRef = useRef<(() => Promise<void>) | null>(null);
  const backOverrideRef = useRef<(() => Promise<BoothStep | "stay" | null>) | null>(
    null,
  );
  const adapters = useMemo(() => getBoothAdapters(), []);

  const setSyncFailure = useCallback((message: string, retry: (() => Promise<void>) | null = null) => {
    setSyncError(message);
    retryRef.current = retry;
  }, []);

  const clearSyncError = useCallback(() => {
    setSyncError(null);
    retryRef.current = null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const fromStorage = readSessionFromStorage();
      if (fromStorage) {
        setAdapterSession(fromStorage);
        dispatch({ type: "hydrate", payload: fromStorage });
        hasInitialized.current = true;
        return;
      }

      try {
        const created = await adapters.sessionStore.createSession(initialSession.current);
        if (!isMounted) {
          return;
        }
        clearSyncError();
        setAdapterSession(created);
        dispatch({ type: "hydrate", payload: created });
      } catch {
        // Keep local in-memory fallback if remote create fails.
        setSyncFailure("Could not connect to Supabase. Running in local fallback mode.");
        setAdapterSession(initialSession.current);
      } finally {
        if (isMounted) {
          hasInitialized.current = true;
          trackEvent({
            name: analyticsEventMap.sessionStarted,
            payload: {
              sessionId: initialSession.current.id,
              supabaseMode: isSupabaseModeEnabled(),
            },
          });
        }
      }
    }

    void initializeSession();

    return () => {
      isMounted = false;
    };
  }, [adapters, clearSyncError, setSyncFailure]);

  useEffect(() => {
    if (!hasInitialized.current) {
      return;
    }
    setAdapterSession(session);
    writeSessionToStorage(session);
    void adapters.sessionStore.updateSession(session).then(
      () => {
        clearSyncError();
      },
      () => {
        setSyncFailure("We could not sync your session. Try again.", async () => {
          await adapters.sessionStore.updateSession(session);
          clearSyncError();
        });
      },
    );
  }, [adapters, clearSyncError, session, setSyncFailure]);

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
      syncError,
      content: boothContent,
      remainingPrompts,
      selectedPrompt,
      clearSyncError,
      async retrySync() {
        if (!retryRef.current) {
          return;
        }
        try {
          await retryRef.current();
          clearSyncError();
        } catch {
          setSyncFailure("Retry failed. Please try again.");
        }
      },
      setBackOverride(handler) {
        backOverrideRef.current = handler;
      },
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
      async goBack() {
        if (backOverrideRef.current) {
          const result = await backOverrideRef.current();
          if (result === "stay") {
            return session.step;
          }
          if (result) {
            dispatch({ type: "force-step", payload: result });
            return result;
          }
        }
        const previous = previousStepFor(session.step);
        dispatch({ type: "force-step", payload: previous });
        return previous;
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
        try {
          await adapters.recordingStore.saveLocal(recording);
          clearSyncError();
        } catch {
          setSyncFailure("Recording saved locally, but cloud sync failed. Retry.", async () => {
            await adapters.recordingStore.saveLocal(recording);
            clearSyncError();
          });
        }
      },
      async submitCurrentPrompt() {
        if (!session.selectedPromptId) {
          return session.step;
        }

        const recording = session.recordings[session.selectedPromptId];
        if (recording) {
          try {
            await adapters.recordingStore.submit(recording.id);
            clearSyncError();
          } catch {
            setSyncFailure("Could not submit recording to cloud. Retry.", async () => {
              await adapters.recordingStore.submit(recording.id);
              clearSyncError();
            });
            return session.step;
          }
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
        try {
          if (email) {
            await adapters.email.queueDelivery(session.id, email);
          }
          await adapters.sessionStore.markComplete(session.id);
          clearSyncError();
        } catch {
          setSyncFailure(
            "Could not finalize this session in the cloud. Retry before restarting.",
            async () => {
              if (email) {
                await adapters.email.queueDelivery(session.id, email);
              }
              await adapters.sessionStore.markComplete(session.id);
              clearSyncError();
            },
          );
          return false;
        }
        trackEvent({
          name: analyticsEventMap.sessionFinished,
          payload: { sessionId: session.id },
        });
        return true;
      },
      async resetSession() {
        clearSessionStorage();
        dispatch({ type: "reset-session" });
      },
    };
  }, [
    adapters,
    clearSyncError,
    remainingPrompts,
    session,
    setSyncFailure,
    syncError,
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
