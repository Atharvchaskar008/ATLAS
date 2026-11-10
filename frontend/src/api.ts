import { PropertyInput, ValuationResult, InfrastructureNode, AppraisalMemorandum } from './types';

const API_BASE = '/api';

export async function fetchLocalities(): Promise<{ localities: string[]; registry: Record<string, any>; maharashtra_hubs?: any[] }> {
  try {
    const res = await fetch(`${API_BASE}/valuation/localities`);
    if (!res.ok) throw new Error('Failed to fetch localities');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback locality data', err);
    return {
      localities: [
        'Moshi / Sector 6 (Jal Vayu Vihar)',
        'Bandra West / Khar',
        'Worli / Lower Parel',
        'Powai / Hiranandani',
        'Thane West (Ghodbunder Road / Majiwada)',
        'Vashi / Palm Beach Road',
        'Baner / Balewadi High Street',
        'Wakad / Bhumkar Chowk',
        'Hinjawadi (Phase 1, 2 & 3)',
        'Nashik (Gangapur Road / College Road)',
        'Nagpur (Dharampeth / Civil Lines)'
      ],
      registry: {}
    };
  }
}

export async function fetchInfrastructure(): Promise<InfrastructureNode[]> {
  try {
    const res = await fetch(`${API_BASE}/valuation/infrastructure`);
    if (!res.ok) throw new Error('Failed to fetch infrastructure');
    const data = await res.json();
    return data.nodes;
  } catch (err) {
    console.warn('Backend offline, using fallback infrastructure', err);
    return [];
  }
}

export async function geocodeAddress(query: string): Promise<Array<{ display_name: string; lat: number; lng: number; source: string }>> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`${API_BASE}/valuation/geocode?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Geocoding error', err);
    return [];
  }
}

export async function fetchLiveAmenities(lat: number, lng: number, radius: number = 1500): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/valuation/live-amenities?lat=${lat}&lng=${lng}&radius=${radius}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.amenities || [];
  } catch (err) {
    return [];
  }
}

export async function fetchSurroundingPrices(lat: number, lng: number, baseRate: number = 10000): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/valuation/surrounding-prices?lat=${lat}&lng=${lng}&base_rate=${baseRate}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.price_distribution || null;
  } catch (err) {
    return null;
  }
}

export async function estimateValuation(property: PropertyInput): Promise<ValuationResult> {
  const res = await fetch(`${API_BASE}/valuation/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to estimate property valuation');
  }
  return await res.json();
}

export async function simulateSensitivity(
  baseProperty: PropertyInput,
  floorDelta: number,
  ageDelta: number,
  metroBonus: boolean
): Promise<{
  original_value_lakhs: number;
  simulated_value_lakhs: number;
  delta_lakhs: number;
  delta_percentage: number;
  simulated_waterfall: any[];
}> {
  const res = await fetch(`${API_BASE}/valuation/sensitivity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base_property: baseProperty,
      floor_delta: floorDelta,
      age_delta: ageDelta,
      metro_operational_bonus: metroBonus,
    }),
  });
  if (!res.ok) throw new Error('Sensitivity calculation failed');
  return await res.json();
}

export async function generateReport(property: PropertyInput): Promise<{
  valuation: ValuationResult;
  memorandum: AppraisalMemorandum;
}> {
  const res = await fetch(`${API_BASE}/valuation/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });
  if (!res.ok) throw new Error('Report generation failed');
  return await res.json();
}

export async function parsePropertyChat(message: string): Promise<{
  parsed_property: PropertyInput;
  valuation: ValuationResult;
  ai_reply: string;
}> {
  const res = await fetch(`${API_BASE}/valuation/chat-parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to parse chat property message');
  }
  return await res.json();
}
