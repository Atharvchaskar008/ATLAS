import React, { useState, useEffect } from 'react';
import { PropertyInput, ValuationResult, InfrastructureNode, AppraisalMemorandum } from './types';
import { fetchLocalities, fetchInfrastructure, estimateValuation, generateReport } from './api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PropertyChatbox } from './components/PropertyChatbox';
import { PropertyForm } from './components/PropertyForm';
import { ValuationScorecard } from './components/ValuationScorecard';
import { ShapWaterfall } from './components/ShapWaterfall';
import { InteractiveMap } from './components/InteractiveMap';
import { CompsTable } from './components/CompsTable';
import { SensitivitySimulator } from './components/SensitivitySimulator';
import { AppraisalMemoModal } from './components/AppraisalMemoModal';
import { GeminiLocalityCard } from './components/GeminiLocalityCard';
import { SurroundingPriceRadar } from './components/SurroundingPriceRadar';
import { Layers, Activity, AlertCircle, Compass, Zap, FileSpreadsheet, Map, Sparkles, BarChart3, MessageSquareQuote } from 'lucide-react';

// Default subject property: The exact Moshi Sector 6 Jal Vayu Vihar case
const DEFAULT_PROPERTY: PropertyInput = {
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

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [property, setProperty] = useState<PropertyInput>(DEFAULT_PROPERTY);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [localities, setLocalities] = useState<string[]>([
    'Moshi / Sector 6 (Jal Vayu Vihar)',
    'Bandra West / Khar',
    'Worli / Lower Parel',
    'Powai / Hiranandani',
    'Thane West (Ghodbunder Road / Majiwada)',
    'Vashi / Palm Beach Road',
    'Kharghar / Panvel (Airport Corridor)',
    'Baner / Balewadi High Street',
    'Wakad / Bhumkar Chowk',
    'Hinjawadi (Phase 1, 2 & 3)',
    'Kharadi / EON Free Zone',
    'Hadapsar / Magarpatta City',
    'Kothrud / Karve Road',
    'Nashik (Gangapur Road / College Road)',
    'Nashik (Indira Nagar / Pathardi Phata)',
    'Nagpur (Dharampeth / Civil Lines)',
    'Nagpur (Wardha Road / MIHAN SEZ)',
    'Chhatrapati Sambhajinagar (CIDCO / Jalna Road)',
    'Kolhapur (Rajarampuri / Tarabai Park)',
    'Solapur (Hotgi Road / Jule Solapur)'
  ]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active view tab for the secondary panels
  const [activeTab, setActiveTab] = useState<'map' | 'gemini' | 'prices' | 'shap' | 'comps' | 'simulator'>('map');

  // Appraisal Memo Modal
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [memorandum, setMemorandum] = useState<AppraisalMemorandum | null>(null);

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      try {
        const [locData, infraData] = await Promise.all([
          fetchLocalities(),
          fetchInfrastructure(),
        ]);
        if (locData.localities && locData.localities.length > 0) {
          setLocalities(locData.localities);
        }
        setInfrastructure(infraData);
      } catch (e) {
        console.warn('Initialization error', e);
      }
    };
    initData();
  }, []);

  // Run valuation whenever property changes
  useEffect(() => {
    let isCurrent = true;
    const runValuation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await estimateValuation(property);
        if (isCurrent) {
          setValuation(res);
        }
      } catch (err: any) {
        if (isCurrent) {
          setError(err.message || 'Valuation estimation failed');
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(runValuation, 250);
    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
    };
  }, [property]);

  // Handle map click to pin anywhere in Maharashtra
  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    setProperty((prev) => ({
      ...prev,
      lat: clickedLat,
      lng: clickedLng,
      locality: `Maharashtra Pin (${clickedLat.toFixed(3)}, ${clickedLng.toFixed(3)})`,
    }));
  };

  // Preset Switcher Handler
  const handleSelectPreset = (presetName: string) => {
    if (presetName === 'Moshi Jal Vayu Vihar' || presetName.includes('Moshi')) {
      setProperty({
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
      });
    } else if (presetName === 'Bandra West' || presetName.includes('Bandra')) {
      setProperty({
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
      });
    } else if (presetName === 'Powai Hiranandani' || presetName.includes('Powai')) {
      setProperty({
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
      });
    } else if (presetName === 'Thane West' || presetName.includes('Thane')) {
      setProperty({
        locality: 'Thane West (Ghodbunder Road / Majiwada)',
        bhk: 2,
        carpet_sqft: 680,
        floor: 9,
        total_floors: 18,
        age_years: 5,
        parking: 'Covered',
        facing: 'East',
        furnishing: 'Semi-Furnished',
        society_amenities: 'Gated Society / Clubhouse',
        lat: 19.2183,
        lng: 72.9781,
      });
    } else if (presetName === 'Nashik Gangapur' || presetName.includes('Nashik')) {
      setProperty({
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
      });
    } else if (presetName === 'Nagpur Dharampeth' || presetName.includes('Nagpur')) {
      setProperty({
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
      });
    }
  };

  // Open Valuation Memorandum Modal
  const handleOpenReport = async () => {
    try {
      setLoading(true);
      const res = await generateReport(property);
      setValuation(res.valuation);
      setMemorandum(res.memorandum);
      setIsReportOpen(true);
    } catch (e: any) {
      alert('Could not generate report: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenReport={handleOpenReport}
        onSelectPreset={handleSelectPreset}
        currentLocality={property.locality}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === 'landing' ? (
        <LandingPage
          onLaunchDashboard={() => setViewMode('dashboard')}
          onSelectPreset={(preset) => {
            handleSelectPreset(preset);
            setViewMode('dashboard');
          }}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Error banner if any */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Natural Language AI Property Chatbox */}
          <div className="mb-6">
            <PropertyChatbox
              onApplyProperty={(parsed) => setProperty(parsed)}
              currentProperty={property}
            />
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form & Specifications (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              <PropertyForm
                property={property}
                onChange={setProperty}
                onRefresh={() => setProperty({ ...property })}
                loading={loading}
                localities={localities}
                resolvedDistrict={valuation?.property_summary?.district}
                resolvedAddress={valuation?.property_summary?.formatted_address}
              />

              {/* Quick Geospatial Metrics Pill */}
              {valuation && (
                <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 shadow-xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Locational Proximity Radar</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {valuation.property_summary.authority} Zone
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Transit</div>
                      <div className="text-sm font-bold text-cyan-400 mt-0.5">
                        {valuation.geospatial_scores.transit_score}/100
                      </div>
                    </div>
                    <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Jobs Hub</div>
                      <div className="text-sm font-bold text-purple-400 mt-0.5">
                        {valuation.geospatial_scores.employment_score}/100
                      </div>
                    </div>
                    <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Walkability</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        {valuation.geospatial_scores.walkability_score}/100
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Valuation Card & Interactive Intelligence (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {valuation ? (
                <>
                  {/* Hero Scorecard */}
                  <ValuationScorecard valuation={valuation} />

                  {/* Sub-Navigation Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#121824] p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('map')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'map'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>Statewide Map & Satellite</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('gemini')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'gemini'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Gemini AI Locality Layer</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('prices')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'prices'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Surrounding Price Radar</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('shap')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'shap'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>SHAP Explainability</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('comps')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'comps'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Sales Comps Matrix</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('simulator')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'simulator'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>"What-If" Simulator</span>
                    </button>
                  </div>

                  {/* Tab Views */}
                  {activeTab === 'map' && (
                    <InteractiveMap
                      property={property}
                      comparables={valuation.comparable_properties}
                      infrastructure={infrastructure}
                      onMapClick={handleMapClick}
                    />
                  )}

                  {activeTab === 'gemini' && (
                    <GeminiLocalityCard
                      gemini={valuation.gemini_ai_layer}
                      surrounding={valuation.surrounding_locality_analysis}
                      district={valuation.property_summary.district}
                      authority={valuation.property_summary.authority}
                    />
                  )}

                  {activeTab === 'prices' && (
                    <SurroundingPriceRadar
                      surrounding={valuation.surrounding_locality_analysis}
                      priceDistribution={(valuation as any).surrounding_price_distribution}
                      locality={valuation.property_summary.locality}
                      district={valuation.property_summary.district}
                    />
                  )}

                  {activeTab === 'shap' && (
                    <ShapWaterfall
                      factors={valuation.explainability_waterfall.factors}
                      baselineExpectedLakhs={valuation.explainability_waterfall.baseline_expected_lakhs}
                      finalEstimatedLakhs={valuation.estimated_value_lakhs}
                    />
                  )}

                  {activeTab === 'comps' && (
                    <CompsTable comparables={valuation.comparable_properties} />
                  )}

                  {activeTab === 'simulator' && (
                    <SensitivitySimulator
                      property={property}
                      baseValuationLakhs={valuation.estimated_value_lakhs}
                    />
                  )}
                </>
              ) : (
                <div className="bg-[#121824] rounded-2xl border border-slate-800 p-12 text-center">
                  <Activity className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-300">
                    Computing statewide hedonic valuation & Gemini AI analysis...
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B12] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">A.T.L.A.S.</span> — Automated Terrain & Asset Location Assessment System
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Statewide Coverage: All 36 Maharashtra Districts • IGR Ready Reckoner 2024-2026 • Gemini AI Layer
          </div>
        </div>
      </footer>

      {/* Appraisal Memorandum Modal */}
      <AppraisalMemoModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        memorandum={memorandum}
        valuation={valuation}
      />
    </div>
  );
};

export default App;
