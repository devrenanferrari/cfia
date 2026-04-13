export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/course-card";

interface SearchParams {
  q?: string;
  categoria?: string;
  nivel?: string;
}

async function getCourses(params: SearchParams) {
  const where: Record<string, unknown> = { isPublished: true };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.categoria) {
    where.category = { slug: params.categoria };
  }
  if (params.nivel) {
    where.level = params.nivel.toUpperCase();
  }

  return prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
}

const levelLabel: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const courses = await getCourses(params);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const hasFilters = params.q || params.categoria || params.nivel;

  return (
    <div>
      {/* Hero banner IBM Style */}
      <div
        className="py-16 px-4 md:px-8 border-b"
        style={{
          backgroundColor: "var(--cds-background)",
          borderColor: "var(--cds-border-subtle)",
        }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
              Cursos
            </h1>
            <p className="text-base" style={{ color: "var(--cds-text-secondary)" }}>
              {courses.length} curso{courses.length !== 1 ? "s" : ""} disponíve{courses.length !== 1 ? "is" : "l"} para desenvolvimento profissional em IA.
            </p>
          </div>

          {/* Search bar */}
          <form className="flex gap-2 mt-8 max-w-xl" method="GET">
            {params.categoria && (
              <input type="hidden" name="categoria" value={params.categoria} />
            )}
            {params.nivel && (
              <input type="hidden" name="nivel" value={params.nivel} />
            )}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--cds-text-helper)" }} />
              <Input
                name="q"
                placeholder="Buscar no catálogo..."
                defaultValue={params.q}
                className="h-12 pl-12 rounded-none bg-transparent"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 rounded-none font-semibold text-sm"
              style={{ backgroundColor: "var(--cds-button-primary)", color: "#ffffff" }}
            >
              Pesquisar
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--cds-text-primary)" }} />
              <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: "var(--cds-text-primary)" }}>Filtros</h2>
              {hasFilters && (
                <Link
                  href="/cursos"
                  className="text-xs ml-auto hover:underline"
                  style={{ color: "var(--cds-interactive)" }}
                >
                  Limpar
                </Link>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Categorias</h3>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/cursos?${new URLSearchParams({ ...params, categoria: "" }).toString()}`}
                  className="px-3 py-2 text-sm transition-colors border-l-2"
                  style={{
                    borderColor: !params.categoria ? "var(--cds-interactive)" : "transparent",
                    color: !params.categoria ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
                    backgroundColor: !params.categoria ? "var(--cds-layer-01)" : "transparent",
                    fontWeight: !params.categoria ? 600 : 400,
                  }}
                >
                  Todas as categorias
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/cursos?${new URLSearchParams({ ...params, categoria: c.slug }).toString()}`}
                    className="px-3 py-2 text-sm transition-colors border-l-2 hover:bg-[var(--cds-layer-01)] hover:text-[var(--cds-text-primary)]"
                    style={{
                      borderColor: params.categoria === c.slug ? "var(--cds-interactive)" : "transparent",
                      color: params.categoria === c.slug ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
                      backgroundColor: params.categoria === c.slug ? "var(--cds-layer-01)" : "transparent",
                      fontWeight: params.categoria === c.slug ? 600 : 400,
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Nível</h3>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/cursos?${new URLSearchParams({ ...params, nivel: "" }).toString()}`}
                  className="px-3 py-2 text-sm transition-colors border-l-2"
                  style={{
                    borderColor: !params.nivel ? "var(--cds-interactive)" : "transparent",
                    color: !params.nivel ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
                    backgroundColor: !params.nivel ? "var(--cds-layer-01)" : "transparent",
                    fontWeight: !params.nivel ? 600 : 400,
                  }}
                >
                  Todos os níveis
                </Link>
                {Object.entries(levelLabel).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/cursos?${new URLSearchParams({ ...params, nivel: key.toLowerCase() }).toString()}`}
                    className="px-3 py-2 text-sm transition-colors border-l-2 hover:bg-[var(--cds-layer-01)] hover:text-[var(--cds-text-primary)]"
                    style={{
                      borderColor: params.nivel?.toUpperCase() === key ? "var(--cds-interactive)" : "transparent",
                      color: params.nivel?.toUpperCase() === key ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
                      backgroundColor: params.nivel?.toUpperCase() === key ? "var(--cds-layer-01)" : "transparent",
                      fontWeight: params.nivel?.toUpperCase() === key ? 600 : 400,
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {courses.length === 0 ? (
              <div
                className="py-20 text-center rounded-none"
                style={{ backgroundColor: "var(--cds-layer-01)" }}
              >
                <div
                  className="h-12 w-12 flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "var(--cds-layer-02)" }}
                >
                  <BookOpen className="h-6 w-6" style={{ color: "var(--cds-text-helper)" }} />
                </div>
                <h3 className="font-semibold text-[var(--cds-text-primary)] mb-1">
                  Nenhum curso encontrado
                </h3>
                <p className="text-sm" style={{ color: "var(--cds-text-secondary)" }}>
                  Tente ajustar seus filtros de busca.
                </p>
                {hasFilters && (
                  <Button variant="outline" className="mt-6 rounded-none bg-transparent" asChild>
                    <Link href="/cursos">Limpar filtros</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 bg-[var(--cds-layer-02)] border border-[var(--cds-layer-02)]">
                {courses.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
