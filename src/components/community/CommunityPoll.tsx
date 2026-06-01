"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  data: {
    _id: string;
    question: string;
    options: string[];
    votes?: number[];
  } | null;
};

// Pad/trim a votes array so it always lines up with the options length.
function align(votes: number[] | undefined, len: number): number[] {
  const out = new Array(len).fill(0);
  if (votes) for (let i = 0; i < len; i++) out[i] = votes[i] ?? 0;
  return out;
}

export default function CommunityPoll({ data }: Props) {
  const [voted, setVoted] = useState<string | null>(null);
  const [counts, setCounts] = useState<number[]>(
    align(data?.votes, data?.options.length ?? 0),
  );

  useEffect(() => {
    if (!data) return;
    setCounts(align(data.votes, data.options.length));
    const stored = localStorage.getItem(`poll-${data._id}`);
    if (stored) setVoted(stored);
  }, [data]);

  if (!data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted font-sans text-sm text-center">Poll coming soon.</p>
      </div>
    );
  }

  async function vote(option: string, index: number) {
    if (voted || !data) return;
    setVoted(option);
    localStorage.setItem(`poll-${data._id}`, option);
    // Optimistically reflect the vote so results appear instantly.
    setCounts((c) => c.map((n, i) => (i === index ? n + 1 : n)));
    try {
      const res = await fetch("/api/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data._id, option: index }),
      });
      if (res.ok) {
        const json = await res.json();
        setCounts(align(json.votes, data.options.length));
      }
    } catch {
      // Keep the optimistic count if the request fails.
    }
  }

  const total = counts.reduce((a, b) => a + b, 0);
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 flex flex-col gap-6 h-full">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-6 bg-accent" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Community Poll</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary leading-snug">
          {data.question}
        </h3>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {data.options.map((option, index) => {
          const isVoted = voted === option;
          const hasVoted = !!voted;
          const percentage = pct(counts[index] ?? 0);

          return (
            <motion.button
              key={option}
              onClick={() => vote(option, index)}
              whileTap={!hasVoted ? { scale: 0.98 } : {}}
              disabled={hasVoted}
              className={[
                "relative w-full rounded-lg border px-5 py-3.5 text-left font-sans text-sm font-medium transition-all duration-300 overflow-hidden",
                isVoted
                  ? "border-accent bg-accent/10 text-accent"
                  : hasVoted
                  ? "border-border text-text-secondary cursor-default"
                  : "border-border text-text-secondary hover:border-accent hover:text-accent cursor-pointer",
              ].join(" ")}
            >
              {/* Result bar — width reflects this option's share of the vote */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className={[
                    "absolute inset-y-0 left-0 pointer-events-none",
                    isVoted ? "bg-accent/15" : "bg-text-muted/10",
                  ].join(" ")}
                />
              )}
              <span className="relative z-10 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  {option}
                  {isVoted && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </span>
                {hasVoted && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={[
                      "font-display font-bold tabular-nums",
                      isVoted ? "text-accent" : "text-text-muted",
                    ].join(" ")}
                  >
                    {percentage}%
                  </motion.span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {voted ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-text-muted font-sans text-center"
        >
          {total > 0
            ? `${total.toLocaleString()} ${total === 1 ? "vote" : "votes"} cast — thanks for participating.`
            : "Vote cast! Thanks for participating."}
        </motion.p>
      ) : (
        <p className="text-xs text-text-muted font-sans text-center">Pick your answer above.</p>
      )}
    </div>
  );
}
