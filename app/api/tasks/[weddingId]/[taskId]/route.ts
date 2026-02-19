import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { TaskStatus } from "@prisma/client";

// PUT /api/tasks/[weddingId]/[taskId] – toggle task status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ weddingId: string; taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { weddingId: weddingIdStr, taskId: taskIdStr } = await params;
    const weddingId = parseInt(weddingIdStr);
    const taskId = parseInt(taskIdStr);

    if (isNaN(weddingId) || isNaN(taskId)) {
      return NextResponse.json({ error: "Ungültige Parameter." }, { status: 400 });
    }

    // Verify ownership
    const planner = await db.planner.findUnique({
      where: { userId: session.user.id },
      include: {
        weddingPlanners: {
          where: { weddingId },
        },
      },
    });

    if (!planner || planner.weddingPlanners.length === 0) {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    const { status, deadline } = await req.json() as {
      status: TaskStatus;
      deadline?: string | null;
    };

    const validStatuses: TaskStatus[] = ["New", "Inprogress", "Done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status." }, { status: 400 });
    }

    // Get task to find chapterId
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Aufgabe nicht gefunden." }, { status: 404 });
    }

    // Upsert wedding task
    const existing = await db.weddingTask.findFirst({
      where: { weddingId, taskId },
    });

    let weddingTask;
    if (existing) {
      weddingTask = await db.weddingTask.update({
        where: { id: existing.id },
        data: {
          status,
          deadline: deadline ? new Date(deadline) : null,
        },
      });
    } else {
      // Get max order for this wedding
      const maxOrder = await db.weddingTask.count({ where: { weddingId } });

      weddingTask = await db.weddingTask.create({
        data: {
          weddingId,
          taskId,
          chapterId: task.chapterId,
          status,
          order: maxOrder + 1,
          deadline: deadline ? new Date(deadline) : null,
        },
      });
    }

    return NextResponse.json({ weddingTask });
  } catch (error) {
    console.error("Update task status error:", error);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten." }, { status: 500 });
  }
}
