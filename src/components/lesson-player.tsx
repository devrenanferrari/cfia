"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle, Play, FileText } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  type: string;
  content: string | null;
  duration: number | null;
}

interface LessonPlayerProps {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
}

export function LessonPlayer({ lesson, courseId, isCompleted }: LessonPlayerProps) {
  const [marking, setMarking] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const router = useRouter();

  async function markAsComplete() {
    setMarking(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, courseId }),
      });
      setCompleted(true);
      toast.success("Aula concluída!");
      router.refresh();
    } catch {
      toast.error("Erro ao marcar aula como concluída");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Player de vídeo */}
      {lesson.type === "VIDEO" && lesson.videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Placeholder sem vídeo */}
      {lesson.type === "VIDEO" && !lesson.videoUrl && (
        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Vídeo não disponível</p>
          </div>
        </div>
      )}

      {/* Conteúdo de texto */}
      {lesson.type === "TEXT" && (
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Aula em texto</span>
          </div>
          {lesson.content ? (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{lesson.content}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Conteúdo não disponível.</p>
          )}
        </div>
      )}

      {/* Info da aula */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          {lesson.description && (
            <p className="text-muted-foreground text-sm mt-1">{lesson.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs capitalize">
              {lesson.type === "VIDEO" ? "Vídeo" : lesson.type === "TEXT" ? "Texto" : "Quiz"}
            </Badge>
            {lesson.duration && (
              <Badge variant="outline" className="text-xs">{lesson.duration} min</Badge>
            )}
          </div>
        </div>

        <Button
          onClick={markAsComplete}
          disabled={marking || completed}
          variant={completed ? "secondary" : "default"}
          className="flex-shrink-0"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {completed ? "Concluída" : marking ? "Salvando..." : "Marcar como concluída"}
        </Button>
      </div>
    </div>
  );
}
