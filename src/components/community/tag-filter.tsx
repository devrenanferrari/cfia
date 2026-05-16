"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TAGS = [
  "IA", "Python", "Machine Learning", "Deep Learning",
  "NLP", "Visão Computacional", "Dados", "Carreira",
];

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("tag");

  function selectTag(tag: string) {
    if (active === tag) {
      router.push("/comunidade");
    } else {
      router.push(`/comunidade?tag=${encodeURIComponent(tag)}`);
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => selectTag(tag)}
          className="px-3 h-7 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap shrink-0"
          style={
            active === tag
              ? { backgroundColor: "#0f62fe", color: "#ffffff", borderColor: "#0f62fe" }
              : { backgroundColor: "#ffffff", color: "#525252", borderColor: "#e0e0e0" }
          }
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
