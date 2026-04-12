"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "BEGINNER",
    price: "0",
    isFree: true,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("O título do curso é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          level: form.level,
          price: form.isFree ? 0 : parseFloat(form.price) || 0,
          isFree: form.isFree,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar curso");
      }

      const course = await res.json();
      toast.success("Curso criado com sucesso!");
      router.push(`/instrutor/cursos/${course.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar curso");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Criar novo curso</h1>
        <p className="text-muted-foreground">Preencha as informações básicas do seu curso.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="title">Título do curso *</Label>
              <Input
                id="title"
                placeholder="Ex: Machine Learning do Zero ao Avançado"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o que os alunos vão aprender neste curso..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>

            <div>
              <Label>Nível</Label>
              <Select value={form.level} onValueChange={(v) => set("level", v ?? form.level)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Iniciante</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                  <SelectItem value="ADVANCED">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preço</Label>
              <div className="flex items-center gap-3 mt-1">
                <Button
                  type="button"
                  variant={form.isFree ? "default" : "outline"}
                  size="sm"
                  onClick={() => set("isFree", true)}
                >
                  Grátis
                </Button>
                <Button
                  type="button"
                  variant={!form.isFree ? "default" : "outline"}
                  size="sm"
                  onClick={() => set("isFree", false)}
                >
                  Pago
                </Button>
              </div>
              {!form.isFree && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium">R$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className="max-w-[120px]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar curso"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
