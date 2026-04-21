import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/auth";
import { saveToken } from "../lib/session";
import Seo from "../components/Seo";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pageError, setPageError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPageError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setPageError("Complete all fields.");
      return;
    }

    if (password.length < 8) {
      setPageError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPageError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser({
        email: email.trim(),
        password: password.trim(),
      });

      saveToken(result.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Register failed:", error);
      setPageError(
        error instanceof Error ? error.message : "Could not create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Seo
        title="Create account | NextTask"
        description="Create a NextTask account and start managing accessible focus sessions, projects, and micro-tasks."
        canonical="https://your-domain.com/register"
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
                Get started
              </p>

              <h1
                className="mt-3 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Create your NextTask account
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: "var(--muted)" }}>
                Start organising projects into smaller, more manageable micro-tasks
                with an interface designed to support clarity, focus, and accessibility.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Micro-tasking
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Break large goals into smaller actions that feel easier to start.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Focus support
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Use distraction-aware focus sessions and visible progress feedback.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Accessibility
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Adjust high contrast and reduced motion settings to suit your needs.
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
                <Link
                  to="/login"
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Login
                </Link>

                <div
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  Register
                </div>
              </div>

              <h2
                className="mt-6 text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Create account
              </h2>

              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Use your email and a secure password to get started.
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                    Must be at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-1 block text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;