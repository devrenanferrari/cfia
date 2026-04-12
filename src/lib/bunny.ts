const API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const HOSTNAME = process.env.BUNNY_STREAM_HOSTNAME!;

const BASE = `https://video.bunnycdn.com/library/${LIBRARY_ID}`;
const HEADERS = {
  AccessKey: API_KEY,
  "Content-Type": "application/json",
};

/** Cria um vídeo no Bunny e retorna o videoId + upload URL */
export async function createBunnyVideo(title: string) {
  const res = await fetch(`${BASE}/videos`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Falha ao criar vídeo no Bunny");
  return res.json() as Promise<{ guid: string; title: string }>;
}

/** Retorna a URL do player embed do Bunny */
export function getBunnyEmbedUrl(videoId: string) {
  return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=false&responsive=true`;
}

/** Retorna a URL HLS direta (para players customizados) */
export function getBunnyHlsUrl(videoId: string) {
  return `https://${HOSTNAME}/${videoId}/playlist.m3u8`;
}

/** Retorna a URL do thumbnail */
export function getBunnyThumbnail(videoId: string) {
  return `https://${HOSTNAME}/${videoId}/thumbnail.jpg`;
}

/** Deleta um vídeo do Bunny */
export async function deleteBunnyVideo(videoId: string) {
  await fetch(`${BASE}/videos/${videoId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
}
