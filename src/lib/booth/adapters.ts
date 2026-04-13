import {
  BoothAdapters,
  BoothSession,
  RecordingArtifact,
  SessionStoreAdapter,
  RecordingStoreAdapter,
  EmailAdapter,
} from "@/lib/booth/types";

function createSessionBase(): BoothSession {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    step: "welcome",
    userProfile: null,
    legalAccepted: null,
    selectedPromptId: null,
    completedPromptIds: [],
    recordings: {},
    createdAt: now,
    updatedAt: now,
  };
}

class MockSessionStoreAdapter implements SessionStoreAdapter {
  private store = new Map<string, BoothSession>();

  async createSession(session: BoothSession): Promise<BoothSession> {
    this.store.set(session.id, session);
    return session;
  }

  async updateSession(session: BoothSession): Promise<BoothSession> {
    this.store.set(session.id, session);
    return session;
  }

  async markComplete(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }
}

class MockRecordingStoreAdapter implements RecordingStoreAdapter {
  private store = new Map<string, RecordingArtifact>();

  async saveLocal(recording: RecordingArtifact): Promise<RecordingArtifact> {
    this.store.set(recording.id, recording);
    return recording;
  }

  async queueUpload(recordingId: string): Promise<void> {
    const existing = this.store.get(recordingId);
    if (existing) {
      this.store.set(recordingId, { ...existing, status: "queued" });
    }
  }

  async submit(recordingId: string): Promise<void> {
    const existing = this.store.get(recordingId);
    if (existing) {
      this.store.set(recordingId, { ...existing, status: "submitted" });
    }
  }
}

class MockEmailAdapter implements EmailAdapter {
  async queueDelivery(sessionId: string, email: string): Promise<void> {
    void sessionId;
    void email;
    return;
  }

  async sendPreviewLink(sessionId: string, email: string): Promise<void> {
    void sessionId;
    void email;
    return;
  }
}

export const mockBoothAdapters: BoothAdapters = {
  sessionStore: new MockSessionStoreAdapter(),
  recordingStore: new MockRecordingStoreAdapter(),
  email: new MockEmailAdapter(),
};

export function createInitialSession(): BoothSession {
  return createSessionBase();
}
