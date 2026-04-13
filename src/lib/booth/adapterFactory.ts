import { mockBoothAdapters } from "@/lib/booth/adapters";
import {
  BoothAdapters,
  BoothSession,
} from "@/lib/booth/types";
import {
  hasSupabaseConfig,
  SupabaseEmailAdapter,
  SupabaseRecordingStoreAdapter,
  SupabaseSessionStoreAdapter,
} from "@/lib/booth/supabaseAdapters";

const useSupabase =
  process.env.NEXT_PUBLIC_USE_SUPABASE === "true" && hasSupabaseConfig();

const sessionStore = useSupabase
  ? new SupabaseSessionStoreAdapter()
  : mockBoothAdapters.sessionStore;

let currentSessionId = "";
const recordingStore = useSupabase
  ? new SupabaseRecordingStoreAdapter(() => currentSessionId)
  : mockBoothAdapters.recordingStore;

const email = useSupabase ? new SupabaseEmailAdapter() : mockBoothAdapters.email;

const adapters: BoothAdapters = {
  sessionStore,
  recordingStore,
  email,
};

export function getBoothAdapters(): BoothAdapters {
  return adapters;
}

export function setAdapterSession(session: BoothSession): void {
  currentSessionId = session.id;
}

export function isSupabaseModeEnabled(): boolean {
  return useSupabase;
}
