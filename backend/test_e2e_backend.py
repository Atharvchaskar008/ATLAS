import requests
import json
import time
import sys

BASE = 'http://127.0.0.1:8000'
results = []

def run_test(name, fn):
    t0 = time.time()
    try:
        ok, msg = fn()
        ms = int((time.time() - t0) * 1000)
        results.append((name, ok, f"{ms}ms", msg))
    except Exception as e:
        ms = int((time.time() - t0) * 1000)
        results.append((name, False, f"{ms}ms", str(e)))

# 1. Health check
def t_health():
    r = requests.get(f"{BASE}/api/health", timeout=5)
    d = r.json()
    return r.status_code == 200 and d.get("status") == "healthy", f"comps={d.get('total_calibrated_comps')}, hubs={d.get('supported_statewide_hubs')}"

# 2. Localities
def t_localities():
    r = requests.get(f"{BASE}/api/valuation/localities", timeout=5)
    d = r.json()
    count = len(d.get("localities", []))
    return r.status_code == 200 and count > 10, f"{count} localities loaded"

# 3. Direct Hedonic Valuation (Moshi Sector 6, 2 BHK, 600 sqft)
def t_estimate_moshi():
    payload = {
        "locality": "Moshi / Sector 6 (Jal Vayu Vihar)",
        "bhk": 2,
        "carpet_sqft": 600,
        "floor": 2,
        "total_floors": 4,
        "age_years": 16,
        "parking": "Covered",
        "facing": "East",
        "furnishing": "Semi-Furnished",
        "society_amenities": "Basic Society",
        "lat": 18.6742,
        "lng": 73.8445
    }
    r = requests.post(f"{BASE}/api/valuation/estimate", json=payload, timeout=25)
    d = r.json()
    val = d.get("estimated_value_lakhs", 0)
    rate = d.get("rate_per_sqft_carpet", 0)
    ok = 45.0 <= val <= 65.0
    return ok, f"Value: Rs {val:.2f}L | Rate: Rs {rate}/sqft"

# 4. Direct Hedonic Valuation (Bandra West, 3 BHK, 1200 sqft)
def t_estimate_bandra():
    payload = {
        "locality": "Bandra West / Khar",
        "bhk": 3,
        "carpet_sqft": 1200,
        "floor": 14,
        "total_floors": 22,
        "age_years": 3,
        "parking": "2 Covered",
        "facing": "North-East",
        "furnishing": "Luxury Furnished",
        "society_amenities": "Township / Multi-Clubhouse",
        "lat": 19.0596,
        "lng": 72.8295
    }
    r = requests.post(f"{BASE}/api/valuation/estimate", json=payload, timeout=25)
    d = r.json()
    val = d.get("estimated_value_lakhs", 0)
    rate = d.get("rate_per_sqft_carpet", 0)
    ok = 400.0 <= val <= 750.0
    return ok, f"Value: Rs {val:.2f}L | Rate: Rs {rate}/sqft"

# 5. Natural Language Parsing + Valuation (Gemini Layer)
def t_chat_parse():
    payload = {
        "message": "Got a 2 BHK in Jal Vayu Vihar Moshi Sector 6, 600 sqft on 2nd floor, asking 38 Lakhs, semi furnished"
    }
    r = requests.post(f"{BASE}/api/valuation/chat-parse", json=payload, timeout=35)
    d = r.json()
    parsed = d.get("parsed_property", {})
    val = d.get("valuation", {}).get("estimated_value_lakhs", 0)
    ok = parsed.get("bhk") == 2 and parsed.get("carpet_sqft") == 600 and val > 0
    return ok, f"Parsed BHK={parsed.get('bhk')}, Sqft={parsed.get('carpet_sqft')}, Val=Rs {val:.2f}L"

# 6. Statutory IGR Ready Reckoner & Stamp Duty
def t_igr_benchmark():
    payload = {
        "locality": "Moshi / Sector 6 (Jal Vayu Vihar)",
        "bhk": 2,
        "carpet_sqft": 600,
        "floor": 2,
        "total_floors": 4,
        "age_years": 16,
        "parking": "Covered",
        "facing": "East",
        "lat": 18.6742,
        "lng": 73.8445
    }
    r = requests.post(f"{BASE}/api/valuation/estimate", json=payload, timeout=25)
    d = r.json().get("government_benchmark", {})
    asr = d.get("ready_reckoner_rate_carpet", 0)
    sd = d.get("stamp_duty_estimate_lakhs", 0)
    pct = d.get("stamp_duty_pct", 0)
    ok = asr > 5000 and sd > 0
    return ok, f"Circle Rate=Rs {asr}/sqft, Stamp Duty=Rs {sd:.2f}L ({pct}%)"

# 7. Surrounding POI & Locality Radar
def t_surrounding():
    r = requests.get(f"{BASE}/api/valuation/live-amenities?lat=18.6742&lng=73.8445&radius=3000", timeout=15)
    d = r.json()
    pois = d.get("amenities", [])
    ok = len(pois) > 0
    return ok, f"{len(pois)} surrounding POIs identified within 3km"

# 8. Sales Comps Matrix
def t_comps():
    payload = {
        "locality": "Moshi / Sector 6 (Jal Vayu Vihar)",
        "bhk": 2,
        "carpet_sqft": 600,
        "floor": 2,
        "total_floors": 4,
        "age_years": 16,
        "parking": "Covered",
        "facing": "East",
        "lat": 18.6742,
        "lng": 73.8445
    }
    r = requests.post(f"{BASE}/api/valuation/comps", json=payload, timeout=10)
    d = r.json()
    comps = d.get("comparables", [])
    ok = len(comps) >= 3
    return ok, f"{len(comps)} verified comparable properties retrieved"

# 9. Appraisal Memorandum Generation
def t_report():
    payload = {
        "locality": "Moshi / Sector 6 (Jal Vayu Vihar)",
        "bhk": 2,
        "carpet_sqft": 600,
        "floor": 2,
        "total_floors": 4,
        "age_years": 16,
        "parking": "Covered",
        "facing": "East",
        "lat": 18.6742,
        "lng": 73.8445
    }
    r = requests.post(f"{BASE}/api/valuation/report", json=payload, timeout=15)
    d = r.json()
    has_memo = "memorandum" in d and "valuation" in d
    return has_memo, f"Generated official appraisal memorandum document"

if __name__ == "__main__":
    run_test("1. Health Check", t_health)
    run_test("2. Localities Registry", t_localities)
    run_test("3. Hedonic Valuation (Moshi)", t_estimate_moshi)
    run_test("4. Hedonic Valuation (Bandra)", t_estimate_bandra)
    run_test("5. Gemini Natural Language Parse", t_chat_parse)
    run_test("6. Statutory IGR Circle Rates", t_igr_benchmark)
    run_test("7. Surrounding POI Radar", t_surrounding)
    run_test("8. Sales Comps Retrieval", t_comps)
    run_test("9. Appraisal Memorandum Gen", t_report)

    print("\n" + "=" * 80)
    print("  ATLAS BACKEND END-TO-END VALIDATION REPORT")
    print("=" * 80)
    all_pass = True
    for name, ok, lat, detail in results:
        status = "PASS [OK]" if ok else "FAIL [X]"
        if not ok:
            all_pass = False
        print(f"{status:<11} | {lat:>6} | {name:<32} | {detail}")
    print("=" * 80)
    res_str = "ALL 9 SUITES PASSED (100% OPERATIONAL)" if all_pass else "SOME SUITES FAILED"
    print(f"Final Result: {res_str}\n")
    sys.exit(0 if all_pass else 1)
