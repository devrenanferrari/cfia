"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, FileQuestion, Loader2, RotateCcw, ShieldCheck } from "lucide-react";

type PlayableQuiz = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  maxAttempts: number | null;
  isCertificationExam: boolean;
  questions: Array<{
    id: string;
    text: string;
    order: number;
    options: Array<{
      id: string;
      text: string;
      order: number;
    }>;
  }>;
  attempts: Array<{
    id: string;
    score: number;
    passed: boolean;
    attemptNumber: number;
    submittedAt: string;
  }>;
};

interface QuizPlayerProps {
  quizId: string;
  isCompleted: boolean;
}

export function QuizPlayer({ quizId, isCompleted }: QuizPlayerProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<PlayableQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
    passingScore: number;
    attemptNumber: number;
    attemptsRemaining: number | null;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as PlayableQuiz;
        if (!active) return;
        setQuiz(data);
        const latestAttempt = data.attempts[0];
        if (latestAttempt) {
          setResult({
            score: latestAttempt.score,
            passed: latestAttempt.passed,
            correct: 0,
            total: data.questions.length,
            passingScore: data.passingScore,
            attemptNumber: latestAttempt.attemptNumber,
            attemptsRemaining:
              data.maxAttempts === null
                ? null
                : Math.max(0, data.maxAttempts - latestAttempt.attemptNumber),
          });
        }
      } catch {
        toast.error("Erro ao carregar quiz");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      active = false;
    };
  }, [quizId]);

  const attemptsUsed = quiz?.attempts[0]?.attemptNumber ?? 0;
  const approved = isCompleted || Boolean(result?.passed);
  const attemptsRemaining = useMemo(() => {
    if (!quiz || quiz.maxAttempts === null) return null;
    return Math.max(0, quiz.maxAttempts - attemptsUsed);
  }, [quiz, attemptsUsed]);

  const locked = Boolean(quiz?.maxAttempts && attemptsRemaining === 0 && !approved);

  async function submitQuiz() {
    if (!quiz) return;
    if (quiz.questions.some((question) => !answers[question.id])) {
      toast.error("Responda todas as perguntas antes de enviar.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar quiz");
      }

      setQuiz((current) =>
        current
          ? {
              ...current,
              attempts: [
                {
                  id: data.id,
                  score: data.score,
                  passed: data.passed,
                  attemptNumber: data.attemptNumber,
                  submittedAt: new Date().toISOString(),
                },
                ...current.attempts,
              ],
            }
          : current
      );
      setResult(data);
      toast.success(data.passed ? "Quiz aprovado!" : "Quiz enviado");
      if (data.passed) {
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar quiz");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border p-8 text-center text-muted-foreground">
        <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
        Carregando quiz...
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <FileQuestion className="h-3.5 w-3.5" />
              Quiz
            </Badge>
            {quiz.isCertificationExam && (
              <Badge className="gap-1 bg-[#0052ff15] text-[#0052ff] border-[#0052ff20] hover:bg-[#0052ff15]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Prova de certificação
              </Badge>
            )}
          </div>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.description || "Responda às perguntas para avançar no curso."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Nota mínima: {quiz.passingScore}%</span>
            <span>•</span>
            <span>{quiz.questions.length} pergunta{quiz.questions.length !== 1 ? "s" : ""}</span>
            {quiz.maxAttempts !== null && (
              <>
                <span>•</span>
                <span>{quiz.maxAttempts} tentativa{quiz.maxAttempts !== 1 ? "s" : ""}</span>
              </>
            )}
          </div>

          {result && (
            <div
              className={`rounded-xl border p-4 text-sm ${
                result.passed
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {result.passed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {result.passed ? "Você foi aprovado" : "Você ainda não atingiu a nota mínima"}
              </div>
              <p className="mt-1">
                Nota {result.score}% de {result.passingScore}%.
              </p>
              {result.attemptsRemaining !== null && !result.passed && (
                <p className="mt-1">
                  Tentativas restantes: {result.attemptsRemaining}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
              <CardDescription>{question.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {question.options.map((option) => {
                const checked = answers[question.id] === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                      checked ? "border-[#0052ff] bg-[#0052ff08]" : "hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={checked}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.id,
                        }))
                      }
                      className="h-4 w-4 accent-primary"
                      disabled={submitting || locked || approved}
                    />
                    <span>{option.text}</span>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={submitQuiz}
          disabled={submitting || locked || approved}
          style={{ backgroundColor: "#0052ff" }}
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {approved ? "Quiz concluído" : "Enviar respostas"}
        </Button>

        {locked && (
          <p className="text-sm text-destructive">
            Você atingiu o limite de tentativas desta avaliação.
          </p>
        )}
      </div>
    </div>
  );
}
