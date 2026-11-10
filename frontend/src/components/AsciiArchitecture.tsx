import React, { useState, useEffect } from 'react';

// ASCII architectural blueprints representing the property valuation engine
const ASCII_FRAMES = [
`
  ┌──────────────────────────────────────────────────┐
  │  ATLAS VALUATION ENGINE // SPATIAL MATRIX        │
  │  LOC: 18.674° N, 73.844° E  •  ELEV: +582m        │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │             ▲ [PENTHOUSE LEVEL 22]               │
  │            /│\\                                  │
  │           / │ \\                                 │
  │          /  │  \\    ─── [TERRACE RESIDENCE]      │
  │         ┌───┼───┐                                │
  │         │ █ │ █ │    ▲                           │
  │         │ █ │ █ │   /│\\  ─── [RESIDENTIAL CORE] │
  │         ├───┼───┤  ┌─┼─┐                         │
  │         │ █ │ █ │  │█│█│                         │
  │         │ █ │ █ │  │█│█│    ─── [CARPET: 1200sf] │
  │         ├───┼───┤  ├─┼─┤                         │
  │         │ █ │ █ │  │█│█│                         │
  │         ├───┼───┤  ├─┼─┤                         │
  │  ═══════╧═══╧═══╧══╧═╧═╧══════════ [PARKING]     │
  │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │
  │   ▲ CIRCLE RATE ANCHOR: IGR ASR 2024-2026        │
  │   ▲ HEDONIC REGRESSION: REAL DEED MATCH (3.5k)   │
  └──────────────────────────────────────────────────┘
`,
`
  ┌──────────────────────────────────────────────────┐
  │  ATLAS VALUATION ENGINE // GEOMETRIC SCAN        │
  │  RADIAL POI: TRANSIT 0.69km • JOBS 4.4km         │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │              ▲                                   │
  │             /║\\      ─── [ZONING: RESIDENTIAL]   │
  │            //║\\\\                                 │
  │           // ║ \\\\    ─── [UDCPR COMPLIANT FSI]   │
  │         ┌═══╦═╦═══┐                              │
  │         │ █ ║ ║ █ │    ▲                         │
  │         │ █ ║ ║ █ │   /║\\   ─── [STAMP DUTY: 6%] │
  │         ├───╫─╫───┤  ┌═╬═┐                       │
  │         │ █ ║ ║ █ │  │█║█│                       │
  │         │ █ ║ ║ █ │  │█║█│   ─── [ASSET ID: #502]│
  │         ├───╫─╫───┤  ├─╫─┤                       │
  │         │ █ ║ ║ █ │  │█║█│                       │
  │         ├───╫─╫───┤  ├─╫─┤                       │
  │  ═══════╧═══╩═╩═══╧══╧═╩═╧══════════ [PODIUM]    │
  │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │
  │   ▲ CONFIDENCE INTERVAL: 85% VERIFIED PARITY     │
  │   ▲ DEPRECIATION CURVE: 16-YR STRUCTURAL RESIDUAL│
  └──────────────────────────────────────────────────┘
`,
`
  ┌──────────────────────────────────────────────────┐
  │  ATLAS VALUATION ENGINE // REGISTERED PARITY     │
  │  STATE: MAHARASHTRA • 36 DISTRICTS ACTIVE        │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │             ▲                                    │
  │            / \\       ─── [FAIR MARKET VALUE]     │
  │           /   \\                                  │
  │          /     \\     ─── [NO SPECULATIVE MARKUP] │
  │         ┌───────┐                                │
  │         │ ▓ ▓ ▓ │    ▲                           │
  │         │ ▓ ▓ ▓ │   / \\   ─── [TRANSIT CORRIDOR] │
  │         ├───────┤  ┌───┐                         │
  │         │ ▓ ▓ ▓ │  │▓ ▓│                         │
  │         │ ▓ ▓ ▓ │  │▓ ▓│    ─── [LTV 80% READY]  │
  │         ├───────┤  ├───┤                         │
  │         │ ▓ ▓ ▓ │  │▓ ▓│                         │
  │         ├───────┤  ├───┤                         │
  │  ═══════╧═══════╧══╧═══╧══════════ [FOUNDATION]  │
  │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │
  │   ▲ ZERO LISTING MARKUP: TRUE TRANSACTED DEED    │
  │   ▲ BANK APPRAISAL SPECIFICATION MEMORANDUM      │
  └──────────────────────────────────────────────────┘
`
];

export const AsciiArchitecture: React.FC = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [ticker, setTicker] = useState('CALIBRATING SATELLITE RADAR...');

  useEffect(() => {
    const frameTimer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ASCII_FRAMES.length);
    }, 2800);

    const tickers = [
      'SCANNING MAHARASHTRA IGR CIRCLE RATES (ASR 2024-26)...',
      'CORRELATING 3,500+ REGISTERED SALES COMPS...',
      'INTERPOLATING RADIAL TRANSIT & EMPLOYMENT HUBS...',
      'APPLYING UDCPR RESIDUAL PLOT RECKONER...',
      'CALCULATING FAIR MARKET VALUE IN LAKHS & CRORES...'
    ];

    let tickerIdx = 0;
    const tickerTimer = setInterval(() => {
      tickerIdx = (tickerIdx + 1) % tickers.length;
      setTicker(tickers[tickerIdx]);
    }, 3200);

    return () => {
      clearInterval(frameTimer);
      clearInterval(tickerTimer);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 shadow-2xl relative overflow-hidden font-mono group">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-neutral-300 font-bold">engine.atlas // spatial_view</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>LIVE SENSOR</span>
        </div>
      </div>

      {/* ASCII Art Canvas */}
      <div className="relative py-2 overflow-x-auto select-none">
        <pre className="text-[11px] sm:text-xs leading-[1.3] text-neutral-300 font-mono tracking-tight whitespace-pre font-bold">
          {ASCII_FRAMES[frameIndex]}
        </pre>
      </div>

      {/* Terminal Status Footer */}
      <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-neutral-500">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="text-emerald-400 font-bold">&gt;</span>
          <span className="text-neutral-300 truncate">{ticker}</span>
        </div>
        <div className="text-neutral-400 whitespace-nowrap">
          FRAME 0{frameIndex + 1} / 03
        </div>
      </div>
    </div>
  );
};

export default AsciiArchitecture;

