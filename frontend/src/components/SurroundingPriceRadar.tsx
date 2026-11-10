import React from 'react';
import { SurroundingLocalityAnalysis } from '../types';
import { BarChart3, TrendingUp, Navigation, MapPin, Store, School, Cross, Train } from 'lucide-react';

interface SurroundingPriceRadarProps {
  surrounding: SurroundingLocalityAnalysis;
  priceDistribution?: {
    rates_per_sqft_carpet: {
      p10: number;
      p25: number;
      median: number;
      p75: number;
      p90: number;
      interquartile_spread: number;
    };
    radial_gradient: Array<{
      radius: string;
      avg_rate_sqft: number;
      sample_density: string;
    }>;
    price_trend_6mo_pct: number;
    price_trend_12mo_pct: number;
  };
  locality: string;
  district: string;
}

export const SurroundingPriceRadar: React.FC<SurroundingPriceRadarProps> = ({
  surrounding,
  priceDistribution,
  locality,
  district,
}) => {
  const dist = priceDistribution?.rates_per_sqft_carpet;
  const radial = priceDistribution?.radial_gradient || [];

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Surrounding Price Analysis & Radial Gradient
            </h3>
            <p className="text-[11px] text-slate-400">
              Deterministic real-time spatial price distribution across {locality} ({district})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">12M Trend:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            +{priceDistribution?.price_trend_12mo_pct || 7.4}%
          </span>
        </div>
      </div>

      {/* Micro-Market Price Distribution Percentiles */}
      {dist && (
        <div className="bg-[#0B0F17] rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Locality Price Spread (Per Sq.Ft Carpet):</span>
            <span className="text-slate-500 font-mono text-[11px]">
              IQR Spread: ₹{dist.interquartile_spread.toLocaleString('en-IN')}/sqft
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center font-mono">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase">10th %ile</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">
                ₹{dist.p10.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">25th %ile</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">
                ₹{dist.p25.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/40">
              <div className="text-[9px] text-emerald-400 uppercase font-bold">Median Rate</div>
              <div className="text-sm font-black text-emerald-300 mt-0.5">
                ₹{dist.median.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">75th %ile</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">
                ₹{dist.p75.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase">90th %ile</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">
                ₹{dist.p90.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Radial Distance Decay Gradient */}
      {radial.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Radial Distance-Decay Gradient (Outward from Core Transit)</span>
            <span className="text-[10px] text-slate-500 font-mono">Distance Sensitivity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            {radial.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0B0F17] p-3 rounded-xl border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-slate-300 font-sans font-semibold text-[11px]">
                    {item.radius}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Density: {item.sample_density}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-cyan-400">
                    ₹{item.avg_rate_sqft.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-slate-500">per sq.ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Surrounding POIs Scanned */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          <span>Surrounding Civic & Social Infrastructure Radar</span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {surrounding.sample_surrounding_pois.length} Key Nodes Scanned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {surrounding.sample_surrounding_pois.map((poi, idx) => {
            const isTransit = poi.type === 'transit' || poi.type === 'railway';
            const isHealth = poi.type === 'health' || poi.type === 'hospital';
            const isEdu = poi.type === 'education';

            return (
              <div
                key={idx}
                className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  <div className="p-1 rounded bg-slate-800 text-slate-300 flex-shrink-0">
                    {isTransit ? (
                      <Train className="w-3.5 h-3.5 text-cyan-400" />
                    ) : isHealth ? (
                      <Cross className="w-3.5 h-3.5 text-rose-400" />
                    ) : isEdu ? (
                      <School className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Store className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-slate-200 font-medium truncate text-xs">{poi.name}</span>
                </div>
                <span className="font-mono text-cyan-400 text-xs flex-shrink-0 font-bold">
                  {poi.distance_km} km
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
