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
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">NextTask</h1>
      <p className="mb-6 text-slate-600">
        {mode === "login" ? "Sign in to continue" : "Create your account"}
      </p>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => onModeChange("login")}
          className={`flex-1 rounded-lg px-4 py-2 font-medium ${
            mode === "login"
              ? "bg-slate-900 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => onModeChange("register")}
          className={`flex-1 rounded-lg px-4 py-2 font-medium ${
            mode === "register"
              ? "bg-slate-900 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;