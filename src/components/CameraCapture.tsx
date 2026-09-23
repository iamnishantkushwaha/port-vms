"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CameraCapture({
  onCapture,
  label = "Capture photo",
}: {
  onCapture: (dataUrl: string) => void;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
      } catch {
        setCameraError("No camera access — use the file upload option below instead.");
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    onCapture(dataUrl);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onCapture(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function retake() {
    setPreview(null);
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="space-y-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Captured" className="w-full rounded-lg border border-slate-200 shadow-card" />
          <button
            type="button"
            onClick={retake}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Retake
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
            <video ref={videoRef} muted playsInline className="w-full" />
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                Starting camera…
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          {cameraError && (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-inset ring-amber-100">
              {cameraError}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={captureFrame}
              disabled={!cameraReady}
              className="rounded-md bg-port-700 px-4 py-2 text-sm font-medium text-white shadow-card hover:bg-port-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {label}
            </button>
            <label className="cursor-pointer text-sm font-medium text-port-700 underline underline-offset-2">
              or upload a photo
              <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
