import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
              Create, edit, and open projects to organise tasks and track progress
              clearly.
            </p>
          </div>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section
          className="rounded-[28px] p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
            Create new project
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Start a new workspace for a study goal, assignment, or personal plan.
          </p>

          <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="project-title"
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Project title
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Final report planning"
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
                htmlFor="project-description"
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short summary for this project"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                rows={4}
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            <button
              type="submit"
              className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-text)",
              }}
            >
              Create project
            </button>
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
                backgroundColor: "var(--pending-soft)",
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
              <EmptyBox text="No projects yet. Create your first project on the left." />
            ) : (
              projects.map((project) => {
                const isEditing = editingProjectId === project.id;

                return (
                  <article
                    key={project.id}
                    className="rounded-[22px] p-5 shadow-sm"
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
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3
                              className="text-xl font-semibold"
                              style={{ color: "var(--text)" }}
                            >
                              {project.title}
                            </h3>

                            <p
                              className="mt-2 text-sm"
                              style={{ color: "var(--muted)" }}
                            >
                              {project.description || "No description yet."}
                            </p>
                          </div>

                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: "var(--pending-soft)",
                              color: "var(--text)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {project.progress}%
                          </span>
                        </div>
                      </>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <MiniInfo label="Tasks" value={project.totalTasks} />
                      <MiniInfo label="Completed" value={project.completedTasks} />
                      <MiniInfo label="Progress" value={`${project.progress}%`} />
                    </div>

                    <div
                      className="mt-4 h-3 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--border)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {isEditing ? (
                        <>
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
                              border: "1px solid var(--border)",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/projects/${project.id}`}
                            className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
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
                              backgroundColor: "var(--warning)",
                              color: "var(--warning-text)",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
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
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

function MiniInfo({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      className="rounded-xl px-3 py-3"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p style={{ color: "var(--text)", fontWeight: 600 }}>{value}</p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </p>
    </div>
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