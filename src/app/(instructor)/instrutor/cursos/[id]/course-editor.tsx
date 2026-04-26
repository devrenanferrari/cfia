"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VideoUpload } from "@/components/video-upload";
import { QuizEditor } from "@/components/quiz-editor";
import { NotebookEditor } from "@/components/admin/notebook-editor";
import { toast } from "sonner";
import {
  ArrowLeft, PlusCircle, ChevronDown, ChevronUp,
  Pencil, Trash2, Eye, EyeOff, Video, FileText,
  CheckCircle2, AlertCircle, Loader2, Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

type Lesson = {
  id: string; title: string; type: string;
  videoUrl: string | null; duration: number | null;
  isFree: boolean; order: number; description: string | null; content: string | null;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    maxAttempts: number | null;
    isCertificationExam: boolean;
    questions: {
      id: string;
      text: string;
      order: number;
      options: {
        id: string;
        text: string;
        order: number;
        isCorrect: boolean;
      }[];
    }[];
  } | null;
};
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type Category = { id: string; name: string; slug: string };
type Course = {
  id: string; title: string; slug: string; description: string | null;
  level: string; price: number; isFree: boolean; isPublished: boolean;
  modules: Module[]; category: Category | null;
};

type Tab = "info" | "curriculum";

export function CourseEditor({
  course: initialCourse,
  categories,
  quizFeatureError,
}: {
  course: Course;
  categories: Category[];
  quizFeatureError?: string | null;
}) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [tab, setTab] = useState<Tab>("curriculum");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [openModule, setOpenModule] = useState<string | null>(course.modules[0]?.id ?? null);
  const [newLesson, setNewLesson] = useState<{ moduleId: string; title: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // Conta aulas com vídeo
  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const lessonsWithVideo = course.modules.reduce(
    (a, m) => a + m.lessons.filter((l) => l.type !== "VIDEO" || l.videoUrl).length,
    0
  );
  const allVideosUploaded = totalLessons > 0 && lessonsWithVideo === totalLessons;

  async function saveCourse(patch: Partial<Course>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCourse((c) => ({ ...c, ...updated }));
      toast.success("Salvo!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCourse((c) => ({ ...c, isPublished: updated.isPublished }));
      toast.success(updated.isPublished ? "Curso publicado!" : "Curso despublicado");
      router.refresh();
    } catch {
      toast.error("Erro ao publicar");
    } finally {
      setPublishing(false);
    }
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle, courseId: course.id, order: course.modules.length + 1 }),
      });
      if (!res.ok) throw new Error();
      const mod = await res.json();
      setCourse((c) => ({ ...c, modules: [...c.modules, { ...mod, lessons: [] }] }));
      setNewModuleTitle("");
      setAddingModule(false);
      setOpenModule(mod.id);
      toast.success("Módulo criado");
    } catch {
      toast.error("Erro ao criar módulo");
    }
  }

  async function addLesson(moduleId: string, title: string, type: string) {
    const mod = course.modules.find((m) => m.id === moduleId)!;
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, moduleId, type, order: mod.lessons.length + 1 }),
      });
      if (!res.ok) throw new Error();
      const lesson = await res.json();
      setCourse((c) => ({
        ...c,
        modules: c.modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, { ...lesson, quiz: null }] } : m
        ),
      }));
      setNewLesson(null);
      setEditingLesson(lesson.id);
    } catch {
      toast.error("Erro ao criar aula");
    }
  }

  async function updateLesson(lessonId: string, patch: Partial<Lesson>) {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCourse((c) => ({
        ...c,
        modules: c.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updated } : l)),
        })),
      }));
    } catch {
      toast.error("Erro ao salvar aula");
    }
  }

  async function deleteLesson(lessonId: string, moduleId: string) {
    if (!confirm("Deletar esta aula permanentemente?")) return;
    try {
      await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
      setCourse((c) => ({
        ...c,
        modules: c.modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
        ),
      }));
      if (editingLesson === lessonId) setEditingLesson(null);
      toast.success("Aula removida");
    } catch {
      toast.error("Erro ao remover aula");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/instrutor/cursos"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Meus cursos
          </Link>
          <h1 className="text-2xl font-bold leading-tight">{course.title}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={course.isPublished ? "default" : "secondary"}>
              {course.isPublished ? "✓ Publicado" : "Rascunho"}
            </Badge>
            {totalLessons > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {allVideosUploaded
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Todos os vídeos enviados</>
                  : <><AlertCircle className="h-3.5 w-3.5 text-yellow-500" /> {lessonsWithVideo}/{totalLessons} vídeos</>
                }
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/cursos/${course.slug}`} target="_blank">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Visualizar
            </Link>
          </Button>
          <Button
            size="sm"
            variant={course.isPublished ? "outline" : "default"}
            className={`rounded-[56px] px-4 ${!course.isPublished ? "font-semibold" : ""}`}
            style={!course.isPublished ? { backgroundColor: "#0052ff" } : undefined}
            onClick={togglePublish}
            disabled={publishing}
          >
            {publishing ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : course.isPublished ? (
              <EyeOff className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Eye className="mr-1.5 h-3.5 w-3.5" />
            )}
            {course.isPublished ? "Despublicar" : "Publicar curso"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      {quizFeatureError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {quizFeatureError}
        </div>
      )}

      <div className="flex border-b gap-1">
        {(["curriculum", "info"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === t
                ? "border-[#0052ff] text-[#0052ff]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "curriculum" ? "Aulas & Vídeos" : "Informações"}
          </button>
        ))}
      </div>

      {/* ── TAB: AULAS & VÍDEOS ─────────────────────────────────────────────── */}
      {tab === "curriculum" && (
        <div className="space-y-3">
          {course.modules.length === 0 && !addingModule && (
            <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium mb-3">Nenhum módulo criado ainda</p>
              <Button onClick={() => setAddingModule(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar primeiro módulo
              </Button>
            </div>
          )}

          {course.modules.map((mod) => (
            <div key={mod.id} className="border rounded-xl overflow-hidden">
              {/* Header do módulo */}
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/70 text-left transition-colors"
                onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
              >
                <span className="font-medium flex-1 text-sm">{mod.title}</span>
                <span className="text-xs text-muted-foreground">
                  {mod.lessons.length} aula{mod.lessons.length !== 1 ? "s" : ""}
                </span>
                {openModule === mod.id
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                }
              </button>

              {/* Aulas */}
              {openModule === mod.id && (
                <div className="divide-y">
                  {mod.lessons.map((lesson) => {
                    const hasVideo = lesson.type !== "VIDEO" || !!lesson.videoUrl;
                    const isEditing = editingLesson === lesson.id;
                    return (
                      <div key={lesson.id} className="bg-background">
                        {/* Linha da aula */}
                        <div className={cn(
                          "flex items-center gap-3 px-4 py-2.5",
                          isEditing && "bg-[#0052ff08] border-l-2 border-[#0052ff]"
                        )}>
                          {lesson.type === "VIDEO" ? (
                            <Video className={cn("h-4 w-4 flex-shrink-0", hasVideo ? "text-green-500" : "text-yellow-500")} />
                          ) : lesson.type === "QUIZ" ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#0052ff]" />
                          ) : lesson.type === "NOTEBOOK" ? (
                            <Code2 className="h-4 w-4 flex-shrink-0 text-[#0f62fe]" />
                          ) : (
                            <FileText className="h-4 w-4 flex-shrink-0 text-blue-500" />
                          )}
                          <span className="text-sm flex-1 font-medium">{lesson.title}</span>

                          {lesson.type === "VIDEO" && (
                            <Badge
                              variant={hasVideo ? "default" : "secondary"}
                              className={cn("text-xs flex-shrink-0", hasVideo ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}
                            >
                              {hasVideo ? "✓ Vídeo" : "Sem vídeo"}
                            </Badge>
                          )}

                          {lesson.type === "QUIZ" && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {lesson.quiz?.isCertificationExam ? "Prova final" : "Quiz"}
                            </Badge>
                          )}

                          {lesson.type === "NOTEBOOK" && (
                            <Badge variant="outline" className="text-xs flex-shrink-0 bg-[#0f62fe]/10 text-[#0f62fe] border-[#0f62fe]/20">
                              Notebook
                            </Badge>
                          )}

                          <Button
                            size="sm"
                            variant={isEditing ? "default" : "ghost"}
                            className="h-7 px-2 flex-shrink-0"
                            onClick={() => setEditingLesson(isEditing ? null : lesson.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteLesson(lesson.id, mod.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Painel de edição da aula */}
                        {isEditing && (
                          <div className="px-4 py-4 space-y-4 border-t bg-muted/10">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Título da aula</Label>
                                <Input
                                  defaultValue={lesson.title}
                                  className="mt-1 h-8 text-sm"
                                  onBlur={(e) => e.target.value !== lesson.title && updateLesson(lesson.id, { title: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Duração (minutos)</Label>
                                <Input
                                  type="number"
                                  defaultValue={lesson.duration ?? ""}
                                  placeholder="Ex: 15"
                                  className="mt-1 h-8 text-sm"
                                  onBlur={(e) => updateLesson(lesson.id, { duration: parseInt(e.target.value) || null })}
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground">Descrição (opcional)</Label>
                              <Textarea
                                defaultValue={lesson.description ?? ""}
                                placeholder="Descreva brevemente o que o aluno vai aprender..."
                                className="mt-1 text-sm min-h-[60px]"
                                onBlur={(e) => updateLesson(lesson.id, { description: e.target.value })}
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                id={`free-${lesson.id}`}
                                type="checkbox"
                                defaultChecked={lesson.isFree}
                                onChange={(e) => updateLesson(lesson.id, { isFree: e.target.checked })}
                                className="h-4 w-4 accent-primary"
                              />
                              <label htmlFor={`free-${lesson.id}`} className="text-sm cursor-pointer">
                                Aula gratuita (visível sem matrícula)
                              </label>
                            </div>

                            {/* Upload de vídeo — destaque principal */}
                            {lesson.type === "VIDEO" && (
                              <div className="pt-1">
                                <Label className="text-xs font-semibold text-foreground">
                                  Vídeo da aula
                                </Label>
                                <div className="mt-2">
                                  <VideoUpload
                                    lessonId={lesson.id}
                                    lessonTitle={lesson.title}
                                    currentVideoId={lesson.videoUrl}
                                    onSuccess={(vid) => {
                                      updateLesson(lesson.id, { videoUrl: vid });
                                      toast.success("Vídeo enviado! Processamento em andamento...");
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {lesson.type === "TEXT" && (
                              <div>
                                <Label className="text-xs font-semibold text-foreground">Conteúdo da aula</Label>
                                <Textarea
                                  defaultValue={lesson.content ?? ""}
                                  placeholder="Escreva o conteúdo da aula aqui..."
                                  className="mt-2 text-sm min-h-[160px] font-mono"
                                  onBlur={(e) => updateLesson(lesson.id, { content: e.target.value })}
                                />
                              </div>
                            )}

                            {lesson.type === "NOTEBOOK" && (
                              <div>
                                <Label className="text-xs font-semibold text-foreground">Laboratório / Exercício Prático</Label>
                                <div className="mt-2">
                                  <NotebookEditor 
                                    initialContent={lesson.content}
                                    onChange={(jsonStr) => updateLesson(lesson.id, { content: jsonStr })}
                                  />
                                </div>
                              </div>
                            )}

                            {lesson.type === "QUIZ" && (
                              <div>
                                <Label className="text-xs font-semibold text-foreground">Quiz e prova</Label>
                                <div className="mt-2">
                                  <QuizEditor
                                    lessonId={lesson.id}
                                    lessonTitle={lesson.title}
                                    quiz={lesson.quiz}
                                    onChange={(updatedQuiz) =>
                                      setCourse((currentCourse) => ({
                                        ...currentCourse,
                                        modules: currentCourse.modules.map((module) => ({
                                          ...module,
                                          lessons: module.lessons.map((courseLesson) =>
                                            courseLesson.id === lesson.id
                                              ? { ...courseLesson, quiz: updatedQuiz }
                                              : courseLesson
                                          ),
                                        })),
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Adicionar aula */}
                  {newLesson?.moduleId === mod.id ? (
                    <div className="px-4 py-3 bg-muted/20 space-y-2 border-t">
                      <Input
                        autoFocus
                        placeholder="Título da aula (ex: Introdução ao Python)"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        onKeyDown={(e) => e.key === "Escape" && setNewLesson(null)}
                        className="h-8 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={!newLesson.title.trim()}
                          onClick={() => addLesson(mod.id, newLesson.title, "VIDEO")}
                        >
                          <Video className="mr-1.5 h-3.5 w-3.5" />
                          Aula de vídeo
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!newLesson.title.trim()}
                          onClick={() => addLesson(mod.id, newLesson.title, "TEXT")}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5" />
                          Aula de texto
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!newLesson.title.trim()}
                          onClick={() => addLesson(mod.id, newLesson.title, "QUIZ")}
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Quiz / prova
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!newLesson.title.trim()}
                          onClick={() => addLesson(mod.id, newLesson.title, "NOTEBOOK")}
                        >
                          <Code2 className="mr-1.5 h-3.5 w-3.5" />
                          Notebook interativo
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setNewLesson(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-t"
                      onClick={() => setNewLesson({ moduleId: mod.id, title: "" })}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Adicionar aula ao módulo
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Novo módulo */}
          {addingModule ? (
            <Card>
              <CardContent className="p-4 space-y-2">
                <Input
                  autoFocus
                  placeholder="Nome do módulo (ex: Módulo 1 — Fundamentos)"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addModule();
                    if (e.key === "Escape") setAddingModule(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button onClick={addModule} disabled={!newModuleTitle.trim()} size="sm">
                    Criar módulo
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAddingModule(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setAddingModule(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar módulo
            </Button>
          )}
        </div>
      )}

      {/* ── TAB: INFORMAÇÕES ────────────────────────────────────────────────── */}
      {tab === "info" && (
        <div className="space-y-5 max-w-2xl">
          <div>
            <Label>Título do curso</Label>
            <Input
              defaultValue={course.title}
              className="mt-1"
              onBlur={(e) => e.target.value.trim() && e.target.value !== course.title && saveCourse({ title: e.target.value })}
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              defaultValue={course.description ?? ""}
              className="mt-1 min-h-[120px]"
              placeholder="Descreva o que o aluno vai aprender, pré-requisitos, etc."
              onBlur={(e) => saveCourse({ description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nível</Label>
              <select
                defaultValue={course.level}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                onChange={(e) => saveCourse({ level: e.target.value })}
              >
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
              </select>
            </div>

            <div>
              <Label>Categoria</Label>
              <select
                defaultValue={course.category?.id ?? ""}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                onChange={(e) => saveCourse({ categoryId: e.target.value || null } as Partial<Course>)}
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Preço</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                size="sm"
                variant={course.isFree ? "default" : "outline"}
                onClick={() => saveCourse({ isFree: true, price: 0 })}
              >
                Grátis
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!course.isFree ? "default" : "outline"}
                onClick={() => saveCourse({ isFree: false })}
              >
                Pago
              </Button>
              {!course.isFree && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={course.price || ""}
                    placeholder="0,00"
                    className="w-28 h-8"
                    onBlur={(e) => saveCourse({ price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>
          </div>

          {saving && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Salvando…
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Needed to avoid import error
import { BookOpen } from "lucide-react";
