"use client";

import { useState } from "react";
import { QuizPlayer } from "@/components/quiz-player";
import { NotebookPlayer } from "@/components/notebook-player";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Loader2, Video, FlaskConical, BookOpen } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  type: string;
  content: string | null;
  duration: number | null;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    maxAttempts: number | null;
    isCertificationExam: boolean;
    attempts: {
      id: string;
      score: number;
      passed: boolean;
      attemptNumber: number;
      submittedAt: Date;
    }[];
  } | null;
}

interface LessonPlayerProps {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
  bunnyLibraryId: string;
}

function isBunnyId(videoUrl: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoUrl);
}

function getBunnyEmbedUrl(videoId: string, libraryId: string) {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&responsive=true&preload=true`;
}

const TYPE_META: Record<string, { label: string; Icon: React.FC<{ className?: string; style?: React.CSSProperties }> }> = {
  VIDEO: { label: "Aula em vídeo", Icon: Video },
  TEXT: { label: "Aula em texto", Icon: FileText },
  NOTEBOOK: { label: "Notebook interativo", Icon: FlaskConical },
  QUIZ: { label: "Quiz", Icon: BookOpen },
};

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
        <div className="aspect-video bg-[#161616] flex flex-col items-center justify-center gap-3 border border-[#393939]">
          <Video className="h-10 w-10 opacity-20" style={{ color: "#ffffff" }} />
          <p className="text-sm" style={{ color: "#8d8d8d" }}>Vídeo ainda não disponível</p>
        </div>
      );
    }

    if (isBunnyId(lesson.videoUrl)) {
      return (
        <div className="aspect-video overflow-hidden bg-black border border-[#393939]">
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

    if (lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be")) {
      const ytId = lesson.videoUrl.match(
        /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/
      )?.[1];
      if (ytId) {
        return (
          <div className="aspect-video overflow-hidden bg-black border border-[#393939]">
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

    if (lesson.videoUrl.includes("vimeo.com")) {
      const vimeoId = lesson.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        return (
          <div className="aspect-video overflow-hidden bg-black border border-[#393939]">
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

    return (
      <div className="aspect-video overflow-hidden bg-black border border-[#393939]">
        <video src={lesson.videoUrl} controls className="w-full h-full" preload="metadata" playsInline>
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      </div>
    );
  };

  const typeMeta = TYPE_META[lesson.type] ?? TYPE_META["TEXT"];

  return (
    <div className="space-y-0">

      {/* ── Video player ───────────────────────────────────────── */}
      {lesson.type === "VIDEO" && renderVideoPlayer()}

      {/* ── Conteúdo de texto ──────────────────────────────────── */}
      {lesson.type === "TEXT" && (
        <div className="bg-white border border-[#e0e0e0]">
          {/* Label */}
          <div
            className="flex items-center gap-2 px-5 py-3 border-b border-[#e0e0e0]"
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <FileText className="h-4 w-4" style={{ color: "#0f62fe" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}>
              Aula em texto
            </span>
            {lesson.duration && (
              <span className="ml-auto text-xs" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}>
                {lesson.duration} min de leitura
              </span>
            )}
          </div>

          {/* Conteúdo com tipografia otimizada para leitura */}
          {lesson.content ? (
            <div className="px-5 md:px-10 lg:px-16 py-8 md:py-10">
              <div className="max-w-[68ch] mx-auto">
                {lesson.content.split(/\n{2,}/).map((block, i) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  // Detecta bloco de código (linhas com 4+ espaços ou indentação comum de código)
                  const looksLikeCode =
                    trimmed.startsWith("```") ||
                    trimmed.split("\n").every((l) => l.startsWith("    ") || l.startsWith("\t") || l === "");

                  if (looksLikeCode) {
                    const codeContent = trimmed.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").replace(/^(    |\t)/gm, "");
                    return (
                      <pre
                        key={i}
                        className="mb-6 p-4 text-sm overflow-x-auto border border-[#e0e0e0]"
                        style={{
                          fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                          backgroundColor: "#161616",
                          color: "#f4f4f4",
                          lineHeight: "1.6",
                          fontSize: "13px",
                        }}
                      >
                        <code>{codeContent}</code>
                      </pre>
                    );
                  }

                  // Detecta título (linha curta seguida de nova linha ou começa com #)
                  if (trimmed.startsWith("# ")) {
                    return (
                      <h2
                        key={i}
                        className="text-xl font-semibold mb-4 mt-8 first:mt-0"
                        style={{ color: "#161616", letterSpacing: "-0.01em" }}
                      >
                        {trimmed.replace(/^# /, "")}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h3
                        key={i}
                        className="text-base font-semibold mb-3 mt-6"
                        style={{ color: "#161616" }}
                      >
                        {trimmed.replace(/^## /, "")}
                      </h3>
                    );
                  }

                  // Parágrafo normal
                  return (
                    <p
                      key={i}
                      className="mb-5 last:mb-0"
                      style={{
                        color: "#393939",
                        fontSize: "16px",
                        lineHeight: "1.8",
                      }}
                    >
                      {trimmed.split("\n").map((line, j, arr) => (
                        <span key={j}>
                          {line}
                          {j < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="px-5 py-8 text-sm" style={{ color: "#8d8d8d" }}>Conteúdo não disponível.</p>
          )}
        </div>
      )}

      {/* ── Notebook ───────────────────────────────────────────── */}
      {lesson.type === "NOTEBOOK" && lesson.content && (
        <NotebookPlayer content={lesson.content} />
      )}

      {/* ── Quiz ───────────────────────────────────────────────── */}
      {lesson.type === "QUIZ" && lesson.quiz && (
        <QuizPlayer quizId={lesson.quiz.id} isCompleted={completed} />
      )}
      {lesson.type === "QUIZ" && !lesson.quiz && (
        <div className="border border-[#e0e0e0] bg-white p-6 text-sm" style={{ color: "#8d8d8d" }}>
          Este quiz ainda não foi configurado pelo instrutor.
        </div>
      )}

      {/* ── Barra de info + conclusão ───────────────────────────── */}
      <div className="bg-white border border-[#e0e0e0] border-t-0 px-5 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          {/* Tipo da aula */}
          <div className="flex items-center gap-1.5 mb-2">
            <typeMeta.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
            <span className="text-xs font-semibold uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.1em" }}>
              {typeMeta.label}
            </span>
            {lesson.duration && (
              <>
                <span style={{ color: "#c6c6c6" }}>·</span>
                <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}>
                  {lesson.duration} min
                </span>
              </>
            )}
          </div>
          <h2 className="text-lg font-semibold leading-snug" style={{ color: "#161616" }}>
            {lesson.title}
          </h2>
          {lesson.description && (
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#525252" }}>
              {lesson.description}
            </p>
          )}
        </div>

        {lesson.type !== "QUIZ" && (
          <button
            onClick={markAsComplete}
            disabled={marking || completed}
            className="flex items-center gap-2 px-5 h-10 text-sm font-semibold shrink-0 transition-colors disabled:opacity-70 self-start sm:self-auto"
            style={
              completed
                ? { backgroundColor: "#defbe6", color: "#24a148", border: "1px solid #24a148" }
                : { backgroundColor: "#0f62fe", color: "#ffffff" }
            }
          >
            {marking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {completed ? "Concluída" : marking ? "Salvando..." : "Marcar como concluída"}
          </button>
        )}
      </div>

    </div>
  );
}
