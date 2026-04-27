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
  } | null;
};

export default function DebateOfWeek({ data }: Props) {
  const [voted, setVoted] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    if (!data) return;
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

  function vote(side: "A" | "B") {
    if (voted) return;
    setVoted(side);
    localStorage.setItem(`debate-${data!._id}`, side);
  }

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
                  ? "border-border opacity-40 cursor-default"
                  : "border-border hover:border-accent/50 cursor-pointer",
              ].join(" ")}
            >
              <span className={[
                "font-display text-xs font-bold uppercase tracking-widest mb-2",
                isVoted
                  ? side === "A" ? "text-accent" : "text-[#f6b327]"
                  : "text-text-muted",
              ].join(" ")}>
                Side {side}
              </span>
              <span className={[
                "font-display text-base font-bold leading-tight",
                isVoted
                  ? side === "A" ? "text-accent" : "text-[#f6b327]"
                  : isLosing ? "text-text-muted" : "text-text-primary",
              ].join(" ")}>
                {label}
              </span>
              {isVoted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring" }}
                  className="mt-3"
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest opacity-70">
                    Your pick ✓
                  </span>
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
          You&apos;ve picked your side. Bold choice.
        </motion.p>
      ) : (
        <p className="text-xs text-text-muted font-sans text-center">Pick a side — no fence sitting.</p>
      )}
    </div>
  );
}
