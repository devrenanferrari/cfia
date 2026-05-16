"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle2, ArrowRight, BookOpen, Users, Award, Zap } from "lucide-react";

const BENEFITS = [
  { icon: BookOpen, title: "Crie cursos completos", desc: "Upload de vídeos, organização em módulos e aulas estruturadas." },
  { icon: Users, title: "Alcance alunos reais", desc: "Seu conteúdo disponível para quem está buscando aprender na plataforma." },
  { icon: Award, title: "Certificação no seu nome", desc: "Os alunos recebem certificados assinados com seu nome como instrutor." },
  { icon: Zap, title: "Processo simples", desc: "Plataforma nova, processo direto — sem burocracia para começar a publicar." },
];

export default function SejaInstrutorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    linkedin: "",
    bio: "",
    expertise: "",
    courseIdea: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (status === "loading") return null;

  if (session?.user?.role === "INSTRUCTOR") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: "#0052ff" }} />
          <h1 className="text-2xl font-bold mb-2">Você já é instrutor!</h1>
          <p className="text-muted-foreground mb-6">Acesse a área do instrutor para gerenciar seus cursos.</p>
          <Button className="rounded-[56px] px-8" style={{ backgroundColor: "#0052ff" }} asChild>
            <Link href="/instrutor">Ir para área do instrutor</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#0052ff15" }}
          >
            <CheckCircle2 className="h-10 w-10" style={{ color: "#0052ff" }} />
          </div>
          <h1 className="text-2xl font-bold mb-3">Candidatura enviada!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Candidatura recebida. Vou analisar e entrar em contato pelo email em breve.
          </p>
          <Button variant="outline" className="rounded-[56px] px-8" asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/entrar?callbackUrl=/seja-instrutor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/instructor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Erro ao enviar candidatura.");
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="font-bold mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: "1.08", color: "#0a0b0d" }}
          >
            Sabe algo que vale
            <br />
            <span style={{ color: "#0052ff" }}>a pena ensinar?</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            O CFIA é uma plataforma nova e pequena. Se você quer contribuir com um curso,
            o processo é direto — sem equipe de análise, sem promessa de audiência garantida.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4" style={{ backgroundColor: "#f7f8fa" }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-white rounded-2xl border">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#0052ff15" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#0052ff" }} />
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold mb-2 text-center">Candidate-se agora</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            {session ? `Candidatura para ${session.user?.email}` : "Faça login para continuar."}
          </p>

          {!session ? (
            <div className="text-center">
              <Button
                className="rounded-[56px] px-8 h-12 font-semibold"
                style={{ backgroundColor: "#0052ff" }}
                asChild
              >
                <Link href="/entrar?callbackUrl=/seja-instrutor">
                  Entrar para candidatar-se
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Não tem conta?{" "}
                <Link href="/cadastro?callbackUrl=/seja-instrutor" style={{ color: "#0052ff" }} className="font-semibold">
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Nome completo</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>LinkedIn (opcional)</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/seuperfil"
                />
              </div>
              <div className="space-y-1.5">
                <Label>O que você quer ensinar</Label>
                <Input
                  value={form.expertise}
                  onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                  placeholder="Ex: Python, Algoritmos, Banco de Dados, Machine Learning..."
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Sobre você</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Conte um pouco sobre sua experiência, formação e projetos..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Ideia de curso</Label>
                <Textarea
                  value={form.courseIdea}
                  onChange={(e) => setForm({ ...form, courseIdea: e.target.value })}
                  placeholder="Descreva brevemente o curso que gostaria de criar..."
                  rows={3}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-[56px] h-12 font-semibold"
                style={{ backgroundColor: "#0052ff" }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar candidatura"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
