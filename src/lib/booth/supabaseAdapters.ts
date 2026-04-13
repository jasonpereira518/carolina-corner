import { getSupabaseClient } from "@/lib/booth/supabase";
import {
  BoothSession,
  EmailAdapter,
  RecordingArtifact,
  RecordingStoreAdapter,
  SessionStoreAdapter,
} from "@/lib/booth/types";

const SESSIONS_TABLE = "booth_sessions";
const RECORDINGS_TABLE = "booth_recordings";

type SessionRow = {
  id: string;
  step: BoothSession["step"];
  first_name: string | null;
  onyen: string | null;
  email: string | null;
  legal_accepted: boolean | null;
  selected_prompt_id: BoothSession["selectedPromptId"];
  completed_prompt_ids: string[] | null;
  recordings_json: string | null;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
};

type RecordingRow = {
  id: string;
  session_id: string;
  prompt_id: string;
  duration_seconds: number;
  blob_url: string;
  status: RecordingArtifact["status"];
  created_at: string;
  updated_at: string;
};

function serializeSession(session: BoothSession): Omit<SessionRow, "status"> {
  return {
    id: session.id,
    step: session.step,
    first_name: session.userProfile?.firstName ?? null,
    onyen: session.userProfile?.onyen ?? null,
    email: session.userProfile?.email ?? null,
    legal_accepted: session.legalAccepted,
    selected_prompt_id: session.selectedPromptId,
    completed_prompt_ids: session.completedPromptIds,
    recordings_json: JSON.stringify(session.recordings),
    created_at: session.createdAt,
    updated_at: session.updatedAt,
  };
}

function deserializeSession(row: SessionRow): BoothSession {
  const recordings = row.recordings_json
    ? (JSON.parse(row.recordings_json) as BoothSession["recordings"])
    : {};

  return {
    id: row.id,
    step: row.step,
    userProfile:
      row.first_name && row.onyen && row.email
        ? {
            firstName: row.first_name,
            onyen: row.onyen,
            email: row.email,
          }
        : null,
    legalAccepted: row.legal_accepted,
    selectedPromptId: row.selected_prompt_id,
    completedPromptIds: (row.completed_prompt_ids ?? []) as BoothSession["completedPromptIds"],
    recordings,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseSessionStoreAdapter implements SessionStoreAdapter {
  async createSession(session: BoothSession): Promise<BoothSession> {
    const client = getSupabaseClient();
    if (!client) {
      return session;
    }

    const payload: SessionRow = {
      ...serializeSession(session),
      status: "active",
    };

    const { data, error } = await client
      .from(SESSIONS_TABLE)
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create booth session: ${error?.message ?? "unknown"}`);
    }

    return deserializeSession(data as SessionRow);
  }

  async updateSession(session: BoothSession): Promise<BoothSession> {
    const client = getSupabaseClient();
    if (!client) {
      return session;
    }

    const payload: SessionRow = {
      ...serializeSession(session),
      status: "active",
    };

    const { data, error } = await client
      .from(SESSIONS_TABLE)
      .upsert(payload)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`Failed to update booth session: ${error?.message ?? "unknown"}`);
    }

    return deserializeSession(data as SessionRow);
  }

  async markComplete(sessionId: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client
      .from(SESSIONS_TABLE)
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (error) {
      throw new Error(`Failed to complete booth session: ${error.message}`);
    }
  }
}

export class SupabaseRecordingStoreAdapter implements RecordingStoreAdapter {
  constructor(private readonly getSessionId: () => string) {}

  async saveLocal(recording: RecordingArtifact): Promise<RecordingArtifact> {
    const client = getSupabaseClient();
    if (!client) {
      return recording;
    }

    const payload: RecordingRow = {
      id: recording.id,
      session_id: this.getSessionId(),
      prompt_id: recording.promptId,
      duration_seconds: recording.durationSeconds,
      blob_url: recording.blobUrl,
      status: recording.status,
      created_at: recording.createdAt,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from(RECORDINGS_TABLE).upsert(payload);
    if (error) {
      throw new Error(`Failed to save recording: ${error.message}`);
    }

    return recording;
  }

  async queueUpload(recordingId: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client
      .from(RECORDINGS_TABLE)
      .update({ status: "queued", updated_at: new Date().toISOString() })
      .eq("id", recordingId);

    if (error) {
      throw new Error(`Failed to queue recording upload: ${error.message}`);
    }
  }

  async submit(recordingId: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client
      .from(RECORDINGS_TABLE)
      .update({ status: "submitted", updated_at: new Date().toISOString() })
      .eq("id", recordingId);

    if (error) {
      throw new Error(`Failed to submit recording: ${error.message}`);
    }
  }
}

export class SupabaseEmailAdapter implements EmailAdapter {
  async queueDelivery(sessionId: string, email: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client.functions.invoke("queue-booth-email", {
      body: { sessionId, email },
    });

    if (error) {
      throw new Error(`Failed to queue booth email delivery: ${error.message}`);
    }
  }

  async sendPreviewLink(sessionId: string, email: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client.functions.invoke("send-booth-preview-link", {
      body: { sessionId, email },
    });

    if (error) {
      throw new Error(`Failed to send booth preview link: ${error.message}`);
    }
  }
}

export function hasSupabaseConfig(): boolean {
  return Boolean(getSupabaseClient());
}
