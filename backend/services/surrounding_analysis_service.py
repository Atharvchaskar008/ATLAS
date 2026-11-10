"""
A.T.L.A.S. - Surrounding Locality & Price Analysis Engine
Integrates:
1. Google Maps / Places Surrounding Locality Amenities Analysis (Transit, Healthcare, Education, Commercial, Civic)
2. Real-time Surrounding Price Analysis (25th-75th Percentile, Median, Variance, Spread)
3. Standard Real Estate Financial & Investment Metrics (Rental Yield, Cap Rate, 5-Yr CAGR, Bank LTV, Stamp Duty)

Fully deterministic calculation engine beneath!
"""

import os
import math
import requests
import numpy as np
from typing import Dict, List, Any, Optional

from data.maharashtra_data import (
    haversine_km,
    MAHARASHTRA_INFRASTRUCTURE_NODES,
    MAHARASHTRA_LOCALITIES_REGISTRY
)


class SurroundingAnalysisService:
    @staticmethod
    def get_google_maps_api_key() -> Optional[str]:
        return os.environ.get("GOOGLE_MAPS_API_KEY") or os.environ.get("VITE_GOOGLE_MAPS_API_KEY")

    @classmethod
    def analyze_surrounding_amenities(cls, lat: float, lng: float, radius_km: float = 3.5) -> Dict[str, Any]:
        """
        Scan surrounding locality amenities around the subject property coordinates.
        Uses Google Places API when API key is available, with automatic high-precision
        Maharashtra spatial node fallback.
        """
        api_key = cls.get_google_maps_api_key()
        live_places_used = False
        amenities_by_category: Dict[str, List[Dict[str, Any]]] = {
            "transit": [],
            "healthcare": [],
            "education": [],
            "commercial": [],
            "civic_parks": []
        }

        if api_key:
            try:
                # Query Google Places API Nearby Search
                # Types: transit_station, hospital, school, shopping_mall, park
                endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                params = {
                    "location": f"{lat},{lng}",
                    "radius": int(radius_km * 1000),
                    "key": api_key
                }
                resp = requests.get(endpoint, params=params, timeout=4.0)
                if resp.status_code == 200:
                    data = resp.json()
                    results = data.get("results", [])
                    if results:
                        live_places_used = True
                        for place in results[:25]:
                            p_lat = place["geometry"]["location"]["lat"]
                            p_lng = place["geometry"]["location"]["lng"]
                            dist = haversine_km(lat, lng, p_lat, p_lng)
                            types = place.get("types", [])
                            name = place.get("name", "Local Amenity")
                            rating = place.get("rating", 4.0)

                            item = {
                                "name": name,
                                "distance_km": round(dist, 2),
                                "rating": rating,
                                "address": place.get("vicinity", ""),
                                "lat": p_lat,
                                "lng": p_lng
                            }

                            if any(t in types for t in ["subway_station", "transit_station", "train_station", "bus_station"]):
                                amenities_by_category["transit"].append(item)
                            elif any(t in types for t in ["hospital", "doctor", "pharmacy"]):
                                amenities_by_category["healthcare"].append(item)
                            elif any(t in types for t in ["school", "university", "secondary_school"]):
                                amenities_by_category["education"].append(item)
                            elif any(t in types for t in ["shopping_mall", "supermarket", "department_store", "store"]):
                                amenities_by_category["commercial"].append(item)
                            else:
                                amenities_by_category["civic_parks"].append(item)
            except Exception as e:
                # Fallback to internal registry silently
                pass

        # If live Google Places was not used or returned sparse data, enrich with Maharashtra spatial nodes
        if not live_places_used or sum(len(v) for v in amenities_by_category.values()) < 4:
            for node in MAHARASHTRA_INFRASTRUCTURE_NODES:
                dist = haversine_km(lat, lng, node["lat"], node["lng"])
                if dist <= radius_km * 2.5:  # within scan envelope
                    cat = node["category"]
                    entry = {
                        "name": node["name"],
                        "distance_km": round(dist, 2),
                        "rating": 4.5,
                        "address": f"{node.get('district', 'Maharashtra')} Corridor",
                        "lat": node["lat"],
                        "lng": node["lng"]
                    }
                    if cat == "metro" or cat == "highway":
                        amenities_by_category["transit"].append(entry)
                    elif cat == "hospital":
                        amenities_by_category["healthcare"].append(entry)
                    elif cat == "lifestyle":
                        amenities_by_category["commercial"].append(entry)
                    elif "hub" in cat:
                        amenities_by_category["commercial"].append(entry)
                    else:
                        amenities_by_category["civic_parks"].append(entry)

        # Sort all lists by distance ascending
        for cat in amenities_by_category:
            amenities_by_category[cat].sort(key=lambda x: x["distance_km"])

        # Calculate standard locational index scores (0-100)
        nearest_transit = amenities_by_category["transit"][0]["distance_km"] if amenities_by_category["transit"] else 5.0
        nearest_health = amenities_by_category["healthcare"][0]["distance_km"] if amenities_by_category["healthcare"] else 4.0
        nearest_comm = amenities_by_category["commercial"][0]["distance_km"] if amenities_by_category["commercial"] else 3.5

        # Distance-decay calculations
        transit_connectivity_index = int(np.clip(100 - (nearest_transit * 16), 25, 98))
        healthcare_access_index = int(np.clip(100 - (nearest_health * 14), 30, 96))
        commercial_density_index = int(np.clip(100 - (nearest_comm * 15), 35, 97))
        overall_walkability_score = int((transit_connectivity_index * 0.4) + (commercial_density_index * 0.35) + (healthcare_access_index * 0.25))

        return {
            "source": "Google Places API (Live)" if live_places_used else "A.T.L.A.S. Maharashtra Geospatial Radar",
            "is_live_google_api": live_places_used,
            "scan_radius_km": radius_km,
            "counts": {
                "transit": len(amenities_by_category["transit"]),
                "healthcare": len(amenities_by_category["healthcare"]),
                "education": len(amenities_by_category["education"]),
                "commercial": len(amenities_by_category["commercial"]),
                "civic_parks": len(amenities_by_category["civic_parks"]),
                "total": sum(len(v) for v in amenities_by_category.values())
            },
            "nearest_amenities": {
                "nearest_transit": amenities_by_category["transit"][:3],
                "nearest_healthcare": amenities_by_category["healthcare"][:3],
                "nearest_education": amenities_by_category["education"][:3],
                "nearest_commercial": amenities_by_category["commercial"][:3]
            },
            "indices": {
                "walkability_score": overall_walkability_score,
                "transit_connectivity_index": transit_connectivity_index,
                "healthcare_access_index": healthcare_access_index,
                "commercial_density_index": commercial_density_index
            }
        }

    @classmethod
    def calculate_surrounding_price_statistics(
        cls,
        subject_lat: float,
        subject_lng: float,
        nearby_comps: List[Dict[str, Any]],
        locality_meta: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Perform real-time statistical surrounding price analysis:
        Min, 25th percentile, Median, 75th percentile, Max per sq.ft,
        and price dispersion across radii (1km, 3km, 5km).
        """
        rates_per_sqft = [c["price_per_sqft_carpet"] for c in nearby_comps] if nearby_comps else []
        
        # If fewer than 4 comps, enrich with locality baseline spread
        if len(rates_per_sqft) < 4:
            base_min = locality_meta["market_rate_carpet_sqft_min"]
            base_avg = locality_meta["market_rate_carpet_sqft_avg"]
            base_max = locality_meta["market_rate_carpet_sqft_max"]
            rates_per_sqft.extend([base_min, base_avg, int((base_min + base_avg) / 2), base_max])

        rates_arr = np.array(rates_per_sqft, dtype=float)
        p_min = int(np.min(rates_arr))
        p_25 = int(np.percentile(rates_arr, 25))
        p_median = int(np.median(rates_arr))
        p_mean = int(np.mean(rates_arr))
        p_75 = int(np.percentile(rates_arr, 75))
        p_max = int(np.max(rates_arr))
        std_dev = int(np.std(rates_arr))
        iqr = p_75 - p_25
        coefficient_of_variation = round((std_dev / max(1.0, float(p_mean))) * 100.0, 1)

        # Distance-segmented price averages
        rates_1km = [c["price_per_sqft_carpet"] for c in nearby_comps if c.get("distance_km", 99) <= 1.2]
        rates_3km = [c["price_per_sqft_carpet"] for c in nearby_comps if c.get("distance_km", 99) <= 3.2]

        avg_1km = int(np.mean(rates_1km)) if rates_1km else p_mean
        avg_3km = int(np.mean(rates_3km)) if rates_3km else p_mean

        # Ready Reckoner comparison
        asr_carpet = locality_meta["ready_reckoner_rate_carpet_sqft"]
        asr_premium_pct = round(((p_median - asr_carpet) / float(asr_carpet)) * 100.0, 1)

        return {
            "rates_per_sqft_carpet": {
                "min": p_min,
                "p25": p_25,
                "median": p_median,
                "mean": p_mean,
                "p75": p_75,
                "max": p_max,
                "std_deviation": std_dev,
                "interquartile_range": iqr,
                "volatility_index_pct": coefficient_of_variation
            },
            "radial_pricing": {
                "radius_1km_avg_sqft": avg_1km,
                "radius_3km_avg_sqft": avg_3km,
                "sample_comps_count": len(nearby_comps)
            },
            "ready_reckoner_spread": {
                "official_asr_sqft": asr_carpet,
                "market_over_asr_premium_pct": asr_premium_pct,
                "valuation_stance": "High Premium" if asr_premium_pct > 45 else ("Balanced Market" if asr_premium_pct > 15 else "Discount/Distress Threshold")
            }
        }

    @classmethod
    def calculate_financial_and_investment_metrics(
        cls,
        estimated_value_lakhs: float,
        carpet_sqft: float,
        locality_meta: Dict[str, Any],
        age_years: int
    ) -> Dict[str, Any]:
        """
        Compute standard real estate financial metrics:
        - Monthly Rental Value & Rental Yield
        - Capitalization Rate (Cap Rate)
        - 5-Year Capital Appreciation CAGR & Projections
        - Max Bank Loan Sanction (LTV 80%)
        - Resale Absorption / Liquidity
        - Stamp Duty and Registration in Maharashtra
        """
        val_inr = estimated_value_lakhs * 100000.0
        rental_yield_pct = locality_meta.get("rental_yield_pct", 3.6)
        
        # Yield adjusts slightly by age (older properties yield higher rental % on capital value)
        effective_yield_pct = rental_yield_pct + (0.3 if age_years > 10 else 0.0)
        annual_rent_inr = (val_inr * (effective_yield_pct / 100.0))
        monthly_rent_inr = int(annual_rent_inr / 12.0)

        # Net Operating Income (NOI) deducting ~12% for property tax, maintenance reserve, vacancy
        net_operating_income_inr = annual_rent_inr * 0.88
        cap_rate_pct = round((net_operating_income_inr / val_inr) * 100.0, 2)

        # 5-Year Capital Appreciation (CAGR)
        annual_growth_pct = locality_meta.get("growth_rate_annual_pct", 7.5)
        yr1_lakhs = round(estimated_value_lakhs * (1 + annual_growth_pct / 100.0) ** 1, 2)
        yr3_lakhs = round(estimated_value_lakhs * (1 + annual_growth_pct / 100.0) ** 3, 2)
        yr5_lakhs = round(estimated_value_lakhs * (1 + annual_growth_pct / 100.0) ** 5, 2)

        # Bank Financing (LTV = 80% typical RBI cap for residential)
        max_bank_loan_lakhs = round(estimated_value_lakhs * 0.80, 2)
        down_payment_required_lakhs = round(estimated_value_lakhs * 0.20, 2)

        # Statutory Stamp Duty in Maharashtra
        stamp_duty_rate = locality_meta.get("stamp_duty_pct", 7.0)
        asr_carpet = locality_meta["ready_reckoner_rate_carpet_sqft"]
        asr_total_lakhs = round((asr_carpet * carpet_sqft) / 100000.0, 2)
        taxable_lakhs = max(estimated_value_lakhs, asr_total_lakhs)
        stamp_duty_lakhs = round((taxable_lakhs * stamp_duty_rate) / 100.0, 2)
        registration_charge_inr = 30000 if taxable_lakhs >= 30.0 else int(taxable_lakhs * 1000.0)

        # Liquidity / Absorption
        # Highly urban areas in Pune/MMR have faster absorption (30-60 days), Tier-2/3 have 90-120 days
        is_metro_hub = locality_meta.get("region") in ["Pune Metropolitan", "Mumbai MMR", "Navi Mumbai"]
        estimated_days_on_market = 45 if is_metro_hub else 75
        liquidity_score = 88 if is_metro_hub else 72

        return {
            "rental_profile": {
                "estimated_monthly_rent_inr": monthly_rent_inr,
                "gross_rental_yield_pct": round(effective_yield_pct, 2),
                "net_cap_rate_pct": cap_rate_pct,
                "rent_per_sqft_carpet": round(monthly_rent_inr / carpet_sqft, 1)
            },
            "growth_projections": {
                "projected_cagr_pct": annual_growth_pct,
                "forecast_year_1_lakhs": yr1_lakhs,
                "forecast_year_3_lakhs": yr3_lakhs,
                "forecast_year_5_lakhs": yr5_lakhs,
                "five_year_total_gain_lakhs": round(yr5_lakhs - estimated_value_lakhs, 2)
            },
            "bank_underwriting": {
                "max_loan_to_value_pct": 80.0,
                "max_bank_loan_sanction_lakhs": max_bank_loan_lakhs,
                "minimum_equity_downpayment_lakhs": down_payment_required_lakhs,
                "estimated_emi_20yr_at_8_5pct": int((max_bank_loan_lakhs * 100000.0) * 0.008678)
            },
            "statutory_charges": {
                "stamp_duty_rate_pct": stamp_duty_rate,
                "stamp_duty_amount_lakhs": stamp_duty_lakhs,
                "registration_charge_inr": registration_charge_inr,
                "total_government_levy_lakhs": round(stamp_duty_lakhs + (registration_charge_inr / 100000.0), 2)
            },
            "market_liquidity": {
                "liquidity_score": liquidity_score,
                "estimated_days_on_market": estimated_days_on_market,
                "demand_velocity": "High Demand Velocity" if liquidity_score > 80 else "Stable Liquidity"
            }
        }

