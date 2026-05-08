"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> Scanning repositories for javascript...",
  "> Filtering by beginner-friendly issues...",
  "> Found 6 perfect matches for you ✓",
];

const TYPING_SPEED = 38;
const PAUSE_AFTER_LINE = 400;
const LOOP_PAUSE = 3000;

type LineState = { text: string; done: boolean; green?: boolean };

export default function TerminalAnimation() {
  const [lines, setLines] = useState<LineState[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    async function run() {
      while (!cancelled) {
        setLines([]);
        setShowCursor(true);

        for (let i = 0; i < LINES.length; i++) {
          const fullText = LINES[i];
          const isGreen = i === 2;

          for (let j = 1; j <= fullText.length; j++) {
            if (cancelled) return;
            setLines((prev) => {
              const next = [...prev];
              next[i] = { text: fullText.slice(0, j), done: false, green: isGreen };
              return next;
            });
            await sleep(TYPING_SPEED);
          }

          await sleep(PAUSE_AFTER_LINE);

          if (i < 2) {
            setLines((prev) => {
              const next = [...prev];
              next[i] = { text: fullText + " ✓", done: true, green: false };
              return next;
            });
            await sleep(200);
          }
        }

        await sleep(LOOP_PAUSE);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Window chrome */}
      <div className="bg-[#111111] rounded-xl border border-[#27272a] overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a] bg-[#161616]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-[#52525b] font-mono">
            mergly ~ bash
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-5 font-mono text-sm min-h-[140px] space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              {line.done ? (
                <span className="text-[#22c55e]">{line.text}</span>
              ) : (
                <span className={line.green ? "text-[#22c55e]" : "text-[#a1a1aa]"}>
                  {line.text}
                </span>
              )}
            </div>
          ))}
          {showCursor && lines.length >= LINES.length && (
            <div className="flex items-center">
              <span className="text-[#a1a1aa]">{">"} </span>
              <span className="cursor-blink ml-1 inline-block w-2 h-4 bg-[#22c55e] rounded-sm" />
            </div>
          )}
          {lines.length === 0 && (
            <div className="flex items-center">
              <span className="text-[#a1a1aa]">{">"} </span>
              <span className="cursor-blink ml-1 inline-block w-2 h-4 bg-[#22c55e] rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
