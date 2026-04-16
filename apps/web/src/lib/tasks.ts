import { apiFetch } from "./api";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
  projectId: string | null;
};

export function getTasks(token: string, projectId?: string) {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return apiFetch<Task[]>(`/tasks${query}`, { method: "GET" }, token);
}

export function createTask(
  title: string,
  token: string,
  projectId?: string
) {
  return apiFetch<Task>(
    "/tasks",
    {
      method: "POST",
      body: JSON.stringify({
        title,
        projectId: projectId ?? null,
      }),
    },
    token
  );
}

export function updateTask(
  taskId: string,
  completed: boolean,
  token: string,
  title?: string
) {
  return apiFetch<Task>(
    `/tasks/${taskId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        completed,
        ...(typeof title === "string" ? { title } : {}),
      }),
    },
    token
  );
}

export function deleteTask(taskId: string, token: string) {
  return apiFetch<void>(`/tasks/${taskId}`, { method: "DELETE" }, token);
}