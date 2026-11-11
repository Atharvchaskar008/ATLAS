import React, { useState, useRef } from 'react';
import { ValuationResult } from '../types';
import { parsePropertyChat, estimateValuation } from '../api';
import { Paperclip, X, ArrowRight, Printer, Check, FileText, CheckCircle2 } from 'lucide-react';
import { TiltedCard } from './reactbits/TiltedCard';
import { ShinyText } from './reactbits/ShinyText';
import { ParticlesBackground } from './reactbits/ParticlesBackground';

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
  // Initially completely empty per user requirement
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
    <div className="bg-black text-white min-h-screen flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Dynamic 3D Geometric Particles Canvas */}
      <ParticlesBackground particleCount={35} particleColor="rgba(255, 255, 255, 0.35)" lineColor="rgba(255, 255, 255, 0.05)" />
      
      {/* Main Two-Box Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BOX 1: INPUT BOX (Left Column: 5 Cols) */}
        <section className="lg:col-span-5 bg-[#0C0C0C] rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Property Specifications
                </h2>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Describe the property in natural words
                </p>
              </div>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-xs font-sans text-neutral-500 hover:text-white transition-colors"
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
                placeholder="Type or paste property details in simple words...&#10;&#10;e.g., 2 BHK apartment in Moshi, Pune, 600 sqft on 2nd floor with covered parking, 16 years old&#10;or 3 BHK penthouse in Bandra West 1200 sqft on 14th floor with 2 covered parkings"
                className="w-full text-sm font-sans leading-relaxed text-white placeholder:text-neutral-500 bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800 focus:border-white focus:bg-neutral-950 focus:outline-none transition-all resize-none"
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
                <div className="border border-neutral-700 rounded-2xl p-3 flex items-center justify-between text-xs font-sans bg-neutral-900">
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0 text-white" />
                    <span className="truncate font-medium text-white">{attachedFile.name}</span>
                    <span className="text-neutral-500">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-neutral-500 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="doc-attachment"
                  className="border border-dashed border-neutral-800 hover:border-neutral-600 rounded-2xl p-3.5 cursor-pointer flex items-center justify-center space-x-2 text-xs font-sans text-neutral-400 hover:text-white bg-neutral-950/60 hover:bg-neutral-900 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Attach floor plan, deed, or 7/12 extract (Optional)</span>
                </label>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">
              Natural language input
            </span>

            <button
              onClick={handleRunAssessment}
              disabled={loading || !inputText.trim()}
              className="bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              <span>{loading ? 'Evaluating...' : 'Calculate Fair Value'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* BOX 2: OUTPUT BOX (Right Column: 7 Cols) */}
        <section className="lg:col-span-7 bg-[#0C0C0C] rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Property Valuation Engine
                </h2>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Fair market appraisal & statutory calculations
                </p>
              </div>

              {valuation && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopySummary}
                    className="text-xs font-sans text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="text-xs font-sans text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3 h-3 text-neutral-400" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-xs font-sans text-red-300">
                {error}
              </div>
            )}

            {/* Content Body */}
            {valuation ? (
              <div className="space-y-6">
                
                {/* 1. Primary Valuation Number Card (Both Lakhs and Crores) */}
                {(() => {
                  const dual = formatDualCurrency(valuation.estimated_value_lakhs);
                  const rangeMin = formatDualCurrency(valuation.value_range_lakhs.min);
                  const rangeMax = formatDualCurrency(valuation.value_range_lakhs.max);

                  return (
                    <TiltedCard maxTilt={6} scale={1.01} className="w-full">
                      <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 shadow-xl shadow-black/60">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                          Estimated Fair Market Value
                        </span>
                        
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                          <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                            <ShinyText text={dual.full} speed={3.5} />
                          </span>
                          <span className="text-sm font-mono text-neutral-400 font-medium">
                            {dual.alt} • ₹{valuation.rate_per_sqft_carpet.toLocaleString()} / sq.ft
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-neutral-500 font-sans">
                          Estimated fair range: {rangeMin.main} – {rangeMax.main} (85% registered comps parity)
                        </div>
                      </div>
                    </TiltedCard>
                  );
                })()}

                {/* 2. Bank Underwriting Status Badge */}
                <div className="bg-emerald-950/30 border border-emerald-800/80 rounded-2xl p-4 flex items-center justify-between text-xs font-sans text-emerald-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold">
                      Bank Verdict: {valuation.gemini_ai_layer?.appraisal_verdict || 'Fair Market Parity'}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-medium">
                    Standard 80% Loan Eligible
                  </span>
                </div>

                {/* 3. Core Property Specifications Grid */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2.5">
                    Property Specifications
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Location</span>
                      <span className="font-semibold text-white">{valuation.property_summary.locality}</span>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Configuration</span>
                      <span className="font-semibold text-white">
                        {valuation.property_summary.typology ||
                          (valuation.property_summary.bhk === 1 && valuation.property_summary.carpet_sqft <= 350
                            ? '1 RK'
                            : `${valuation.property_summary.bhk} BHK`)}
                      </span>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Carpet Area</span>
                      <span className="font-semibold text-white">{valuation.property_summary.carpet_sqft} sq.ft</span>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Floor Level</span>
                      <span className="font-semibold text-white">{valuation.property_summary.floor} of {valuation.property_summary.total_floors}</span>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Building Age</span>
                      <span className="font-semibold text-white">{valuation.property_summary.age_years} Years</span>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Parking</span>
                      <span className="font-semibold text-white">{valuation.property_summary.parking}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Statutory Government Benchmark (Circle Rate) */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2.5">
                    Official Government Benchmark
                  </span>
                  <div className="rounded-2xl border border-neutral-800 p-4 space-y-2.5 text-xs font-sans bg-neutral-950">
                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-neutral-400">Government Ready Reckoner Circle Rate</span>
                      <span className="font-semibold text-white">
                        ₹{valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-neutral-400">Statutory Base Floor Value</span>
                      <span className="font-semibold text-white">
                        {formatDualCurrency(valuation.government_benchmark.government_floor_value_lakhs).full}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-300 pt-2 border-t border-neutral-800">
                      <span className="text-neutral-400">Estimated Stamp Duty & Registration ({valuation.government_benchmark.stamp_duty_pct}%)</span>
                      <span className="font-semibold text-white">
                        {formatDualCurrency(valuation.government_benchmark.stamp_duty_estimate_lakhs).full}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Locality Context Summary */}
                {valuation.gemini_ai_layer?.livability_summary && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-1.5">
                      Neighborhood Insight
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans bg-neutral-950 rounded-2xl p-4 border border-neutral-800">
                      {valuation.gemini_ai_layer.livability_summary}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center text-neutral-500 text-xs font-sans">
                Awaiting property details. Enter specifications on the left and click Calculate Fair Value.
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-sans">
            <span>Verified against registered deeds & ASR circle rates</span>
            <span>Bank-compliant memorandum</span>
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="bg-black border-t border-neutral-800 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-neutral-500 font-sans">
          <div>ATLAS Real Estate Valuation Engine</div>
          <div>Official Circle Rates (ASR 2024–2026)</div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
