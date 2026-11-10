"""
A.T.L.A.S. - FastAPI Application Backend
Statewide Maharashtra AI-Powered Property Valuation & Locality Intelligence API
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file (check current dir and parent)
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from models.valuation_engine import ValuationEngine
from services.narrative_service import NarrativeService
from services.places_service import PlacesService
from data.pune_data import PUNE_LOCALITIES_REGISTRY, INFRASTRUCTURE_NODES
from data.maharashtra_registry import MAHARASHTRA_LOCALITY_HUBS, resolve_maharashtra_location

app = FastAPI(
    title="A.T.L.A.S. Statewide Maharashtra Valuation API",
    description="Automated Terrain & Asset Location Assessment System - AI Property Valuation & Locality Intelligence",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Valuation Engine singleton
engine = ValuationEngine()


# --- Pydantic Request Models ---
class PropertyInput(BaseModel):
    locality: str = Field(default="Moshi", description="Locality or micro-market name")
    bhk: int = Field(default=2, ge=1, le=8, description="Number of bedrooms")
    carpet_sqft: float = Field(default=600.0, ge=150, le=8000, description="RERA Carpet Area in sq.ft")
    floor: int = Field(default=2, ge=0, le=80, description="Floor number of the unit")
    total_floors: int = Field(default=4, ge=1, le=80, description="Total floors in building")
    age_years: int = Field(default=16, ge=0, le=70, description="Age of construction in years")
    parking: str = Field(default="Covered", description="Covered, 2 Covered, Open, or None")
    facing: str = Field(default="East", description="East, North, North-East, West, South")
    furnishing: str = Field(default="Unfurnished", description="Unfurnished, Semi-Furnished, Fully Furnished, Ultra-Luxury")
    society_amenities: str = Field(default="Standard CHS", description="Standard CHS, Gated Community, Integrated Township")
    lat: Optional[float] = Field(default=None, description="Latitude anywhere in Maharashtra")
    lng: Optional[float] = Field(default=None, description="Longitude anywhere in Maharashtra")


class ChatQuery(BaseModel):
    message: str


class SensitivityInput(BaseModel):
    base_property: PropertyInput
    floor_delta: int = Field(default=0, description="Change in floor number")
    age_delta: int = Field(default=0, description="Change in property age in years")
    metro_operational_bonus: bool = Field(default=False, description="Simulate upcoming metro opening")


# --- API Routes ---
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "A.T.L.A.S. Statewide Engine",
        "state": "Maharashtra",
        "total_calibrated_comps": len(engine.all_comps),
        "supported_statewide_hubs": len(MAHARASHTRA_LOCALITY_HUBS)
    }


@app.get("/api/valuation/localities")
def get_localities():
    """Return supported localities and micro-market hubs across Maharashtra."""
    hub_names = [h["locality"] for h in MAHARASHTRA_LOCALITY_HUBS]
    return {
        "localities": hub_names,
        "registry": PUNE_LOCALITIES_REGISTRY,
        "maharashtra_hubs": MAHARASHTRA_LOCALITY_HUBS
    }


@app.get("/api/valuation/maharashtra/hubs")
def get_maharashtra_hubs():
    """Return all 36-district calibrated regional hubs across Maharashtra."""
    return {"hubs": MAHARASHTRA_LOCALITY_HUBS}


@app.get("/api/valuation/reverse-geocode")
def reverse_geocode(lat: float = Query(...), lng: float = Query(...)):
    """Reverse geocode ANY coordinate in Maharashtra to address & district."""
    addr = PlacesService.reverse_geocode(lat, lng)
    loc_meta = resolve_maharashtra_location(lat, lng)
    return {
        "address": addr,
        "resolved_district": loc_meta["district"],
        "resolved_authority": loc_meta["authority"],
        "resolved_locality": loc_meta["locality_name"],
        "ready_reckoner_carpet": loc_meta["ready_reckoner_rate_carpet_sqft"],
        "market_rate_avg": loc_meta["market_rate_carpet_sqft_avg"]
    }


@app.get("/api/valuation/geocode")
def geocode_address(query: str = Query(..., min_length=2)):
    """Search any address across Maharashtra and return matched coordinates."""
    results = PlacesService.geocode_address(query)
    return {"results": results}


@app.get("/api/valuation/live-amenities")
def get_live_amenities(lat: float = Query(...), lng: float = Query(...), radius: int = Query(1500)):
    """Query real-time live Overpass / OSM surrounding POIs."""
    pois = PlacesService.query_live_overpass_amenities(lat, lng, radius_m=radius)
    return {"amenities": pois}


@app.get("/api/valuation/surrounding-prices")
def get_surrounding_prices(lat: float = Query(...), lng: float = Query(...), base_rate: int = Query(10000)):
    """Get surrounding price percentiles and distance-decay radial gradient."""
    dist = PlacesService.calculate_surrounding_price_distribution(lat, lng, base_rate)
    return {"price_distribution": dist}


@app.get("/api/valuation/infrastructure")
def get_infrastructure():
    """Return transit, tech park, and healthcare nodes for map rendering."""
    return {
        "nodes": engine.infrastructure
    }


@app.post("/api/valuation/estimate")
def estimate_property(prop: PropertyInput):
    """Compute comprehensive valuation, ASR benchmark, SHAP waterfall, surrounding POIs, and Gemini AI analysis."""
    try:
        prop_dict = prop.model_dump()
        result = engine.estimate_valuation(prop_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/valuation/comps")
def get_comparables(prop: PropertyInput):
    """Retrieve spatial nearest neighbor comps with pairwise adjustments."""
    prop_dict = prop.model_dump()
    lat = prop.lat or 18.6750
    lng = prop.lng or 73.8450
    
    comps = engine.find_comparable_properties(
        lat=lat,
        lng=lng,
        bhk=prop.bhk,
        carpet_sqft=prop.carpet_sqft,
        max_results=8
    )
    return {"comparables": comps}


@app.post("/api/valuation/sensitivity")
def simulate_sensitivity(sim: SensitivityInput):
    """Real-time 'What-If' sensitivity analysis."""
    base_dict = sim.base_property.model_dump()
    base_val = engine.estimate_valuation(base_dict)
    
    mod_dict = dict(base_dict)
    mod_dict["floor"] = max(0, mod_dict["floor"] + sim.floor_delta)
    mod_dict["age_years"] = max(0, mod_dict["age_years"] + sim.age_delta)
    
    mod_val = engine.estimate_valuation(mod_dict)
    
    mod_price = mod_val["estimated_value_lakhs"]
    if sim.metro_operational_bonus:
        mod_price = round(mod_price * 1.045, 2)
        mod_val["estimated_value_lakhs"] = mod_price
        mod_val["rate_per_sqft_carpet"] = int((mod_price * 100000.0) / mod_dict["carpet_sqft"])
        
    delta_lakhs = round(mod_price - base_val["estimated_value_lakhs"], 2)
    delta_pct = round((delta_lakhs / base_val["estimated_value_lakhs"]) * 100.0, 2)

    return {
        "original_value_lakhs": base_val["estimated_value_lakhs"],
        "simulated_value_lakhs": mod_price,
        "delta_lakhs": delta_lakhs,
        "delta_percentage": delta_pct,
        "simulated_waterfall": mod_val["explainability_waterfall"]["factors"]
    }


@app.post("/api/valuation/chat-parse")
def chat_parse_and_evaluate(query: ChatQuery):
    """
    Natural Language property parser and valuation assistant:
    Extracts property specifications from user conversational text or inquiry,
    evaluates through the deterministic valuation engine, and generates an AI summary.
    """
    msg = query.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Empty query message")

    gemini_key = os.environ.get("GEMINI_API_KEY")
    import re
    msg_lower = msg.lower()

    # 1. Baseline intelligent entity extraction from text
    is_rk = bool(re.search(r'\b1\s*rk\b|\b1-rk\b|\bstudio\b', msg_lower))
    
    # BHK extraction
    detected_bhk = 1 if is_rk else 2
    bhk_m = re.search(r'(\d+)\s*(?:bhk|bedroom|bed|rk)', msg_lower)
    if bhk_m:
        detected_bhk = int(bhk_m.group(1))

    # Carpet Area extraction (if 1RK and omitted, estimate realistic 275 sq.ft carpet)
    detected_sqft = 275.0 if is_rk else (450.0 if detected_bhk == 1 else 650.0)
    sqft_m = re.search(r'(\d{2,4})\s*(?:sqft|sq\.ft|square\s*feet|carpet|sq\s*ft)', msg_lower)
    if sqft_m:
        detected_sqft = float(sqft_m.group(1))

    # Furnishing & Appliances (AC, modular kitchen, etc.)
    detected_furnishing = "Unfurnished"
    if "luxury" in msg_lower or "ultra" in msg_lower:
        detected_furnishing = "Luxury Furnished"
    elif "fully furnished" in msg_lower or "full furnished" in msg_lower:
        detected_furnishing = "Fully Furnished"
    elif "semi furnished" in msg_lower or "semi-furnished" in msg_lower or "ac" in msg_lower or "air conditioner" in msg_lower:
        detected_furnishing = "Semi-Furnished"

    # Parking
    detected_parking = "Covered" if ("parking" in msg_lower and "no parking" not in msg_lower) else "None"
    if "open parking" in msg_lower:
        detected_parking = "Open"
    elif "2 covered" in msg_lower:
        detected_parking = "2 Covered"

    # Locality & Region Resolution
    detected_locality = "Moshi / Sector 6 (Jal Vayu Vihar)"
    detected_lat = 18.6742
    detected_lng = 73.8445

    # Check Mazgaon / Hattibaugh / South Mumbai specifically
    if "mazgaon" in msg_lower or "hattibaugh" in msg_lower or "hattibaug" in msg_lower or "byculla" in msg_lower:
        detected_locality = "Mazgaon / Byculla (Hattibaugh)"
        detected_lat = 18.9696
        detected_lng = 72.8427
    else:
        # Match against all known Maharashtra hubs
        for hub in MAHARASHTRA_LOCALITY_HUBS:
            clean_hub_name = hub["locality"].split("/")[0].strip().lower()
            tokens = [t.strip() for t in clean_hub_name.split() if len(t.strip()) > 3]
            if clean_hub_name in msg_lower or any(t in msg_lower for t in tokens):
                detected_locality = hub["locality"]
                detected_lat = hub["lat"]
                detected_lng = hub["lng"]
                break

    extracted_prop = {
        "locality": detected_locality,
        "bhk": detected_bhk,
        "carpet_sqft": detected_sqft,
        "floor": 2,
        "total_floors": 4 if is_rk else 10,
        "age_years": 18 if "mazgaon" in msg_lower else 5,
        "parking": detected_parking,
        "facing": "East",
        "furnishing": detected_furnishing,
        "society_amenities": "Standard CHS",
        "lat": detected_lat,
        "lng": detected_lng
    }

    # 2. Try Gemini to enrich if available and within quota
    if gemini_key:
        try:
            from google import genai
            from google.genai import types
            import json

            client = genai.Client(api_key=gemini_key)
            prompt = f"""
Extract property specifications from user message into JSON:
- "locality": string (e.g. "Mazgaon / Byculla (Hattibaugh)", "Bandra West", "Wakad")
- "bhk": integer (for 1RK use 1)
- "carpet_sqft": number
- "parking": string ("Covered", "Open", "None")
- "furnishing": string ("Semi-Furnished", "Fully Furnished", "Unfurnished")
Message: "{msg}"
Return ONLY JSON.
"""
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json"
                )
            )
            if resp and resp.text:
                parsed = json.loads(resp.text.strip())
                for k, v in parsed.items():
                    if k in extracted_prop and v is not None and v != "":
                        extracted_prop[k] = v
        except Exception as e:
            # Safely fall back to our extracted_prop (e.g. when 429 quota is reached)
            pass

    # 3. Run deterministic valuation
    val_data = engine.estimate_valuation(extracted_prop)

    # 3. Formulate concise, institutional appraisal summary
    ai_reply = (
        f"For your {extracted_prop['bhk']} BHK ({extracted_prop['carpet_sqft']:.0f} sq.ft) in "
        f"{val_data['property_summary']['locality']}, the engine assesses a Fair Market Value of "
        f"₹{val_data['estimated_value_lakhs']:.2f} Lakhs (Corridor: ₹{val_data['value_range_lakhs']['min']:.2f}L – ₹{val_data['value_range_lakhs']['max']:.2f}L), "
        f"reflecting ₹{val_data['rate_per_sqft_carpet']:,}/sq.ft. "
        f"Official Maharashtra Ready Reckoner circle floor is ₹{val_data['government_benchmark']['government_floor_value_lakhs']:.2f} Lakhs."
    )

    return {
        "parsed_property": extracted_prop,
        "valuation": val_data,
        "ai_reply": ai_reply
    }


@app.post("/api/valuation/report")
def generate_report(prop: PropertyInput):
    """Generate formal Appraisal Memorandum for banks, investors, or buyers."""
    prop_dict = prop.model_dump()
    val_data = engine.estimate_valuation(prop_dict)
    memo = NarrativeService.generate_appraisal_memorandum(val_data)
    
    return {
        "valuation": val_data,
        "memorandum": memo
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
