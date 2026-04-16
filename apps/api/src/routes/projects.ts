import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const projectsRouter = Router();

projectsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedProjects = projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((task) => task.completed).length;
      const progress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        userId: project.userId,
        totalTasks,
        completedTasks,
        progress,
      };
    });

    res.json(formattedProjects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

projectsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Project title is required" });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description.trim() : null,
        userId,
      },
    });

    res.status(201).json({
      ...project,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

projectsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});