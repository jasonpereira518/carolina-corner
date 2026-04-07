"use client";

import { PromptDefinition } from "@/lib/booth/types";

const toneClass: Record<PromptDefinition["phaseTone"] | "sky", string> = {
  sky: "tone-sky",
  coral: "tone-coral",
  moss: "tone-moss",
  pine: "tone-pine",
};

export function BoothShell({
  tone = "sky",
  children,
}: {
  tone?: PromptDefinition["phaseTone"] | "sky";
  children: React.ReactNode;
}) {
  return (
    <div className={`booth-bg ${toneClass[tone]}`}>
      <div className="noise-layer" />
      <main className="booth-shell">{children}</main>
    </div>
  );
}

export function BrandHeader({ label }: { label: string }) {
  return (
    <header className="brand-header">
      <span className="brand-mark">CH</span>
      <span className="brand-wordmark">{label}</span>
    </header>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="btn-primary" {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="btn-secondary" {...props}>
      {children}
    </button>
  );
}

export function DoorCard({
  title,
  promptLabel,
  onClick,
}: {
  title: string;
  promptLabel: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="door-card" onClick={onClick}>
      <span className="door-tag">{title}</span>
      <span className="door-label">{promptLabel}</span>
    </button>
  );
}

export function TimeDisplay({ secondsRemaining }: { secondsRemaining: number }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  return (
    <span className="time-display" aria-live="polite">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
