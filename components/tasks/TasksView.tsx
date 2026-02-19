"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import type { TaskStatus } from "@prisma/client";

interface WeddingTask {
  id: number;
  status: TaskStatus;
  deadline: string | null;
}

interface Task {
  id: number;
  name: string;
  order: number;
  weddingTasks: WeddingTask[];
}

interface Chapter {
  id: number;
  name: string;
  order: number;
  tasks: Task[];
}

interface TasksViewProps {
  chapters: Chapter[];
  weddingId: number | null;
  locale: string;
}

function getTaskStatus(task: Task): TaskStatus {
  return task.weddingTasks?.[0]?.status ?? "New";
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "Done":
      return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case "Inprogress":
      return <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  }
}

function getNextStatus(current: TaskStatus): TaskStatus {
  switch (current) {
    case "New":
      return "Inprogress";
    case "Inprogress":
      return "Done";
    case "Done":
      return "New";
  }
}

export default function TasksView({ chapters, weddingId, locale }: TasksViewProps) {
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>(() => {
    const map: Record<number, TaskStatus> = {};
    for (const chapter of chapters) {
      for (const task of chapter.tasks) {
        map[task.id] = getTaskStatus(task);
      }
    }
    return map;
  });

  const [collapsedChapters, setCollapsedChapters] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const toggleChapter = (chapterId: number) => {
    setCollapsedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleTaskStatus = async (taskId: number) => {
    if (!weddingId) return;

    const current = taskStatuses[taskId] ?? "New";
    const next = getNextStatus(current);

    // Optimistic update
    setTaskStatuses((prev) => ({ ...prev, [taskId]: next }));
    setUpdatingTaskId(taskId);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${weddingId}/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });

        if (!res.ok) {
          // Revert on error
          setTaskStatuses((prev) => ({ ...prev, [taskId]: current }));
        }
      } catch {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: current }));
      } finally {
        setUpdatingTaskId(null);
      }
    });
  };

  // Calculate overall progress
  const totalTasks = chapters.reduce((acc, c) => acc + c.tasks.length, 0);
  const doneTasks = Object.values(taskStatuses).filter((s) => s === "Done").length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (!weddingId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Erstelle zuerst deine Hochzeit
        </h2>
        <p className="text-muted-foreground mb-6">
          Um die Aufgaben-Checkliste zu nutzen, musst du zuerst eine Hochzeit anlegen.
        </p>
        <Link
          href={`/${locale}/dashboard/wedding/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Hochzeit anlegen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Aufgaben & Checkliste</h1>
        <p className="text-muted-foreground text-sm">
          Klicke auf eine Aufgabe um den Status zu ändern.
        </p>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Gesamtfortschritt</span>
          <span className="text-sm font-semibold text-primary">
            {doneTasks} / {totalTasks} erledigt
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground text-right">
          {progressPercent}% abgeschlossen
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Circle className="h-3.5 w-3.5" />
          <span>Offen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span>In Bearbeitung</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          <span>Erledigt</span>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        {chapters.map((chapter) => {
          const isCollapsed = collapsedChapters[chapter.id] ?? false;
          const chapterDone = chapter.tasks.filter(
            (t) => taskStatuses[t.id] === "Done"
          ).length;
          const chapterTotal = chapter.tasks.length;

          return (
            <div
              key={chapter.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-foreground">{chapter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {chapterDone}/{chapterTotal}
                  </span>
                  {chapterDone === chapterTotal && chapterTotal > 0 && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      ✓ Fertig
                    </span>
                  )}
                </div>
              </button>

              {/* Tasks */}
              {!isCollapsed && (
                <div className="border-t border-border divide-y divide-border/50">
                  {chapter.tasks.map((task) => {
                    const status = taskStatuses[task.id] ?? "New";
                    const isUpdating = updatingTaskId === task.id && isPending;

                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTaskStatus(task.id)}
                        disabled={isUpdating}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/30 transition-colors disabled:opacity-60 ${
                          status === "Done" ? "opacity-70" : ""
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span
                          className={`flex-1 text-sm ${
                            status === "Done"
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.name}
                        </span>
                        {status === "Inprogress" && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 flex-shrink-0">
                            In Arbeit
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
