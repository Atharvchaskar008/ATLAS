import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ScrollStack } from './ScrollStack';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectPreset?: (presetName: string) => void;
}

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Modern Villa Architecture',
    caption: 'Verified spatial assessment & land parcel valuation',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    title: 'Sunlit Urban Residence',
    caption: 'Carpet efficiency & registered transaction benchmarking',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    title: 'Contemporary Living Space',
    caption: 'Circle rate statutory compliance across Maharashtra',
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    title: 'Prime Residential Asset',
    caption: 'Instant bank-grade appraisal for buyers & lenders',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-cycle hero images smoothly every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Clear Natural Language */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08]">
            Know the true market value of any property.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed">
            Online real estate portals often show inflated asking prices. ATLAS helps you discover the genuine, transacted market value and official circle rates before you buy, sell, or take a loan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="bg-neutral-900 text-white hover:bg-neutral-800 px-8 py-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <span>Estimate Property Value</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#solution"
              className="border border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-8 py-4 rounded-full text-sm font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Colorful Cross-Fading Architectural Carousel */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl border border-neutral-200/80 p-2.5 bg-neutral-50 shadow-xl overflow-hidden">
            {/* Image Frame */}
            <div className="relative overflow-hidden aspect-[4/5] rounded-2xl bg-neutral-200">
              {HERO_IMAGES.map((img, idx) => (
                <div
                  key={img.url}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Image Badge at Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-display font-bold">{img.title}</div>
                    <div className="text-xs text-white/80 font-sans mt-0.5">{img.caption}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Dot Indicators */}
            <div className="mt-3 px-2 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {HERO_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                0{activeImageIndex + 1} / 0{HERO_IMAGES.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Card Boxes Explaining the Solution */}
      <section id="solution" className="border-t border-neutral-200 bg-neutral-50/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              The Reality
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              Maharashtra Statewide Coverage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1 */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-4">01 / HONEST PRICING</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
                  No listing portal markups.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                  Sellers often inflate public listing prices by 10% to 15% just to leave room for negotiation. ATLAS analyzes actual registered transaction records so you know what buyers actually paid.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-100 mt-8 text-xs font-mono text-neutral-500">
                Based on actual deeds, not asking prices
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-4">02 / LEGAL TRANSPARENCY</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
                  Official government circle rates.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                  Instantly verify the legal minimum valuation and exact stamp duty based on the official Maharashtra Ready Reckoner gazette. No surprises at the registration office.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-100 mt-8 text-xs font-mono text-neutral-500">
                Official Ready Reckoner (ASR 2024–2026) verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* React Bits Pro Scroll Stack Component */}
      <ScrollStack />

      {/* Giant Statement: ATLAS */}
      <section className="border-t border-b border-neutral-200 py-16 sm:py-24 bg-white overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-[15vw] sm:text-[18vw] font-black tracking-tighter leading-none text-neutral-900 uppercase">
            ATLAS
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-400 uppercase tracking-widest">
            Automated Terrain & Asset Location Assessment System
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-neutral-900 font-display">ATLAS</span>
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
