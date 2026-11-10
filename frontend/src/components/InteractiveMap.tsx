import React, { useEffect, useRef, useState } from 'react';
import { PropertyInput, ComparableProperty, InfrastructureNode } from '../types';
import L from 'leaflet';
import { Layers, MapPin, Eye, Compass, Navigation, MousePointerClick } from 'lucide-react';

interface InteractiveMapProps {
  property: PropertyInput;
  comparables: ComparableProperty[];
  infrastructure: InfrastructureNode[];
  onSelectComp?: (comp: ComparableProperty) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  property,
  comparables,
  infrastructure,
  onSelectComp,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [basemap, setBasemap] = useState<'dark' | 'street' | 'satellite'>('dark');

  const propLat = property.lat || 18.6742;
  const propLng = property.lng || 73.8445;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [propLat, propLng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layers
      const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      const tileLayer = L.tileLayer(darkTileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      (map as any)._tileLayer = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Handle map click to drop pin anywhere in Maharashtra
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update onMapClick handler if it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.off('click');
    mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
  }, [onMapClick]);

  // Handle Basemap Toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const currentTile = (map as any)._tileLayer;
    if (currentTile) {
      map.removeLayer(currentTile);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attr = '&copy; OpenStreetMap &copy; CARTO';

    if (basemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri &copy; DigitalGlobe';
    } else if (basemap === 'street') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
    }

    const newTile = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(map);

    (map as any)._tileLayer = newTile;
  }, [basemap]);

  // Update Markers & Circles when property or comps change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // Pan map to new center
    map.setView([propLat, propLng], 14, { animate: true });

    // 1. Proximity Radius Circles
    const circle500m = L.circle([propLat, propLng], {
      radius: 500,
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 4',
    }).bindTooltip('500m Hyperlocal Walking Radius', { permanent: false, direction: 'top' });
    layer.addLayer(circle500m);

    const circle1500m = L.circle([propLat, propLng], {
      radius: 1500,
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.04,
      weight: 1,
      dashArray: '6, 6',
    }).bindTooltip('1.5 km Transit Corridor', { permanent: false, direction: 'top' });
    layer.addLayer(circle1500m);

    // 2. Subject Property Marker (Glowing Amber/Emerald)
    const subjectIcon = L.divIcon({
      className: 'custom-subject-marker',
      html: `
        <div style="position: relative; width: 34px; height: 34px;">
          <div style="position: absolute; inset: 0; background: #22c55e; border-radius: 50%; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; inset: 3px; background: #15803d; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
            <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const subjectMarker = L.marker([propLat, propLng], { icon: subjectIcon }).bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <div style="color: #22c55e; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Subject Property</div>
        <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px;">${property.bhk} BHK • ${property.locality}</div>
        <div style="color: #94a3b8; margin-top: 2px;">Carpet Area: ${property.carpet_sqft} sq.ft</div>
        <div style="color: #94a3b8;">Floor: ${property.floor} of ${property.total_floors} | Age: ${property.age_years} yrs</div>
        <div style="color: #38bdf8; font-size: 10px; margin-top: 4px;">Lat: ${propLat.toFixed(4)}, Lng: ${propLng.toFixed(4)}</div>
      </div>
    `);
    layer.addLayer(subjectMarker);

    // 3. Infrastructure Nodes
    infrastructure.forEach((node) => {
      const isMetro = node.category === 'metro' || node.category === 'railway';
      const isIT = (node.category || '').includes('it_hub') || (node.category || '').includes('industrial');
      const isHospital = node.category === 'hospital';
      
      const badgeBg = isMetro ? '#38bdf8' : isIT ? '#a855f7' : isHospital ? '#ef4444' : '#f59e0b';
      const badgeLabel = isMetro ? 'M' : isIT ? 'IT' : isHospital ? 'H' : '★';

      const infraIcon = L.divIcon({
        className: 'infra-marker',
        html: `
          <div style="background: ${badgeBg}; color: #000000; font-weight: 900; font-size: 10px; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            ${badgeLabel}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const infraMarker = L.marker([node.lat, node.lng], { icon: infraIcon }).bindTooltip(`
        <div style="font-size: 11px; font-weight: bold;">
          ${node.name}
          <div style="font-weight: normal; font-size: 10px; color: #94a3b8;">${(node.category || '').toUpperCase()}</div>
        </div>
      `, { direction: 'top' });
      layer.addLayer(infraMarker);
    });

    // 4. Comparable Sales Markers
    comparables.forEach((comp) => {
      const compIcon = L.divIcon({
        className: 'comp-marker',
        html: `
          <div style="background: #1e293b; color: #38bdf8; border: 1.5px solid #38bdf8; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 12px; white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 3px;">
            <span>₹${comp.price_lakhs}L</span>
          </div>
        `,
        iconSize: [50, 20],
        iconAnchor: [25, 10],
      });

      const compMarker = L.marker([comp.lat, comp.lng], { icon: compIcon }).bindPopup(`
        <div style="font-family: inherit; font-size: 11px; line-height: 1.4;">
          <div style="color: #38bdf8; font-weight: bold; font-size: 10px; text-transform: uppercase;">Verified Registry Comp</div>
          <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-top: 2px;">${comp.society}</div>
          <div style="color: #94a3b8;">${comp.bhk} BHK • ${comp.carpet_sqft} sq.ft carpet</div>
          <div style="color: #22c55e; font-weight: bold; margin-top: 2px;">Registered Price: ₹${comp.price_lakhs} Lakhs</div>
          <div style="color: #94a3b8; font-size: 10px;">Rate: ₹${comp.price_per_sqft_carpet.toLocaleString('en-IN')}/sqft | Dist: ${comp.distance_km} km</div>
          <div style="color: #cbd5e1; font-size: 10px; margin-top: 3px; border-top: 1px solid #334155; pt: 3px;">
            Pairwise Adjustment: <span style="color: #f59e0b;">${comp.adjustment_notes}</span>
          </div>
        </div>
      `);

      compMarker.on('click', () => {
        if (onSelectComp) onSelectComp(comp);
      });

      layer.addLayer(compMarker);
    });
  }, [propLat, propLng, comparables, infrastructure]);

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col h-[520px] relative">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Statewide Maharashtra Geospatial Radar</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                Click Map to Pin Any Location
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Drop pin anywhere across Maharashtra for real-time reverse geocoding & ASR valuation
            </p>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="flex items-center bg-[#0B0F17] p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setBasemap('dark')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              basemap === 'dark'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vector Dark
          </button>
          <button
            onClick={() => setBasemap('street')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              basemap === 'street'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Street Map
          </button>
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              basemap === 'satellite'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Satellite</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-800 relative">
        <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

        {/* Click-to-Pin Hint Banner */}
        <div className="absolute top-3 right-3 bg-[#0B0F17]/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 shadow-lg pointer-events-none z-[1000]">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Click anywhere to re-anchor</span>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#0B0F17]/95 border border-slate-800 rounded-xl p-2.5 text-[10px] space-y-1.5 z-[1000] backdrop-blur-sm pointer-events-auto shadow-xl">
          <div className="font-bold text-slate-300 uppercase tracking-wider mb-1">Statewide Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Subject Asset Pin</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
            <span className="text-slate-300">Nearby Comp Sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
            <span className="text-slate-300">IT / Auto Employment Hubs</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
            <span className="text-slate-300">Metro / Railway Transit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
