"use client";

import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { VoteButtons } from "./vote-buttons";

type Author = { id: string; name: string | null; image: string | null };
type Vote = { value: number; userId: string };

export interface PostCardData {
  id: string;
  title: string;
  body: string | null;
  type: string;
  tags: string[];
  createdAt: string;
  author: Author;
  votes: Vote[];
  _count: { comments: number; votes: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function PostCard({ post, currentUserId }: { post: PostCardData; currentUserId?: string }) {
  return (
    <article className="flex gap-3 bg-white border border-[#e0e0e0] hover:border-[#c6c6c6] transition-colors">
      <div className="flex flex-col items-center gap-0 p-2 pt-3 border-r border-[#e0e0e0] bg-[#f4f4f4] min-w-[44px]">
        <VoteButtons
          targetId={post.id}
          targetType="post"
          votes={post.votes}
          userId={currentUserId}
          vertical
        />
      </div>

      <div className="flex-1 p-3 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#8d8d8d" }}>
            {post.author.name ?? "Anônimo"}
          </span>
          <span style={{ color: "#c6c6c6" }}>·</span>
          <span className="text-xs flex items-center gap-1" style={{ color: "#8d8d8d" }}>
            <Clock className="h-3 w-3" /> {timeAgo(post.createdAt)}
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/comunidade/${post.id}`} className="block group">
          <h2
            className="text-base font-semibold leading-snug mb-1 group-hover:underline"
            style={{ color: "#161616" }}
          >
            {post.title}
          </h2>
          {post.body && (
            <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "#525252" }}>
              {post.body}
            </p>
          )}
        </Link>

        <div className="flex items-center gap-3 mt-2.5">
          <Link
            href={`/comunidade/${post.id}`}
            className="flex items-center gap-1.5 text-xs transition-colors hover:text-[#0f62fe]"
            style={{ color: "#8d8d8d" }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {post._count.comments} comentário{post._count.comments !== 1 ? "s" : ""}
          </Link>
        </div>
      </div>
    </article>
  );
}
