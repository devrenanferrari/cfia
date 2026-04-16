export function getPrismaErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return null;

  const message = error.message.toLowerCase();

  if (
    message.includes("does not exist") ||
    message.includes("no such table") ||
    message.includes("column") ||
    message.includes("relation") ||
    message.includes("quiz") ||
    message.includes("questionresponse") ||
    message.includes("quizattempt")
  ) {
    return "O banco ainda não foi sincronizado com o módulo de quizzes. Rode `npx prisma db push` ou a migration antes de usar esta área.";
  }

  return null;
}
