import { useEffect, useState } from "react";

type FocusTimerProps = {
  onComplete: (duration: number) => void;
};

const DEFAULT_TIME = 25 * 60;

function FocusTimer({ onComplete }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          onComplete(25);
          return DEFAULT_TIME;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function start() {
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(DEFAULT_TIME);
  }

  return (
    <div className="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Focus Session</h2>

      <div className="text-center text-5xl font-bold mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-3">
        {!running && (
          <button
            onClick={start}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Start
          </button>
        )}

        {running && (
          <button
            onClick={pause}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
          >
            Pause
          </button>
        )}

        <button
          onClick={reset}
          className="rounded-lg bg-slate-700 px-4 py-2 text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FocusTimer;