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
    <section
      className="rounded-3xl p-6 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-2">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--text)" }}
        >
          Focus Session
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--muted)" }}
        >
          Use a short timed session to focus on one micro-task.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div
          className="mb-6 text-6xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
          aria-live="polite"
          aria-label={`Time remaining ${formatTime(timeLeft)}`}
        >
          {formatTime(timeLeft)}
        </div>

        <div
          className="mb-6 h-3 w-full max-w-md overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--primary)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!running ? (
            <button
                type="button"
                onClick={start}
                disabled={isSaving}
                aria-label={timeLeft === initialSeconds ? "Start focus session" : "Resume focus session"}
                className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                }}
                >
              {timeLeft === initialSeconds ? "Start" : "Resume"}
            </button>
          ) : (
            <button
              type="button"
                onClick={pause}
                aria-label="Pause focus session"
                className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                style={{
                    backgroundColor: "var(--warning)",
                    color: "var(--warning-text)",
                }}
            >
              Pause
            </button>
          )}

          <button
            type="button"
            onClick={reset}
            disabled={isSaving}
            aria-label="Reset focus session"
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
            style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-text)",
                border: "1px solid var(--border)",
            }}
          >
            Reset
          </button>
        </div>

        <p
          className="mt-4 text-sm"
          style={{ color: "var(--muted)" }}
          aria-live="polite"
        >
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