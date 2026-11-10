"""
IGR Maharashtra Annual Statement of Rates (ASR) 2024-2026
Circle rate anchors for all 36 districts — used as valuation floor/ceil guards.

Source: Maharashtra IGR (Inspector General of Registration & Stamps)
        Annual Statement of Rates 2024-25 / 2025-26 Gazette Notifications.

Usage in ATLAS:
  - Values here are baseline circle rates in ₹/sqft (carpet area equivalent).
  - The hedonic engine uses these as hard lower bounds (bank minimum LTV floor).
  - Market value from the regressor can exceed circle rates (market premium),
    but final estimate is clamped to max(circle_rate_value, regression_value).
  - Stamp duty in Maharashtra = circle_rate_value * applicable_rate% (varies 1–7%).

Circle rate bands (approximate, representative locality mid-point):
  Ultra-Premium : Bandra / Worli / Marine Drive           ₹2,50,000–₹3,80,000/sqm
  Premium       : Powai / Juhu / Prabhadevi               ₹1,20,000–₹2,20,000/sqm
  High          : Thane / Navi Mumbai / Kharadi            ₹65,000–₹1,10,000/sqm
  Mid           : Nashik / Nagpur Premium / Aurangabad     ₹35,000–₹60,000/sqm
  Affordable    : Tier-3 / Taluka HQ / Rural periphery     ₹8,000–₹30,000/sqm

All values below are ₹ per sq-ft (carpet). 1 sqm = 10.764 sqft.
"""

# District-level representative circle rates (₹/sqft carpet, residential flat)
# These are weighted averages of key localities within each district.
# Data aligned to ASR 2025-26 gazette revision cycle.

DISTRICT_CIRCLE_RATES: dict[str, dict] = {
    # --- Mumbai City & Suburbs ---
    "Mumbai City": {
        "asr_rate_per_sqft": 36_000,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Malabar Hill / Cuffe Parade": 42_000,
            "Bandra West / Pali Hill": 32_000,
            "Worli / Lower Parel": 28_000,
            "Dadar / Mahim": 22_000,
            "Andheri West": 18_000,
        },
    },
    "Mumbai Suburban": {
        "asr_rate_per_sqft": 20_000,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Juhu / JVPD": 28_000,
            "Powai / Hiranandani": 22_000,
            "Goregaon West / Malad": 15_000,
            "Borivali / Kandivali": 13_500,
            "Mulund / Vikhroli": 14_000,
        },
    },

    # --- MMR Region ---
    "Thane": {
        "asr_rate_per_sqft": 10_500,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Thane West (Ghodbunder Road)": 12_500,
            "Thane East / Kolshet": 11_000,
            "Dombivli / Kalyan": 7_500,
            "Bhiwandi": 5_000,
        },
    },
    "Navi Mumbai (Raigad)": {
        "asr_rate_per_sqft": 10_000,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Vashi / Palm Beach Road": 14_000,
            "Kharghar / Panvel": 10_500,
            "Ulwe / Dronagiri": 7_000,
            "Taloja / MIDC": 5_500,
        },
    },

    # --- Pune Region ---
    "Pune": {
        "asr_rate_per_sqft": 9_500,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Koregaon Park / Kalyani Nagar": 16_000,
            "Baner / Balewadi High Street": 13_000,
            "Wakad / Bhumkar Chowk": 11_500,
            "Kothrud / Karve Road": 12_000,
            "Hinjawadi (Phase 1-3)": 10_500,
            "Kharadi / EON Free Zone": 12_500,
            "Hadapsar / Magarpatta": 10_000,
            "Moshi / Sector 6 (Jal Vayu Vihar)": 7_200,
            "Wagholi / Dhanori": 7_000,
            "Ambegaon / Sus Road": 8_000,
        },
    },
    "Pimpri-Chinchwad": {
        "asr_rate_per_sqft": 8_000,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 1.0,
        "locality_bands": {
            "Pimpri / Chinchwad": 9_000,
            "Wakad / Thergaon": 10_500,
            "Akurdi / Nigdi": 8_500,
            "Talegaon Dabhade": 5_500,
        },
    },

    # --- Nashik Region ---
    "Nashik": {
        "asr_rate_per_sqft": 5_200,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 0.0,
        "locality_bands": {
            "Gangapur Road / College Road": 7_000,
            "Indira Nagar / Pathardi Phata": 5_800,
            "Satpur / Ambad (MIDC)": 5_000,
            "Panchvati / Nashik Road": 4_200,
            "Ozar / Sinnar (Periphery)": 2_500,
        },
    },

    # --- Nagpur Region ---
    "Nagpur": {
        "asr_rate_per_sqft": 5_800,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 0.0,
        "locality_bands": {
            "Dharampeth / Civil Lines": 9_000,
            "Ramdaspeth / Shankar Nagar": 8_000,
            "Wardha Road / MIHAN SEZ": 6_500,
            "Hingna / Butibori (MIDC)": 3_500,
            "Koradi / Kamptee (Periphery)": 2_800,
        },
    },

    # --- Aurangabad / Chhatrapati Sambhajinagar ---
    "Chhatrapati Sambhajinagar": {
        "asr_rate_per_sqft": 4_200,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 0.0,
        "locality_bands": {
            "CIDCO N-1 / N-6": 5_500,
            "Jalna Road / Waluj MIDC": 4_800,
            "Garkheda / Beed Bypass": 4_200,
            "Paithan Road / Rauza Baug": 3_500,
            "Harsul / Chikalthana (Periphery)": 2_800,
        },
    },

    # --- Kolhapur ---
    "Kolhapur": {
        "asr_rate_per_sqft": 4_500,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 0.0,
        "locality_bands": {
            "Rajarampuri / Shahupuri": 6_200,
            "Tarabai Park / Kale Colony": 5_800,
            "Kasba Bawada / Gandhinagar": 4_000,
            "Shiroli / Ichalkaranji": 3_200,
        },
    },

    # --- Solapur ---
    "Solapur": {
        "asr_rate_per_sqft": 3_200,
        "stamp_duty_pct": 6.0,
        "registration_pct": 1.0,
        "metro_cess_pct": 0.0,
        "locality_bands": {
            "Hotgi Road / Jule Solapur": 4_500,
            "Vijapur Road / Datta Nagar": 3_800,
            "Akkalkot Road / MIDC": 2_800,
            "Pandharpur / Barshi (Tier-3)": 1_800,
        },
    },

    # --- Other districts (abbreviated) ---
    "Raigad": {"asr_rate_per_sqft": 5_500, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Palghar": {"asr_rate_per_sqft": 4_200, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Ratnagiri": {"asr_rate_per_sqft": 3_500, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Sindhudurg": {"asr_rate_per_sqft": 3_000, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Ahmednagar": {"asr_rate_per_sqft": 3_200, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Dhule": {"asr_rate_per_sqft": 2_800, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Nandurbar": {"asr_rate_per_sqft": 1_800, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Jalgaon": {"asr_rate_per_sqft": 3_000, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Beed": {"asr_rate_per_sqft": 2_200, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Hingoli": {"asr_rate_per_sqft": 1_900, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Jalna": {"asr_rate_per_sqft": 2_300, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Latur": {"asr_rate_per_sqft": 2_600, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Nanded": {"asr_rate_per_sqft": 2_400, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Osmanabad (Dharashiv)": {"asr_rate_per_sqft": 2_000, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Parbhani": {"asr_rate_per_sqft": 2_100, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Akola": {"asr_rate_per_sqft": 2_900, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Amravati": {"asr_rate_per_sqft": 3_100, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Buldhana": {"asr_rate_per_sqft": 2_000, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Washim": {"asr_rate_per_sqft": 1_700, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Yavatmal": {"asr_rate_per_sqft": 1_900, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Wardha": {"asr_rate_per_sqft": 2_200, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Bhandara": {"asr_rate_per_sqft": 1_800, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Chandrapur": {"asr_rate_per_sqft": 2_500, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Gadchiroli": {"asr_rate_per_sqft": 1_200, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Gondia": {"asr_rate_per_sqft": 1_900, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Satara": {"asr_rate_per_sqft": 3_800, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
    "Sangli": {"asr_rate_per_sqft": 3_600, "stamp_duty_pct": 6.0, "registration_pct": 1.0, "metro_cess_pct": 0.0, "locality_bands": {}},
}


def get_circle_rate(district: str, locality: str | None = None) -> float:
    """
    Returns the applicable IGR circle rate in ₹/sqft for a given district and
    optional locality. Falls back to district-level rate if locality not found.
    """
    dist_data = DISTRICT_CIRCLE_RATES.get(district)
    if not dist_data:
        return 2_500  # Statewide rural minimum floor

    if locality:
        for loc_key, rate in dist_data.get("locality_bands", {}).items():
            if any(word.lower() in locality.lower() for word in loc_key.split("/")):
                return float(rate)

    return float(dist_data["asr_rate_per_sqft"])


def calculate_stamp_duty(district: str, value_lakhs: float) -> dict:
    """
    Computes stamp duty, registration, and metro cess for a property transaction
    in Maharashtra based on the IGR ASR 2025-26 applicable rates.

    Returns breakdown dict with individual components and total_lakhs.
    """
    dist_data = DISTRICT_CIRCLE_RATES.get(district, {})
    sd_pct = dist_data.get("stamp_duty_pct", 6.0)
    reg_pct = dist_data.get("registration_pct", 1.0)
    metro_pct = dist_data.get("metro_cess_pct", 0.0)

    stamp_duty = round(value_lakhs * sd_pct / 100, 2)
    registration = round(value_lakhs * reg_pct / 100, 2)
    metro_cess = round(value_lakhs * metro_pct / 100, 2)
    total = round(stamp_duty + registration + metro_cess, 2)

    return {
        "stamp_duty_lakhs": stamp_duty,
        "registration_lakhs": registration,
        "metro_cess_lakhs": metro_cess,
        "total_govt_charges_lakhs": total,
        "stamp_duty_pct": sd_pct,
        "registration_pct": reg_pct,
        "metro_cess_pct": metro_pct,
        "effective_total_pct": round(sd_pct + reg_pct + metro_pct, 1),
    }
