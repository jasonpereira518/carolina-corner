export type BoothStep =
  | "welcome"
  | "user-info"
  | "legal"
  | "decline"
  | "prompts"
  | "prompt-reveal"
  | "prompt-quote"
  | "prompt-preview"
  | "prompt-record"
  | "prompt-review"
  | "email"
  | "goodbye";

export type PromptId = string;
export type PromptCategoryId = "belonging" | "courage" | "life-story";

export interface PromptCategoryDefinition {
  id: PromptCategoryId;
  label: string;
  description: string;
  phaseTone: "coral" | "moss" | "pine";
}

export interface UserProfile {
  firstName: string;
  onyen: string;
  email: string;
}

export interface PromptDefinition {
  id: PromptId;
  categoryId: PromptCategoryId;
  title: string;
  revealText: string;
  quoteText: string;
  quoteAuthor: string;
  previewGuidance: string;
  reviewHeadline: string;
  reviewBody: string;
  phaseTone: "coral" | "moss" | "pine";
}

export interface RecordingArtifact {
  id: string;
  promptId: PromptId;
  createdAt: string;
  durationSeconds: number;
  blobUrl: string;
  status: "local" | "queued" | "submitted";
}

export interface BoothSession {
  id: string;
  step: BoothStep;
  userProfile: UserProfile | null;
  legalAccepted: boolean | null;
  selectedPromptId: PromptId | null;
  completedPromptIds: PromptId[];
  recordings: Partial<Record<PromptId, RecordingArtifact>>;
  createdAt: string;
  updatedAt: string;
}

export interface LegalContent {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  agreement: string;
}

export interface ThemeConfig {
  appName: string;
  logoWordmark: string;
  colors: {
    sky: string;
    navy: string;
    cream: string;
    ink: string;
  };
}

export interface ScreenCopy {
  welcome: {
    eyebrow: string;
    title: string;
    body: string;
    bulletList: string[];
    cta: string;
  };
  userInfo: {
    title: string;
    body: string;
    fields: {
      firstName: string;
      onyen: string;
      email: string;
    };
    cta: string;
  };
  decline: {
    title: string;
    body: string;
    cta: string;
  };
  prompts: {
    title: string;
    body: string;
    skipCta: string;
  };
  emailComing: {
    title: string;
    body: string;
    cta: string;
  };
  goodbye: {
    title: string;
    body: string;
    quoteAuthor: string;
  };
}

export interface BoothContent {
  theme: ThemeConfig;
  promptCategories: PromptCategoryDefinition[];
  prompts: PromptDefinition[];
  legal: LegalContent;
  copy: ScreenCopy;
  recordingSecondsLimit: number;
}

export interface SessionStoreAdapter {
  createSession(session: BoothSession): Promise<BoothSession>;
  updateSession(session: BoothSession): Promise<BoothSession>;
  markComplete(sessionId: string): Promise<void>;
}

export interface RecordingStoreAdapter {
  saveLocal(recording: RecordingArtifact): Promise<RecordingArtifact>;
  queueUpload(recordingId: string): Promise<void>;
  submit(recordingId: string): Promise<void>;
}

export interface EmailAdapter {
  queueDelivery(sessionId: string, email: string): Promise<void>;
  sendPreviewLink(sessionId: string, email: string): Promise<void>;
}

export interface BoothAdapters {
  sessionStore: SessionStoreAdapter;
  recordingStore: RecordingStoreAdapter;
  email: EmailAdapter;
}

export interface AnalyticsEvent {
  name: string;
  payload: Record<string, string | number | boolean | null>;
}
