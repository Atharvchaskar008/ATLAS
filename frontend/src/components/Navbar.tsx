import React from 'react';
import { ShieldCheck, Sparkles, FileText, Activity, Layers, MapPin, LayoutDashboard, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenReport: () => void;
  onSelectPreset: (presetName: string) => void;
  currentLocality: string;
  viewMode: 'landing' | 'dashboard';
  onViewChange: (view: 'landing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReport,
  onSelectPreset,
  currentLocality,
  viewMode,
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#070B12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Identity */}
          <div
            onClick={() => onViewChange('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  A.T.L.A.S.
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  Maharashtra Engine
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Automated Terrain & Asset Location Assessment System (Statewide Coverage)
              </p>
            </div>
          </div>

          {/* Navigation View Switcher (Landing vs Dashboard) */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onViewChange('landing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'landing'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Engine</span>
            </button>
          </div>

          {/* Quick Statewide Presets */}
          <div className="hidden xl:flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <span className="px-2 text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-cyan-400" /> Presets:
            </span>
            <button
              onClick={() => {
                onSelectPreset('Moshi Jal Vayu Vihar');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Moshi')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Moshi (Pune)
            </button>
            <button
              onClick={() => {
                onSelectPreset('Bandra West');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Bandra')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Bandra (Mumbai)
            </button>
            <button
              onClick={() => {
                onSelectPreset('Powai Hiranandani');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Powai')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Powai (MMR)
            </button>
            <button
              onClick={() => {
                onSelectPreset('Thane West');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Thane')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Thane
            </button>
            <button
              onClick={() => {
                onSelectPreset('Nashik Gangapur');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Nashik')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Nashik
            </button>
            <button
              onClick={() => {
                onSelectPreset('Nagpur Dharampeth');
                if (viewMode !== 'dashboard') onViewChange('dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                currentLocality.includes('Nagpur')
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Nagpur
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px] text-slate-400">IGR 2024-26 Anchor</span>
            </div>

            <button
              onClick={onOpenReport}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Valuation Memo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
