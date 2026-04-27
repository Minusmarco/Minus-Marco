"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  data: {
    _id: string;
    question: string;
    options: string[];
  } | null;
};

export default function CommunityPoll({ data }: Props) {
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
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

  function vote(option: string) {
    if (voted) return;
    setVoted(option);
    localStorage.setItem(`poll-${data!._id}`, option);
  }

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
        {data.options.map((option) => {
          const isVoted = voted === option;
          const hasVoted = !!voted;

          return (
            <motion.button
              key={option}
              onClick={() => vote(option)}
              whileTap={!hasVoted ? { scale: 0.98 } : {}}
              disabled={hasVoted}
              className={[
                "relative w-full rounded-lg border px-5 py-3.5 text-left font-sans text-sm font-medium transition-all duration-300 overflow-hidden",
                isVoted
                  ? "border-accent bg-accent/10 text-accent"
                  : hasVoted
                  ? "border-border text-text-muted cursor-default"
                  : "border-border text-text-secondary hover:border-accent hover:text-accent cursor-pointer",
              ].join(" ")}
            >
              {isVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-accent/5"
                />
              )}
              <span className="relative z-10 flex items-center justify-between">
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
          Vote cast! Thanks for participating.
        </motion.p>
      ) : (
        <p className="text-xs text-text-muted font-sans text-center">Pick your answer above.</p>
      )}
    </div>
  );
}
