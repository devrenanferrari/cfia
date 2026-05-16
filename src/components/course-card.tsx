"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Users, ArrowRight, Star, Clock } from "lucide-react";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  level: string;
  isFree: boolean;
  price: number;
  instructor: { name: string | null };
  category: { name: string } | null;
  _count: { enrollments: number };
};

const levelLabel: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="h-full"
    >
      <Link href={`/cursos/${course.slug}`} className="group block h-full">
        <div
          className="layer-01 overflow-hidden h-full flex flex-col transition-colors duration-200"
          style={{
            borderBottom: "2px solid transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cds-layer-02)";
            (e.currentTarget as HTMLDivElement).style.borderBottomColor = "var(--cds-interactive)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cds-layer-01)";
            (e.currentTarget as HTMLDivElement).style.borderBottomColor = "transparent";
          }}
        >
          {/* Thumbnail */}
          <div
            className="aspect-video relative overflow-hidden"
            style={{ backgroundColor: "var(--cds-layer-02)" }}
          >
            {course.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="h-14 w-14 flex items-center justify-center"
                  style={{ backgroundColor: "var(--cds-background)" }}
                >
                  <BookOpen className="h-7 w-7" style={{ color: "var(--cds-text-secondary)" }} />
                </div>
              </div>
            )}

            {/* Hover overlay with ArrowRight matching IBM Tiles */}
            <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
               <div className="h-8 w-8 flex items-center justify-center bg-white">
                 <ArrowRight className="h-4 w-4" style={{ color: "var(--cds-interactive)" }} />
               </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex gap-1.5">
              {course.isFree ? (
                <span
                  className="text-xs font-semibold px-2 py-1 flex items-center gap-1"
                  style={{ backgroundColor: "var(--cds-support-success)", color: "white" }}
                >
                  Gratis
                </span>
              ) : (
                <span
                  className="text-xs font-semibold px-2 py-1 flex items-center gap-1"
                  style={{ backgroundColor: "var(--cds-text-primary)", color: "white" }}
                >
                  <Clock className="h-3 w-3" />
                  Em breve
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              {course.category && (
                <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--cds-text-secondary)" }}>
                  {course.category.name}
                </span>
              )}
              <span
                className="text-xs font-medium ml-auto uppercase tracking-widest"
                style={{ color: "var(--cds-text-secondary)" }}
              >
                {levelLabel[course.level] ?? course.level}
              </span>
            </div>

            <h3
              className="font-semibold text-base line-clamp-2 mb-1.5 flex-1 leading-snug"
              style={{ color: "var(--cds-text-primary)" }}
            >
              {course.title}
            </h3>

            <p className="text-sm mb-4" style={{ color: "var(--cds-text-secondary)" }}>
              {course.instructor.name}
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-3 w-3"
                    style={{ fill: i <= 4 ? "var(--cds-support-warning)" : "none", color: "var(--cds-support-warning)" }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--cds-text-primary)" }}>4.8</span>
              <span className="text-xs" style={{ color: "var(--cds-text-helper)" }}>
                ({course._count.enrollments} alunos)
              </span>
            </div>

            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid var(--cds-border-subtle)" }}
            >
              <div className="flex items-center gap-1 text-sm" style={{ color: "var(--cds-text-secondary)" }}>
                <Users className="h-4 w-4" />
                {course._count.enrollments}
              </div>
              <span
                className="text-base font-semibold"
                style={{ color: "var(--cds-text-primary)" }}
              >
                {course.isFree ? "Acesso livre" : "Em breve"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
