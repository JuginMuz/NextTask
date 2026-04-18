import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../lib/session";
import { useTheme } from "../lib/theme";

function ProfilePage() {
  const navigate = useNavigate();
  const { theme, motion, toggleTheme, toggleMotion } = useTheme();

  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("focus-default-minutes");
      if (saved) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed) && parsed >= 5 && parsed <= 60) {
          setFocusMinutes(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load focus preference:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("focus-default-minutes", String(focusMinutes));
    } catch (error) {
      console.error("Failed to save focus preference:", error);
    }
  }, [focusMinutes]);

  useEffect(() => {
    if (!savedMessage) return;

    const timeout = window.setTimeout(() => {
      setSavedMessage("");
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [savedMessage]);

  function showSaved(message: string) {
    setSavedMessage(message);
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Password change can be connected to the backend next.");
  }

  function handleDeleteAccount() {
    alert("Delete account can be connected to the backend next.");
  }

  function handleToggleTheme() {
    toggleTheme();
    showSaved(theme === "default" ? "High contrast enabled" : "Theme set to standard");
  }

  function handleToggleMotion() {
    toggleMotion();
    showSaved(
      motion === "default" ? "Reduced motion enabled" : "Motion set to standard"
    );
  }

  function setFocusPreset(minutes: number) {
    setFocusMinutes(minutes);
    showSaved(`Default focus timer set to ${minutes} minutes`);
  }

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <header
          className="rounded-3xl px-6 py-5 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Profile
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Manage your settings, accessibility preferences, and account options.
          </p>

          {savedMessage && (
            <div
              className="mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-medium"
              aria-live="polite"
              style={{
                backgroundColor: "var(--success-soft)",
                color: "var(--success)",
                border: "1px solid var(--border)",
              }}
            >
              {savedMessage}
            </div>
          )}
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section
            className="rounded-3xl p-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              App settings
            </h2>

            <div className="mt-5 space-y-4">
              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      Theme
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      High contrast: {theme === "high-contrast" ? "On" : "Off"}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      Switch between standard and high-contrast display.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                    style={{
                      backgroundColor:
                        theme === "high-contrast" ? "var(--success-soft)" : "var(--primary)",
                      color:
                        theme === "high-contrast" ? "var(--success)" : "var(--primary-text)",
                      border: theme === "high-contrast" ? "1px solid var(--border)" : "none",
                      minWidth: "9rem",
                    }}
                    aria-pressed={theme === "high-contrast"}
                  >
                    {theme === "high-contrast" ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      Motion
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      Reduced motion: {motion === "reduced" ? "On" : "Off"}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      Reduce motion for a calmer and less distracting experience.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleMotion}
                    className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                    style={{
                      backgroundColor:
                        motion === "reduced"
                          ? "var(--success-soft)"
                          : "var(--secondary)",
                      color:
                        motion === "reduced"
                          ? "var(--success)"
                          : "var(--secondary-text)",
                      border: "1px solid var(--border)",
                      minWidth: "9rem",
                    }}
                    aria-pressed={motion === "reduced"}
                  >
                    {motion === "reduced" ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Default focus timer
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Used as the default timer on the focus page.
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Choose your preferred starting session length.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[15, 25, 45].map((minutes) => {
                    const isActive = focusMinutes === minutes;
                    return (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setFocusPreset(minutes)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                        style={{
                          backgroundColor: isActive ? "var(--primary)" : "var(--card)",
                          color: isActive ? "var(--primary-text)" : "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                        aria-pressed={isActive}
                      >
                        {minutes} min
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                  Current default:{" "}
                  <strong style={{ color: "var(--text)" }}>{focusMinutes} minutes</strong>
                </p>
              </div>
            </div>
          </section>

          <section
            className="rounded-3xl p-5 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Security
            </h2>

            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-3">
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Current password
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="pt-2 rounded-xl px-5 py-3 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-text)",
                }}
              >
                Update password
              </button>
            </form>
          </section>
        </section>

        <section
          className="rounded-3xl p-5 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            Account actions
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
              style={{
                backgroundColor: "var(--card)",
                color: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Logout
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
              style={{
                backgroundColor: "var(--danger-soft)",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
              }}
            >
              Delete account
            </button>
          </div>

          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Account deletion and password updates can be connected to backend routes next.
          </p>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;