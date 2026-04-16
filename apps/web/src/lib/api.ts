const API_BASE_URL = "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // no JSON body, keep fallback message
    }

    throw new Error(errorMessage);
  }

  // Important fix for DELETE / 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}