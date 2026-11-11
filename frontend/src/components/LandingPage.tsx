import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ScrollStack } from './ScrollStack';
import { SpotlightCard } from './reactbits/SpotlightCard';
import { DecryptedText } from './reactbits/DecryptedText';
import { CountUp } from './reactbits/CountUp';
import { AsciiArchitecture } from './AsciiArchitecture';
import { TiltedCard } from './reactbits/TiltedCard';
import { ShinyText } from './reactbits/ShinyText';
import { ParticlesBackground } from './reactbits/ParticlesBackground';

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
    <div className="bg-black text-white min-h-screen flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Dynamic 3D Geometric Particles Canvas */}
      <ParticlesBackground particleCount={40} particleColor="rgba(255, 255, 255, 0.4)" lineColor="rgba(255, 255, 255, 0.06)" />
      
      {/* Top Large Scroll Progress Bar (Design Showcase) */}
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-neutral-900 z-40">
        <div
          className="h-full bg-gradient-to-r from-neutral-400 via-white to-neutral-200 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Clear Natural Language + Decrypted Text Effect */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            <DecryptedText
              text="Know the true market value of any property."
              speed={30}
              maxIterations={12}
              animateOn="view"
            />
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-xl font-normal leading-relaxed font-sans">
            Online real estate portals often show inflated asking prices. ATLAS calculates the honest, transacted market value and official circle rates before you buy, sell, or finance.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xl shadow-white/5 group"
            >
              <span>Estimate Property Value</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            </button>
            
            <a
              href="#solution"
              className="border border-neutral-800 text-neutral-300 hover:bg-neutral-900 px-8 py-4 rounded-full text-sm font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </a>
          </div>
        </div>

        {/* Right Column: ASCII Real Estate Architectural Structure Terminal */}
        <div className="lg:col-span-5">
          <AsciiArchitecture />
        </div>
      </section>

      {/* Dynamic Animated Statistics Bar (CountUp Component) */}
      <section className="border-t border-b border-neutral-800/80 bg-neutral-950 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-display text-4xl sm:text-5xl font-black text-white">
              <CountUp to={36} duration={1.8} />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Maharashtra Districts</div>
          </div>

          <div>
            <div className="font-display text-4xl sm:text-5xl font-black text-white">
              <CountUp to={3500} duration={2} suffix="+" />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Registered Transactions</div>
          </div>

          <div>
            <div className="font-display text-4xl sm:text-5xl font-black text-white">
              <CountUp to={100} duration={1.5} suffix="%" />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Official ASR Circle Rate Anchors</div>
          </div>

          <div>
            <div className="font-display text-4xl sm:text-5xl font-black text-white">
              0%
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Speculative Seller Markup</div>
          </div>
        </div>
      </section>

      {/* Two Solution Cards with SpotlightCard */}
      <section id="solution" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              The Reality
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              Maharashtra Statewide Coverage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1 (TiltedCard + SpotlightCard) */}
            <TiltedCard maxTilt={7} scale={1.01} className="h-full">
              <SpotlightCard className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono text-neutral-500 block mb-4">01 / HONEST PRICING</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                    No listing portal markups.
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
                    Sellers often inflate public listing prices by 10% to 15% just to leave room for negotiation. ATLAS analyzes actual registered transaction records so you know what buyers actually paid.
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-800 mt-8 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Based on actual deeds, not asking prices</span>
                </div>
              </SpotlightCard>
            </TiltedCard>

            {/* Box 2 (TiltedCard + SpotlightCard) */}
            <TiltedCard maxTilt={7} scale={1.01} className="h-full">
              <SpotlightCard className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono text-neutral-500 block mb-4">02 / LEGAL TRANSPARENCY</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                    Official government circle rates.
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
                    Instantly verify the legal minimum valuation and exact stamp duty based on the official Maharashtra Ready Reckoner gazette. No surprises at the registration office.
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-800 mt-8 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Official Ready Reckoner (ASR 2024–2026) verified</span>
                </div>
              </SpotlightCard>
            </TiltedCard>
          </div>
        </div>
      </section>

      {/* React Bits Pro Scroll Stack Component (Inverted Crisp White Cards on Black Canvas) */}
      <ScrollStack />

      {/* Giant Statement: ATLAS */}
      <section className="border-t border-b border-neutral-900 py-20 sm:py-28 bg-black overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-[15vw] sm:text-[18vw] font-black tracking-tighter leading-none text-white uppercase">
            ATLAS
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-500 uppercase tracking-widest">
            Automated Terrain & Asset Location Assessment System
          </p>
        </div>
      </section>

      {/* Minimal Dark Footer */}
      <footer className="bg-black border-t border-neutral-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white font-display">ATLAS</span>
            <span>— Property Valuation & Assessment</span>
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
