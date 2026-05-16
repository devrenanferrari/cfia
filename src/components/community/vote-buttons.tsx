"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

type Vote = { value: number; userId: string };

interface VoteButtonsProps {
  targetId: string;
  targetType: "post" | "comment";
  votes: Vote[];
  userId?: string;
  vertical?: boolean;
}

export function VoteButtons({ targetId, targetType, votes, userId, vertical = true }: VoteButtonsProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const score = votes.reduce((s, v) => s + v.value, 0);
  const myVote = votes.find((v) => v.userId === (userId ?? session?.user?.id))?.value ?? 0;

  const [optimistic, setOptimistic] = useState({ score, myVote });

  async function vote(value: 1 | -1) {
    if (!session) { router.push("/entrar"); return; }

    const prev = optimistic;
    const sameVote = optimistic.myVote === value;
    const newMyVote = sameVote ? 0 : value;
    const delta = newMyVote - optimistic.myVote;
    setOptimistic({ score: optimistic.score + delta, myVote: newMyVote });

    const url =
      targetType === "post"
        ? `/api/community/posts/${targetId}/vote`
        : `/api/community/comments/${targetId}/vote`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    if (!res.ok) setOptimistic(prev);
  }

  const cls = vertical ? "flex flex-col items-center gap-0.5" : "flex items-center gap-1";

  return (
    <div className={cls}>
      <button
        onClick={() => vote(1)}
        aria-label="Upvote"
        className="flex items-center justify-center w-7 h-7 transition-colors rounded hover:bg-[#edf5ff]"
        style={{ color: optimistic.myVote === 1 ? "#0f62fe" : "#8d8d8d" }}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <span
        className="text-xs font-bold font-mono tabular-nums"
        style={{ color: optimistic.score > 0 ? "#0f62fe" : optimistic.score < 0 ? "#da1e28" : "#6f6f6f" }}
      >
        {optimistic.score}
      </span>
      <button
        onClick={() => vote(-1)}
        aria-label="Downvote"
        className="flex items-center justify-center w-7 h-7 transition-colors rounded hover:bg-[#fff1f1]"
        style={{ color: optimistic.myVote === -1 ? "#da1e28" : "#8d8d8d" }}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}
