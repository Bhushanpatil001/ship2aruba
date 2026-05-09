"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
      <p className="text-muted mt-2 mb-6">We encountered an unexpected error while rendering this page.</p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-primary px-8 py-3 text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
