import React, { useState, useEffect } from 'react';
import { CornerCrosses } from './CornerCrosses';

// Pure architectural building elevation / structural CAD drawings
// Zero marketing text - pure structural blueprint representation of prime real estate
const BUILDING_FRAMES = [
  // Frame 1: High-rise architectural tower with structural facade
`
                     ▲
                    ┌┼┐
                    │││
                   ┌┘│└┐
                  ┌┘ │ └┐
                  │  │  │
                 ┌┴──┼──┴┐
                 │ █ │ █ │
                 │ █ │ █ │
                ┌┴───┼───┴┐
                │ █  │  █ │
                │ █  │  █ │
               ┌┴────┼────┴┐
               │ █ █ │ █ █ │
               │ █ █ │ █ █ │
               │ █ █ │ █ █ │
              ┌┴─────┼─────┴┐
              │ █ █ █│█ █ █ │
              │ █ █ █│█ █ █ │
              │ █ █ █│█ █ █ │
              │ █ █ █│█ █ █ │
             ┌┴──────┼──────┴┐
             │ █ █ █ │ █ █ █ │
             │ █ █ █ │ █ █ █ │
             │ █ █ █ │ █ █ █ │
             │ █ █ █ │ █ █ █ │
            ┌┴───────┼───────┴┐
            │ █ █ █ █│█ █ █ █ │
            │ █ █ █ █│█ █ █ █ │
            │ █ █ █ █│█ █ █ █ │
           ┌┴────────┼────────┴┐
           │ █ █ █ █ │ █ █ █ █ │
           │ █ █ █ █ │ █ █ █ █ │
          ┌┴─────────┼─────────┴┐
          │ ▓ ▓ ▓ ▓ ▓│▓ ▓ ▓ ▓ ▓ │
          │ ▓ ▓ ▓ ▓ ▓│▓ ▓ ▓ ▓ ▓ │
      ════╧══════════╧══════════╧════
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`,
  // Frame 2: Structural load-bearing CAD scan with cross-bracing
`
                     ▲
                    ┌┼┐
                    │││
                   ┌┘│└┐
                  ┌┘ │ └┐
                  │ ╳│╳ │
                 ┌┴──┼──┴┐
                 │ ╳ │ ╳ │
                 │ ╳ │ ╳ │
                ┌┴───┼───┴┐
                │ ╳  │  ╳ │
                │ ╳  │  ╳ │
               ┌┴────┼────┴┐
               │ ╳ ╳ │ ╳ ╳ │
               │ ╳ ╳ │ ╳ ╳ │
               │ ╳ ╳ │ ╳ ╳ │
              ┌┴─────┼─────┴┐
              │ ╳ ╳ ╳│╳ ╳ ╳ │
              │ ╳ ╳ ╳│╳ ╳ ╳ │
              │ ╳ ╳ ╳│╳ ╳ ╳ │
              │ ╳ ╳ ╳│╳ ╳ ╳ │
             ┌┴──────┼──────┴┐
             │ ╳ ╳ ╳ │ ╳ ╳ ╳ │
             │ ╳ ╳ ╳ │ ╳ ╳ ╳ │
             │ ╳ ╳ ╳ │ ╳ ╳ ╳ │
             │ ╳ ╳ ╳ │ ╳ ╳ ╳ │
            ┌┴───────┼───────┴┐
            │ ╳ ╳ ╳ ╳│╳ ╳ ╳ ╳ │
            │ ╳ ╳ ╳ ╳│╳ ╳ ╳ ╳ │
            │ ╳ ╳ ╳ ╳│╳ ╳ ╳ ╳ │
           ┌┴────────┼────────┴┐
           │ ╳ ╳ ╳ ╳ │ ╳ ╳ ╳ ╳ │
           │ ╳ ╳ ╳ ╳ │ ╳ ╳ ╳ ╳ │
          ┌┴─────────┼─────────┴┐
          │ ▓ ▓ ▓ ▓ ▓│▓ ▓ ▓ ▓ ▓ │
          │ ▓ ▓ ▓ ▓ ▓│▓ ▓ ▓ ▓ ▓ │
      ════╧══════════╧══════════╧════
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`,
  // Frame 3: Contemporary stepped isometric facade
`
                     ▲
                    ┌┴┐
                   ┌┘ └┐
                  ┌┘   └┐
                 ┌┘  █  └┐
                ┌┴───────┴┐
                │ █ █ █ █ │
                │ █ █ █ █ │
               ┌┴─────────┴┐
               │ █ █ █ █ █ │
               │ █ █ █ █ █ │
              ┌┴───────────┴┐
              │ █ █ █ █ █ █ │
              │ █ █ █ █ █ █ │
              │ █ █ █ █ █ █ │
             ┌┴─────────────┴┐
             │ █ █ █ █ █ █ █ │
             │ █ █ █ █ █ █ █ │
             │ █ █ █ █ █ █ █ │
            ┌┴───────────────┴┐
            │ █ █ █ █ █ █ █ █ │
            │ █ █ █ █ █ █ █ █ │
            │ █ █ █ █ █ █ █ █ │
           ┌┴─────────────────┴┐
           │ █ █ █ █ █ █ █ █ █ │
           │ █ █ █ █ █ █ █ █ █ │
          ┌┴───────────────────┴┐
          │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓│
          │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓│
      ════╧═════════════════════╧════
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`
];

export const AsciiArchitecture: React.FC = () => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % BUILDING_FRAMES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative has-crosses group">
      {/* Architectural Corner Crosses */}
      <CornerCrosses />

      {/* Terminal Container */}
      <div className="relative rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)] transition-all duration-300 p-5 sm:p-6 shadow-sm overflow-hidden select-none">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[var(--ink)] opacity-80" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--ink-secondary)]">
              STRUCTURAL ELEVATION // 1:500
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[10px] font-mono text-[var(--ink-muted)]">
            <span className="hidden sm:inline">CAD REV 4.2</span>
            <span className="px-1.5 py-0.5 rounded border border-[var(--line)]">
              AXIS Z+
            </span>
          </div>
        </div>

        {/* ASCII Drawing Canvas */}
        <div className="relative flex justify-center py-2 overflow-x-auto scrollbar-none">
          <pre className="font-mono text-[10px] sm:text-xs leading-[1.12] text-[var(--ink)] tracking-wider whitespace-pre selection:bg-[var(--ink)] selection:text-[var(--canvas)] transition-opacity duration-300 opacity-95 group-hover:opacity-100">
            {BUILDING_FRAMES[frameIndex]}
          </pre>
        </div>

        {/* Minimal Blueprint Footer */}
        <div className="pt-3 mt-2 border-t border-[var(--line)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)]">
          <span>COORDS: 18.969°N 72.842°E</span>
          <span className="text-[var(--ink-secondary)]">SCALE • METRIC</span>
        </div>
      </div>
    </div>
  );
};

export default AsciiArchitecture;
