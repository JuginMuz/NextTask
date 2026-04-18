import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../lib/theme";

function AppLayout() {
  const location = useLocation();
  const { theme } = useTheme();

  function isActive(path: string) {
    return location.pathname.startsWith(path);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <header
        className="px-6 py-4 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            NextTask
          </h1>

          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link
              to="/dashboard"
              className="rounded-full px-3 py-2 no-underline transition"
              style={{
                color: isActive("/dashboard") ? "var(--primary)" : "var(--text)",
                backgroundColor: isActive("/dashboard")
                  ? "var(--pending-soft)"
                  : "transparent",
              }}
            >
              Dashboard
            </Link>

            <Link
              to="/projects"
              className="rounded-full px-3 py-2 no-underline transition"
              style={{
                color: isActive("/projects") ? "var(--primary)" : "var(--text)",
                backgroundColor: isActive("/projects")
                  ? "var(--pending-soft)"
                  : "transparent",
              }}
            >
              Projects
            </Link>

            <Link
              to="/profile"
              className="rounded-full px-3 py-2 no-underline transition"
              style={{
                color: isActive("/profile") ? "var(--primary)" : "var(--text)",
                backgroundColor: isActive("/profile")
                  ? "var(--pending-soft)"
                  : "transparent",
              }}
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      <footer
        className="py-3 text-center text-xs"
        style={{ color: "var(--muted)" }}
      >
        Privacy · Terms
      </footer>
    </div>
  );
}

export default AppLayout;