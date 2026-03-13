import { apiFetch } from "./api";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
};

export function getTasks(token: string) {
  return apiFetch<Task[]>("/tasks", {
    method: "GET",
  }, token);
}

export function createTask(title: string, token: string) {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  }, token);
}