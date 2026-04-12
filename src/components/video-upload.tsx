"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, CheckCircle, Film, X } from "lucide-react";

interface VideoUploadProps {
  lessonId: string;
  lessonTitle: string;
  currentVideoId?: string | null;
  onSuccess: (videoId: string) => void;
}

export function VideoUpload({ lessonId, lessonTitle, currentVideoId, onSuccess }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(!!currentVideoId);
  const [videoId, setVideoId] = useState(currentVideoId ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024 * 1024; // 5 GB
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Limite: 5 GB");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // 1. Cria o slot no Bunny e salva o videoId na aula
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lessonTitle, lessonId }),
      });

      if (!res.ok) throw new Error("Erro ao iniciar upload");
      const { videoId: vid, uploadUrl, accessKey } = await res.json();

      // 2. Upload direto do navegador para o Bunny via XHR (permite progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload falhou: ${xhr.status}`));
        });
        xhr.addEventListener("error", () => reject(new Error("Erro de rede")));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("AccessKey", accessKey);
        xhr.send(file);
      });

      setVideoId(vid);
      setDone(true);
      onSuccess(vid);
      toast.success("Vídeo enviado com sucesso! O processamento pode levar alguns minutos.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (done && videoId) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Vídeo enviado</span>
          <span className="text-xs text-green-600 font-mono">{videoId.slice(0, 8)}…</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-green-700 hover:text-green-900 hover:bg-green-100"
          onClick={() => { setDone(false); setVideoId(null); }}
        >
          <X className="h-4 w-4 mr-1" />
          Trocar vídeo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading ? (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Film className="h-4 w-4 animate-pulse text-primary" />
            Enviando vídeo… {progress}%
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Não feche esta aba durante o upload.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">Clique para fazer upload do vídeo</span>
          <span className="text-xs">MP4, MOV, AVI, MKV — até 5 GB</span>
        </button>
      )}
    </div>
  );
}
