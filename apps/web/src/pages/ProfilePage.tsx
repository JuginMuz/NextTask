import { useNavigate } from "react-router-dom";
import { clearToken } from "../lib/session";
import { useTheme } from "../lib/theme";

function ProfilePage() {
  const navigate = useNavigate();
  const { theme, motion, toggleTheme, toggleMotion } = useTheme();

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
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
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
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Theme mode
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Current: {theme === "default" ? "Normal mode" : "High contrast"}
                </p>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  {theme === "default" ? "Enable High Contrast" : "Use Normal Mode"}
                </button>
              </div>

              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Motion preference
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Current: {motion === "default" ? "Standard motion" : "Reduced motion"}
                </p>

                <button
                  type="button"
                  onClick={toggleMotion}
                  className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {motion === "default" ? "Enable Reduced Motion" : "Use Standard Motion"}
                </button>
              </div>

              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px dashed var(--border)",
                }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Accessibility summary
                </p>
                <ul
                  className="mt-3 space-y-2 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  <li>• High contrast mode available</li>
                  <li>• Reduced motion mode available</li>
                  <li>• Colour-blind-safe task/status design applied</li>
                  <li>• Keyboard focus visibility improved</li>
                </ul>
              </div>
            </div>
          </section>

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
              Security
            </h2>

            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
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
                className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
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
            Account actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-text)",
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
                backgroundColor: "var(--danger)",
                color: "var(--danger-text)",
              }}
            >
              Delete account
            </button>
          </div>

          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Account deletion and password updates can be connected to backend
            routes next.
          </p>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;