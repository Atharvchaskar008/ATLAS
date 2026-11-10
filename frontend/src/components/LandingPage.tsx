import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectPreset?: (presetName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Minimal Punchy Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-block border border-black px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-black">
            System / Maharashtra Coverage
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-[1.05]">
            Deterministic valuation for real estate and land.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed">
            Instant fair market appraisal across all 36 Maharashtra districts. Underpinned by registered transaction benchmarks and official IGR Ready Reckoner rates.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="bg-black text-white hover:bg-neutral-800 border border-black px-8 py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all active:translate-y-0.5"
            >
              <span>Launch Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#solution"
              className="border border-black text-black hover:bg-neutral-100 px-8 py-4 text-xs uppercase tracking-widest font-bold text-center transition-all"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right Column: One Striking Editorial Architectural Image */}
        <div className="lg:col-span-5">
          <div className="relative border border-black p-2 bg-white">
            <div className="overflow-hidden aspect-[4/5] bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural structure representing land and asset intelligence"
                className="w-full h-full object-cover filter grayscale contrast-125 hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase text-neutral-500 px-1">
              <span>Figure 01.0</span>
              <span>Asset Valuation Matrix</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Card Boxes Explaining the Solution */}
      <section id="solution" className="border-t border-black bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Core Principles
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              36 Districts / Verified Comps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1 */}
            <div className="border border-black p-8 sm:p-10 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-6">01 / CALIBRATION</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black mb-4">
                  Zero asking-price distortion.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Public listing platforms carry an average 8–12% seller markup. ATLAS filters speculative inflation and values assets strictly on recorded registry deeds and verified transactions.
                </p>
              </div>
              <div className="pt-8 border-t border-neutral-200 mt-8 text-xs font-mono text-neutral-500">
                Ground-truth transaction parity
              </div>
            </div>

            {/* Box 2 */}
            <div className="border border-black p-8 sm:p-10 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-6">02 / STATUTORY</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black mb-4">
                  Official IGR circle rate anchors.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Every valuation is cross-referenced with Maharashtra Inspector General of Registration (ASR 2024–2026) gazette circle rates, stamp duty tiers, and UDCPR land residual guidelines.
                </p>
              </div>
              <div className="pt-8 border-t border-neutral-200 mt-8 text-xs font-mono text-neutral-500">
                Bank-grade underwriting compliance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giant Statement: ATLAS */}
      <section className="border-t border-b border-black py-12 sm:py-20 bg-white overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-[15vw] sm:text-[18vw] font-black tracking-tighter leading-none text-black uppercase">
            ATLAS
          </h2>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <div>
            <span className="font-bold text-black font-sans uppercase tracking-wider">ATLAS</span> — Automated Terrain & Asset Location Assessment System
          </div>
          <div className="flex items-center space-x-6">
            <span>Maharashtra Statewide Engine</span>
            <span>IGR ASR 2024–2026</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
