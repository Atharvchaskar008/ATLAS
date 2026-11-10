import React from 'react';
import { GeminiAiLayer, SurroundingLocalityAnalysis } from '../types';
import { Sparkles, Brain, Compass, Building, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';

interface GeminiLocalityCardProps {
  gemini: GeminiAiLayer;
  surrounding: SurroundingLocalityAnalysis;
  district: string;
  authority: string;
}

export const GeminiLocalityCard: React.FC<GeminiLocalityCardProps> = ({
  gemini,
  surrounding,
  district,
  authority,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#121824] via-[#0D1525] to-[#121824] rounded-2xl border border-indigo-500/30 p-5 shadow-2xl relative overflow-hidden">
      {/* Ambient AI Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Gemini AI Locality Intelligence Layer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-normal">
                AI Qualitative Layer
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {gemini.source} • {district} ({authority})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/50">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time Synthesis</span>
        </div>
      </div>

      {/* Section 1: Livability & Demographics */}
      <div className="space-y-4 text-xs">
        <div className="bg-[#0B0F17]/80 rounded-xl p-3.5 border border-slate-800/80">
          <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>Neighborhood Livability & Infrastructure Catchment</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {gemini.livability_summary}
          </p>
        </div>

        {/* Section 2: Surrounding POIs and Real-time Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Transit Access</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">
              {surrounding.indices.transit_accessibility}/100
            </div>
            <div className="text-[9px] text-slate-500 truncate" title={surrounding.nearest_transit.name}>
              {surrounding.nearest_transit.name.split('(')[0]} ({surrounding.nearest_transit.distance_km}km)
            </div>
          </div>

          <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Job Corridor</div>
            <div className="text-sm font-bold text-purple-400 mt-0.5">
              {surrounding.indices.employment_proximity}/100
            </div>
            <div className="text-[9px] text-slate-500 truncate" title={surrounding.nearest_employment_hub.name}>
              {surrounding.nearest_employment_hub.name.split('(')[0]} ({surrounding.nearest_employment_hub.distance_km}km)
            </div>
          </div>

          <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Walkability</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {surrounding.indices.walkability_score}/100
            </div>
            <div className="text-[9px] text-slate-500">
              {surrounding.amenities_count.within_500m} POIs in 500m
            </div>
          </div>

          <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Rental Yield</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              {gemini.rental_yield_outlook.split(' ')[0]}
            </div>
            <div className="text-[9px] text-slate-500">Gross Forecast</div>
          </div>
        </div>

        {/* Section 3: Future Catalysts */}
        <div className="bg-[#0B0F17]/80 rounded-xl p-3.5 border border-slate-800/80">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Infrastructure & Growth Catalysts</span>
          </div>
          <ul className="space-y-1.5">
            {gemini.infrastructure_catalysts.map((cat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 font-sans text-xs">
                <span className="text-emerald-400 font-mono font-bold mt-0.5">•</span>
                <span>{cat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Institutional Appraiser Verdict */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#0B0F17] to-indigo-950/40 rounded-xl p-3.5 border border-emerald-500/30">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Underwriting & Investment Verdict</span>
          </div>
          <p className="text-slate-200 text-xs font-sans leading-relaxed">
            {gemini.appraisal_verdict}
          </p>
        </div>
      </div>
    </div>
  );
};
