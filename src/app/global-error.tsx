"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="max-w-md space-y-4 px-6 text-center">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-neutral-400">{error.message}</p>
          {error.digest && (
            <p className="text-xs text-neutral-500">Digest: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
