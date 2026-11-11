import React from 'react';
import { ShieldCheck, TrendingUp, Compass, FileCheck } from 'lucide-react';
import { CornerCrosses } from './CornerCrosses';

interface StackCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
}

const CARDS: StackCard[] = [
  {
    id: '01',
    tag: 'Unbiased Market Truth',
    title: 'Cut through listing markups.',
    description: 'Online portals frequently list flats with a 10% to 15% asking premium. ATLAS calculates the actual transaction price based on registered sales deeds in the neighborhood.',
    metric: '10–15%',
    metricLabel: 'Average Portal Asking Markup Filtered',
    icon: <TrendingUp className="w-5 h-5 text-[var(--ink)]" />,
  },
  {
    id: '02',
    tag: 'Statutory Transparency',
    title: 'Official government circle rates.',
    description: 'Every valuation is anchored against the official Maharashtra IGR Ready Reckoner. You see the legal minimum benchmark and exact stamp duty before signing.',
    metric: 'ASR 2024–26',
    metricLabel: 'Official Circle Rate Compliance',
    icon: <ShieldCheck className="w-5 h-5 text-[var(--ink)]" />,
  },
  {
    id: '03',
    tag: 'Location Intelligence',
    title: 'Surrounding transit and amenities.',
    description: 'Automatically analyzes proximity to operational metros, expressways, schools, and employment centers to gauge long-term livability and appreciation.',
    metric: '3,000 m',
    metricLabel: 'Radial Infrastructure Radar',
    icon: <Compass className="w-5 h-5 text-[var(--ink)]" />,
  },
  {
    id: '04',
    tag: 'Bank-Grade Appraisal',
    title: 'Ready for loans and transactions.',
    description: 'Clear, concise property assessment summaries formatted for institutional loan underwriting, private negotiation, and instant buyer peace of mind.',
    metric: '80% LTV',
    metricLabel: 'Standard Bank Eligibility Guidance',
    icon: <FileCheck className="w-5 h-5 text-[var(--ink)]" />,
  },
];

export const ScrollStack: React.FC = () => {
  return (
    <section className="py-24 bg-[var(--canvas)] border-t border-[var(--line)] transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-3">
            02 // SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] font-sans">
            A smarter way to value property.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed font-sans">
            Built without technical jargon or speculative hype. Just honest, data-backed valuations for home buyers, sellers, and lenders.
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative space-y-8 pb-12">
          {CARDS.map((card, index) => {
            const topOffset = 100 + index * 24;

            return (
              <div
                key={card.id}
                style={{ top: `${topOffset}px` }}
                className="sticky relative has-crosses rounded-2xl bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] p-8 sm:p-12 shadow-sm transition-all duration-300 hover:border-[var(--line-strong)]"
              >
                <CornerCrosses />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Story */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)] flex items-center justify-center">
                        {card.icon}
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-secondary)] font-medium">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight font-sans">
                      {card.title}
                    </h3>

                    <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                      {card.description}
                    </p>
                  </div>

                  {/* Right Column: Key Metric Highlight */}
                  <div className="md:col-span-4 flex md:flex-col justify-between items-start md:items-end p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--line)]">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-[var(--ink)] tracking-tight">
                      {card.metric}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] text-right mt-1 max-w-[140px]">
                      {card.metricLabel}
                    </span>
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
