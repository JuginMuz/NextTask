import { apiFetch } from "./api";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export function getProjects(token: string) {
  return apiFetch<Project[]>("/projects", { method: "GET" }, token);
}

export function createProject(
  title: string,
  description: string,
  token: string
) {
  return apiFetch<Project>(
    "/projects",
    {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
    },
    token
  );
}

export function updateProject(
  projectId: string,
  title: string,
  description: string,
  token: string
) {
  return apiFetch<Project>(
    `/projects/${projectId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
      }),
    },
    token
  );
}

export function deleteProject(projectId: string, token: string) {
  return apiFetch<void>(`/projects/${projectId}`, { method: "DELETE" }, token);
}