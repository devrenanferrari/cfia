import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Usuários de teste
  const admin = await prisma.user.upsert({
    where: { email: "admin@cfia.com.br" },
    update: {},
    create: {
      email: "admin@cfia.com.br",
      name: "Admin cfia",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instrutor@cfia.com.br" },
    update: {},
    create: {
      email: "instrutor@cfia.com.br",
      name: "Prof. Ana Lima",
      role: "INSTRUCTOR",
      emailVerified: new Date(),
      bio: "Especialista em Machine Learning com 10 anos de experiência.",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "aluno@cfia.com.br" },
    update: {},
    create: {
      email: "aluno@cfia.com.br",
      name: "João Silva",
      role: "STUDENT",
      emailVerified: new Date(),
    },
  });

  // Categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "machine-learning" },
      update: {},
      create: { name: "Machine Learning", slug: "machine-learning", icon: "🤖" },
    }),
    prisma.category.upsert({
      where: { slug: "deep-learning" },
      update: {},
      create: { name: "Deep Learning", slug: "deep-learning", icon: "🧠" },
    }),
    prisma.category.upsert({
      where: { slug: "llms" },
      update: {},
      create: { name: "LLMs & IA Generativa", slug: "llms", icon: "💬" },
    }),
    prisma.category.upsert({
      where: { slug: "python" },
      update: {},
      create: { name: "Python para IA", slug: "python", icon: "🐍" },
    }),
    prisma.category.upsert({
      where: { slug: "visao-computacional" },
      update: {},
      create: { name: "Visão Computacional", slug: "visao-computacional", icon: "👁️" },
    }),
  ]);

  // Curso de exemplo
  const course = await prisma.course.upsert({
    where: { slug: "machine-learning-do-zero" },
    update: {},
    create: {
      title: "Machine Learning do Zero ao Avançado",
      slug: "machine-learning-do-zero",
      description:
        "Aprenda Machine Learning do zero com Python. Cubra regressão, classificação, clustering, redes neurais e muito mais com projetos práticos.",
      level: "BEGINNER",
      isFree: true,
      isPublished: true,
      instructorId: instructor.id,
      categoryId: categories[0].id,
      duration: 480,
    },
  });

  // Módulos e aulas
  const mod1 = await prisma.module.upsert({
    where: { id: "mod-ml-1" },
    update: { title: "Introdução ao ML", order: 1, courseId: course.id },
    create: { id: "mod-ml-1", title: "Introdução ao ML", order: 1, courseId: course.id },
  });

  const mod2 = await prisma.module.upsert({
    where: { id: "mod-ml-2" },
    update: { title: "Algoritmos Supervisionados", order: 2, courseId: course.id },
    create: { id: "mod-ml-2", title: "Algoritmos Supervisionados", order: 2, courseId: course.id },
  });

  const mod3 = await prisma.module.upsert({
    where: { id: "mod-ml-3" },
    update: { title: "Avaliação de Modelos", order: 3, courseId: course.id },
    create: { id: "mod-ml-3", title: "Avaliação de Modelos", order: 3, courseId: course.id },
  });

  const lessons = [
    { id: "les-ml-1", title: "O que é Machine Learning?", order: 1, moduleId: mod1.id, isFree: true, type: "VIDEO", duration: 15 },
    { id: "les-ml-2", title: "Tipos de aprendizado", order: 2, moduleId: mod1.id, isFree: true, type: "VIDEO", duration: 20 },
    { id: "les-ml-3", title: "Configurando o ambiente Python", order: 3, moduleId: mod1.id, isFree: false, type: "TEXT", duration: 10 },
    { id: "les-ml-4", title: "Regressão Linear", order: 1, moduleId: mod2.id, isFree: false, type: "VIDEO", duration: 35 },
    { id: "les-ml-5", title: "Regressão Logística", order: 2, moduleId: mod2.id, isFree: false, type: "VIDEO", duration: 30 },
    { id: "les-ml-6", title: "Árvores de Decisão", order: 3, moduleId: mod2.id, isFree: false, type: "VIDEO", duration: 40 },
    { id: "les-ml-7", title: "Métricas de avaliação", order: 1, moduleId: mod3.id, isFree: false, type: "VIDEO", duration: 25 },
    { id: "les-ml-8", title: "Validação cruzada", order: 2, moduleId: mod3.id, isFree: false, type: "VIDEO", duration: 20 },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lesson,
      create: lesson,
    });
  }

  // Matrícula do aluno no curso
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course.id } },
    update: {},
    create: { userId: student.id, courseId: course.id },
  });

  // Progresso em 2 aulas
  for (const lessonId of ["les-ml-1", "les-ml-2"]) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: student.id, lessonId } },
      update: {},
      create: { userId: student.id, lessonId, completed: true, completedAt: new Date() },
    });
  }

  // Review do aluno
  await prisma.review.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      rating: 5,
      comment: "Curso excelente! Didática clara e exemplos práticos.",
    },
  });

  console.log("✅ Seed concluído!\n");
  console.log("Logins de teste:");
  console.log("  Admin:     admin@cfia.com.br      (role: ADMIN)");
  console.log("  Instrutor: instrutor@cfia.com.br  (role: INSTRUCTOR)");
  console.log("  Aluno:     aluno@cfia.com.br       (role: STUDENT)");
  console.log("\n⚠️  Como o email real não está configurado, use o Prisma Studio");
  console.log("    para criar sessões manualmente: npx prisma studio\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
