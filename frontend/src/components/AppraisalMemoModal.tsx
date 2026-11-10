import React, { useState } from 'react';
import { AppraisalMemorandum, ValuationResult } from '../types';
import { X, Printer, Copy, Check, FileText, Landmark, ShieldCheck } from 'lucide-react';

interface AppraisalMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorandum: AppraisalMemorandum | null;
  valuation: ValuationResult | null;
}

export const AppraisalMemoModal: React.FC<AppraisalMemoModalProps> = ({
  isOpen,
  onClose,
  memorandum,
  valuation,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !memorandum || !valuation) return null;

  const handleCopy = () => {
    const fullText = `
================================================================================
A.T.L.A.S. REAL ESTATE APPRAISAL MEMORANDUM
Reference ID: ${memorandum.memorandum_id}
Date: ${memorandum.valuation_date}
Standard: ${memorandum.valuation_standard}
================================================================================

1. EXECUTIVE SUMMARY:
${memorandum.executive_summary}

2. VALUATION METRICS:
- Fair Market Value: Rs. ${valuation.estimated_value_lakhs.toFixed(2)} Lakhs
- 85% Empirical Range: Rs. ${valuation.value_range_lakhs.min.toFixed(2)}L to Rs. ${valuation.value_range_lakhs.max.toFixed(2)}L
- Rate per sq.ft (Carpet): Rs. ${valuation.rate_per_sqft_carpet.toLocaleString('en-IN')}/sq.ft

3. STATUTORY READY RECKONER (ASR) ANALYSIS:
${memorandum.statutory_analysis}

4. INFRASTRUCTURE & PROXIMITY PROFILE:
${memorandum.infrastructure_highlights}

5. COMPARABLE RECONCILIATION:
${memorandum.comparable_reconciliation}

6. RISK & SENSITIVITY FACTORS:
${memorandum.risk_and_sensitivity_factors.map((r, i) => `  [${i + 1}] ${r}`).join('\n')}

================================================================================
${memorandum.appraiser_note}
================================================================================
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0B0F17] border border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#121824]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Property Valuation Memorandum
              </h2>
              <p className="text-xs font-mono text-emerald-400">
                Ref: {memorandum.memorandum_id} • {memorandum.valuation_date}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Formal Document Style) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
          {/* Header Badge */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Appraisal Methodology
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {memorandum.valuation_standard}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Bank Ready Audit</span>
            </div>
          </div>

          {/* Core Valuation Figures */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#121824] border border-slate-800 font-mono text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Fair Market Value</div>
              <div className="text-xl font-black text-white mt-1">
                ₹{valuation.estimated_value_lakhs.toFixed(2)}L
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Effective Rate</div>
              <div className="text-xl font-black text-emerald-400 mt-1">
                ₹{valuation.rate_per_sqft_carpet.toLocaleString('en-IN')}
              </div>
              <div className="text-[9px] text-slate-500">per sq.ft carpet</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Govt ASR Floor</div>
              <div className="text-xl font-black text-amber-400 mt-1">
                ₹{valuation.government_benchmark.government_floor_value_lakhs.toFixed(2)}L
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              1. Executive Appraisal Statement
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121824] p-3.5 rounded-xl border border-slate-800/80">
              {memorandum.executive_summary}
            </p>
          </div>

          {/* Section 2: Statutory & Ready Reckoner Analysis */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              2. Maharashtra Ready Reckoner (ASR) Reconciliation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121824] p-3.5 rounded-xl border border-slate-800/80">
              {memorandum.statutory_analysis}
            </p>
          </div>

          {/* Section 3: Infrastructure Highlights */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              3. Geospatial Infrastructure & Accessibility Profile
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121824] p-3.5 rounded-xl border border-slate-800/80">
              {memorandum.infrastructure_highlights}
            </p>
          </div>

          {/* Section 4: Comparable Reconciliation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              4. Comparable Transactions Reconciliation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121824] p-3.5 rounded-xl border border-slate-800/80">
              {memorandum.comparable_reconciliation}
            </p>
          </div>

          {/* Section 5: Risk & Sensitivity Factors */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              5. Appraisal Risk & Sensitivity Factors
            </h4>
            <ul className="space-y-1.5">
              {memorandum.risk_and_sensitivity_factors.map((risk, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 bg-[#121824] p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                >
                  <span className="text-amber-400 font-bold font-mono">[{idx + 1}]</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Appraiser Sign-off Footer */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            {memorandum.appraiser_note}
          </div>
        </div>
      </div>
    </div>
  );
};

