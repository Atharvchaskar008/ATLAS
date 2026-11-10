import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  viewMode: 'landing' | 'dashboard';
  onViewChange: (view: 'landing' | 'dashboard') => void;
  onOpenReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onViewChange('landing')}
          className="cursor-pointer flex items-center space-x-3 select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-display font-extrabold text-sm tracking-tighter group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            ATLAS
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-neutral-400 pl-3 border-l border-neutral-800">
            Valuation Engine
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium">
          <button
            onClick={() => onViewChange('landing')}
            className={`transition-colors text-xs uppercase tracking-wider font-semibold ${
              viewMode === 'landing' ? 'text-white underline underline-offset-8' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => onViewChange('dashboard')}
            className={`transition-colors text-xs uppercase tracking-wider font-semibold ${
              viewMode === 'dashboard' ? 'text-white underline underline-offset-8' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Engine
          </button>

          <a
            href="https://github.com/Atharvchaskar008/ATLAS"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-400 hover:text-white font-semibold transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Action CTA */}
          {viewMode === 'landing' ? (
            <button
              onClick={() => onViewChange('dashboard')}
              className="bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-wider font-bold px-5 py-2 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Launch Engine
            </button>
          ) : (
            <button
              onClick={() => onViewChange('landing')}
              className="border border-neutral-700 text-white hover:bg-neutral-900 text-xs uppercase tracking-wider font-bold px-5 py-2 rounded-full transition-all active:scale-95"
            >
              Back to Overview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
