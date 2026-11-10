import React from 'react';
import { ShapFactor } from '../types';
import { HelpCircle, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ShapWaterfallProps {
  factors: ShapFactor[];
  baselineExpectedLakhs: number;
  finalEstimatedLakhs: number;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  factors,
  baselineExpectedLakhs,
  finalEstimatedLakhs,
}) => {
  // Find max absolute impact to scale bar widths
  const maxImpact = Math.max(...factors.map((f) => Math.abs(f.impact_lakhs)), 1.0);

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Explainable AI (TreeSHAP) Valuation Drivers
            </h3>
            <p className="text-[11px] text-slate-400">
              Itemized rupee-by-rupee impact of individual physical & spatial features
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span className="text-slate-400">Premium Added</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
            <span className="text-slate-400">Depreciation Deducted</span>
          </div>
        </div>
      </div>

      {/* Baseline Anchor */}
      <div className="bg-[#0B0F17] rounded-xl p-3 border border-slate-800/80 mb-4 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-slate-300">Micro-Market Cluster Baseline:</span>
          <span className="text-slate-500 ml-1.5">
            (Average clearing benchmark for this size in locality)
          </span>
        </div>
        <div className="font-mono font-bold text-white text-sm">
          ₹{baselineExpectedLakhs.toFixed(2)} Lakhs
        </div>
      </div>

      {/* Waterfall Items List */}
      <div className="space-y-3">
        {factors.map((factor, idx) => {
          const isPositive = factor.impact_lakhs > 0;
          const isNeutral = factor.impact_lakhs === 0;
          const pctWidth = Math.min(100, Math.max(15, (Math.abs(factor.impact_lakhs) / maxImpact) * 100));

          return (
            <div
              key={idx}
              className="bg-[#0B0F17]/60 rounded-xl p-3 border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center space-x-2">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : isNeutral ? (
                    <Minus className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-slate-200">{factor.factor}</span>
                </div>

                <div
                  className={`font-mono font-bold ${
                    isPositive ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {factor.impact_lakhs.toFixed(2)} Lakhs
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden my-1.5 flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : isNeutral
                      ? 'bg-slate-700'
                      : 'bg-gradient-to-r from-rose-500 to-amber-600'
                  }`}
                  style={{ width: `${pctWidth}%` }}
                ></div>
              </div>

              {/* Plain-English Explanation */}
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                {factor.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summation Total */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-300">Final Adjusted Fair Market Valuation:</span>
        <span className="font-mono text-emerald-400 font-bold text-base">
          ₹{finalEstimatedLakhs.toFixed(2)} Lakhs
        </span>
      </div>
    </div>
  );
};

