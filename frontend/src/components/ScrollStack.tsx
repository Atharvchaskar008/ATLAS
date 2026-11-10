import React from 'react';
import { ShieldCheck, TrendingUp, Compass, FileCheck } from 'lucide-react';

interface StackCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const CARDS: StackCard[] = [
  {
    id: '01',
    tag: 'Unbiased Market Truth',
    title: 'Cut through listing markups.',
    description: 'Online portals frequently list flats with a 10% to 15% asking premium. ATLAS calculates the actual transaction price based on registered sales deeds in the neighborhood.',
    metric: '10–15%',
    metricLabel: 'Average Portal Asking Inflation Eliminated',
    icon: <TrendingUp className="w-5 h-5 text-neutral-900" />,
    bgGradient: 'bg-white',
  },
  {
    id: '02',
    tag: 'Statutory Transparency',
    title: 'Official government circle rates.',
    description: 'Every valuation is anchored against the official Maharashtra IGR Ready Reckoner. You see the legal minimum benchmark and exact stamp duty before signing.',
    metric: 'ASR 2024–26',
    metricLabel: 'Statewide Gazette Rate Compliance',
    icon: <ShieldCheck className="w-5 h-5 text-neutral-900" />,
    bgGradient: 'bg-neutral-50',
  },
  {
    id: '03',
    tag: 'Location Intelligence',
    title: 'Surrounding transit and amenities.',
    description: 'Automatically analyzes proximity to operational metros, expressways, schools, and employment centers to gauge long-term livability and appreciation.',
    metric: '3,000 m',
    metricLabel: 'Radial Infrastructure POI Radar',
    icon: <Compass className="w-5 h-5 text-neutral-900" />,
    bgGradient: 'bg-white',
  },
  {
    id: '04',
    tag: 'Bank-Grade Appraisal',
    title: 'Ready for loans and transactions.',
    description: 'Clear, concise property assessment summaries formatted for institutional loan underwriting, private negotiation, and instant buyer peace of mind.',
    metric: '80% LTV',
    metricLabel: 'Standard Bank Eligibility Guidance',
    icon: <FileCheck className="w-5 h-5 text-neutral-900" />,
    bgGradient: 'bg-neutral-50',
  },
];

export const ScrollStack: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-neutral-200">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">
            Why ATLAS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            A smarter way to value property.
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed font-sans">
            Built without technical jargon or speculative hype. Just honest, data-backed valuations for home buyers, sellers, and lenders.
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative space-y-6">
          {CARDS.map((card, index) => {
            // Cards stick to the top with an increasing offset to create the stacking deck effect
            const topOffset = 90 + index * 20;

            return (
              <div
                key={card.id}
                style={{ top: `${topOffset}px` }}
                className={`sticky rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ${card.bgGradient} hover:border-neutral-400`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Story */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        {card.icon}
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      {card.title}
                    </h3>

                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
                      {card.description}
                    </p>
                  </div>

                  {/* Right Column: Metric Callout */}
                  <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                    <div className="font-display text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
                      {card.metric}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono mt-1">
                      {card.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollStack;
