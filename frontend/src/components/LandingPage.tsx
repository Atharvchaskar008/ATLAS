import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ScrollStack } from './ScrollStack';
import { DecryptedText } from './reactbits/DecryptedText';
import { CountUp } from './reactbits/CountUp';
import { AsciiArchitecture } from './AsciiArchitecture';
import { CornerCrosses } from './CornerCrosses';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectPreset?: (presetName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Large interactive scrollbar progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-250">
      
      {/* Top Large Scroll Progress Bar (Architectural Precision Indicator) */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-[var(--line)] z-40">
        <div
          className="h-full bg-[var(--ink)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Natural Language Typography */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--surface-elevated)] text-[11px] font-mono uppercase tracking-widest text-[var(--ink-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />
            <span>AI Valuation & Locality Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--ink)] leading-[1.08] font-sans">
            <DecryptedText
              text="Know the true market value of any property."
              speed={30}
              maxIterations={12}
              animateOn="view"
            />
          </h1>

          <p className="text-base sm:text-lg text-[var(--ink-secondary)] max-w-xl font-normal leading-relaxed font-sans">
            Online real estate portals often show inflated asking prices. ATLAS calculates the honest, transacted market value and official circle rates before you buy, sell, or finance.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 px-8 py-4 rounded-md text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-sm group"
            >
              <span>Estimate Property Value</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#solution"
              className="border border-[var(--line)] text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] px-8 py-4 rounded-md text-xs font-mono font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Architectural ASCII Building Elevation (Pure CAD art, zero marketing text) */}
        <div className="lg:col-span-5">
          <AsciiArchitecture />
        </div>
      </section>

      {/* Statistics Grid (Architectural Boxed Cells with Corner Crosses) */}
      <section className="border-t border-b border-[var(--line)] bg-[var(--surface)] py-10 transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="relative has-crosses rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-5 hover:border-[var(--line-strong)] transition-all">
            <CornerCrosses />
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              <CountUp to={36} duration={1.8} />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-secondary)] mt-2">
              Maharashtra Districts
            </div>
          </div>

          <div className="relative has-crosses rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-5 hover:border-[var(--line-strong)] transition-all">
            <CornerCrosses />
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              <CountUp to={3500} duration={2} suffix="+" />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-secondary)] mt-2">
              Registered Sales Comps
            </div>
          </div>

          <div className="relative has-crosses rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-5 hover:border-[var(--line-strong)] transition-all">
            <CornerCrosses />
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              <CountUp to={100} duration={1.5} suffix="%" />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-secondary)] mt-2">
              ASR Circle Rate Anchors
            </div>
          </div>

          <div className="relative has-crosses rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-5 hover:border-[var(--line-strong)] transition-all">
            <CornerCrosses />
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              0%
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-secondary)] mt-2">
              Speculative Markup
            </div>
          </div>

        </div>
      </section>

      {/* Two Solution Boxes (Architectural Framing with Corner Crosses) */}
      <section id="solution" className="py-24 bg-[var(--canvas)] transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex items-center justify-between border-b border-[var(--line)] pb-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-secondary)] font-semibold">
              01 // CORE ASSESSMENT FOUNDATIONS
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)]">
              STATEWIDE RECKONER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1 */}
            <div className="relative has-crosses rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)] p-8 flex flex-col justify-between transition-all shadow-sm">
              <CornerCrosses />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-3">
                  01.1 / TRANSACTION PARITY
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mb-3 font-sans">
                  No listing portal markups.
                </h3>
                <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed font-sans">
                  Sellers often inflate public listing prices by 10% to 15% just to leave room for negotiation. ATLAS analyzes actual registered transaction records so you know what buyers actually paid.
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--line)] mt-8 text-xs font-mono text-[var(--ink-secondary)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--ink)]" />
                <span>Calibrated against registered deeds, not asking prices</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="relative has-crosses rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)] p-8 flex flex-col justify-between transition-all shadow-sm">
              <CornerCrosses />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-3">
                  01.2 / LEGAL TRANSPARENCY
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mb-3 font-sans">
                  Official government circle rates.
                </h3>
                <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed font-sans">
                  Instantly verify the legal minimum valuation and exact stamp duty based on the official Maharashtra Ready Reckoner gazette. No surprises at the registration office.
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--line)] mt-8 text-xs font-mono text-[var(--ink-secondary)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--ink)]" />
                <span>Annual Statement of Rates (ASR 2024–2026) verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pro Scroll Stack Component */}
      <ScrollStack />

      {/* Giant Architectural Statement */}
      <section className="border-t border-b border-[var(--line)] py-20 sm:py-28 bg-[var(--surface)] overflow-hidden select-none transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-mono text-[14vw] sm:text-[16vw] font-black tracking-tighter leading-none text-[var(--ink)] uppercase">
            ATLAS
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-mono text-[var(--ink-secondary)] uppercase tracking-widest">
            Automated Terrain & Asset Location Assessment System
          </p>
        </div>
      </section>

      {/* Editorial Minimal Footer */}
      <footer className="bg-[var(--canvas)] border-t border-[var(--line)] py-12 mt-auto transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[var(--ink-muted)] font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[var(--ink)]">ATLAS</span>
            <span>— Property Valuation & Assessment Engine</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>All 36 Maharashtra Districts</span>
            <span>ASR 2024–2026</span>
            <span>© 2026 ATLAS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
