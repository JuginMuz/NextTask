import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../lib/theme";

type FocusTimerProps = {
  onComplete: (duration: number) => Promise<void> | void;
  defaultMinutes?: number;
  taskTitle?: string;
  projectTitle?: string;
};

const DEFAULT_MINUTES = 25;
const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

function FocusTimer({
  onComplete,
  defaultMinutes = DEFAULT_MINUTES,
  taskTitle,
  projectTitle,
}: FocusTimerProps) {
  const { motion } = useTheme();

  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const intervalRef = useRef<number | null>(null);

  const isReducedMotion = motion === "reduced";

  useEffect(() => {
    if (running || isSaving) return;

    setTimeLeft(defaultMinutes * 60);
    setTotalSeconds(defaultMinutes * 60);
    setJustCompleted(false);
    }, [defaultMinutes]);

  const displayedMinutes = Math.max(1, Math.ceil(timeLeft / 60));

  const progressPercent = useMemo(() => {
    if (totalSeconds <= 0) return 0;
    const elapsed = totalSeconds - timeLeft;
    return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
  }, [totalSeconds, timeLeft]);

  const completedMinutes = useMemo(
    () => Math.max(1, Math.round(totalSeconds / 60)),
    [totalSeconds]
  );

  const sessionState = useMemo(() => {
    if (isSaving) return "saving";
    if (justCompleted) return "completed";
    if (running) return "running";
    if (timeLeft === totalSeconds) return "ready";
    return "paused";
  }, [isSaving, justCompleted, running, timeLeft, totalSeconds]);

  const stateStyles = useMemo(() => {
    switch (sessionState) {
      case "saving":
        return {
          badgeBg: "var(--success-soft)",
          badgeText: "var(--success)",
          badgeLabel: "Saving",
          barColor: "var(--success)",
        };
      case "completed":
        return {
          badgeBg: "var(--success-soft)",
          badgeText: "var(--success)",
          badgeLabel: "Completed",
          barColor: "var(--success)",
        };
      case "running":
        return {
          badgeBg: "var(--pending-soft)",
          badgeText: "var(--primary)",
          badgeLabel: "Running",
          barColor: "var(--primary)",
        };
      case "paused":
        return {
          badgeBg: "var(--warning-soft)",
          badgeText: "var(--warning)",
          badgeLabel: "Paused",
          barColor: "var(--warning)",
        };
      default:
        return {
          badgeBg: "var(--pending-soft)",
          badgeText: "var(--primary)",
          badgeLabel: "Ready",
          barColor: "var(--primary)",
        };
    }
  }, [sessionState]);

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
          setJustCompleted(true);

          void (async () => {
            try {
              setIsSaving(true);
              await onComplete(completedMinutes);
            } finally {
              setIsSaving(false);
            }
          })();

          return totalSeconds;
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
  }, [running, onComplete, totalSeconds, completedMinutes]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function start() {
    if (isSaving) return;
    setJustCompleted(false);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setJustCompleted(false);
    setTimeLeft(totalSeconds);
  }

  function changeTimerByMinutes(delta: number) {
    if (isSaving || running) return;

    const deltaSeconds = delta * 60;

    setTimeLeft((prev) =>
      Math.min(MAX_MINUTES * 60, Math.max(MIN_MINUTES * 60, prev + deltaSeconds))
    );

    setTotalSeconds((prev) =>
      Math.min(MAX_MINUTES * 60, Math.max(MIN_MINUTES * 60, prev + deltaSeconds))
    );

    setJustCompleted(false);
  }

  return (
    <section
      className="rounded-3xl p-6 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
            Focus Session
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Use a short timed session to focus on one micro-task.
          </p>
        </div>

        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: stateStyles.badgeBg,
            color: stateStyles.badgeText,
          }}
          aria-live="polite"
        >
          {stateStyles.badgeLabel}
        </span>
      </div>

      <div
        className="mt-5 rounded-2xl px-4 py-4"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          Current task
        </p>
        <p className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>
          {taskTitle || "Focus task"}
        </p>
        {projectTitle && (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Project: {projectTitle}
          </p>
        )}
      </div>

      <div className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
        Short task? Try 10–15 min. Longer task? Add time as needed.
      </div>

      {isReducedMotion && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
          style={{
            backgroundColor: "var(--pending-soft)",
            color: "var(--primary)",
            border: "1px solid var(--border)",
          }}
        >
          Reduced motion is active. Timer movement and animated transitions are minimised.
        </div>
      )}

      <div className="mt-6 flex flex-col items-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => changeTimerByMinutes(-1)}
            disabled={isSaving || running || timeLeft <= MIN_MINUTES * 60}
            aria-label="Remove 1 minute from timer"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold outline-none transition-transform duration-200 hover:scale-110"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-text)",
              border: "1px solid var(--border)",
            }}
          >
            −
          </button>

          <div
            className="min-w-[10.5rem] text-center"
            aria-live="polite"
            aria-label={`Time remaining ${formatTime(timeLeft)}`}
          >
            <div
              className={`text-6xl font-bold tracking-tight ${
                running && !isReducedMotion ? "animate-timerPulse" : ""
              }`}
              style={{
                color: "var(--text)",
              }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="mt-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
              {displayedMinutes} minute{displayedMinutes === 1 ? "" : "s"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => changeTimerByMinutes(1)}
            disabled={isSaving || running || timeLeft >= MAX_MINUTES * 60}
            aria-label="Add 1 minute to timer"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold outline-none transition-transform duration-200 hover:scale-110"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-text)",
              border: "1px solid var(--border)",
            }}
          >
            +
          </button>
        </div>

        <div
          className="mb-3 h-4 w-full max-w-md overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border)" }}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-in-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: stateStyles.barColor,
            }}
          />
        </div>

        <p className="mb-6 text-sm font-medium" style={{ color: "var(--muted)" }}>
          {Math.round(progressPercent)}% of session elapsed
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              disabled={isSaving}
              aria-label={timeLeft === totalSeconds ? "Start focus session" : "Resume focus session"}
              className="rounded-xl px-4 py-2 text-sm font-semibold outline-none transition-transform duration-200 hover:scale-[1.04]"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-text)",
              }}
            >
              {timeLeft === totalSeconds ? "Start" : "Resume"}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              aria-label="Pause focus session"
              className="rounded-xl px-4 py-2 text-sm font-semibold outline-none transition-transform duration-200 hover:scale-[1.04]"
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
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none transition-transform duration-200 hover:scale-[1.04]"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-text)",
              border: "1px solid var(--border)",
            }}
          >
            Reset
          </button>
        </div>

        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            !isReducedMotion ? "transition-all duration-300" : ""
          }`}
          aria-live="polite"
          style={{
            backgroundColor:
              justCompleted || isSaving ? "var(--success-soft)" : "var(--card)",
            border: "1px solid var(--border)",
            color:
              justCompleted || isSaving ? "var(--success)" : "var(--muted)",
          }}
        >
          {isSaving
            ? `✔ Session complete — saving ${completedMinutes} minutes.`
            : justCompleted
            ? `✔ Session complete — ${completedMinutes} minutes saved.`
            : running
            ? "Session in progress."
            : timeLeft === totalSeconds
            ? "Ready to begin."
            : "Session paused. You can resume, reset, or adjust the timer."}
        </div>
      </div>
    </section>
  );
}

export default FocusTimer;