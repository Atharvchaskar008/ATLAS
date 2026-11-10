"""
A.T.L.A.S. - Statewide Engine Verification Test
Verifies:
1. Moshi (PCMC Pune)
2. Bandra West (Mumbai Suburban)
3. Gangapur Road (Nashik)
4. Dharampeth (Nagpur)
5. Arbitrary Pin-Drop in rural/suburban Maharashtra (Continuous spatial IDW)
6. Real-time Surrounding POI Analysis & Gemini AI Layer
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.valuation_engine import ValuationEngine

def run_tests():
    print(">>> Initializing A.T.L.A.S. Statewide Engine...")
    engine = ValuationEngine()
    print(f"Total calibrated statewide dataset size: {len(engine.all_comps)} properties\n")

    test_cases = [
        {
            "name": "Moshi Sector 6 Jal Vayu Vihar (PCMC Pune)",
            "prop": {
                "locality": "Moshi",
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
        },
        {
            "name": "Bandra West / Khar (Mumbai Suburban)",
            "prop": {
                "locality": "Bandra West",
                "bhk": 3,
                "carpet_sqft": 1200,
                "floor": 14,
                "total_floors": 22,
                "age_years": 3,
                "parking": "2 Covered",
                "facing": "North-East",
                "lat": 19.0596,
                "lng": 72.8295
            }
        },
        {
            "name": "Gangapur Road (Nashik)",
            "prop": {
                "locality": "Nashik",
                "bhk": 2,
                "carpet_sqft": 750,
                "floor": 5,
                "total_floors": 12,
                "age_years": 4,
                "parking": "Covered",
                "facing": "East",
                "lat": 19.9975,
                "lng": 73.7898
            }
        },
        {
            "name": "Dharampeth (Nagpur)",
            "prop": {
                "locality": "Nagpur",
                "bhk": 3,
                "carpet_sqft": 1100,
                "floor": 6,
                "total_floors": 11,
                "age_years": 5,
                "parking": "Covered",
                "facing": "North",
                "lat": 21.1458,
                "lng": 79.0669
            }
        },
        {
            "name": "Arbitrary Pin-Drop in Maharashtra (Near Lonavala / Khandala corridor)",
            "prop": {
                "locality": "Custom Pin Drop",
                "bhk": 2,
                "carpet_sqft": 650,
                "floor": 3,
                "total_floors": 6,
                "age_years": 5,
                "parking": "Covered",
                "facing": "East",
                "lat": 18.7500,
                "lng": 73.4000
            }
        }
    ]

    for tc in test_cases:
        print(f"==================================================")
        print(f"TEST: {tc['name']}")
        res = engine.estimate_valuation(tc['prop'])
        ps = res["property_summary"]
        gb = res["government_benchmark"]
        surr = res["surrounding_locality_analysis"]
        ai = res["gemini_ai_layer"]

        print(f"Resolved Location: {ps['locality']} ({ps['district']}, {ps['authority']})")
        print(f"Address: {ps['formatted_address']}")
        print(f"Fair Market Value: Rs. {res['estimated_value_lakhs']} Lakhs (Rs. {res['rate_per_sqft_carpet']}/sqft)")
        print(f"Value Range: Rs. {res['value_range_lakhs']['min']}L to {res['value_range_lakhs']['max']}L")
        print(f"Govt Ready Reckoner (ASR): Rs. {gb['government_floor_value_lakhs']} Lakhs (Rate: Rs. {gb['ready_reckoner_rate_carpet']}/sqft)")
        print(f"Stamp Duty ({gb['stamp_duty_pct']}%): Rs. {gb['stamp_duty_estimate_lakhs']} Lakhs")
        print(f"Surrounding POIs (1.5km): {surr['amenities_count']['within_1500m']} | Walkability: {surr['indices']['walkability_score']}/100")
        print(f"Nearest Transit: {surr['nearest_transit']['name']} ({surr['nearest_transit']['distance_km']} km)")
        print(f"AI Livability Summary: {ai['livability_summary']}")
        print(f"AI Rental Yield: {ai['rental_yield_outlook']}")
        print(f"AI Appraiser Verdict: {ai['appraisal_verdict']}")
        print(f"Comps Found: {len(res['comparable_properties'])} (Nearest: {res['comparable_properties'][0]['society']} - Rs. {res['comparable_properties'][0]['price_lakhs']}L)")
        print()

    print(">>> ALL STATEWIDE TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
