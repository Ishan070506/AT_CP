"use client";

import { useEffect, useRef, useState } from "react";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "demo-tenant";

export function FaceVerificationPanel({ courseId }: { courseId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState("Camera inactive.");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("face-demo-token");
    if (savedToken) {
      setAccessToken(savedToken);
    }

    let stream: MediaStream | null = null;
    async function enableCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
          setStatus("Camera ready. Register a master face or run a verification pulse.");
        }
      } catch {
        setStatus("Camera permission denied or unavailable in this browser.");
      }
    }

    void enableCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function captureFrame() {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  }

  async function sendFrame(path: string) {
    if (!accessToken) {
      setStatus("Add a JWT access token to enable live API calls.");
      return;
    }
    const frame = captureFrame();
    if (!frame) {
      setStatus("Could not capture a webcam frame.");
      return;
    }
    window.localStorage.setItem("face-demo-token", accessToken);
    setStatus("Submitting frame for analysis...");

    const payload =
      path === "/monitoring/master-face/"
        ? {
            image_base64: frame,
            capture_device: "web-browser"
          }
        : {
            image_base64: frame,
            course_id: courseId,
            source: "web",
            challenge_frames: [frame]
          };

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": TENANT_ID
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail ?? `Request failed: ${response.status}`);
      }
      if (path === "/monitoring/master-face/") {
        setStatus(`Master face registered. Liveness ${Math.round((result.analysis?.liveness_score ?? 0) * 100)}%.`);
      } else {
        setStatus(
          `Verification ${result.matched ? "passed" : "flagged"}. Match ${(result.confidence_score * 100).toFixed(1)}%, liveness ${(result.liveness_score * 100).toFixed(1)}%.`
        );
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Verification failed.");
    }
  }

  return (
    <section className="panel">
      <div className="eyebrow">Webcam face AI</div>
      <p className="muted">
        This panel captures a live frame, posts it to the Django monitoring API, and lets the backend derive the face embedding with YuNet + SFace.
      </p>
      <video ref={videoRef} muted playsInline className="faceVideo" />
      <canvas ref={canvasRef} hidden />
      <input
        className="search"
        value={accessToken}
        onChange={(event) => setAccessToken(event.target.value)}
        placeholder="Paste a JWT access token for live verification"
      />
      <div className="ctaRow">
        <button className="button" disabled={!cameraReady} onClick={() => void sendFrame("/monitoring/master-face/")}>
          Register master face
        </button>
        <button className="button button--soft" disabled={!cameraReady} onClick={() => void sendFrame("/monitoring/verify/")}>
          Run verification pulse
        </button>
      </div>
      <div className="muted">{status}</div>
    </section>
  );
}
