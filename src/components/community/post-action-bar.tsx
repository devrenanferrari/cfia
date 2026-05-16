"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, MessageSquare } from "lucide-react";

interface PostActionBarProps {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
}

export function PostActionBar({ postId, initialLiked, initialLikes }: PostActionBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  async function toggleLike() {
    if (!session) { router.push("/entrar"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => newLiked ? prev + 1 : Math.max(0, prev - 1));
    await fetch(`/api/community/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 1 }),
    });
  }

  function scrollToComments() {
    document.querySelector("textarea")?.focus();
  }

  return (
    <div className="flex items-center border-t border-[#e0e0e0] px-2">
      <button
        onClick={toggleLike}
        className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-medium transition-colors hover:bg-[#f4f4f4]"
        style={{ color: liked ? "#0f62fe" : "#525252" }}
      >
        <Heart
          className="h-4 w-4"
          style={{ fill: liked ? "#0f62fe" : "none", color: liked ? "#0f62fe" : "#525252" }}
        />
        Curtir{likes > 0 ? ` · ${likes}` : ""}
      </button>

      <button
        onClick={scrollToComments}
        className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-medium transition-colors hover:bg-[#f4f4f4]"
        style={{ color: "#525252" }}
      >
        <MessageSquare className="h-4 w-4" />
        Comentar
      </button>
    </div>
  );
}
