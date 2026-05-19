"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export function MarkdownRenderer({ content, compact = false }: { content: string; compact?: boolean }) {
  return (
    <div className={`prose-community ${compact ? "compact" : ""}`}>
      <style>{`
        .prose-community { color: #393939; font-size: 14px; line-height: 1.7; }
        .prose-community p { margin: 0 0 0.75em; }
        .prose-community p:last-child { margin-bottom: 0; }
        .prose-community h1,.prose-community h2,.prose-community h3 {
          color: #161616; font-weight: 700; margin: 1em 0 0.5em; line-height: 1.3;
        }
        .prose-community h1 { font-size: 1.25em; }
        .prose-community h2 { font-size: 1.1em; }
        .prose-community h3 { font-size: 1em; }
        .prose-community ul,.prose-community ol { padding-left: 1.4em; margin: 0.5em 0; }
        .prose-community li { margin: 0.25em 0; }
        .prose-community code:not(pre code) {
          background: #f4f4f4; border: 1px solid #e0e0e0;
          padding: 0.1em 0.4em; border-radius: 3px;
          font-family: var(--font-mono, monospace); font-size: 0.85em; color: #da1e28;
        }
        .prose-community pre {
          background: #161616; border-radius: 0; padding: 1em 1.25em;
          overflow-x: auto; margin: 0.75em 0; border-left: 3px solid #0f62fe;
        }
        .prose-community pre code {
          background: transparent; border: none; padding: 0;
          color: #f4f4f4; font-size: 0.82em; font-family: var(--font-mono, monospace);
        }
        .prose-community blockquote {
          border-left: 3px solid #0f62fe; margin: 0.75em 0;
          padding: 0.5em 1em; background: #f0f7ff; color: #525252;
        }
        .prose-community a { color: #0f62fe; text-decoration: underline; }
        .prose-community a:hover { color: #0353e9; }
        .prose-community hr { border: none; border-top: 1px solid #e0e0e0; margin: 1em 0; }
        .prose-community table { border-collapse: collapse; width: 100%; font-size: 0.85em; margin: 0.75em 0; }
        .prose-community th { background: #f4f4f4; font-weight: 700; color: #161616; }
        .prose-community th,.prose-community td { border: 1px solid #e0e0e0; padding: 0.5em 0.75em; text-align: left; }
        .prose-community.compact p { margin-bottom: 0.4em; }
        .prose-community.compact pre { padding: 0.6em 1em; }
        .hljs { background: transparent !important; }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
