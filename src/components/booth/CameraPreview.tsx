"use client";

import { useEffect, useRef, useState } from "react";

export function CameraPreview({
  className,
}: {
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initPreview() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError("Camera preview unavailable. You can still continue.");
      }
    }

    void initPreview();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (error) {
    return (
      <div className={`camera-frame ${className ?? ""}`}>
        <p className="camera-error">{error}</p>
      </div>
    );
  }

  return (
    <div className={`camera-frame ${className ?? ""}`}>
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        className="camera-video"
        data-testid="camera-preview"
      />
    </div>
  );
}
