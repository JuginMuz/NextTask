const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3001";

type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function updatePassword(
  payload: UpdatePasswordPayload,
  token: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to update password.");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not reach the API at ${API_BASE_URL}. Check that the backend is running and that the URL/port is correct.`
      );
    }

    throw error;
  }
}

export async function deleteAccount(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to delete account.");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not reach the API at ${API_BASE_URL}. Check that the backend is running and that the URL/port is correct.`
      );
    }

    throw error;
  }
}