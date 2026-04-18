import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { getToken } from "../lib/session";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
} from "../lib/projects";

function ProjectsPage() {
  const navigate = useNavigate();
  const token = getToken();

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProjects() {
      try {
        setPageError("");
        const fetchedProjects = await getProjects(token);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setPageError("Unable to load your projects right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, [token, navigate]);

  async function handleCreateProject(e?: React.FormEvent) {
    e?.preventDefault();
    if (!token) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setPageError("Project title cannot be empty.");
      return;
    }

    try {
      const createdProject = await createProject(
        trimmedTitle,
        trimmedDescription,
        token
      );
      setProjects((prev) => [createdProject, ...prev]);
      setTitle("");
      setDescription("");
      setPageError("");
    } catch (error) {
      console.error("Failed to create project:", error);
      setPageError("Could not create the project.");
    }
  }

  async function handleDeleteProject(projectId: string) {
    if (!token) return;

    try {
      await deleteProject(projectId, token);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setPageError("");
    } catch (error) {
      console.error("Failed to delete project:", error);
      setPageError("Could not delete the project.");
    }
  }

  function handleStartEdit(project: Project) {
    setEditingProjectId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description || "");
  }

  function handleCancelEdit() {
    setEditingProjectId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function handleSaveEdit(projectId: string) {
    if (!token) return;

    const trimmedTitle = editTitle.trim();
    const trimmedDescription = editDescription.trim();

    if (!trimmedTitle) {
      setPageError("Project title cannot be empty.");
      return;
    }

    try {
      const updated = await updateProject(
        projectId,
        trimmedTitle,
        trimmedDescription,
        token
      );

      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? updated : project))
      );

      setEditingProjectId(null);
      setEditTitle("");
      setEditDescription("");
      setPageError("");
    } catch (error) {
      console.error("Failed to update project:", error);
      setPageError("Could not update the project.");
    }
  }

  return (
    <section className="space-y-6">
      <header
        className="rounded-[28px] px-6 py-6 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="max-w-2xl">
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            Projects
          </p>
          <h1
            className="mt-2 text-4xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Manage your project spaces
          </h1>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Create, edit, and open projects to organise tasks and track progress clearly.
          </p>
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

      <section
        className="rounded-[28px] p-5 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            Create a new project
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Start with a clear title and a short description.
          </p>
        </div>

        <form onSubmit={handleCreateProject}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="project-title"
                  className="mb-1 block text-xs font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  Project title
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dissertation planning"
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-1 block text-xs font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  Description
                </label>
                <input
                  id="project-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap outline-none"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-text)",
              }}
            >
              Create project
            </button>
          </div>
        </form>
      </section>

      <section
        className="rounded-[28px] p-6 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              All projects
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Open a project to manage tasks and focus work.
            </p>
          </div>

          <div
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <EmptyBox text="Loading projects..." />
          ) : projects.length === 0 ? (
            <EmptyBox text="No projects yet. Create your first project above." />
          ) : (
            projects.map((project) => {
              const isEditing = editingProjectId === project.id;
              const projectIsComplete = project.progress === 100;

              return (
                <article
                  key={project.id}
                  className="rounded-[22px] p-4 shadow-sm"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label
                          className="mb-1 block text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          Project title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
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
                          className="mb-1 block text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          Description
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                          style={{
                            backgroundColor: "var(--card)",
                            color: "var(--text)",
                            border: "1px solid var(--border)",
                          }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(project.id)}
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
                          onClick={handleCancelEdit}
                          className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--secondary-text)",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {project.title}
                          </h3>

                          <p
                            className="mt-1 text-sm line-clamp-2"
                            title={project.description || "No description yet."}
                            style={{ color: "var(--muted)" }}
                          >
                            {project.description || "No description yet."}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <StatusBadge
                            status={projectIsComplete ? "completed" : "pending"}
                          />
                        </div>
                      </div>

                      <div
                        className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        <span>
                          <strong style={{ color: "var(--text)" }}>Tasks:</strong>{" "}
                          {project.totalTasks}
                        </span>
                        <span>
                          <strong style={{ color: "var(--text)" }}>Completed:</strong>{" "}
                          {project.completedTasks}
                        </span>
                        <span>
                          <strong style={{ color: "var(--text)" }}>Progress:</strong>{" "}
                          {project.progress}%
                        </span>
                      </div>

                      <div
                        className="mt-5 h-4 w-full overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--border)" }}
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${project.progress}%`,
                            backgroundColor: projectIsComplete
                              ? "var(--success)"
                              : "var(--primary)",
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs font-medium" style={{ color: "var(--muted)" }}>
                        {project.progress}% complete
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-block rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-text)",
                          }}
                        >
                          Open
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(project)}
                          className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--secondary-text)",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                          style={{
                            backgroundColor: "var(--danger-soft)",
                            color: "var(--danger)",
                            border: "1px solid var(--danger)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </section>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-6"
      style={{
        backgroundColor: "var(--card)",
        border: "1px dashed var(--border)",
        color: "var(--text)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {text}
      </p>
    </div>
  );
}

export default ProjectsPage;