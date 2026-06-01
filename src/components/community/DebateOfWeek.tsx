"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  data: {
    _id: string;
    question: string;
    optionA: string;
    optionB: string;
    context?: string;
    votesA?: number;
    votesB?: number;
  } | null;
};

export default function DebateOfWeek({ data }: Props) {
  const [voted, setVoted] = useState<"A" | "B" | null>(null);
  const [counts, setCounts] = useState({
    a: data?.votesA ?? 0,
    b: data?.votesB ?? 0,
  });

  useEffect(() => {
    if (!data) return;
    setCounts({ a: data.votesA ?? 0, b: data.votesB ?? 0 });
    const stored = localStorage.getItem(`debate-${data._id}`);
    if (stored === "A" || stored === "B") setVoted(stored);
  }, [data]);

  if (!data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted font-sans text-sm text-center">Debate of the week coming soon.</p>
      </div>
    );
  }

  async function vote(side: "A" | "B") {
    if (voted || !data) return;
    setVoted(side);
    localStorage.setItem(`debate-${data._id}`, side);
    // Optimistically reflect the vote so percentages appear instantly.
    setCounts((c) => ({
      a: c.a + (side === "A" ? 1 : 0),
      b: c.b + (side === "B" ? 1 : 0),
    }));
    try {
      const res = await fetch("/api/debate/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data._id, side }),
      });
      if (res.ok) {
        const json = await res.json();
        setCounts({ a: json.votesA ?? 0, b: json.votesB ?? 0 });
      }
    } catch {
      // Keep the optimistic count if the request fails.
    }
  }

  const total = counts.a + counts.b;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 flex flex-col gap-6 h-full">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-6 bg-[#f6b327]" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#f6b327]">Debate of the Week</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary leading-snug">
          {data.question}
        </h3>
        {data.context && (
          <p className="mt-2 text-sm text-text-muted leading-relaxed">{data.context}</p>
        )}
      </div>

      {/* VS cards */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {(["A", "B"] as const).map((side) => {
          const label = side === "A" ? data.optionA : data.optionB;
          const isVoted = voted === side;
          const hasVoted = !!voted;
          const isLosing = hasVoted && !isVoted;
          const percentage = pct(side === "A" ? counts.a : counts.b);

          return (
            <motion.button
              key={side}
              onClick={() => vote(side)}
              whileTap={!hasVoted ? { scale: 0.97 } : {}}
              disabled={hasVoted}
              className={[
                "relative flex flex-col items-center justify-center rounded-lg border p-5 text-center transition-all duration-300 overflow-hidden min-h-[120px]",
                isVoted
                  ? side === "A"
                    ? "border-accent bg-accent/10"
                    : "border-[#f6b327] bg-[#f6b327]/10"
                  : isLosing
                  ? "border-border opacity-60 cursor-default"
                  : "border-border hover:border-accent/50 cursor-pointer",
              ].join(" ")}
            >
              {/* Result bar fill — grows from the bottom to show the share */}
              {hasVoted && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className={[
                    "absolute bottom-0 left-0 right-0 pointer-events-none",
                    side === "A" ? "bg-accent/10" : "bg-[#f6b327]/10",
                  ].join(" ")}
                />
              )}

              <span className={[
                "relative font-display text-xs font-bold uppercase tracking-widest mb-2",
                isVoted
                  ? side === "A" ? "text-accent" : "text-[#f6b327]"
                  : "text-text-muted",
              ].join(" ")}>
                Side {side}
              </span>
              <span className={[
                "relative font-display text-base font-bold leading-tight",
                isVoted
                  ? side === "A" ? "text-accent" : "text-[#f6b327]"
                  : isLosing ? "text-text-secondary" : "text-text-primary",
              ].join(" ")}>
                {label}
              </span>

              {hasVoted && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative mt-3 flex flex-col items-center"
                >
                  <span className={[
                    "font-display text-2xl font-bold leading-none",
                    side === "A" ? "text-accent" : "text-[#f6b327]",
                  ].join(" ")}>
                    {percentage}%
                  </span>
                  {isVoted && (
                    <span className="mt-1 font-display text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Your pick ✓
                    </span>
                  )}
                </motion.div>
              )}
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
            ? `${total.toLocaleString()} ${total === 1 ? "vote" : "votes"} so far — bold choice.`
            : "You've picked your side. Bold choice."}
        </motion.p>
      ) : (
        <p className="text-xs text-text-muted font-sans text-center">Pick a side — no fence sitting.</p>
      )}
    </div>
  );
}
