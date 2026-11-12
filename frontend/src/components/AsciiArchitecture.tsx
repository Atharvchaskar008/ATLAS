import React, { useState, useEffect } from 'react';

/**
 * Architectural Building Elevation View
 * High-precision CAD blueprint rendering for ATLAS
 */
const BUILDING_FRAMES = [
  // Frame 1: Tiered High-Rise Elevation
  `
               ▲
              ┌┴┐
             ┌┴─┴┐
             │ █ │
            ┌┴───┴┐
            │ █ █ │
           ┌┴─────┴┐
           │ █ █ █ │
          ┌┴───────┴┐
          │ █ █ █ █ │
          │ █ █ █ █ │
         ┌┴─────────┴┐
         │ █ █ █ █ █ │
         │ █ █ █ █ █ │
         │ █ █ █ █ █ │
        ┌┴───────────┴┐
        │ █ █ █ █ █ █ │
        │ █ █ █ █ █ █ │
        │ █ █ █ █ █ █ │
       ┌┴─────────────┴┐
       │ █ █ █ █ █ █ █ │
       │ █ █ █ █ █ █ █ │
      ┌┴───────────────┴┐
      │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓│
      │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓│
  ════╧═════════════════╧════
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░
`,
  // Frame 2: Stepped Architectural Silhouette
  `
                ▲
               ┌─┐
              ┌┴─┴┐
              │ █ │
             ┌┴───┴┐
             │ █ █ │
            ┌┴─────┴┐
            │ █ █ █ │
           ┌┴───────┴┐
           │ █ █ █ █ │
          ┌┴─────────┴┐
          │ █ █ █ █ █ │
          │ █ █ █ █ █ │
         ┌┴───────────┴┐
         │ █ █ █ █ █ █ │
         │ █ █ █ █ █ █ │
        ┌┴─────────────┴┐
        │ █ █ █ █ █ █ █ │
        │ █ █ █ █ █ █ █ │
       ┌┴───────────────┴┐
       │ █ █ █ █ █ █ █ █ │
       │ █ █ █ █ █ █ █ █ │
      ┌┴─────────────────┴┐
      │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ │
      │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ │
  ════╧═══════════════════╧════
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
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
    <div className="relative group max-w-[380px] w-full mx-auto select-none">
      {/* Terminal Container - Locked proportions, never stretched */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)] transition-all duration-300 p-5 shadow-sm overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--line)]">
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
        <div className="relative flex justify-center py-1 overflow-hidden">
          <pre className="font-mono text-[10px] sm:text-[11px] leading-[1.12] text-[var(--ink)] tracking-wider whitespace-pre selection:bg-[var(--ink)] selection:text-[var(--canvas)] transition-opacity duration-300 opacity-95">
            {BUILDING_FRAMES[frameIndex]}
          </pre>
        </div>

        {/* Minimal Blueprint Footer */}
        <div className="pt-3 mt-1 border-t border-[var(--line)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)]">
          <span>COORDS: 18.969°N 72.842°E</span>
          <span className="text-[var(--ink-secondary)]">SCALE • METRIC</span>
        </div>
      </div>
    </div>
  );
};

export default AsciiArchitecture;
