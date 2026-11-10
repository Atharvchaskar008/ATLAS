import React from 'react';
import { Layers, ShieldCheck, Cpu, MapPin, Sparkles, ArrowRight, TrendingUp, Compass, CheckCircle2, ChevronRight, BarChart3, Database } from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectPreset: (presetName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard, onSelectPreset }) => {
  return (
    <div className="bg-[#070B12] text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <div className="relative isolate pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glowing Background Radial Gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500/30 to-cyan-500/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm shadow-emerald-500/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Statewide Maharashtra Coverage • Official IGR Ready Reckoner (ASR 2024–2026) Anchor</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
            Automated Terrain & Asset Location Assessment System
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A bank-grade real estate valuation and geospatial intelligence engine. Calculations are computed
            <span className="text-emerald-400 font-semibold"> deterministically underneath</span> using trained hedonic regression and official circle rates, with
            <span className="text-cyan-400 font-semibold"> Google Maps & Gemini 2.5 Flash</span> providing the qualitative neighborhood intelligence layer.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Valuation Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <a
              href="#sample-benchmarks"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all text-center"
            >
              Explore 112+ Verified Micro-Markets
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#0B0F17]/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">36 / 36</div>
              <div className="text-xs text-slate-400 mt-1">Districts of Maharashtra</div>
            </div>
            <div className="bg-[#0B0F17]/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">3,495+</div>
              <div className="text-xs text-slate-400 mt-1">Calibrated Deed Transactions</div>
            </div>
            <div className="bg-[#0B0F17]/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">2.0 ms</div>
              <div className="text-xs text-slate-400 mt-1">Valuation Inference Latency</div>
            </div>
            <div className="bg-[#0B0F17]/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Benchmark Mathematical Pass</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="py-16 bg-[#0B0F17] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              The Two-Tier Architecture
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Why ATLAS Wins Over Generic LLM Web Searches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Deterministic Calculation Engine Beneath</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Trained Gradient Boosting Regressor anchored to Maharashtra IGR Ready Reckoner (ASR 2024–26). Calculates floor rise, age depreciation, parking, and transit distance decay mathematically. Zero hallucinations.
              </p>
            </div>

            <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Google Maps & Places Radar</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Real-time 500m (walkable), 1.5km (neighborhood), and 3.5km (catchment) surrounding scans for transit, hospitals, schools, tech parks, and commercial nodes with distance-decay pricing models.
              </p>
            </div>

            <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Gemini 2.5 Flash Qualitative Layer</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Gemini functions strictly as the qualitative synthesis layer: analyzing micro-market DNA, upcoming infrastructure catalysts, tenant demographics, pros & cons, and institutional underwriting opinions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Micro-Markets Grid */}
      <div id="sample-benchmarks" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
              Live Regional Presets
            </h2>
            <p className="mt-1 text-2xl font-bold text-white">
              Instant 1-Click Appraisals Across Maharashtra
            </p>
          </div>
          <button
            onClick={onLaunchDashboard}
            className="mt-3 sm:mt-0 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Open Custom Map & Pin Dropper</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => {
              onSelectPreset('Moshi Jal Vayu Vihar');
              onLaunchDashboard();
            }}
            className="group cursor-pointer bg-[#121824] hover:bg-[#161F2E] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PCMC / Pune
              </span>
              <span className="text-xs font-mono text-slate-400">Sector 6</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Moshi (Jal Vayu Vihar)
            </h4>
            <p className="text-xs text-slate-400 mt-1">2 BHK • 600 sq.ft • 16 yrs</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-xs text-slate-400">Fair Value:</span>
              <span className="text-sm font-bold font-mono text-emerald-400">₹56.3 L – ₹61.2 L</span>
            </div>
          </div>

          <div
            onClick={() => {
              onSelectPreset('Bandra West');
              onLaunchDashboard();
            }}
            className="group cursor-pointer bg-[#121824] hover:bg-[#161F2E] p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Mumbai MMR
              </span>
              <span className="text-xs font-mono text-slate-400">Pali Hill</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Bandra West / Khar
            </h4>
            <p className="text-xs text-slate-400 mt-1">3 BHK • 1,250 sq.ft • 3 yrs</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-xs text-slate-400">Fair Value:</span>
              <span className="text-sm font-bold font-mono text-cyan-400">₹5.75 Cr – ₹7.10 Cr</span>
            </div>
          </div>

          <div
            onClick={() => {
              onSelectPreset('Powai Hiranandani');
              onLaunchDashboard();
            }}
            className="group cursor-pointer bg-[#121824] hover:bg-[#161F2E] p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Mumbai MMR
              </span>
              <span className="text-xs font-mono text-slate-400">Hiranandani</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Powai Lakefront
            </h4>
            <p className="text-xs text-slate-400 mt-1">2 BHK • 760 sq.ft • 4 yrs</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-xs text-slate-400">Fair Value:</span>
              <span className="text-sm font-bold font-mono text-purple-400">₹2.03 Cr – ₹2.35 Cr</span>
            </div>
          </div>

          <div
            onClick={() => {
              onSelectPreset('Nagpur Dharampeth');
              onLaunchDashboard();
            }}
            className="group cursor-pointer bg-[#121824] hover:bg-[#161F2E] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Vidarbha
              </span>
              <span className="text-xs font-mono text-slate-400">WHC Road</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Nagpur (Dharampeth)
            </h4>
            <p className="text-xs text-slate-400 mt-1">3 BHK • 1,150 sq.ft • 4 yrs</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-xs text-slate-400">Fair Value:</span>
              <span className="text-sm font-bold font-mono text-amber-400">₹1.12 Cr – ₹1.28 Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

