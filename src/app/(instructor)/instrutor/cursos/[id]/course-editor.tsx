"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VideoUpload } from "@/components/video-upload";
import { toast } from "sonner";
import {
  PlusCircle, ChevronDown, ChevronUp, Pencil, Trash2,
  Eye, EyeOff, Save, GripVertical, Video, FileText
} from "lucide-react";

type Lesson = {
  id: string; title: string; type: string;
  videoUrl: string | null; duration: number | null;
  isFree: boolean; order: number; description: string | null; content: string | null;
};
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type Category = { id: string; name: string; slug: string };
type Course = {
  id: string; title: string; slug: string; description: string | null;
  level: string; price: number; isFree: boolean; isPublished: boolean;
  modules: Module[]; category: Category | null;
};

export function CourseEditor({
  course: initialCourse,
  categories,
  bunnyLibraryId,
}: {
  course: Course;
  categories: Category[];
  bunnyLibraryId: string;
}) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [saving, setSaving] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [openModule, setOpenModule] = useState<string | null>(course.modules[0]?.id ?? null);
  const [newLesson, setNewLesson] = useState<{ moduleId: string; title: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // ─── Salvar curso ───────────────────────────────────────────────────────────
  async function saveCourse(patch: Partial<Course>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      const updated = await res.json();
      setCourse((c) => ({ ...c, ...updated }));
      toast.success("Salvo!");
      router.refresh();
    } catch {
      toast.error("Erro ao salvar o curso");
    } finally {
      setSaving(false);
    }
  }

  // ─── Adicionar módulo ───────────────────────────────────────────────────────
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
      setOpenModule(mod.id);
      toast.success("Módulo criado");
    } catch {
      toast.error("Erro ao criar módulo");
    }
  }

  // ─── Adicionar aula ─────────────────────────────────────────────────────────
  async function addLesson(moduleId: string, title: string, type: string) {
    try {
      const mod = course.modules.find((m) => m.id === moduleId)!;
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
          m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
        ),
      }));
      setNewLesson(null);
      setEditingLesson(lesson.id);
      toast.success("Aula criada");
    } catch {
      toast.error("Erro ao criar aula");
    }
  }

  // ─── Atualizar aula ─────────────────────────────────────────────────────────
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
      toast.error("Erro ao atualizar aula");
    }
  }

  // ─── Deletar aula ───────────────────────────────────────────────────────────
  async function deleteLesson(lessonId: string, moduleId: string) {
    if (!confirm("Deletar esta aula?")) return;
    try {
      await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
      setCourse((c) => ({
        ...c,
        modules: c.modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
        ),
      }));
      toast.success("Aula deletada");
    } catch {
      toast.error("Erro ao deletar aula");
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge variant={course.isPublished ? "default" : "secondary"} className="mt-1">
            {course.isPublished ? "Publicado" : "Rascunho"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => saveCourse({ isPublished: !course.isPublished })}
            disabled={saving}
          >
            {course.isPublished ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {course.isPublished ? "Despublicar" : "Publicar"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/cursos/${course.slug}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </div>
      </div>

      {/* Informações básicas */}
      <Card>
        <CardHeader><CardTitle>Informações do curso</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              defaultValue={course.title}
              className="mt-1"
              onBlur={(e) => e.target.value !== course.title && saveCourse({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              defaultValue={course.description ?? ""}
              className="mt-1 min-h-[100px]"
              onBlur={(e) => saveCourse({ description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nível</Label>
              <select
                defaultValue={course.level}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                onChange={(e) => saveCourse({ level: e.target.value })}
              >
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
              </select>
            </div>
            <div>
              <Label>Preço</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant={course.isFree ? "default" : "outline"}
                  onClick={() => saveCourse({ isFree: true, price: 0 })}
                >Grátis</Button>
                <Button
                  size="sm"
                  variant={!course.isFree ? "default" : "outline"}
                  onClick={() => saveCourse({ isFree: false })}
                >Pago</Button>
                {!course.isFree && (
                  <Input
                    type="number"
                    defaultValue={course.price}
                    className="w-28"
                    onBlur={(e) => saveCourse({ price: parseFloat(e.target.value) || 0 })}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Currículo */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Currículo do curso</h2>

        <div className="space-y-3">
          {course.modules.map((mod) => (
            <div key={mod.id} className="border rounded-lg overflow-hidden">
              {/* Header do módulo */}
              <button
                type="button"
                className="w-full flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted text-left transition-colors"
                onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium flex-1">{mod.title}</span>
                <span className="text-sm text-muted-foreground">{mod.lessons.length} aulas</span>
                {openModule === mod.id
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                }
              </button>

              {/* Aulas do módulo */}
              {openModule === mod.id && (
                <div className="divide-y">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        {lesson.type === "VIDEO"
                          ? <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          : <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        }
                        <span className="text-sm flex-1">{lesson.title}</span>
                        {lesson.videoUrl && (
                          <Badge variant="outline" className="text-xs">Vídeo ok</Badge>
                        )}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteLesson(lesson.id, mod.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Edição da aula expandida */}
                      {editingLesson === lesson.id && (
                        <div className="px-4 pb-4 space-y-3 bg-muted/20 border-t">
                          <div className="pt-3">
                            <Label className="text-xs">Título</Label>
                            <Input
                              defaultValue={lesson.title}
                              className="mt-1 h-8 text-sm"
                              onBlur={(e) => updateLesson(lesson.id, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descrição</Label>
                            <Textarea
                              defaultValue={lesson.description ?? ""}
                              className="mt-1 text-sm min-h-[60px]"
                              onBlur={(e) => updateLesson(lesson.id, { description: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <Label className="text-xs">Duração (min)</Label>
                              <Input
                                type="number"
                                defaultValue={lesson.duration ?? ""}
                                className="mt-1 h-8 text-sm w-24"
                                onBlur={(e) => updateLesson(lesson.id, { duration: parseInt(e.target.value) || null })}
                              />
                            </div>
                            <div className="flex items-end gap-2 pb-0.5">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked={lesson.isFree}
                                  onChange={(e) => updateLesson(lesson.id, { isFree: e.target.checked })}
                                />
                                Aula gratuita (preview)
                              </label>
                            </div>
                          </div>

                          {/* Upload de vídeo */}
                          {lesson.type === "VIDEO" && (
                            <div>
                              <Label className="text-xs">Vídeo</Label>
                              <div className="mt-1">
                                <VideoUpload
                                  lessonId={lesson.id}
                                  lessonTitle={lesson.title}
                                  currentVideoId={lesson.videoUrl}
                                  onSuccess={(vid) => updateLesson(lesson.id, { videoUrl: vid })}
                                />
                              </div>
                            </div>
                          )}

                          {lesson.type === "TEXT" && (
                            <div>
                              <Label className="text-xs">Conteúdo</Label>
                              <Textarea
                                defaultValue={lesson.content ?? ""}
                                className="mt-1 text-sm min-h-[120px] font-mono"
                                onBlur={(e) => updateLesson(lesson.id, { content: e.target.value })}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Adicionar nova aula */}
                  {newLesson?.moduleId === mod.id ? (
                    <div className="px-4 py-3 bg-muted/20 space-y-2">
                      <Input
                        autoFocus
                        placeholder="Título da aula"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newLesson.title.trim()) {
                            addLesson(mod.id, newLesson.title, "VIDEO");
                          }
                          if (e.key === "Escape") setNewLesson(null);
                        }}
                        className="h-8 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => newLesson.title.trim() && addLesson(mod.id, newLesson.title, "VIDEO")}
                        >
                          <Video className="mr-1 h-3.5 w-3.5" />
                          Vídeo
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => newLesson.title.trim() && addLesson(mod.id, newLesson.title, "TEXT")}
                        >
                          <FileText className="mr-1 h-3.5 w-3.5" />
                          Texto
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setNewLesson(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => setNewLesson({ moduleId: mod.id, title: "" })}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Adicionar aula
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Novo módulo */}
          <div className="flex gap-2">
            <Input
              placeholder="Título do novo módulo"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addModule()}
            />
            <Button onClick={addModule} disabled={!newModuleTitle.trim()} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Módulo
            </Button>
          </div>
        </div>
      </div>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <Save className="h-4 w-4 animate-pulse" />
          Salvando…
        </div>
      )}
    </div>
  );
}
