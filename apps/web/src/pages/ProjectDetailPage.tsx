import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import { getProjects, type Project } from "../lib/projects";
import { clearToken, getToken } from "../lib/session";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "../lib/tasks";

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      navigate("/projects");
      return;
    }

    async function loadProjectPage() {
      try {
        setPageError("");

        const [projects, projectTasks] = await Promise.all([
          getProjects(token),
          getTasks(token, id),
        ]);

        const currentProject = projects.find((p) => p.id === id);

        if (!currentProject) {
          setPageError("Project not found.");
          setProject(null);
          setTasks([]);
          return;
        }

        setProject(currentProject);
        setTasks(projectTasks);
      } catch (error) {
        console.error("Failed to load project page:", error);
        setPageError("Unable to load this project right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadProjectPage();
  }, [id, token, navigate]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !id) return;

    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return;

    try {
      const createdTask = await createTask(trimmedTitle, token, id);
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle("");
      setPageError("");
    } catch (error) {
      console.error("Failed to create task:", error);
      setPageError("Could not create the task.");
    }
  }

  async function handleToggleTask(taskId: string, completed: boolean) {
    if (!token) return;

    try {
      const updated = await updateTask(taskId, completed, token);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
      setPageError("");
    } catch (error) {
      console.error("Failed to update task:", error);
      setPageError("Could not update the task.");
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!token) return;

    try {
      await deleteTask(taskId, token);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setEditTaskTitle("");
      }
      setPageError("");
    } catch (error) {
      console.error("Failed to delete task:", error);
      setPageError("Could not delete the task.");
    }
  }

  function handleStartEditTask(task: Task) {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
  }

  function handleCancelEditTask() {
    setEditingTaskId(null);
    setEditTaskTitle("");
  }

  async function handleSaveEditTask(task: Task) {
    if (!token) return;

    const trimmedTitle = editTaskTitle.trim();
    if (!trimmedTitle) {
      setPageError("Task title cannot be empty.");
      return;
    }

    try {
      const updated = await updateTask(task.id, task.completed, token, trimmedTitle);
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updated : item))
      );
      setEditingTaskId(null);
      setEditTaskTitle("");
      setPageError("");
    } catch (error) {
      console.error("Failed to update task title:", error);
      setPageError("Could not update the task title.");
    }
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header
          className="rounded-3xl px-6 py-5 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  to="/projects"
                  className="text-sm font-medium no-underline"
                  style={{ color: "var(--muted)" }}
                >
                  ← Back to projects
                </Link>
              </div>

              <h1
                className="mt-3 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {project ? project.title : "Project"}
              </h1>

              <p
                className="mt-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                {project?.description || "No description yet."}
              </p>
            </div>

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
          </div>
        </header>

        {pageError && (
          <div
            className="rounded-2xl px-4 py-3 text-sm"
            role="alert"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--danger-soft)",
              color: "var(--text)",
            }}
          >
            {pageError}
          </div>
        )}

        {loading ? (
          <section
            className="rounded-3xl px-5 py-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            Loading project...
          </section>
        ) : !project ? (
          <section
            className="rounded-3xl px-5 py-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <p className="text-base font-semibold">Project not found</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              The project may have been deleted or you may not have access to it.
            </p>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard label="Total tasks" value={totalTasks} />
              <InfoCard label="Completed tasks" value={completedTasks} />
              <InfoCard label="Progress" value={`${progress}%`} />
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
                Project progress
              </h2>

              <div
                className="mt-5 h-4 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>

              <p
                className="mt-3 text-sm"
                style={{ color: "var(--muted)" }}
              >
                {completedTasks} of {totalTasks} task
                {totalTasks === 1 ? "" : "s"} completed
              </p>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
              <TaskForm
                value={newTaskTitle}
                onChange={setNewTaskTitle}
                onSubmit={handleCreateTask}
              />

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
                  Focus guidance
                </h2>

                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Open a task in focus mode to work on it with the timer and see
                  project progress.
                </p>

                <div
                  className="mt-5 rounded-2xl px-4 py-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px dashed var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <p className="font-semibold">Suggested next action</p>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    Pick one unfinished task and open it in focus mode before
                    starting a new one.
                  </p>
                </div>
              </section>
            </div>

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
                Tasks
              </h2>

              <p
                className="mt-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                Manage tasks for this project, then open one in focus mode.
              </p>

              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <div
                    className="rounded-2xl px-5 py-6"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px dashed var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <p className="text-base font-semibold">No tasks yet</p>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      Add a task above to start working on this project.
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const isEditing = editingTaskId === task.id;

                    return (
                      <article
                        key={task.id}
                        className="rounded-2xl p-4 shadow-sm"
                        style={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div>
                                <label
                                  className="mb-1 block text-sm font-medium"
                                  style={{ color: "var(--text)" }}
                                >
                                  Task title
                                </label>
                                <input
                                  type="text"
                                  value={editTaskTitle}
                                  onChange={(e) => setEditTaskTitle(e.target.value)}
                                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                                  style={{
                                    backgroundColor: "var(--card)",
                                    color: "var(--text)",
                                    border: "1px solid var(--border)",
                                  }}
                                />
                              </div>
                            ) : (
                              <>
                                <p
                                  className={`text-base font-semibold ${
                                    task.completed ? "line-through opacity-80" : ""
                                  }`}
                                  style={{ color: "var(--text)" }}
                                >
                                  {task.title}
                                </p>

                                <p
                                  className="mt-1 text-sm"
                                  style={{ color: "var(--muted)" }}
                                >
                                  {task.completed ? "Completed" : "Pending"}
                                </p>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditTask(task)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={handleCancelEditTask}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--secondary)",
                                    color: "var(--secondary-text)",
                                    border: "1px solid var(--border)",
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleTask(task.id, !task.completed)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: task.completed
                                      ? "var(--warning)"
                                      : "var(--primary)",
                                    color: task.completed
                                      ? "var(--warning-text)"
                                      : "var(--primary-text)",
                                  }}
                                  aria-label={
                                    task.completed
                                      ? `Mark "${task.title}" as pending`
                                      : `Mark "${task.title}" as completed`
                                  }
                                >
                                  {task.completed ? "Mark as pending" : "Mark as completed"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditTask(task)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--warning)",
                                    color: "var(--warning-text)",
                                  }}
                                >
                                  Edit
                                </button>

                                <Link
                                  to={`/projects/${id}/tasks/${task.id}`}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                                  style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                  Open focus
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--secondary)",
                                    color: "var(--secondary-text)",
                                    border: "1px solid var(--border)",
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

type InfoCardProps = {
  label: string;
  value: number | string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <article
      className="rounded-3xl p-5 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-3 text-4xl font-bold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {value}
      </p>
    </article>
  );
}

export default ProjectDetailPage;