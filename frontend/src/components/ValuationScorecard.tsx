import React from 'react';
import { ValuationResult } from '../types';
import { TrendingUp, ShieldAlert, BadgeCheck, Scale, ArrowUpRight, Percent, Landmark } from 'lucide-react';

interface ValuationScorecardProps {
  valuation: ValuationResult;
}

export const ValuationScorecard: React.FC<ValuationScorecardProps> = ({ valuation }) => {
  const {
    estimated_value_lakhs,
    value_range_lakhs,
    rate_per_sqft_carpet,
    property_summary,
    government_benchmark,
  } = valuation;

  // Approximate portal asking price (sellers typically quote 10-14% above realistic clearing value)
  const portalAskingEstimate = Math.round(estimated_value_lakhs * 1.12 * 100) / 100;

  return (
    <div className="space-y-4">
      {/* Primary Hero Valuation Card */}
      <div className="bg-gradient-to-br from-[#121824] via-[#0F172A] to-[#121824] rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Fair Market Value Appraisal
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>High Confidence ({value_range_lakhs.confidence_level})</span>
          </div>
        </div>

        {/* Big Number Headline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 my-4">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                ₹{estimated_value_lakhs.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-slate-300">Lakhs</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estimated clearing consideration for {property_summary.bhk} BHK ({property_summary.carpet_sqft} sq.ft) in{' '}
              <span className="text-emerald-400 font-medium">{property_summary.locality}</span>
            </p>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ₹{rate_per_sqft_carpet.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-medium text-slate-400">per sq.ft (RERA Carpet)</div>
          </div>
        </div>

        {/* Prediction Interval Range Bar */}
        <div className="bg-[#0B0F17]/90 rounded-xl p-3.5 border border-slate-800/80 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-400">Appraisal Value Band (85% Empirical Interval):</span>
            <span className="font-mono text-emerald-400 font-bold">
              ₹{value_range_lakhs.min.toFixed(2)}L — ₹{value_range_lakhs.max.toFixed(2)}L
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
            <span>Conservative Bid: ₹{value_range_lakhs.min.toFixed(2)}L</span>
            <span>Target Market Mean</span>
            <span>Aggressive Ask: ₹{value_range_lakhs.max.toFixed(2)}L</span>
          </div>
        </div>

        {/* Three-Way Market Benchmark Comparison */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Tri-Factor Indian Real Estate Benchmark</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Government Ready Reckoner Floor */}
            <div className="bg-[#0B0F17] rounded-xl p-3 border border-amber-500/20">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                <span>Govt Ready Reckoner (ASR)</span>
                <Landmark className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold font-mono text-white">
                ₹{government_benchmark.government_floor_value_lakhs.toFixed(2)} L
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Rate: ₹{government_benchmark.ready_reckoner_rate_carpet.toLocaleString('en-IN')}/sqft (Min Legal Base)
              </div>
            </div>

            {/* A.T.L.A.S. Fair Valuation */}
            <div className="bg-[#0B0F17] rounded-xl p-3 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
                <span>A.T.L.A.S. Fair Market</span>
                <BadgeCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                ₹{estimated_value_lakhs.toFixed(2)} L
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                +{government_benchmark.market_premium_pct}% over Govt ASR rate
              </div>
            </div>

            {/* Portal Asking Inflation */}
            <div className="bg-[#0B0F17] rounded-xl p-3 border border-rose-500/20">
              <div className="flex items-center justify-between text-[11px] text-rose-400 font-semibold mb-1">
                <span>Typical Listing Portals</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold font-mono text-white">
                ~₹{portalAskingEstimate.toFixed(2)} L
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Includes ~12% seller negotiation buffer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Stamp Duty & Taxes Card */}
      <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Statutory Registration & Stamp Duty Liability
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 font-bold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {government_benchmark.statutory_authority} Jurisdiction
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Under Section 56(2)(x) of the Indian Income Tax Act, stamp duty is levied on the higher of the
          Government Ready Reckoner value or the actual agreed market consideration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Applicable Rate</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">7.0%</div>
            <div className="text-[9px] text-slate-500">5% SD + 1% LBT + 1% Metro</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Stamp Duty (Est)</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              ₹{government_benchmark.stamp_duty_estimate_lakhs.toFixed(2)} Lakhs
            </div>
            <div className="text-[9px] text-slate-500">On Fair Consideration</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Registration Fee</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              ₹{government_benchmark.registration_charge_inr.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-slate-500">Statutory State Cap</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Total Legal Cost</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              ₹{(government_benchmark.stamp_duty_estimate_lakhs + 0.30).toFixed(2)} Lakhs
            </div>
            <div className="text-[9px] text-slate-500">Over purchase price</div>
          </div>
        </div>
      </div>
    </div>
  );
};

