"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-background text-foreground flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-lg">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Something went wrong</h2>
          <p className="text-muted mb-8 font-medium">An unexpected error occurred in the application core.</p>
          <button
            onClick={() => reset()}
            className="rounded-2xl bg-primary px-10 h-14 font-bold text-white shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
          >
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
