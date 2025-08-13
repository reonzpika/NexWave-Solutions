"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_URL =
  "https://www.healthpoint.co.nz/gps-accident-urgent-medical-care/north-auckland/";

export default function Page() {
  const [seedUrl, setSeedUrl] = useState(DEFAULT_URL);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [progress, setProgress] = useState<{ pagesVisited?: number; clinicsFound?: number; gpsFound?: number }>({});
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_WORKER_BASE_URL || "";
  }, []);

  useEffect(() => {
    if (!jobId || !workerBaseUrl) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${workerBaseUrl}/crawl/status?jobId=${jobId}`);
        if (!res.ok) throw new Error("Status request failed");
        const data = await res.json();
        setStatus(data.status);
        setProgress({
          pagesVisited: data.pagesVisited,
          clinicsFound: data.clinicsFound,
          gpsFound: data.gpsFound,
        });
        if (data.status === "success") {
          setSheetUrl(data.sheetUrl || null);
          clearInterval(interval);
        }
        if (data.status === "error") {
          setError(data.error || "Unknown error");
          clearInterval(interval);
        }
      } catch (e: any) {
        setError(e.message);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, workerBaseUrl]);

  const onRun = async () => {
    setError(null);
    setSheetUrl(null);
    setProgress({});
    setStatus("running");

    try {
      const res = await fetch(`${workerBaseUrl}/crawl/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedUrl }),
      });
      if (!res.ok) throw new Error("Failed to start crawl");
      const data = await res.json();
      setJobId(data.jobId);
    } catch (e: any) {
      setError(e.message);
      setStatus("idle");
    }
  };

  const disabled = status === "running";

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Healthpoint GP Crawler</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Enter any Healthpoint GP region URL and run a one-off crawl. Results will be written to a Google Sheet.
      </p>

      <label htmlFor="seed" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Starting URL</label>
      <input
        id="seed"
        type="url"
        value={seedUrl}
        onChange={(e) => setSeedUrl(e.target.value)}
        placeholder={DEFAULT_URL}
        style={{ width: "100%", padding: 12, border: "1px solid #ccc", borderRadius: 6 }}
      />

      <button
        onClick={onRun}
        disabled={disabled || !workerBaseUrl}
        style={{ marginTop: 16, padding: "10px 16px", borderRadius: 6, border: 0, background: disabled ? "#bbb" : "#111", color: "white", cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {status === "running" ? "Running…" : "Run Crawl"}
      </button>

      {!workerBaseUrl && (
        <p style={{ color: "#a00", marginTop: 12 }}>Missing NEXT_PUBLIC_WORKER_BASE_URL env var.</p>
      )}

      {status === "running" && (
        <div style={{ marginTop: 16 }}>
          <div>Pages visited: {progress.pagesVisited ?? 0}</div>
          <div>Clinics found: {progress.clinicsFound ?? 0}</div>
          <div>GPs found: {progress.gpsFound ?? 0}</div>
        </div>
      )}

      {sheetUrl && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: "#0a0", fontWeight: 600 }}>Success!</div>
          <a href={sheetUrl} target="_blank" rel="noreferrer" style={{ color: "#06c" }}>Open Google Sheet</a>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 16, color: "#a00" }}>
          Error: {error}
        </div>
      )}
    </main>
  );
}