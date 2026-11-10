import React, { useState } from 'react';
import { PropertyInput, ValuationResult } from '../types';
import { parsePropertyChat } from '../api';
import { MessageSquare, Send, Sparkles, Building2, CheckCircle2, ArrowRight, CornerDownLeft, Loader2, Bot } from 'lucide-react';

interface PropertyChatboxProps {
  onApplyProperty: (property: PropertyInput) => void;
  currentProperty: PropertyInput;
}

export const PropertyChatbox: React.FC<PropertyChatboxProps> = ({
  onApplyProperty,
  currentProperty,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    parsed_property: PropertyInput;
    valuation: ValuationResult;
    ai_reply: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    "2 BHK in Jal Vayu Vihar Moshi Sector 6 (600 sqft, 2nd floor, covered parking, 16 yrs old)",
    "3 BHK in Bandra West Pali Hill 1250 sqft on 14th floor, asking 7.2 Cr with luxury interiors",
    "2 BHK in Wakad Bhumkar Chowk 765 sqft 11th floor 4 yrs old with covered parking",
    "3 BHK in Kharadi EON IT Park 1450 sqft on 18th floor with 2 covered parkings"
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || query;
    if (!textToSend.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await parsePropertyChat(textToSend);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process inquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplyProperty(result.parsed_property);
    }
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Natural Language Appraisal Assistant</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-mono">
                Gemini 2.5 Flash Parser
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Type or paste any property description from WhatsApp, broker, or NoBroker
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Pills */}
      <div className="mb-4">
        <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Clickable Sample Queries:</div>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(prompt);
                handleSend(prompt);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0B0F17] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="relative">
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="E.g. I am looking at a 2 BHK flat in Moshi Sector 6 (600 sqft, 2nd floor, 16 yrs old, covered parking) — seller is asking 65 Lakhs, is this fair value?"
          className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none pr-12 font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          className="absolute right-2.5 bottom-3.5 p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold disabled:opacity-40 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
          ) : (
            <Send className="w-3.5 h-3.5 text-slate-950" />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Valuation & AI Reply Card */}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/30 animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Grounded Valuation Summary
              </span>
            </div>
            <button
              onClick={handleApply}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-sm shadow-emerald-500/30"
            >
              <span>Load Into Dashboard</span>
              <ArrowRight className="w-3 h-3 text-slate-950" />
            </button>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono py-1">
            <div className="bg-[#121824] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Fair Market Value</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                ₹{result.valuation.estimated_value_lakhs}L
              </div>
            </div>
            <div className="bg-[#121824] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Rate / Sq.Ft</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">
                ₹{result.valuation.rate_per_sqft_carpet.toLocaleString()}/s
              </div>
            </div>
            <div className="bg-[#121824] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Circle Rate (ASR)</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">
                ₹{result.valuation.government_benchmark.government_floor_value_lakhs}L
              </div>
            </div>
          </div>

          {/* AI Conversational Explanation */}
          <div className="text-xs text-slate-300 leading-relaxed bg-[#121824]/60 p-3 rounded-lg border border-slate-800/80">
            {result.ai_reply}
          </div>

          {/* Extracted Specifications Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Locality: {result.parsed_property.locality}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {result.parsed_property.bhk} BHK • {result.parsed_property.carpet_sqft} sqft
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Floor {result.parsed_property.floor}/{result.parsed_property.total_floors}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Age: {result.parsed_property.age_years} yrs
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Parking: {result.parsed_property.parking}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

