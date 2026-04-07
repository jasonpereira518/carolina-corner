import { getSupabaseClient } from "@/lib/booth/supabase";
import {
  BoothSession,
  EmailAdapter,
  RecordingArtifact,
  RecordingStoreAdapter,
  SessionStoreAdapter,
} from "@/lib/booth/types";

export class SupabaseSessionStoreAdapter implements SessionStoreAdapter {
  async createSession(): Promise<BoothSession> {
    throw new Error("Not implemented in prototype phase.");
  }

  async updateSession(session: BoothSession): Promise<BoothSession> {
    void session;
    throw new Error("Not implemented in prototype phase.");
  }

  async markComplete(sessionId: string): Promise<void> {
    void sessionId;
    throw new Error("Not implemented in prototype phase.");
  }
}

export class SupabaseRecordingStoreAdapter implements RecordingStoreAdapter {
  async saveLocal(recording: RecordingArtifact): Promise<RecordingArtifact> {
    void recording;
    throw new Error("Not implemented in prototype phase.");
  }

  async queueUpload(recordingId: string): Promise<void> {
    void recordingId;
    throw new Error("Not implemented in prototype phase.");
  }

  async submit(recordingId: string): Promise<void> {
    void recordingId;
    throw new Error("Not implemented in prototype phase.");
  }
}

export class SupabaseEmailAdapter implements EmailAdapter {
  async queueDelivery(sessionId: string, email: string): Promise<void> {
    void sessionId;
    void email;
    throw new Error("Not implemented in prototype phase.");
  }

  async sendPreviewLink(sessionId: string, email: string): Promise<void> {
    void sessionId;
    void email;
    throw new Error("Not implemented in prototype phase.");
  }
}

export function hasSupabaseConfig(): boolean {
  return Boolean(getSupabaseClient());
}
