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
    extracted_prop = {
        "locality": "Moshi",
        "bhk": 2,
        "carpet_sqft": 650.0,
        "floor": 3,
        "total_floors": 10,
        "age_years": 5,
        "parking": "Covered",
        "facing": "East",
        "furnishing": "Unfurnished",
        "society_amenities": "Standard CHS"
    }

    # 1. Use Gemini to extract structured parameters if key is available
    if gemini_key:
        try:
            from google import genai
            from google.genai import types
            import json

            client = genai.Client(api_key=gemini_key)
            prompt = f"""
You are an institutional real estate assistant.
Extract the property specifications from the user's message into a valid JSON object matching these exact keys:
- "locality": string (e.g. "Moshi", "Wakad", "Bandra West", "Kharadi", "Powai", "Dharampeth", "Gangapur Road", etc.)
- "bhk": integer (1 to 5)
- "carpet_sqft": number (e.g. 600, 750, 1100)
- "floor": integer
- "total_floors": integer
- "age_years": integer
- "parking": string ("Covered", "2 Covered", "Open", or "None")
- "facing": string ("East", "North", "North-East", "West", "South")
- "furnishing": string ("Unfurnished", "Semi-Furnished", "Fully Furnished", "Ultra-Luxury")
- "society_amenities": string ("Standard CHS", "Gated Community", "Integrated Township")

User Message: "{msg}"
Return ONLY valid JSON.
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
                    if k in extracted_prop and v is not None:
                        extracted_prop[k] = v
        except Exception as e:
            print(f"[chat-parse] Gemini extraction fallback: {e}")

    # Fallback heuristic extraction if Gemini was not used or missed keys
    import re
    bhk_m = re.search(r'(\d+)\s*(?:bhk|bedroom|bed)', msg, re.IGNORECASE)
    if bhk_m:
        extracted_prop["bhk"] = int(bhk_m.group(1))

    sqft_m = re.search(r'(\d{3,4})\s*(?:sqft|sq\.ft|square feet|carpet)', msg, re.IGNORECASE)
    if sqft_m:
        extracted_prop["carpet_sqft"] = float(sqft_m.group(1))

    # Detect known localities in text
    for hub in MAHARASHTRA_LOCALITY_HUBS:
        clean_hub_name = hub["locality"].split("/")[0].strip().lower()
        if clean_hub_name in msg.lower():
            extracted_prop["locality"] = hub["locality"]
            extracted_prop["lat"] = hub["lat"]
            extracted_prop["lng"] = hub["lng"]
            break

    # 2. Run deterministic valuation
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
