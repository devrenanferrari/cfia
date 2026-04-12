import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBunnyVideo } from "@/lib/bunny";
import { prisma } from "@/lib/prisma";

/** POST /api/videos
 * Cria um vídeo no Bunny e retorna { videoId, uploadUrl }
 * O cliente então faz o upload direto para o Bunny
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Apenas instrutores podem fazer upload" }, { status: 403 });
  }

  const { title, lessonId } = await req.json();
  if (!title) return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });

  const video = await createBunnyVideo(title);

  // Atualiza a aula com o videoId se lessonId for fornecido
  if (lessonId) {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoUrl: video.guid },
    });
  }

  return NextResponse.json({
    videoId: video.guid,
    uploadUrl: `https://video.bunnycdn.com/library/${process.env.BUNNY_STREAM_LIBRARY_ID}/videos/${video.guid}`,
    accessKey: process.env.BUNNY_STREAM_API_KEY,
  });
}
