import { useState } from "react";
import { register } from "../lib/auth";
import { saveToken } from "../lib/session";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await register(email, password);
      saveToken(result.token);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Register failed");
      }
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div>
        <AuthForm
          mode="register"
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onModeChange={(mode) =>
            navigate(mode === "login" ? "/login" : "/register")
          }
          onSubmit={handleSubmit}
        />

        {error && (
          <p
            className="mt-4 rounded-lg px-3 py-2"
            style={{
              backgroundColor: "var(--danger-soft)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;