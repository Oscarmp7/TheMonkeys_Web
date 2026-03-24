"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl text-brand-yellow mb-4">OOPS</h1>
        <p className="font-body text-off-white/60 text-base mb-8">
          {error.message || "Something went wrong."}
        </p>
        <button
          onClick={reset}
          className="bg-brand-yellow text-brand-black font-display text-sm tracking-wider px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
