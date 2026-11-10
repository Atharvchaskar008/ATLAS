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
  onOpenReport,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onViewChange('landing')}
          className="cursor-pointer flex items-center space-x-3 select-none"
        >
          <span className="font-display font-extrabold text-2xl tracking-tighter text-black">
            ATLAS
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-neutral-500 pl-3 border-l border-neutral-300">
            Valuation Engine
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium">
          <button
            onClick={() => onViewChange('landing')}
            className={`transition-colors text-xs uppercase tracking-wider font-semibold ${
              viewMode === 'landing' ? 'text-black underline underline-offset-4' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => onViewChange('dashboard')}
            className={`transition-colors text-xs uppercase tracking-wider font-semibold ${
              viewMode === 'dashboard' ? 'text-black underline underline-offset-4' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Engine
          </button>

          <a
            href="https://github.com/Atharvchaskar008/ATLAS"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold transition-colors"
          >
            <span>Source</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Action CTA */}
          {viewMode === 'landing' ? (
            <button
              onClick={() => onViewChange('dashboard')}
              className="bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-bold px-4 py-2 border border-black transition-all active:translate-y-0.5"
            >
              Launch Dashboard
            </button>
          ) : (
            <button
              onClick={() => onViewChange('landing')}
              className="border border-black text-black hover:bg-black hover:text-white text-xs uppercase tracking-wider font-bold px-4 py-2 transition-all active:translate-y-0.5"
            >
              Back to Overview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
