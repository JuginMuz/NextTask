type AuthFormProps = {
  mode: "login" | "register";
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onModeChange: (mode: "login" | "register") => void;
  onSubmit: (e: React.FormEvent) => void;
};

function AuthForm({
  mode,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onModeChange,
  onSubmit,
}: AuthFormProps) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-8 shadow-lg"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <h1
        className="mb-2 text-3xl font-bold"
        style={{ color: "var(--text)" }}
      >
        NextTask
      </h1>

      <p
        className="mb-6"
        style={{ color: "var(--muted)" }}
      >
        {mode === "login" ? "Sign in to continue" : "Create your account"}
      </p>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="flex-1 rounded-lg px-4 py-2 font-medium"
          style={{
            backgroundColor:
              mode === "login" ? "var(--text)" : "var(--border)",
            color: mode === "login" ? "var(--card)" : "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => onModeChange("register")}
          className="flex-1 rounded-lg px-4 py-2 font-medium"
          style={{
            backgroundColor:
              mode === "register" ? "var(--text)" : "var(--border)",
            color: mode === "register" ? "var(--card)" : "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg px-3 py-2 outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg px-3 py-2 outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg py-2 font-semibold"
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "1px solid transparent",
          }}
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;