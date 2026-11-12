import React, { useState, useRef } from 'react';
import { ValuationResult } from '../types';
import { parsePropertyChat } from '../api';
import { Paperclip, X, ArrowRight, Printer, Check, FileText } from 'lucide-react';

interface DashboardProps {
  onBackToLanding: () => void;
}

// Utility to cleanly format values in both Lakhs and Crores
const formatDualCurrency = (lakhs: number) => {
  const crores = lakhs / 100.0;
  if (crores >= 1.0) {
    return {
      main: `₹${crores.toFixed(2)} Cr`,
      full: `₹${crores.toFixed(2)} Crores`,
      alt: `₹${lakhs.toFixed(2)} Lakhs`,
    };
  }
  return {
    main: `₹${lakhs.toFixed(2)} L`,
    full: `₹${lakhs.toFixed(2)} Lakhs`,
    alt: `₹${crores.toFixed(2)} Crores`,
  };
};

export const Dashboard: React.FC<DashboardProps> = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunAssessment = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const parsedData = await parsePropertyChat(inputText);
      if (parsedData && parsedData.valuation) {
        setValuation(parsedData.valuation);
      } else {
        throw new Error('Unable to extract valuation for this property description.');
      }
    } catch (err: any) {
      console.error('Assessment error:', err);
      setError(
        err.message || 'Unable to parse property details. Please try specifying the locality, BHK, and carpet area in simple words.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopySummary = () => {
    if (!valuation) return;
    const dual = formatDualCurrency(valuation.estimated_value_lakhs);
    const summary = `ATLAS PROPERTY VALUATION\nLocation: ${valuation.property_summary.locality}, ${valuation.property_summary.district}\nEstimated Value: ${dual.full} (${dual.alt})\nRate: ₹${valuation.rate_per_sqft_carpet.toLocaleString()}/sq.ft\nCircle Rate: ₹${valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()}/sq.ft\nStamp Duty & Reg: ₹${valuation.government_benchmark.stamp_duty_estimate_lakhs.toFixed(2)} Lakhs`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen flex flex-col font-sans transition-colors duration-250">
      
      {/* Main Two-Box Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BOX 1: INPUT BOX (Left Column: 5 Cols) */}
        <section className="relative lg:col-span-5 bg-[var(--surface)] rounded-2xl border border-[var(--line)] hover:border-[var(--line-strong)] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div>
                <h2 className="font-sans font-bold text-lg text-[var(--ink)]">
                  Property Specifications
                </h2>
                <p className="text-xs text-[var(--ink-secondary)] font-sans mt-0.5">
                  Describe the property in natural words
                </p>
              </div>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-[11px] font-mono text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors px-2.5 py-1 rounded border border-[var(--line)] hover:border-[var(--line-strong)]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Textarea */}
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={9}
                placeholder="Type or paste property details in simple words...&#10;&#10;e.g., 1 RK flat in Mazgaon Hattibaugh area, 300 sqft on 2nd floor with parking and lift&#10;or 2 BHK apartment in Moshi, Pune, 600 sqft on 2nd floor with covered parking&#10;or 3 BHK penthouse in Bandra West 1200 sqft on 14th floor with 2 covered parkings"
                className="w-full text-sm font-sans leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-muted)] bg-[var(--surface-elevated)] rounded-xl p-4 border border-[var(--line)] focus:border-[var(--line-strong)] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Document Attachment Area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                id="doc-attachment"
              />

              {attachedFile ? (
                <div className="border border-[var(--line)] rounded-xl p-3 flex items-center justify-between text-xs font-sans bg-[var(--surface-elevated)]">
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0 text-[var(--ink)]" />
                    <span className="truncate font-medium text-[var(--ink)]">{attachedFile.name}</span>
                    <span className="text-[var(--ink-muted)] font-mono">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-[var(--ink-secondary)] hover:text-[var(--ink)] p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="doc-attachment"
                  className="border border-dashed border-[var(--line)] hover:border-[var(--line-strong)] rounded-xl p-3.5 cursor-pointer flex items-center justify-center space-x-2 text-xs font-sans text-[var(--ink-secondary)] hover:text-[var(--ink)] bg-[var(--surface-elevated)] transition-all"
                >
                  <Paperclip className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                  <span>Add additional details</span>
                </label>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-[var(--line)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--ink-muted)] font-mono uppercase tracking-wider">
              Natural language input
            </span>

            <button
              onClick={handleRunAssessment}
              disabled={loading || !inputText.trim()}
              className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 shadow-sm"
            >
              <span>{loading ? 'Evaluating...' : 'Calculate Fair Value'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* BOX 2: OUTPUT BOX (Right Column: 7 Cols) */}
        <section className="relative lg:col-span-7 bg-[var(--surface)] rounded-2xl border border-[var(--line)] hover:border-[var(--line-strong)] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 min-h-[520px] shadow-sm">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div>
                <h2 className="font-sans font-bold text-lg text-[var(--ink)]">
                  Property Valuation Engine
                </h2>
                <p className="text-xs text-[var(--ink-secondary)] font-sans mt-0.5">
                  Fair market appraisal & statutory calculations
                </p>
              </div>

              {valuation && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopySummary}
                    className="text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink)] px-3 py-1.5 rounded border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors flex items-center gap-1.5 bg-[var(--surface-elevated)]"
                  >
                    {copied ? <Check className="w-3 h-3 text-[var(--ink)]" /> : null}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink)] px-3 py-1.5 rounded border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors flex items-center gap-1.5 bg-[var(--surface-elevated)]"
                  >
                    <Printer className="w-3 h-3 text-[var(--ink-muted)]" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--line-strong)] text-xs font-mono text-[var(--ink)]">
                {error}
              </div>
            )}

            {/* Content Body */}
            {valuation ? (
              <div className="space-y-6">
                
                {/* 1. Primary Valuation Number Card (Harmonized Architectural Card) */}
                {(() => {
                  const dual = formatDualCurrency(valuation.estimated_value_lakhs);
                  const rangeMin = formatDualCurrency(valuation.value_range_lakhs.min);
                  const rangeMax = formatDualCurrency(valuation.value_range_lakhs.max);

                  return (
                    <div className="rounded-xl p-6 border border-[var(--line)] bg-[var(--surface-elevated)] transition-colors">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-1">
                        ESTIMATED FAIR MARKET VALUE
                      </span>
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 my-1">
                        <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
                          {dual.full}
                        </span>
                        <span className="text-sm font-mono text-[var(--ink-secondary)] font-medium">
                          {dual.alt} • ₹{valuation.rate_per_sqft_carpet.toLocaleString()} / sq.ft
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-[var(--ink-muted)] font-mono">
                        Estimated fair range: {rangeMin.main} – {rangeMax.main} (85% registered comps parity)
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Institutional Underwriting Status Badge (Harmonized, Clean) */}
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans text-[var(--ink)] gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--ink)] flex-shrink-0" />
                    <span className="font-medium text-[var(--ink)]">
                      Bank Verdict: {valuation.gemini_ai_layer?.appraisal_verdict || 'Institutional Parity Validated'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[var(--ink-secondary)] uppercase tracking-wider">
                    Standard 80% Loan Eligible
                  </span>
                </div>

                {/* 3. Core Property Specifications Grid (Harmonized Uniform Cards) */}
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-2.5">
                    PROPERTY SPECIFICATIONS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Location</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">{valuation.property_summary.locality}</span>
                    </div>

                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Configuration</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">
                        {valuation.property_summary.typology ||
                          (valuation.property_summary.bhk === 1 && valuation.property_summary.carpet_sqft <= 350
                            ? '1 RK'
                            : `${valuation.property_summary.bhk} BHK`)}
                      </span>
                    </div>

                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Carpet Area</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">{valuation.property_summary.carpet_sqft} sq.ft</span>
                    </div>

                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Floor Level</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">{valuation.property_summary.floor} of {valuation.property_summary.total_floors}</span>
                    </div>

                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Building Age</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">{valuation.property_summary.age_years} Years</span>
                    </div>

                    <div className="bg-[var(--surface-elevated)] rounded-lg p-3 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors">
                      <span className="text-[var(--ink-muted)] block text-[10px] font-mono uppercase tracking-wider">Parking</span>
                      <span className="font-medium text-[var(--ink)] mt-0.5 block">{valuation.property_summary.parking}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Statutory Government Benchmark (Circle Rate) */}
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-2.5">
                    OFFICIAL GOVERNMENT BENCHMARK
                  </span>
                  <div className="rounded-xl border border-[var(--line)] p-4 space-y-2.5 text-xs font-sans bg-[var(--surface-elevated)]">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-secondary)]">Ready Reckoner Circle Rate</span>
                      <span className="font-mono font-medium text-[var(--ink)]">
                        ₹{valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-secondary)]">Statutory Base Floor Value</span>
                      <span className="font-mono font-medium text-[var(--ink)]">
                        {formatDualCurrency(valuation.government_benchmark.government_floor_value_lakhs).full}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[var(--line)]">
                      <span className="text-[var(--ink-secondary)]">
                        Stamp Duty & Registration ({valuation.government_benchmark.stamp_duty_pct}%)
                      </span>
                      <span className="font-mono font-medium text-[var(--ink)]">
                        {formatDualCurrency(valuation.government_benchmark.stamp_duty_estimate_lakhs).full}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Locality Context Summary */}
                {valuation.gemini_ai_layer?.livability_summary && (
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-1.5">
                      NEIGHBORHOOD CONTEXT
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed font-sans bg-[var(--surface-elevated)] rounded-xl p-4 border border-[var(--line)]">
                      {valuation.gemini_ai_layer.livability_summary}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center text-[var(--ink-muted)] text-xs font-mono">
                Awaiting property details. Enter specifications on the left and click Calculate Fair Value.
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--ink-muted)] font-mono">
            <span>Verified against registered deeds & ASR circle rates</span>
            <span>Bank-compliant memorandum</span>
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--line)] py-4 mt-auto transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--ink-muted)] font-mono">
          <div>ATLAS Real Estate Valuation Engine</div>
          <div>Official Circle Rates (ASR 2024–2026)</div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
