"use client";

import { useState } from "react";

export default function DeployButton() {
  const [status, setStatus] = useState<"idle" | "deploying" | "success" | "error">("idle");

  const handleDeploy = async () => {
    setStatus("deploying");

    try {
      const res = await fetch("/api/deploy", { method: "POST" });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        throw new Error("Deploy failed");
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const buttonText = {
    idle: "Deploy",
    deploying: "Deploying...",
    success: "Deployed!",
    error: "Failed",
  };

  const buttonClass = {
    idle: "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white",
    deploying: "bg-gray-400 cursor-not-allowed text-white",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <button
      onClick={handleDeploy}
      disabled={status === "deploying"}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${buttonClass[status]}`}
    >
      {buttonText[status]}
    </button>
  );
}
