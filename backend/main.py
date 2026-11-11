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


GEMINI_QUOTA_EXHAUSTED = False

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
    detected_sqft = 275.0 if is_rk else (450.0 if detected_bhk == 1 else (650.0 if detected_bhk == 2 else 1050.0))
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
    detected_parking = "Covered" if ("parking" in msg_lower and "no parking" not in msg_lower and "without parking" not in msg_lower) else "None"
    if "open parking" in msg_lower:
        detected_parking = "Open"
    elif "2 covered" in msg_lower or "two covered" in msg_lower:
        detected_parking = "2 Covered"

    # Floor & Total Floors
    detected_floor = 2
    detected_total_floors = 4 if is_rk else 10
    floor_m = re.search(r'(?:on\s+)?(\d+)(?:st|nd|rd|th)?\s*floor', msg_lower)
    if floor_m:
        detected_floor = int(floor_m.group(1))
    total_floor_m = re.search(r'(?:total\s+)?(\d+)\s*(?:floors|storey|story)', msg_lower)
    if total_floor_m:
        detected_total_floors = max(detected_floor, int(total_floor_m.group(1)))

    # Age extraction
    detected_age = 18 if ("mazgaon" in msg_lower or "byculla" in msg_lower) else 5
    age_m = re.search(r'(\d+)\s*(?:years?|yrs?)\s*old', msg_lower)
    if age_m:
        detected_age = int(age_m.group(1))
    elif "brand new" in msg_lower or "under construction" in msg_lower or "new construction" in msg_lower:
        detected_age = 0

    # Exhaustive Maharashtra Locality Priority Resolution
    LOCALITY_KEYWORD_MAP = [
        # South Mumbai & Island City
        (["mazgaon", "hattibaugh", "hattibaug", "byculla", "dockyard", "priyakuter"], "Mazgaon / Byculla (Hattibaugh)", 18.9696, 72.8427),
        (["malabar hill", "cuffe parade", "walkeshwar", "nepean sea", "colaba", "marine drive", "nariman point", "churchgate"], "Malabar Hill / Cuffe Parade", 18.9550, 72.7980),
        (["worli", "lower parel", "prabhadevi", "mahalaxmi", "currey road"], "Worli / Lower Parel", 19.0020, 72.8280),
        (["dadar", "mahim", "matunga", "shivaji park"], "Dadar / Mahim", 19.0178, 72.8478),
        
        # Western Suburbs (MMR)
        (["bandra west", "bandra east", "bandstand", "pali hill", "carter road", "khar west", "khar", "bandra"], "Bandra West / Khar", 19.0596, 72.8295),
        (["bkc", "bandra kurla complex", "kalanagar"], "Bandra-Kurla Complex (BKC) / Kalanagar", 19.0657, 72.8683),
        (["andheri west", "andheri east", "lokhandwala", "versova", "oshiwara", "andheri", "juhu", "jvpd", "seven bungalows"], "Andheri West / Lokhandwala", 19.1363, 72.8277),
        (["powai", "hiranandani", "chandivali"], "Powai / Hiranandani", 19.1176, 72.9060),
        (["goregaon west", "goregaon east", "malad west", "malad east", "goregaon", "malad"], "Goregaon West / Malad", 19.1663, 72.8526),
        (["borivali west", "borivali east", "kandivali west", "kandivali east", "borivali", "kandivali", "dahisar"], "Borivali / Kandivali", 19.2307, 72.8567),
        
        # Eastern Suburbs (MMR)
        (["mulund", "vikhroli", "chembur", "ghatkopar", "bhandup", "kanjurmarg", "tilak nagar", "kurla", "sion", "wadala"], "Mulund / Vikhroli / Chembur", 19.1726, 72.9425),
        
        # Thane & Beyond
        (["thane west", "ghodbunder", "majiwada", "kolshet", "naupada", "vartak nagar", "balkum", "panchpakhadi", "kalwa", "thane"], "Thane West (Ghodbunder Road / Majiwada)", 19.2183, 72.9781),
        (["dombivli", "kalyan", "palava", "shilphata", "ulhasnagar", "bhiwandi", "ambernath", "badlapur"], "Dombivli / Kalyan (Kalyan-Shil Corridor)", 19.2184, 73.0867),
        (["mira road", "bhayandar", "vasai", "virar", "nalasopara"], "Mira Road / Vasai Corridor", 19.2812, 72.8561),
        
        # Navi Mumbai
        (["vashi", "palm beach", "sanpada", "nerul", "seawoods", "belapur", "ghansoli", "airoli", "koparkhairane", "mahapi"], "Vashi / Palm Beach Road", 19.0771, 72.9986),
        (["kharghar", "panvel", "ulwe", "dronagiri", "taloja", "kamothe", "khandeshwar", "karanjade", "navi mumbai"], "Kharghar / Panvel (Airport Corridor)", 19.0269, 73.0645),
        
        # Pune & PCMC
        (["kothrud", "karve road", "karve nagar", "erandwane", "deccan", "shivajinagar", "model colony", "fc road", "jm road"], "Kothrud / Karve Road", 18.5074, 73.8077),
        (["viman nagar", "kalyani nagar", "koregaon park", "wadgaon sheri"], "Viman Nagar / Kalyani Nagar", 18.5679, 73.9143),
        (["baner", "balewadi", "mahalunge", "sus road"], "Baner / Balewadi High Street", 18.5590, 73.7868),
        (["wakad", "bhumkar", "thergaon", "pimple saudagar", "pimple nilakh", "pimple gurav", "rahatani", "sangvi"], "Wakad / Bhumkar Chowk", 18.5987, 73.7631),
        (["hinjawadi", "hinjewadi", "maan", "marunji"], "Hinjawadi (Phase 1, 2 & 3)", 18.5913, 73.7389),
        (["kharadi", "eon free zone", "eon it park"], "Kharadi / EON Free Zone", 18.5516, 73.9535),
        (["hadapsar", "magarpatta", "amanora", "mundhwa", "keshav nagar"], "Hadapsar / Magarpatta City", 18.5146, 73.9260),
        (["aundh", "pashan", "bavdhan"], "Aundh / Pashan / Bavdhan", 18.5580, 73.8070),
        (["moshi", "jal vayu vihar", "alandi", "chakan", "spine road"], "Moshi / Sector 6 (Jal Vayu Vihar)", 18.6742, 73.8445),
        (["bhosari", "chinchwad", "pimpri", "nigdi", "akurdi", "pradhikaran", "ravet", "talegaon", "pcmc"], "Pimpri-Chinchwad (Nigdi / Akurdi / Chinchwad)", 18.6448, 73.7997),
        (["wagholi", "dhanori", "lohegaon"], "Wagholi / Dhanori Corridor", 18.5800, 73.9800),
        (["nibm", "undri", "katraj", "kondhwa", "wanowrie", "dhayari", "bibwewadi", "narhe", "warje", "sahakar nagar", "ambegaon"], "South Pune (NIBM / Undri / Katraj)", 18.4600, 73.8900),
        
        # North Maharashtra
        (["gangapur road", "college road", "canada corner", "mahatma nagar", "anandwalli"], "Nashik (Gangapur Road / College Road)", 20.0063, 73.7639),
        (["indira nagar", "pathardi", "satpur", "ambad"], "Nashik (Indira Nagar / Pathardi Phata)", 19.9650, 73.7780),
        (["panchavati", "nashik road", "kalaram"], "Nashik (Panchavati / Nashik Road)", 19.9920, 73.8120),
        (["jalgaon"], "Jalgaon City (Court Road / MIDC)", 21.0077, 75.5626),
        (["dhule"], "Dhule City Corridor", 20.9042, 74.7749),
        
        # Vidarbha
        (["dharampeth", "civil lines", "ramdaspeth", "sadar", "shankar nagar", "laxmi nagar"], "Nagpur (Dharampeth / Civil Lines)", 21.1458, 79.0640),
        (["wardha road", "mihan", "manish nagar", "besa", "somalwada", "butibori"], "Nagpur (Wardha Road / MIHAN SEZ)", 21.0720, 79.0550),
        (["amravati"], "Amravati (Ravi Nagar / Camp)", 20.9320, 77.7523),
        (["akola"], "Akola City Corridor", 20.7002, 77.0082),
        (["chandrapur"], "Chandrapur City Corridor", 19.9615, 79.2961),
        
        # Marathwada
        (["cidco", "jalna road", "garkheda", "beed bypass", "waluj", "shendra", "aurangabad", "sambhajinagar", "chhatrapati sambhajinagar"], "Chhatrapati Sambhajinagar (CIDCO / Jalna Road)", 19.8762, 75.3433),
        (["nanded"], "Nanded (Vip Road / MIDC)", 19.1383, 77.3210),
        (["latur"], "Latur City Corridor", 18.4088, 76.5604),
        
        # Western Maharashtra
        (["rajarampuri", "tarabai park", "shahupuri", "kolhapur", "rankala"], "Kolhapur (Rajarampuri / Tarabai Park)", 16.7050, 74.2433),
        (["jule solapur", "hotgi", "solapur"], "Solapur (Hotgi Road / Jule Solapur)", 17.6599, 75.9064),
        (["satara", "karad"], "Satara (MIDC / Sadar Bazar)", 17.6805, 73.9930),
        (["sangli", "miraj"], "Sangli / Miraj Corridor", 16.8524, 74.5815),
        
        # Hill & Coastal
        (["lonavala", "khandala"], "Lonavala / Khandala Hill Corridor", 18.7557, 73.4091),
        (["alibaug", "mandwa", "kihim"], "Alibaug / Mandwa Coastal Enclave", 18.6414, 72.8722),
        (["ratnagiri"], "Ratnagiri (Mirya Road / Kuwarbav)", 16.9902, 73.3120),
        
        # Broad Metro Fallbacks (City Names)
        (["pune"], "Baner / Balewadi High Street", 18.5590, 73.7868),
        (["mumbai"], "Dadar / Mahim", 19.0178, 72.8478),
        (["nashik"], "Nashik (Gangapur Road / College Road)", 20.0063, 73.7639),
        (["nagpur"], "Nagpur (Dharampeth / Civil Lines)", 21.1458, 79.0640)
    ]

    detected_locality = None
    detected_lat = None
    detected_lng = None

    for keywords, loc_name, lat, lng in LOCALITY_KEYWORD_MAP:
        if any(re.search(r'\b' + re.escape(kw) + r'\b', msg_lower) for kw in keywords):
            detected_locality = loc_name
            detected_lat = lat
            detected_lng = lng
            break

    # If still not matched, check if PlacesService can geocode any location phrase from query
    if not detected_locality:
        try:
            # Extract possible location words
            cleaned_phrase = re.sub(r'\b\d+\s*(?:bhk|rk|sqft|sq\.ft|feet|floor|years?|yrs?|old)\b', '', msg_lower)
            geo_results = PlacesService.geocode_address(cleaned_phrase)
            if geo_results:
                top_geo = geo_results[0]
                # Verify coordinate is in Maharashtra bounds (approx lat 15.6 to 22.2, lng 72.5 to 81.0)
                if 15.6 <= top_geo["lat"] <= 22.2 and 72.5 <= top_geo["lng"] <= 81.0:
                    detected_lat = top_geo["lat"]
                    detected_lng = top_geo["lng"]
                    loc_meta = resolve_maharashtra_location(detected_lat, detected_lng)
                    detected_locality = loc_meta["locality_name"]
        except Exception:
            pass

    # Clean default if user provided zero geographic keywords
    if not detected_locality:
        detected_locality = "Maharashtra Urban Benchmark Corridor (Mumbai / Pune Core)"
        detected_lat = 19.0760
        detected_lng = 72.8777

    extracted_prop = {
        "locality": detected_locality,
        "bhk": detected_bhk,
        "carpet_sqft": detected_sqft,
        "floor": detected_floor,
        "total_floors": detected_total_floors,
        "age_years": detected_age,
        "parking": detected_parking,
        "facing": "East",
        "furnishing": detected_furnishing,
        "society_amenities": "Standard CHS",
        "lat": detected_lat,
        "lng": detected_lng
    }

    # 2. Try Gemini to enrich if available and within quota
    global GEMINI_QUOTA_EXHAUSTED
    if gemini_key and not GEMINI_QUOTA_EXHAUSTED:
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
            err_str = str(e).lower()
            if "429" in err_str or "resource_exhausted" in err_str or "quota" in err_str:
                GEMINI_QUOTA_EXHAUSTED = True
            pass

    # 3. Run deterministic valuation
    val_data = engine.estimate_valuation(extracted_prop)

    # 4. Formulate concise, natural language valuation summary (dual currency Lakhs + Crores)
    lakhs_val = val_data['estimated_value_lakhs']
    crores_val = lakhs_val / 100.0
    dual_price = f"₹{crores_val:.2f} Crores (₹{lakhs_val:.2f} Lakhs)" if crores_val >= 1.0 else f"₹{lakhs_val:.2f} Lakhs (₹{crores_val:.2f} Crores)"

    min_l = val_data['value_range_lakhs']['min']
    max_l = val_data['value_range_lakhs']['max']
    corridor = f"₹{min_l / 100:.2f}Cr – ₹{max_l / 100:.2f}Cr" if max_l >= 100 else f"₹{min_l:.2f}L – ₹{max_l:.2f}L"

    ai_reply = (
        f"For your {extracted_prop['bhk']} BHK ({extracted_prop['carpet_sqft']:.0f} sq.ft) in "
        f"{val_data['property_summary']['locality']}, the engine calculates a Fair Market Value of "
        f"{dual_price} (Corridor: {corridor}), reflecting ₹{val_data['rate_per_sqft_carpet']:,}/sq.ft. "
        f"Official Maharashtra Ready Reckoner circle rate floor is ₹{val_data['government_benchmark']['government_floor_value_lakhs']:.2f} Lakhs."
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
