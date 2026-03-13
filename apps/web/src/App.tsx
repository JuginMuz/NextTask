import { useState } from "react";
import { login, register } from "./lib/auth";
import { saveToken } from "./lib/session";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : await register(email, password);

      saveToken(result.token);
      setMessage(`${mode === "login" ? "Logged in" : "Registered"} successfully as ${result.user.email}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">NextTask</h1>
        <p className="text-slate-600 mb-6">
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-4 py-2 font-medium ${
              mode === "login"
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg px-4 py-2 font-medium ${
              mode === "register"
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-lg bg-green-100 px-3 py-2 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;