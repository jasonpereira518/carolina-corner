import { BoothSession } from "@/lib/booth/types";

const STORAGE_KEY = "carolina-corner/session";

export function readSessionFromStorage(): BoothSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BoothSession;
  } catch {
    return null;
  }
}

export function writeSessionToStorage(session: BoothSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSessionStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
