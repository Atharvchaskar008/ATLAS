import React, { useState, useEffect } from 'react';
import { PropertyInput } from '../types';
import { geocodeAddress } from '../api';
import {
  Sliders,
  Building,
  Compass,
  Car,
  Calendar,
  Sparkles,
  RefreshCw,
  MapPin,
  Navigation,
  Search,
  Loader2,
  Check
} from 'lucide-react';

interface PropertyFormProps {
  property: PropertyInput;
  onChange: (property: PropertyInput) => void;
  onRefresh: () => void;
  loading: boolean;
  localities: string[];
  resolvedDistrict?: string;
  resolvedAddress?: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onChange,
  onRefresh,
  loading,
  localities,
  resolvedDistrict,
  resolvedAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const updateField = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => {
    onChange({
      ...property,
      [key]: value,
    });
  };

  // Debounced address search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await geocodeAddress(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (e) {
        console.warn('Geocode search failed', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = (loc: any) => {
    onChange({
      ...property,
      locality: loc.display_name.split(',')[0],
      lat: loc.lat,
      lng: loc.lng,
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Property Specifications
          </h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Recalculate</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Instant Search Bar for ANY Address in Maharashtra */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Search Any Address in Maharashtra
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Google / OSM Live</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Bandra West, Moshi Spine Rd, Powai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              className="w-full bg-[#0B0F17] border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin absolute right-3 top-2.5" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0B0F17] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLocation(result)}
                  className="p-2.5 hover:bg-slate-800/70 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">
                      {result.display_name.split(',')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">
                      {result.display_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Locality Selector / Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Micro-Market Hub Selector
            </span>
            {resolvedDistrict && (
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                {resolvedDistrict}
              </span>
            )}
          </label>
          <select
            value={property.locality}
            onChange={(e) => updateField('locality', e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium truncate"
          >
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {resolvedAddress && (
            <p className="text-[11px] text-slate-400 mt-1 truncate" title={resolvedAddress}>
              📍 {resolvedAddress}
            </p>
          )}
        </div>

        {/* Lat / Lng Coordinates */}
        <div className="grid grid-cols-2 gap-2 bg-[#0B0F17] p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Latitude</span>
            <input
              type="number"
              step="0.0001"
              value={property.lat ? Number(property.lat.toFixed(4)) : 18.6742}
              onChange={(e) => updateField('lat', parseFloat(e.target.value))}
              className="w-full bg-transparent text-emerald-400 font-bold focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Longitude</span>
            <input
              type="number"
              step="0.0001"
              value={property.lng ? Number(property.lng.toFixed(4)) : 73.8445}
              onChange={(e) => updateField('lng', parseFloat(e.target.value))}
              className="w-full bg-transparent text-emerald-400 font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Configuration (BHK) Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Unit Configuration (BHK)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((bhkVal) => (
              <button
                key={bhkVal}
                type="button"
                onClick={() => updateField('bhk', bhkVal)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  property.bhk === bhkVal
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {bhkVal} BHK
              </button>
            ))}
          </div>
        </div>

        {/* Carpet Area Slider + Input */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span>RERA Carpet Area</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {property.carpet_sqft} <span className="text-[11px] font-normal text-slate-400">sq.ft</span>
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="3000"
            step="25"
            value={property.carpet_sqft}
            onChange={(e) => updateField('carpet_sqft', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
            <span>300 sqft (Studio/1BHK)</span>
            <span>Est. Built-up: {Math.round(property.carpet_sqft * 1.3)} sqft</span>
            <span>3,000 sqft (Luxury)</span>
          </div>
        </div>

        {/* Floor and Total Floors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Floor Level</span>
              <span className="text-emerald-400 font-mono font-bold">{property.floor}</span>
            </div>
            <input
              type="number"
              min="0"
              max={property.total_floors}
              value={property.floor}
              onChange={(e) => updateField('floor', Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Total Floors</span>
              <span className="text-slate-400 font-mono font-bold">{property.total_floors}</span>
            </div>
            <input
              type="number"
              min="1"
              max="80"
              value={property.total_floors}
              onChange={(e) => updateField('total_floors', Math.max(1, Number(e.target.value)))}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Property Age Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Building Age
            </span>
            <span className="text-emerald-400 font-mono font-bold">
              {property.age_years === 0 ? 'Brand New (0 yrs)' : `${property.age_years} yrs`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={property.age_years}
            onChange={(e) => updateField('age_years', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>New Launch</span>
            <span>15 yrs (Resale)</span>
            <span>40 yrs</span>
          </div>
        </div>

        {/* Parking and Facing */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-slate-400" /> Parking
            </label>
            <select
              value={property.parking}
              onChange={(e) => updateField('parking', e.target.value)}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Covered">1 Covered Podium</option>
              <option value="2 Covered">2 Covered Podium</option>
              <option value="Open">Open Common</option>
              <option value="None">No Parking</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" /> Vastu / Facing
            </label>
            <select
              value={property.facing}
              onChange={(e) => updateField('facing', e.target.value)}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="East">East Facing</option>
              <option value="North-East">North-East (Ishanya)</option>
              <option value="North">North Facing</option>
              <option value="West">West Facing</option>
              <option value="South">South Facing</option>
            </select>
          </div>
        </div>

        {/* Furnishing and Society Amenities */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Interior Furnishing
            </label>
            <select
              value={property.furnishing || 'Unfurnished'}
              onChange={(e) => updateField('furnishing', e.target.value)}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Unfurnished">Unfurnished (Bare)</option>
              <option value="Semi-Furnished">Semi-Furnished (+₹450/s)</option>
              <option value="Fully Furnished">Fully Furnished (+₹950/s)</option>
              <option value="Ultra-Luxury">Ultra-Luxury (+₹1,800/s)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-cyan-400" /> Society Amenities
            </label>
            <select
              value={property.society_amenities || 'Standard CHS'}
              onChange={(e) => updateField('society_amenities', e.target.value)}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Standard CHS">Standard CHS / Standalone</option>
              <option value="Gated Community">Gated Community (+5.5%)</option>
              <option value="Integrated Township">Mega Township (+11.5%)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
