import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../lib/session";
import {
  createProject,
  deleteProject,
  getProjects,
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

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          Projects
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Organise tasks into focused projects and track progress clearly.
        </p>
      </div>

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
        className="rounded-3xl p-6 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Create new project
        </h3>

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
              placeholder="Example: Dissertation planning"
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
              Short description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe this project"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              rows={3}
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

      <section className="space-y-4">
        {loading ? (
          <div
            className="rounded-2xl px-4 py-5 text-sm"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
            }}
          >
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div
            className="rounded-2xl px-5 py-6"
            style={{
              backgroundColor: "var(--card)",
              border: "1px dashed var(--border)",
              color: "var(--text)",
            }}
          >
            <p className="text-base font-semibold">No projects yet</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Create your first project to start organising your work.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-3xl p-5 shadow-sm"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {project.title}
                </h3>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {project.description || "No description yet."}
                </p>

                <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                  <p>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>
                      Tasks:
                    </span>{" "}
                    {project.totalTasks}
                  </p>
                  <p>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>
                      Completed:
                    </span>{" "}
                    {project.completedTasks}
                  </p>
                  <p>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>
                      Progress:
                    </span>{" "}
                    {project.progress}%
                  </p>
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
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ProjectsPage;