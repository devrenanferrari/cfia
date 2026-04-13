"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/course-card";

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

export function CoursesSection({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null;

  return (
    <section className="py-28 px-4" style={{ backgroundColor: "#f8f9fb" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "#0052ff10", color: "#0052ff" }}
            >
              Catálogo
            </span>
            <h2 className="text-4xl font-black" style={{ color: "#06070a", letterSpacing: "-0.03em" }}>
              Cursos em destaque
            </h2>
          </div>
          <Link
            href="/cursos"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:opacity-75 transition-opacity"
            style={{ color: "#0052ff" }}
          >
            Ver todos os cursos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10 sm:hidden"
        >
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #0052ff 0%, #1a6bff 100%)",
              boxShadow: "0 4px 14px rgba(0,82,255,0.35)",
            }}
          >
            Ver todos os cursos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
