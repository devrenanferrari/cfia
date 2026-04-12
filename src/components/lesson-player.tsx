"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, Loader2 } from "lucide-react";

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
  bunnyLibraryId: string;
}

/** Detecta se é um videoId do Bunny (guid) ou URL externa (youtube, vimeo, etc.) */
function isBunnyId(videoUrl: string) {
  // Bunny GUIDs são UUIDs: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoUrl);
}

function getBunnyEmbedUrl(videoId: string, libraryId: string) {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&responsive=true&preload=true`;
}

export function LessonPlayer({ lesson, courseId, isCompleted, bunnyLibraryId }: LessonPlayerProps) {
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

  const renderVideoPlayer = () => {
    if (!lesson.videoUrl) {
      return (
        <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-10 w-10 opacity-30" />
          <p className="text-sm">Vídeo ainda não disponível</p>
        </div>
      );
    }

    // Bunny.net (videoId UUID)
    if (isBunnyId(lesson.videoUrl)) {
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
          <iframe
            src={getBunnyEmbedUrl(lesson.videoUrl, bunnyLibraryId)}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      );
    }

    // YouTube
    if (lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be")) {
      const ytId = lesson.videoUrl.match(
        /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/
      )?.[1];
      if (ytId) {
        return (
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        );
      }
    }

    // Vimeo
    if (lesson.videoUrl.includes("vimeo.com")) {
      const vimeoId = lesson.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        return (
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?dnt=1&byline=0&portrait=0`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        );
      }
    }

    // Fallback: vídeo direto HTML5 (mp4, webm, etc.)
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <video
          src={lesson.videoUrl}
          controls
          className="w-full h-full"
          preload="metadata"
          playsInline
        >
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Player */}
      {lesson.type === "VIDEO" && renderVideoPlayer()}

      {/* Conteúdo de texto */}
      {lesson.type === "TEXT" && (
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Aula em texto</span>
          </div>
          {lesson.content ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{lesson.content}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Conteúdo não disponível.</p>
          )}
        </div>
      )}

      {/* Info + botão de conclusão */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          {lesson.description && (
            <p className="text-muted-foreground text-sm mt-1">{lesson.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
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
          {marking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {completed ? "Concluída" : marking ? "Salvando..." : "Marcar como concluída"}
        </Button>
      </div>
    </div>
  );
}
