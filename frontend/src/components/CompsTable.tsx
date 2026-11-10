import React from 'react';
import { ComparableProperty } from '../types';
import { Table, CheckCircle2, ArrowRightLeft, MapPin } from 'lucide-react';

interface CompsTableProps {
  comparables: ComparableProperty[];
  onSelectComp?: (comp: ComparableProperty) => void;
}

export const CompsTable: React.FC<CompsTableProps> = ({ comparables, onSelectComp }) => {
  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Sales Comparison Approach (Comp Matrix)
            </h3>
            <p className="text-[11px] text-slate-400">
              Direct market evidence: nearest comparable registered transactions with pairwise feature adjustments
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
          {comparables.length} Verified Sales Comps
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="pb-3 pl-2">Society & Project</th>
              <th className="pb-3">Config</th>
              <th className="pb-3">Carpet</th>
              <th className="pb-3">Floor</th>
              <th className="pb-3">Age</th>
              <th className="pb-3">Distance</th>
              <th className="pb-3">Sale Price</th>
              <th className="pb-3">Rate/Sq.Ft</th>
              <th className="pb-3">Similarity</th>
              <th className="pb-3 pr-2">Adjusted Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {comparables.map((comp) => (
              <tr
                key={comp.id}
                onClick={() => onSelectComp && onSelectComp(comp)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td className="py-3 pl-2 font-sans font-semibold text-slate-200 group-hover:text-emerald-300">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span>{comp.society}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal ml-4.5">
                    {comp.sub_locality}
                  </div>
                </td>
                <td className="py-3 text-slate-300">{comp.bhk} BHK</td>
                <td className="py-3 text-slate-300">{comp.carpet_sqft} sqft</td>
                <td className="py-3 text-slate-400">
                  {comp.floor}/{comp.total_floors}
                </td>
                <td className="py-3 text-slate-400">{comp.age_years}y</td>
                <td className="py-3 text-cyan-400">{comp.distance_km} km</td>
                <td className="py-3 font-bold text-white">₹{comp.price_lakhs}L</td>
                <td className="py-3 text-slate-400">
                  ₹{comp.price_per_sqft_carpet.toLocaleString('en-IN')}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {comp.similarity_score}%
                  </span>
                </td>
                <td className="py-3 pr-2 font-bold text-emerald-400">
                  ₹{comp.adjusted_price_lakhs}L
                  <div className="text-[9px] text-slate-500 font-normal font-sans">
                    {comp.adjustment_notes}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

