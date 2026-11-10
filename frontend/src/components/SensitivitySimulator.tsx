import React, { useState, useEffect } from 'react';
import { PropertyInput } from '../types';
import { simulateSensitivity } from '../api';
import { SlidersHorizontal, Train, TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';

interface SensitivitySimulatorProps {
  property: PropertyInput;
  baseValuationLakhs: number;
}

export const SensitivitySimulator: React.FC<SensitivitySimulatorProps> = ({
  property,
  baseValuationLakhs,
}) => {
  const [floorDelta, setFloorDelta] = useState<number>(0);
  const [ageDelta, setAgeDelta] = useState<number>(0);
  const [metroBonus, setMetroBonus] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{
    simulated_value_lakhs: number;
    delta_lakhs: number;
    delta_percentage: number;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    const runSim = async () => {
      setIsSimulating(true);
      try {
        const res = await simulateSensitivity(property, floorDelta, ageDelta, metroBonus);
        if (isCurrent) {
          setSimResult({
            simulated_value_lakhs: res.simulated_value_lakhs,
            delta_lakhs: res.delta_lakhs,
            delta_percentage: res.delta_percentage,
          });
        }
      } catch (err) {
        console.warn('Simulation failed', err);
      } finally {
        if (isCurrent) setIsSimulating(false);
      }
    };

    const timeout = setTimeout(runSim, 150);
    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [property, floorDelta, ageDelta, metroBonus]);

  const targetFloor = Math.max(0, property.floor + floorDelta);
  const targetAge = Math.max(0, property.age_years + ageDelta);

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              "What-If" Sensitivity Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive scenario modeling: test how floor rise, age, or upcoming transit projects impact asset value
            </p>
          </div>
        </div>

        {simResult && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Net Shift:</span>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                simResult.delta_lakhs >= 0
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {simResult.delta_lakhs >= 0 ? '+' : ''}
              {simResult.delta_lakhs.toFixed(2)}L ({simResult.delta_percentage >= 0 ? '+' : ''}
              {simResult.delta_percentage}%)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Floor Rise Simulator */}
        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Simulate Floor Rise:</span>
            <span className="text-emerald-400 font-mono font-bold">
              Floor {targetFloor}{' '}
              <span className="text-[10px] text-slate-500 font-normal">
                ({floorDelta >= 0 ? `+${floorDelta}` : floorDelta} flr)
              </span>
            </span>
          </div>
          <input
            type="range"
            min={-property.floor}
            max="18"
            step="1"
            value={floorDelta}
            onChange={(e) => setFloorDelta(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
            <span>Ground Floor</span>
            <span>Current ({property.floor}th)</span>
            <span>High Rise (+18)</span>
          </div>
        </div>

        {/* Age Depreciation Simulator */}
        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Simulate Age Shift:</span>
            <span className="text-amber-400 font-mono font-bold">
              {targetAge} yrs{' '}
              <span className="text-[10px] text-slate-500 font-normal">
                ({ageDelta >= 0 ? `+${ageDelta}` : ageDelta}y)
              </span>
            </span>
          </div>
          <input
            type="range"
            min={-property.age_years}
            max="15"
            step="1"
            value={ageDelta}
            onChange={(e) => setAgeDelta(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
            <span>Brand New (0y)</span>
            <span>Current ({property.age_years}y)</span>
            <span>Older (+15y)</span>
          </div>
        </div>

        {/* Infrastructure Simulator (Metro Operational Toggle) */}
        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Train className="w-4 h-4 text-cyan-400" /> Pune Metro Line Transit
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                metroBonus
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {metroBonus ? 'COMMISSIONED (+4.5%)' : 'UNDER CONSTRUCTION'}
            </span>
          </div>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-[11px] text-slate-400">
              Simulate full commercial operations of nearest Pune Metro line
            </span>
            <input
              type="checkbox"
              checked={metroBonus}
              onChange={(e) => setMetroBonus(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-700 bg-slate-800 cursor-pointer accent-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* Real-time Dynamic Result Bar */}
      {simResult && (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-slate-900 via-[#0B0F17] to-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Current Base:</span>
            <span className="font-mono font-bold text-white">₹{baseValuationLakhs.toFixed(2)}L</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Simulated Valuation:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              ₹{simResult.simulated_value_lakhs.toFixed(2)}L
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {simResult.delta_lakhs > 0 ? (
              <span className="text-emerald-400 font-medium">
                Scenario creates +₹{simResult.delta_lakhs.toFixed(2)} Lakhs in equity appreciation.
              </span>
            ) : simResult.delta_lakhs < 0 ? (
              <span className="text-rose-400 font-medium">
                Scenario reflects -₹{Math.abs(simResult.delta_lakhs).toFixed(2)} Lakhs in depreciation drag.
              </span>
            ) : (
              <span>No net variance from baseline specs.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

