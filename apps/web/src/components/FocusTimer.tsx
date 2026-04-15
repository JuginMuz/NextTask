import { useEffect, useMemo, useRef, useState } from "react";

type FocusTimerProps = {
  onComplete: (duration: number) => Promise<void> | void;
  defaultMinutes?: number;
};

const DEFAULT_MINUTES = 25;

function FocusTimer({
  onComplete,
  defaultMinutes = DEFAULT_MINUTES,
}: FocusTimerProps) {
  const initialSeconds = defaultMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const progressPercent = useMemo(() => {
    const elapsed = initialSeconds - timeLeft;
    return Math.min(100, Math.max(0, (elapsed / initialSeconds) * 100));
  }, [initialSeconds, timeLeft]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setRunning(false);

          void (async () => {
            try {
              setIsSaving(true);
              await onComplete(defaultMinutes);
            } finally {
              setIsSaving(false);
            }
          })();

          return initialSeconds;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, onComplete, defaultMinutes, initialSeconds]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function start() {
    if (isSaving) return;
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(initialSeconds);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-slate-900">Focus Session</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use a short timed session to focus on one micro-task.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div
          className="mb-6 text-6xl font-bold tracking-tight text-slate-950"
          aria-live="polite"
          aria-label={`Time remaining ${formatTime(timeLeft)}`}
        >
          {formatTime(timeLeft)}
        </div>

        <div className="mb-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              disabled={isSaving}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {timeLeft === initialSeconds ? "Start" : "Resume"}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Pause
            </button>
          )}

          <button
            type="button"
            onClick={reset}
            disabled={isSaving}
            className="rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          {isSaving
            ? "Saving completed focus session..."
            : running
            ? "Session in progress."
            : timeLeft === initialSeconds
            ? "Ready to begin."
            : "Session paused."}
        </p>
      </div>
    </section>
  );
}

export default FocusTimer;