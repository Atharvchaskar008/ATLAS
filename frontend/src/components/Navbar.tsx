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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onViewChange('landing')}
          className="cursor-pointer flex items-center space-x-3 select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-display font-extrabold text-sm tracking-tighter">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-900">
            ATLAS
          </span>
          <span className="hidden sm:inline-block text-[11px] font-sans font-medium text-neutral-500 pl-3 border-l border-neutral-200">
            Real Estate Valuation
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium">
          <button
            onClick={() => onViewChange('landing')}
            className={`transition-colors text-xs font-semibold ${
              viewMode === 'landing' ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => onViewChange('dashboard')}
            className={`transition-colors text-xs font-semibold ${
              viewMode === 'dashboard' ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Valuation Engine
          </button>

          <a
            href="https://github.com/Atharvchaskar008/ATLAS"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 font-semibold transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Action CTA */}
          {viewMode === 'landing' ? (
            <button
              onClick={() => onViewChange('dashboard')}
              className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm"
            >
              Get Valuation
            </button>
          ) : (
            <button
              onClick={() => onViewChange('landing')}
              className="border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95"
            >
              Back to Overview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
