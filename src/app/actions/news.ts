"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNews(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  // create a slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  await prisma.news.create({
    data: {
      title,
      slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
      summary,
      content,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/home");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function deleteNews(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.news.delete({
    where: { id },
  });

  revalidatePath("/home");
  revalidatePath("/admin/noticias");
}
