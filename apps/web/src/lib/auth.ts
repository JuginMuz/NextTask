import { apiFetch } from "./api";

type AuthResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  token: string;
};

export function register(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(payload: { email: string; password: string }) {
  return register(payload.email, payload.password);
}

export function loginUser(payload: { email: string; password: string }) {
  return login(payload.email, payload.password);
}