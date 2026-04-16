import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth";
import { tasksRouter } from "./routes/tasks";
import { sessionsRouter } from "./routes/sessions";
import { projectsRouter } from "./routes/projects";


dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/auth", authRouter);

app.use("/tasks", tasksRouter);

app.use("/sessions", sessionsRouter);

app.use("/projects", projectsRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

app.get("/test-db", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  res.json(users);
});