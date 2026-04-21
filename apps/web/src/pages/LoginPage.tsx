import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/auth";
import { saveToken } from "../lib/session";
import Seo from "../components/Seo";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageError, setPageError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPageError("");

    if (!email.trim() || !password.trim()) {
      setPageError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email.trim(), password.trim());

      saveToken(result.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setPageError(
        error instanceof Error ? error.message : "Could not sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Seo
        title="Log in | NextTask"
        description="Log in to NextTask to manage projects, micro-tasks, and accessible focus sessions."
        canonical="https://your-domain.com/login"
        robots="noindex, follow"
      />

      <main
        className="min-h-screen px-6 py-10"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <section
              className="rounded-3xl p-8 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Welcome back
              </p>

              <h1
                className="mt-3 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Continue where you left off
              </h1>

              <p
                className="mt-4 max-w-2xl text-base leading-7"
                style={{ color: "var(--muted)" }}
              >
                Sign in to return to your projects, continue your focus sessions,
                and manage tasks with the same accessible, distraction-aware
                experience.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Pick up tasks
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Return to your latest projects and continue the next action.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Focus clearly
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Resume timed work sessions with clear progress and minimal clutter.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Keep your settings
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Your high contrast, reduced motion, and focus preferences stay ready.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-3xl p-8 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex gap-3">
                <div
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  Login
                </div>

                <Link
                  to="/register"
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Register
                </Link>
              </div>

              <h2
                className="mt-6 text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Log in
              </h2>

              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Enter your account details to access NextTask.
              </p>

              {pageError && (
                <div
                  className="mt-4 rounded-xl px-4 py-3 text-sm"
                  role="alert"
                  style={{
                    backgroundColor: "var(--danger-soft)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                  }}
                >
                  {pageError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  disabled={loading}
                  className="w-full rounded-xl px-5 py-3 text-sm font-semibold outline-none"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? "Signing in..." : "Log in"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default LoginPage;