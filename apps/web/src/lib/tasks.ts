import { apiFetch } from "./api";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
};

export function getTasks(token: string) {
  return apiFetch<Task[]>("/tasks", { method: "GET" }, token);
}

export function createTask(title: string, token: string) {
  return apiFetch<Task>(
    "/tasks",
    {
      method: "POST",
      body: JSON.stringify({ title }),
    },
    token
  );
}

export function updateTask(taskId: string, completed: boolean, token: string) {
  return apiFetch<Task>(
    `/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    },
    token
  );
}

export function deleteTask(taskId: string, token: string) {
  return apiFetch<{ message: string }>(
    `/tasks/${taskId}`,
    {
      method: "DELETE",
    },
    token
  );
}