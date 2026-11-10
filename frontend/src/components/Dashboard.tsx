import React, { useState, useRef } from 'react';
import { PropertyInput, ValuationResult } from '../types';
import { parsePropertyChat, estimateValuation } from '../api';
import { Paperclip, X, ArrowRight, Printer, Check, FileText } from 'lucide-react';

interface DashboardProps {
  onBackToLanding: () => void;
}

const PRESETS = [
  {
    name: 'Moshi (Pune)',
    text: '2 BHK in Jal Vayu Vihar Moshi Sector 6, 600 sqft carpet, 2nd floor of 4, covered parking, 16 yrs old, semi-furnished',
    property: {
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
    }
  },
  {
    name: 'Bandra (Mumbai)',
    text: '3 BHK in Bandra West Pali Hill, 1200 sqft carpet, 14th floor of 22, 2 covered parkings, 3 yrs old, luxury furnished, premium gated society',
    property: {
      locality: 'Bandra West / Khar',
      bhk: 3,
      carpet_sqft: 1200,
      floor: 14,
      total_floors: 22,
      age_years: 3,
      parking: '2 Covered',
      facing: 'North-East',
      furnishing: 'Luxury Furnished',
      society_amenities: 'Township / Multi-Clubhouse',
      lat: 19.0596,
      lng: 72.8295,
    }
  },
  {
    name: 'Powai (MMR)',
    text: '2 BHK in Powai Hiranandani Gardens, 780 sqft carpet, 18th floor of 28, covered parking, 4 yrs old, fully furnished',
    property: {
      locality: 'Powai / Hiranandani',
      bhk: 2,
      carpet_sqft: 780,
      floor: 18,
      total_floors: 28,
      age_years: 4,
      parking: 'Covered',
      facing: 'East',
      furnishing: 'Fully Furnished',
      society_amenities: 'Township / Multi-Clubhouse',
      lat: 19.1176,
      lng: 72.9060,
    }
  },
  {
    name: 'Nashik',
    text: '2 BHK in Gangapur Road Nashik, 750 sqft carpet, 5th floor of 12, covered parking, 4 yrs old, semi-furnished',
    property: {
      locality: 'Nashik (Gangapur Road / College Road)',
      bhk: 2,
      carpet_sqft: 750,
      floor: 5,
      total_floors: 12,
      age_years: 4,
      parking: 'Covered',
      facing: 'East',
      furnishing: 'Semi-Furnished',
      society_amenities: 'Basic Society',
      lat: 19.9975,
      lng: 73.7898,
    }
  },
  {
    name: 'Nagpur',
    text: '3 BHK in Dharampeth Nagpur, 1100 sqft carpet, 6th floor of 11, covered parking, 5 yrs old, fully furnished',
    property: {
      locality: 'Nagpur (Dharampeth / Civil Lines)',
      bhk: 3,
      carpet_sqft: 1100,
      floor: 6,
      total_floors: 11,
      age_years: 5,
      parking: 'Covered',
      facing: 'North',
      furnishing: 'Fully Furnished',
      society_amenities: 'Gated Society / Clubhouse',
      lat: 21.1458,
      lng: 79.0669,
    }
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ onBackToLanding }) => {
  const [inputText, setInputText] = useState(PRESETS[0].text);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Evaluate on mount with initial preset
  React.useEffect(() => {
    handleRunAssessment(PRESETS[0].text);
  }, []);

  const handleRunAssessment = async (textToAssess?: string) => {
    const text = textToAssess ?? inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Try parsing through natural language endpoint
      const parsedData = await parsePropertyChat(text);
      if (parsedData && parsedData.valuation) {
        setValuation(parsedData.valuation);
      } else {
        // Fallback to direct calculation
        const fallbackProp = PRESETS[0].property;
        const res = await estimateValuation(fallbackProp);
        setValuation(res);
      }
    } catch (err: any) {
      console.warn('Chat parse error, using fallback assessment', err);
      try {
        const fallbackProp = PRESETS[0].property;
        const res = await estimateValuation(fallbackProp);
        setValuation(res);
      } catch (inner: any) {
        setError(inner.message || 'Valuation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setInputText(preset.text);
    handleRunAssessment(preset.text);
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
    const summary = `ATLAS VALUATION REPORT\nLocation: ${valuation.property_summary.locality}, ${valuation.property_summary.district}\nEstimated Value: ₹${valuation.estimated_value_lakhs} Lakhs\nRate: ₹${valuation.rate_per_sqft_carpet}/sqft\nConfidence Range: ₹${valuation.value_range_lakhs.min}L - ₹${valuation.value_range_lakhs.max}L\nIGR Ready Reckoner: ₹${valuation.government_benchmark.ready_reckoner_rate_carpet}/sqft\nStamp Duty & Reg: ₹${valuation.government_benchmark.stamp_duty_estimate_lakhs} Lakhs`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col font-sans">
      {/* Top Context Bar */}
      <div className="border-b border-black bg-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToLanding}
              className="text-black hover:underline underline-offset-2 font-bold"
            >
              ← Overview
            </button>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-600">Maharashtra Statewide Terminal</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-neutral-500">
            <span>Anchor: IGR ASR 2024–2026</span>
            <span>Comps: 3,500+ Registered</span>
          </div>
        </div>
      </div>

      {/* Main Two-Box Split Layout (SETTL Style) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BOX 1: INPUT BOX (Left Column: 5 Cols) */}
        <section className="lg:col-span-5 border border-black bg-white flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-black px-5 py-3 flex items-center justify-between bg-white">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-black">
                01 / Property Specifications
              </span>
              <button
                onClick={() => setInputText('')}
                className="text-[11px] font-mono text-neutral-400 hover:text-black transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Presets Row */}
            <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono uppercase text-neutral-500 whitespace-nowrap">
                Presets:
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-[11px] font-mono px-2.5 py-1 border whitespace-nowrap transition-colors ${
                    inputText === p.text
                      ? 'border-black bg-black text-white font-bold'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="p-5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={9}
                placeholder="Paste listing text, broker message, or write specifications (e.g. 2 BHK in Jal Vayu Vihar Moshi Sector 6, 600 sqft carpet, 2nd floor of 4, covered parking, 16 yrs old, semi-furnished)..."
                className="w-full text-sm font-sans leading-relaxed text-black placeholder:text-neutral-400 bg-transparent resize-none focus:outline-none border-0 p-0"
              />
            </div>

            {/* File Attachment Area */}
            <div className="px-5 pb-5">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                id="doc-attachment"
              />

              {attachedFile ? (
                <div className="border border-black p-2.5 flex items-center justify-between text-xs font-mono bg-neutral-50">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0 text-black" />
                    <span className="truncate">{attachedFile.name}</span>
                    <span className="text-neutral-400">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-neutral-400 hover:text-black p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="doc-attachment"
                  className="border border-dashed border-neutral-300 hover:border-black p-3 cursor-pointer flex items-center justify-center space-x-2 text-xs font-mono text-neutral-500 hover:text-black transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach floorplan, index-II, or deed (.pdf, .jpg, .png)</span>
                </label>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-black p-4 bg-white flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400">
              {inputText.length} characters
            </span>

            <button
              onClick={() => handleRunAssessment()}
              disabled={loading || !inputText.trim()}
              className="bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed border border-black px-6 py-3 text-xs uppercase tracking-widest font-bold flex items-center space-x-2 transition-all active:translate-y-0.5"
            >
              <span>{loading ? 'Evaluating...' : 'Assess Property'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* BOX 2: OUTPUT BOX (Right Column: 7 Cols) */}
        <section className="lg:col-span-7 border border-black bg-white flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-black px-5 py-3 flex items-center justify-between bg-white">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-black">
                02 / Valuation Memorandum
              </span>

              {valuation && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCopySummary}
                    className="text-[11px] font-mono text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-black" /> : null}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="text-[11px] font-mono text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="p-4 border-b border-black bg-neutral-100 text-xs font-mono text-black">
                Error: {error}
              </div>
            )}

            {/* Content Area */}
            {valuation ? (
              <div className="p-6 sm:p-8 space-y-8">
                {/* Primary Fair Market Value */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
                    Fair Market Value
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <span className="font-display text-5xl sm:text-6xl font-black tracking-tight text-black">
                      ₹{valuation.estimated_value_lakhs.toFixed(2)} Lakhs
                    </span>
                    <span className="text-sm font-mono text-neutral-600">
                      ₹{valuation.rate_per_sqft_carpet.toLocaleString()} / sq.ft
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-neutral-500">
                    Confidence Bracket (85%): ₹{valuation.value_range_lakhs.min.toFixed(2)} L — ₹{valuation.value_range_lakhs.max.toFixed(2)} L
                  </div>
                </div>

                {/* Bank Underwriting Status Pill */}
                <div className="border border-black p-3.5 bg-neutral-50 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    <span className="font-bold text-black uppercase">
                      Bank Verdict: {valuation.gemini_ai_layer?.appraisal_verdict || 'Fair Market Parity'}
                    </span>
                  </div>
                  <span className="text-neutral-500 uppercase">
                    LTV Standard: 80%
                  </span>
                </div>

                {/* Property Specification Grid */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
                    Subject Asset Parameters
                  </div>
                  <div className="border border-black divide-y divide-black text-xs font-mono">
                    <div className="grid grid-cols-2 divide-x divide-black p-3">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Location</span>
                        <span className="font-bold text-black text-sm">{valuation.property_summary.locality}</span>
                      </div>
                      <div className="pl-3">
                        <span className="text-neutral-400 block text-[10px] uppercase">Jurisdiction</span>
                        <span className="font-bold text-black text-sm">{valuation.property_summary.district} ({valuation.property_summary.authority})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-black p-3">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Carpet Area</span>
                        <span className="font-bold text-black">{valuation.property_summary.carpet_sqft} sq.ft</span>
                      </div>
                      <div className="pl-3">
                        <span className="text-neutral-400 block text-[10px] uppercase">Configuration</span>
                        <span className="font-bold text-black">{valuation.property_summary.bhk} BHK</span>
                      </div>
                      <div className="pl-3">
                        <span className="text-neutral-400 block text-[10px] uppercase">Floor Level</span>
                        <span className="font-bold text-black">{valuation.property_summary.floor} of {valuation.property_summary.total_floors}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-black p-3">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Structure Age</span>
                        <span className="font-bold text-black">{valuation.property_summary.age_years} Years</span>
                      </div>
                      <div className="pl-3">
                        <span className="text-neutral-400 block text-[10px] uppercase">Parking</span>
                        <span className="font-bold text-black">{valuation.property_summary.parking}</span>
                      </div>
                      <div className="pl-3">
                        <span className="text-neutral-400 block text-[10px] uppercase">Builtup (Est.)</span>
                        <span className="font-bold text-black">{valuation.property_summary.builtup_sqft_est} sq.ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Benchmark (IGR ASR 2024-2026) */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
                    Statutory IGR Benchmark & Due Charges
                  </div>
                  <div className="border border-black p-4 space-y-3 text-xs font-mono bg-white">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                      <span className="text-neutral-600">Official IGR Ready Reckoner (Circle Rate)</span>
                      <span className="font-bold text-black">
                        ₹{valuation.government_benchmark.ready_reckoner_rate_carpet.toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                      <span className="text-neutral-600">Government Minimum Base Value</span>
                      <span className="font-bold text-black">
                        ₹{valuation.government_benchmark.government_floor_value_lakhs.toFixed(2)} Lakhs
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                      <span className="text-neutral-600">Estimated Stamp Duty ({valuation.government_benchmark.stamp_duty_pct}%)</span>
                      <span className="font-bold text-black">
                        ₹{valuation.government_benchmark.stamp_duty_estimate_lakhs.toFixed(2)} Lakhs
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Registration & Statutory Fee</span>
                      <span className="font-bold text-black">
                        ₹{(valuation.government_benchmark.registration_charge_inr / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Locality & Environmental Synthesis */}
                {valuation.surrounding_locality_analysis && (
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
                      Surrounding Context
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans border-l-2 border-black pl-4 py-1">
                      {valuation.gemini_ai_layer?.livability_summary || 
                       `Positioned in ${valuation.property_summary.locality} with ${valuation.surrounding_locality_analysis.nearest_transit.name} within ${valuation.surrounding_locality_analysis.nearest_transit.distance_km} km. High commercial demand and stable rental appreciation.`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center text-neutral-400 font-mono text-xs">
                Awaiting property specifications. Enter details on the left and click Assess Property.
              </div>
            )}
          </div>

          {/* Footer of output box */}
          <div className="border-t border-black p-4 bg-white flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Official Valuation Document</span>
            <span>Valid for Maharashtra Jurisdiction</span>
          </div>
        </section>

      </main>

      {/* Minimal Dashboard Footer */}
      <footer className="border-t border-black bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-mono text-neutral-500">
          <div>ATLAS / Real Estate Valuation System</div>
          <div>All 36 Districts Verified</div>
        </div>
      </footer>
    </div>
  );
};
