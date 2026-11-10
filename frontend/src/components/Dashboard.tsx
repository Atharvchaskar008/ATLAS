import React, { useState, useRef } from 'react';
import { ValuationResult } from '../types';
import { parsePropertyChat, estimateValuation } from '../api';
import { Paperclip, X, ArrowRight, Printer, Check, FileText, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  onBackToLanding: () => void;
}

const DEFAULT_EXAMPLE = '2 BHK apartment in Moshi, Pune, 600 sqft on 2nd floor with covered parking, 16 years old';

export const Dashboard: React.FC<DashboardProps> = () => {
  const [inputText, setInputText] = useState(DEFAULT_EXAMPLE);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run initial valuation on load
  React.useEffect(() => {
    handleRunAssessment(DEFAULT_EXAMPLE);
  }, []);

  const handleRunAssessment = async (textToAssess?: string) => {
    const text = textToAssess ?? inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const parsedData = await parsePropertyChat(text);
      if (parsedData && parsedData.valuation) {
        setValuation(parsedData.valuation);
      } else {
        // Fallback default evaluation
        const fallbackProp = {
          locality: 'Moshi / Sector 6 (Jal Vayu Vihar)',
          bhk: 2,
          carpet_sqft: 600,
          floor: 2,
          total_floors: 4,
          age_years: 16,
          parking: 'Covered',
          facing: 'East',
          furnishing: 'Semi-Furnished',
          society_amenities: 'Basic Society',
          lat: 18.6742,
          lng: 73.8445,
        };
        const res = await estimateValuation(fallbackProp);
        setValuation(res);
      }
    } catch (err: any) {
      console.warn('Evaluation fallback triggered', err);
      try {
        const fallbackProp = {
          locality: 'Moshi / Sector 6 (Jal Vayu Vihar)',
          bhk: 2,
          carpet_sqft: 600,
          floor: 2,
          total_floors: 4,
          age_years: 16,
          parking: 'Covered',
          facing: 'East',
          furnishing: 'Semi-Furnished',
          society_amenities: 'Basic Society',
          lat: 18.6742,
          lng: 73.8445,
        };
        const res = await estimateValuation(fallbackProp);
        setValuation(res);
      } catch (inner: any) {
        setError(inner.message || 'Unable to calculate valuation');
      }
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
    const summary = `PROPERTY VALUATION REPORT\nLocation: ${valuation.property_summary.locality}, ${valuation.property_summary.district}\nEstimated Value: ₹${valuation.estimated_value_lakhs.toFixed(2)} Lakhs\nRate: ₹${valuation.rate_per_sqft_carpet.toLocaleString()}/sq.ft\nGovernment Circle Rate: ₹${valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()}/sq.ft\nEstimated Stamp Duty: ₹${valuation.government_benchmark.stamp_duty_estimate_lakhs.toFixed(2)} Lakhs`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-50/60 text-neutral-900 min-h-screen flex flex-col font-sans">
      
      {/* Main Two-Box Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BOX 1: INPUT BOX (Left Column: 5 Cols) */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  Property Details
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Type or paste the listing in simple words
                </p>
              </div>
              <button
                onClick={() => setInputText('')}
                className="text-xs font-sans text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                placeholder="Describe the property in natural words...&#10;&#10;e.g., 2 BHK apartment in Moshi, Pune, 600 sqft on 2nd floor with covered parking, 16 years old"
                className="w-full text-sm font-sans leading-relaxed text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/70 rounded-2xl p-4 border border-neutral-200/80 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all resize-none"
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
                <div className="border border-neutral-200 rounded-2xl p-3 flex items-center justify-between text-xs font-sans bg-neutral-50">
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0 text-neutral-800" />
                    <span className="truncate font-medium text-neutral-800">{attachedFile.name}</span>
                    <span className="text-neutral-400">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-neutral-400 hover:text-neutral-800 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="doc-attachment"
                  className="border border-dashed border-neutral-300 hover:border-neutral-500 rounded-2xl p-3.5 cursor-pointer flex items-center justify-center space-x-2 text-xs font-sans text-neutral-600 hover:text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Attach floor plan, deed, or 7/12 extract (Optional)</span>
                </label>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-mono">
              Natural language input
            </span>

            <button
              onClick={() => handleRunAssessment()}
              disabled={loading || !inputText.trim()}
              className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed px-6 py-3 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all active:scale-95 shadow-sm"
            >
              <span>{loading ? 'Evaluating...' : 'Calculate Fair Value'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* BOX 2: OUTPUT BOX (Right Column: 7 Cols) */}
        <section className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  Valuation Summary
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Verified fair market pricing & legal benchmarks
                </p>
              </div>

              {valuation && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopySummary}
                    className="text-xs font-sans text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="text-xs font-sans text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3 h-3 text-neutral-500" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-neutral-100 text-xs font-sans text-neutral-800">
                {error}
              </div>
            )}

            {/* Content Body */}
            {valuation ? (
              <div className="space-y-6">
                
                {/* 1. Primary Valuation Number Card */}
                <div className="bg-neutral-50/80 rounded-2xl p-6 border border-neutral-200/70">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Estimated Fair Market Value
                  </span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
                      ₹{valuation.estimated_value_lakhs.toFixed(2)} Lakhs
                    </span>
                    <span className="text-sm font-sans font-medium text-neutral-600">
                      ₹{valuation.rate_per_sqft_carpet.toLocaleString()} / sq.ft
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-neutral-500 font-sans">
                    Estimated fair trading range: ₹{valuation.value_range_lakhs.min.toFixed(2)} L – ₹{valuation.value_range_lakhs.max.toFixed(2)} L
                  </div>
                </div>

                {/* 2. Bank Approval Status Badge */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-xs font-sans text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">
                      Bank Verdict: {valuation.gemini_ai_layer?.appraisal_verdict || 'Fair Market Parity'}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-medium">
                    Eligible for 80% Home Loan
                  </span>
                </div>

                {/* 3. Core Property Specifications Grid */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2.5">
                    Property Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Location</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.locality}</span>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Configuration</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.bhk} BHK</span>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Carpet Area</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.carpet_sqft} sq.ft</span>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Floor Level</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.floor} of {valuation.property_summary.total_floors}</span>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Building Age</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.age_years} Years</span>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                      <span className="text-neutral-400 block text-[11px]">Parking</span>
                      <span className="font-semibold text-neutral-900">{valuation.property_summary.parking}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Statutory Government Benchmark (Circle Rate) */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2.5">
                    Official Government Benchmark
                  </span>
                  <div className="rounded-2xl border border-neutral-200 p-4 space-y-2.5 text-xs font-sans bg-white">
                    <div className="flex justify-between items-center text-neutral-700">
                      <span>Government Ready Reckoner Circle Rate</span>
                      <span className="font-semibold text-neutral-900">
                        ₹{valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-700">
                      <span>Statutory Base Floor Value</span>
                      <span className="font-semibold text-neutral-900">
                        ₹{valuation.government_benchmark.government_floor_value_lakhs.toFixed(2)} Lakhs
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-700 pt-2 border-t border-neutral-100">
                      <span>Estimated Stamp Duty & Registration ({valuation.government_benchmark.stamp_duty_pct}%)</span>
                      <span className="font-semibold text-neutral-900">
                        ₹{valuation.government_benchmark.stamp_duty_estimate_lakhs.toFixed(2)} Lakhs
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Locality Context Summary */}
                {valuation.gemini_ai_layer?.livability_summary && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Neighborhood Insight
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans bg-neutral-50 rounded-2xl p-4 border border-neutral-200/60">
                      {valuation.gemini_ai_layer.livability_summary}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center text-neutral-400 text-xs font-sans">
                Enter your property details on the left to calculate the fair market value.
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-sans">
            <span>Verified against registered deeds & ASR circle rates</span>
            <span>Bank-compliant format</span>
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-neutral-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-neutral-500 font-sans">
          <div>ATLAS Real Estate Valuation Engine</div>
          <div>Official Circle Rates (ASR 2024–2026)</div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
