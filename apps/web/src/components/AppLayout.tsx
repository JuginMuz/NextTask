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
      {/* NAVBAR */}
      <header
        className="flex items-center justify-between px-6 py-4 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1 className="text-xl font-bold">NextTask</h1>

        <nav className="flex gap-6 text-sm font-semibold">
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "underline" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={isActive("/projects") ? "underline" : ""}
          >
            Projects
          </Link>

          <Link
            to="/profile"
            className={isActive("/profile") ? "underline" : ""}
          >
            Profile
          </Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="text-center text-xs py-3"
        style={{ color: "var(--muted)" }}
      >
        Privacy · Terms
      </footer>
    </div>
  );
}

export default AppLayout;