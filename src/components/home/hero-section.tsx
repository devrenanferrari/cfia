"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, Brain, Code2, BarChart3, Cpu, Users, Award, BookOpen, Zap } from "lucide-react";

const floatingCards = [
  {
    icon: Brain,
    title: "Machine Learning",
    subtitle: "Módulo 3 · 24 aulas",
    progress: 68,
    color: "#0052ff",
    delay: 0,
  },
  {
    icon: Code2,
    title: "LLMs na Prática",
    subtitle: "Módulo 1 · 18 aulas",
    progress: 32,
    color: "#7c3aed",
    delay: 0.15,
  },
  {
    icon: BarChart3,
    title: "Deep Learning",
    subtitle: "Módulo 5 · 31 aulas",
    progress: 85,
    color: "#059669",
    delay: 0.3,
  },
];

function FloatingCard({
  icon: Icon, title, subtitle, progress, color, delay,
}: (typeof floatingCards)[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 + delay, ease: "easeOut" }}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite`, willChange: "transform" }}
      className="relative rounded-2xl p-4 w-48 shrink-0"
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      />
      <div className="relative z-10">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}25` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <p className="text-white text-sm font-semibold mb-0.5">{title}</p>
        <p className="text-white/50 text-xs mb-3">{subtitle}</p>
        <div className="h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
        <p className="text-white/40 text-xs mt-1.5">{progress}% concluído</p>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center px-4 pt-24 pb-20 min-h-[94vh]"
      style={{ backgroundColor: "#06070a" }}
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: "-20%",
            left: "-15%",
            background: "radial-gradient(circle, rgba(0,82,255,0.28) 0%, transparent 65%)",
            filter: "blur(60px)",
            animation: "orb1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "5%",
            right: "-12%",
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 65%)",
            filter: "blur(60px)",
            animation: "orb2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            left: "35%",
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 65%)",
            filter: "blur(70px)",
            animation: "orb3 22s ease-in-out infinite",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "#0052ff" }} />
        <span className="text-white/70 text-xs font-medium">Plataforma #1 de IA do Brasil</span>
        <div className="flex items-center gap-0.5 ml-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </motion.div>

      {/* Headline */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-black tracking-tight leading-[1.02] mb-0"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "-0.03em" }}
        >
          <span className="text-white block">Domine a</span>
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #4d90ff 0%, #a78bfa 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Inteligência
          </span>
          <span className="text-white block">Artificial</span>
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative z-10 text-center max-w-lg mx-auto mb-10 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}
      >
        Cursos práticos, projetos reais e certificados reconhecidos pelo mercado. Aprenda com os melhores especialistas.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 flex flex-col sm:flex-row items-center gap-3 mb-16"
      >
        <Link
          href="/cadastro"
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #0052ff 0%, #1a6bff 100%)",
            boxShadow: "0 0 30px rgba(0,82,255,0.5), 0 4px 14px rgba(0,82,255,0.35)",
          }}
        >
          Começar grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/cursos"
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
          style={{
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Play className="h-4 w-4" />
          Ver cursos
        </Link>
      </motion.div>

      {/* Social proof pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 flex items-center gap-3 mb-12"
      >
        <div className="flex -space-x-2">
          {["#0052ff", "#7c3aed", "#059669", "#d97706", "#dc2626"].map((color, i) => (
            <div
              key={i}
              className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: color, borderColor: "#06070a" }}
            >
              {["A", "P", "M", "L", "R"][i]}
            </div>
          ))}
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          <span className="text-white font-semibold">+10.000</span> alunos já aprendendo
        </p>
      </motion.div>

      {/* Floating course cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="relative z-10 flex flex-wrap justify-center gap-4 max-w-3xl"
      >
        {floatingCards.map((card) => (
          <FloatingCard key={card.title} {...card} />
        ))}
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #06070a)" }}
      />
    </section>
  );
}

// Stats bar
export function StatsBar({ totalCourses, totalStudents }: { totalCourses: number; totalStudents: number }) {
  const stats = [
    { value: `${totalCourses}+`, label: "Cursos disponíveis", icon: BookOpen, color: "#0052ff" },
    {
      value: `${(totalStudents || 0) > 1000 ? `${Math.floor(totalStudents / 1000)}k` : totalStudents || "500"}+`,
      label: "Alunos ativos",
      icon: Users,
      color: "#7c3aed",
    },
    { value: "200h+", label: "Horas de conteúdo", icon: Zap, color: "#059669" },
    { value: "4.9★", label: "Avaliação média", icon: Award, color: "#d97706" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0c0d11",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.05]">
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-8 px-6 text-center flex flex-col items-center"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div
                className="text-2xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bento feature grid
const bentoItems = [
  {
    icon: Brain,
    title: "Machine Learning & Deep Learning",
    desc: "Do zero ao estado da arte. Redes neurais, transformers, difusion models e muito mais.",
    color: "#0052ff",
    large: true,
  },
  {
    icon: Cpu,
    title: "LLMs e IA Generativa",
    desc: "GPT, Claude, Llama — aprenda a construir aplicações com os modelos mais avançados.",
    color: "#7c3aed",
    large: false,
  },
  {
    icon: BarChart3,
    title: "Visão Computacional",
    desc: "YOLO, ViT, detecção e segmentação de imagens em produção.",
    color: "#059669",
    large: false,
  },
  {
    icon: Code2,
    title: "MLOps & Deploy",
    desc: "Leve seus modelos para produção com Docker, Kubernetes e pipelines automatizados.",
    color: "#d97706",
    large: false,
  },
];

export function BentoSection() {
  return (
    <section className="py-28 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "#0052ff10", color: "#0052ff" }}
          >
            O que você vai aprender
          </span>
          <h2 className="text-4xl font-black mb-4" style={{ color: "#06070a", letterSpacing: "-0.03em" }}>
            Tudo que o mercado de IA exige
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Currículo atualizado constantemente por especialistas que trabalham com IA no dia a dia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 rounded-3xl p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #0047e1 0%, #0052ff 50%, #1a6bff 100%)",
              boxShadow: "0 20px 60px rgba(0,82,255,0.3)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 75% 40%, rgba(255,255,255,0.12) 0%, transparent 55%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5 backdrop-blur-sm">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Machine Learning & Deep Learning</h3>
              <p className="text-white/65 max-w-sm leading-relaxed">
                Do zero ao estado da arte. Redes neurais, transformers, difusion models e muito mais.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-3 mt-6">
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
              >
                12 cursos
              </span>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
              >
                120h+ de conteúdo
              </span>
            </div>
          </motion.div>

          {/* Small cards */}
          <div className="flex flex-col gap-4">
            {bentoItems.slice(1).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + (i + 1) * 0.1 }}
                className="rounded-3xl p-6 border flex-1 hover:shadow-md transition-all duration-300"
                style={{ backgroundColor: "#fafafa", borderColor: "#f0f0f0" }}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: "#0a0b0d" }}>{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
