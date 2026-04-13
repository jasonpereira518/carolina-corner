"use client";

import Image from "next/image";
import { useRef } from "react";
import { useBooth } from "@/components/booth/BoothProvider";
import { routeForStep } from "@/lib/booth/flow";
import { useRouter } from "next/navigation";
import { PromptDefinition } from "@/lib/booth/types";

const toneClass: Record<PromptDefinition["phaseTone"] | "sky", string> = {
  sky: "tone-sky",
  coral: "tone-coral",
  moss: "tone-moss",
  pine: "tone-pine",
};

const toneImage: Record<PromptDefinition["phaseTone"], string> = {
  coral: "/booth/images/quote-coral.jpg",
  moss: "/booth/images/quote-moss.jpg",
  pine: "/booth/images/quote-pine.jpg",
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
      <main className="booth-shell">
        <SyncBanner />
        <BackControl />
        {children}
      </main>
    </div>
  );
}

function SyncBanner() {
  const { syncError, retrySync, clearSyncError } = useBooth();

  if (!syncError) {
    return null;
  }

  return (
    <aside className="sync-banner" role="status" aria-live="polite">
      <p>{syncError}</p>
      <div className="button-row">
        <button type="button" className="btn-secondary" onClick={retrySync}>
          Retry Sync
        </button>
        <button type="button" className="btn-secondary" onClick={clearSyncError}>
          Dismiss
        </button>
      </div>
    </aside>
  );
}

function BackControl() {
  const { session, goBack } = useBooth();
  const router = useRouter();

  if (session.step === "welcome") {
    return null;
  }

  async function onBack() {
    const previous = await goBack();
    router.push(routeForStep(previous));
  }

  return (
    <div className="back-row">
      <button
        type="button"
        className="back-arrow-btn"
        onClick={onBack}
        aria-label="Go back"
        title="Go back"
      >
        <span aria-hidden="true">←</span>
      </button>
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
  icon,
  count,
  onClick,
}: {
  title: string;
  icon: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button type="button" className="door-card" onClick={onClick}>
      <span className="door-count-badge">{count}</span>
      <span className="door-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="door-tag">{title}</span>
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

export function TonePortrait({
  tone,
  alt,
}: {
  tone: PromptDefinition["phaseTone"];
  alt: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function setPortraitMotion(clientX: number, clientY: number) {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const tiltX = (0.5 - y) * 22;
    const tiltY = (x - 0.5) * 22;

    card.style.setProperty("--rotate-x", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--rotate-y", `${tiltY.toFixed(2)}deg`);
    card.style.setProperty("--glare-x", `${(x * 100).toFixed(2)}%`);
    card.style.setProperty("--glare-y", `${(y * 100).toFixed(2)}%`);
  }

  function onPointerEnter() {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    card.style.setProperty("--lift", "8px");
    card.style.setProperty("--glare-opacity", "0.35");
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    setPortraitMotion(event.clientX, event.clientY);
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    setPortraitMotion(event.clientX, event.clientY);
  }

  function onPointerLeave() {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--lift", "0px");
    card.style.setProperty("--glare-opacity", "0");
    card.style.setProperty("--glare-x", "50%");
    card.style.setProperty("--glare-y", "50%");
  }

  return (
    <div
      ref={cardRef}
      className="portrait-card"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onMouseMove={onMouseMove}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    >
      <Image
        src={toneImage[tone]}
        alt={alt}
        width={1242}
        height={720}
        className="portrait-image"
      />
      <span className="portrait-glare" aria-hidden="true" />
    </div>
  );
}

export function PortraitTriptych() {
  return (
    <div className="portrait-strip" aria-hidden="true">
      <TonePortrait tone="coral" alt="" />
      <TonePortrait tone="moss" alt="" />
      <TonePortrait tone="pine" alt="" />
    </div>
  );
}
