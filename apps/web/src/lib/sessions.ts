import { apiFetch } from "./api";

export type FocusSession = {
  id: string;
  duration: number;
  createdAt: string;
  userId: string;
};

export function getSessions(token: string) {
  return apiFetch<FocusSession[]>("/sessions", { method: "GET" }, token);
}

export function createSession(duration: number, token: string) {
  return apiFetch<FocusSession>(
    "/sessions",
    {
      method: "POST",
      body: JSON.stringify({ duration }),
    },
    token
  );
}