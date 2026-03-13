import { useEffect, useState } from "react";
import { login, register } from "./lib/auth";
import { saveToken, getToken, clearToken } from "./lib/session";
import { createTask, getTasks, type Task } from "./lib/tasks";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [token, setToken] = useState<string | null>(getToken());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      if (!token) return;

      try {
        setLoadingTasks(true);
        setError("");
        const fetchedTasks = await getTasks(token);
        setTasks(fetchedTasks);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load tasks");
        }
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, [token]);

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
      setToken(result.token);
      setMessage(
        `${mode === "login" ? "Logged in" : "Registered"} successfully as ${result.user.email}`
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in");
      return;
    }

    if (!newTaskTitle.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    try {
      setError("");
      const createdTask = await createTask(newTaskTitle.trim(), token);
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle("");
      setMessage("Task created successfully");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create task");
      }
    }
  }

  function handleLogout() {
    clearToken();
    setToken(null);
    setTasks([]);
    setEmail("");
    setPassword("");
    setMessage("Logged out successfully");
    setError("");
  }

  if (token) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-6 shadow">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">NextTask</h1>
              <p className="text-slate-600">Your task dashboard</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Create a new task
            </h2>

            <form onSubmit={handleCreateTask} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter a micro-task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Add task
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Your tasks
            </h2>

            {loadingTasks ? (
              <p className="text-slate-600">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-600">No tasks yet. Add your first one.</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.completed ? "Completed" : "Not completed"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

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