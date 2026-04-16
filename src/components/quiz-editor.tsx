"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, FileQuestion, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";

type QuizOption = {
  id: string;
  text: string;
  order: number;
  isCorrect: boolean;
};

type QuizQuestion = {
  id: string;
  text: string;
  order: number;
  options: QuizOption[];
};

type QuizData = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  maxAttempts: number | null;
  isCertificationExam: boolean;
  questions: QuizQuestion[];
};

interface QuizEditorProps {
  lessonId: string;
  lessonTitle: string;
  quiz: QuizData | null;
  onChange: (quiz: QuizData | null) => void;
}

export function QuizEditor({ lessonId, lessonTitle, quiz, onChange }: QuizEditorProps) {
  const [creating, setCreating] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);

  async function createQuiz() {
    setCreating(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao criar quiz");
      onChange(payload);
      toast.success("Quiz criado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar quiz");
    } finally {
      setCreating(false);
    }
  }

  async function updateQuiz(patch: Partial<QuizData>) {
    if (!quiz) return;
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao salvar quiz");
      onChange(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar quiz");
    }
  }

  async function addQuestion() {
    if (!quiz) return;
    setAddingQuestion(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao adicionar pergunta");
      const question = payload;
      onChange({ ...quiz, questions: [...quiz.questions, question] });
      toast.success("Pergunta adicionada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar pergunta");
    } finally {
      setAddingQuestion(false);
    }
  }

  async function updateQuestion(questionId: string, patch: Partial<QuizQuestion>) {
    if (!quiz) return;
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao salvar pergunta");
      const updated = payload;
      onChange({
        ...quiz,
        questions: quiz.questions.map((question) => (question.id === questionId ? updated : question)),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar pergunta");
    }
  }

  async function deleteQuestion(questionId: string) {
    if (!quiz) return;
    if (!confirm("Excluir esta pergunta?")) return;
    try {
      const res = await fetch(`/api/questions/${questionId}`, { method: "DELETE" });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao remover pergunta");
      onChange({
        ...quiz,
        questions: quiz.questions.filter((question) => question.id !== questionId),
      });
      toast.success("Pergunta removida");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover pergunta");
    }
  }

  async function updateOption(
    questionId: string,
    optionId: string,
    patch: Partial<QuizOption>
  ) {
    if (!quiz) return;
    try {
      const res = await fetch(`/api/options/${optionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao salvar alternativa");
      const updated = payload;
      onChange({
        ...quiz,
        questions: quiz.questions.map((question) =>
          question.id !== questionId
            ? question
            : {
                ...question,
                options: question.options.map((option) =>
                  option.id === optionId
                    ? updated
                    : patch.isCorrect
                      ? { ...option, isCorrect: false }
                      : option
                ),
              }
        ),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar alternativa");
    }
  }

  if (!quiz) {
    return (
      <div className="rounded-xl border border-dashed p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#0052ff12] p-3">
            <FileQuestion className="h-5 w-5 text-[#0052ff]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{lessonTitle}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Transforme esta aula em um quiz avaliativo ou em uma prova final de certificação.
            </p>
            <Button
              className="mt-4"
              style={{ backgroundColor: "#0052ff" }}
              onClick={createQuiz}
              disabled={creating}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {creating ? "Criando..." : "Criar quiz"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label>Título da avaliação</Label>
          <Input
            defaultValue={quiz.title}
            className="mt-1"
            onBlur={(e) => e.target.value !== quiz.title && updateQuiz({ title: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Textarea
            defaultValue={quiz.description ?? ""}
            className="mt-1 min-h-[80px]"
            placeholder="Explique o objetivo desta avaliação."
            onBlur={(e) => updateQuiz({ description: e.target.value })}
          />
        </div>

        <div>
          <Label>Nota mínima para aprovação (%)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            defaultValue={quiz.passingScore}
            className="mt-1"
            onBlur={(e) => updateQuiz({ passingScore: Number(e.target.value) || 70 })}
          />
        </div>

        <div>
          <Label>Máximo de tentativas</Label>
          <Input
            type="number"
            min="1"
            defaultValue={quiz.maxAttempts ?? ""}
            className="mt-1"
            placeholder="Ilimitado"
            onBlur={(e) =>
              updateQuiz({ maxAttempts: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border p-4">
        <input
          type="checkbox"
          checked={quiz.isCertificationExam}
          onChange={(e) => updateQuiz({ isCertificationExam: e.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Usar como prova de certificação</span>
            {quiz.isCertificationExam && (
              <Badge className="bg-[#0052ff15] text-[#0052ff] border-[#0052ff20] hover:bg-[#0052ff15]">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Certificação
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            O certificado do curso só será emitido quando o aluno concluir tudo e passar nesta prova.
          </p>
        </div>
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Perguntas</h4>
            <p className="text-sm text-muted-foreground">
              Marque apenas uma alternativa correta por pergunta.
            </p>
          </div>
          <Button variant="outline" onClick={addQuestion} disabled={addingQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {addingQuestion ? "Adicionando..." : "Nova pergunta"}
          </Button>
        </div>

        {quiz.questions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nenhuma pergunta ainda.
          </div>
        ) : (
          quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-xl border p-4">
              <div className="mb-4 flex items-center gap-3">
                <Badge variant="outline">Pergunta {index + 1}</Badge>
                <div className="ml-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Enunciado</Label>
                  <Textarea
                    defaultValue={question.text}
                    className="mt-1 min-h-[72px]"
                    onBlur={(e) => e.target.value !== question.text && updateQuestion(question.id, { text: e.target.value })}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={option.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Alternativa {optionIndex + 1}
                        </span>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            option.isCorrect ? "text-green-600" : "text-muted-foreground"
                          }`}
                          onClick={() => updateOption(question.id, option.id, { isCorrect: true })}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {option.isCorrect ? "Correta" : "Marcar correta"}
                        </button>
                      </div>
                      <Input
                        defaultValue={option.text}
                        onBlur={(e) =>
                          e.target.value !== option.text &&
                          updateOption(question.id, option.id, { text: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
