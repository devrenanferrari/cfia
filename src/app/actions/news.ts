"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createNews(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const category = formData.get("category") as string;
  const published = formData.get("published") === "on";

  const slug = slugify(title);

  await prisma.news.create({
    data: {
      title,
      slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
      summary,
      content,
      imageUrl: imageUrl || null,
      category: category || null,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/home");
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
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
