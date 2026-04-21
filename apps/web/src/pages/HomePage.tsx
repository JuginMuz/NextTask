import { Link } from "react-router-dom";
import Seo from "../components/Seo";

function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NextTask",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description:
      "An accessibility-first productivity web application for neurodivergent users, with micro-tasking, focus sessions, and inclusive UI modes.",
    url: "https://your-domain.com/",
  };

  return (
    <>
      <Seo
        title="NextTask | Accessible Productivity App for ADHD and Colour-Blind Users"
        description="NextTask helps users manage work with micro-tasks, focus timers, high-contrast modes, reduced motion, and accessible design for neurodivergent users."
        canonical="https://your-domain.com/"
        robots="index, follow"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main
        className="min-h-screen px-6 py-10"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div className="mx-auto max-w-5xl space-y-6">
          <section
            className="rounded-3xl p-8 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  Accessibility-first productivity
                </p>

                <h1
                  className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
                  style={{ color: "var(--text)" }}
                >
                  Stay focused with a task app designed for clarity, structure, and calm
                </h1>

                <p
                  className="mt-4 max-w-2xl text-base leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  NextTask helps users break large goals into manageable micro-tasks,
                  complete focus sessions with clear progress feedback, and use an
                  interface designed with accessibility in mind.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-block rounded-xl px-5 py-3 text-sm font-semibold no-underline"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-text)",
                    }}
                  >
                    Create account
                  </Link>

                  <Link
                    to="/login"
                    className="inline-block rounded-xl px-5 py-3 text-sm font-semibold no-underline"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--secondary-text)",
                    }}
                  >
                    Log in
                  </Link>
                </div>
              </div>

              <div
                className="rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  Designed for
                </p>

                <div className="mt-4 space-y-3">
                  <div
                    className="rounded-2xl px-4 py-4"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      ADHD-friendly task flow
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      Smaller tasks, visible progress, and less overwhelming screens.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl px-4 py-4"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      Colour-safe and readable
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      High contrast support and reduced reliance on colour-only cues.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl px-4 py-4"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      Calm focus sessions
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      Timed work sessions with a cleaner, less distracting experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <article
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                01
              </p>
              <h2
                className="mt-3 text-xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Create projects
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                Organise work into clear project spaces so tasks stay grouped and easier to follow.
              </p>
            </article>

            <article
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                02
              </p>
              <h2
                className="mt-3 text-xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Break work down
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                Turn large goals into short, manageable micro-tasks that feel easier to begin.
              </p>
            </article>

            <article
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                03
              </p>
              <h2
                className="mt-3 text-xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Focus and track
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                Use focus sessions, progress feedback, and accessibility settings that support concentration.
              </p>
            </article>
          </section>

          <section
            className="rounded-3xl p-8 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  Why NextTask
                </p>

                <h2
                  className="mt-3 text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  Built to reduce friction, not add more of it
                </h2>

                <p className="mt-4 text-sm leading-7" style={{ color: "var(--muted)" }}>
                  Many productivity tools rely on cluttered interfaces, long lists,
                  and colour-heavy signals. NextTask takes a simpler approach: one
                  clear next step, visible progress, and interface settings that can
                  be adapted to the user.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  className="rounded-xl px-5 py-3 text-center text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  Get started
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl px-5 py-3 text-center text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default HomePage;