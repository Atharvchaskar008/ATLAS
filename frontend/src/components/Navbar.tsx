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
    <header className="sticky top-0 z-50 bg-[var(--canvas)]/85 backdrop-blur-md border-b border-[var(--line)] transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onViewChange('landing')}
          className="cursor-pointer flex items-center space-x-3 select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--ink)] flex items-center justify-center text-[var(--canvas)] font-mono font-bold text-sm tracking-tight group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-[var(--ink)]">
            ATLAS
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] pl-3 border-l border-[var(--line)]">
            VALUATION ENGINE
          </span>
        </div>

        {/* Navigation Links & Actions */}
        <nav className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono font-medium">
          <button
            onClick={() => onViewChange('landing')}
            className={`transition-colors uppercase tracking-wider py-1 ${
              viewMode === 'landing'
                ? 'text-[var(--ink)] font-bold border-b border-[var(--ink)]'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => onViewChange('dashboard')}
            className={`transition-colors uppercase tracking-wider py-1 ${
              viewMode === 'dashboard'
                ? 'text-[var(--ink)] font-bold border-b border-[var(--ink)]'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            Engine
          </button>

          <a
            href="https://github.com/Atharvchaskar008/ATLAS"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Action CTA */}
          {viewMode === 'landing' ? (
            <button
              onClick={() => onViewChange('dashboard')}
              className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 text-[11px] uppercase tracking-wider font-bold px-4 sm:px-5 py-2 rounded-md transition-all active:scale-95 shadow-sm"
            >
              Launch Engine
            </button>
          ) : (
            <button
              onClick={() => onViewChange('landing')}
              className="border border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--surface-hover)] text-[11px] uppercase tracking-wider font-bold px-4 sm:px-5 py-2 rounded-md transition-all active:scale-95"
            >
              Overview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
