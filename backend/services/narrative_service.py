"""
A.T.L.A.S. - Appraisal Memorandum & Narrative Intelligence Service
Generates formal bank-grade and investor-grade property appraisal reports
with statutory stamp duty analysis and comparable reconciliation.
"""

from typing import Dict, Any
from datetime import datetime


class NarrativeService:
    @staticmethod
    def generate_appraisal_memorandum(valuation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Produce a structured, formal Real Estate Valuation Memorandum.
        """
        prop = valuation_data["property_summary"]
        gov = valuation_data["government_benchmark"]
        val_range = valuation_data["value_range_lakhs"]
        est_val = valuation_data["estimated_value_lakhs"]
        rate_sqft = valuation_data["rate_per_sqft_carpet"]
        geo = valuation_data["geospatial_scores"]
        comps = valuation_data.get("comparable_properties", [])

        now_str = datetime.now().strftime("%B %d, %Y")
        ref_id = f"ATLAS-VAL-{prop['locality'][:3].upper()}-{int(est_val * 100)}"

        # Executive Summary Paragraph
        exec_summary = (
            f"This Property Valuation Memorandum provides an independent, evidence-backed assessment "
            f"for a {prop['bhk']}-BHK residential apartment situated in {prop['locality']} ({gov['statutory_authority']} jurisdiction). "
            f"Based on a synthesis of micro-market hedonic regression and recent nearby registered transactions, "
            f"the estimated Fair Market Value is determined to be ₹{est_val:.2f} Lakhs "
            f"(with an 85% confidence interval of ₹{val_range['min']:.2f}L to ₹{val_range['max']:.2f}L), "
            f"corresponding to an effective rate of ₹{rate_sqft:,}/sq.ft carpet area."
        )

        # Statutory / Ready Reckoner Analysis
        statutory_summary = (
            f"Under the Maharashtra Annual Statement of Rates (ASR / Ready Reckoner), the official benchmark "
            f"floor value for this asset is established at ₹{gov['government_floor_value_lakhs']:.2f} Lakhs "
            f"(benchmark rate: ₹{gov['ready_reckoner_rate_carpet']:,}/sq.ft). The assessed market value reflects a "
            f"{gov['market_premium_pct']}% premium over the circle rate, typical of active growth corridors in {prop['locality']}. "
            f"Estimated statutory stamp duty payable at 7.0% is approximately ₹{gov['stamp_duty_estimate_lakhs']:.2f} Lakhs "
            f"plus ₹{gov['registration_charge_inr']:,} statutory registration fee."
        )

        # Infrastructure & Proximity Highlights
        infra_summary = (
            f"The asset demonstrates high locational resilience, scoring {geo['transit_score']}/100 on transit access "
            f"and {geo['employment_score']}/100 on employment hub proximity. Nearest mass transit infrastructure "
            f"is located approximately {geo['nearest_metro_km']} km away, with primary employment corridors at {geo['nearest_job_hub_km']} km."
        )

        # Comparable Synthesis
        comp_names = [f"{c['society']} (₹{c['price_lakhs']}L)" for c in comps[:3]]
        comp_summary = (
            f"Appraisal reconciliation is supported by {len(comps)} proximate comparable transactions, including "
            f"{', '.join(comp_names)}. Pairwise adjustments reflect specific premiums for floor height (Floor {prop['floor']} of {prop['total_floors']}), "
            f"parking allocation ({prop['parking']}), and physical asset age ({prop['age_years']} years)."
        )

        # Risk Factors & Sensitivity
        risks = []
        if prop["age_years"] > 12:
            risks.append(f"Building age ({prop['age_years']} years) indicates moderate structural depreciation; factoring higher maintenance reserve.")
        if geo["nearest_metro_km"] > 3.0:
            risks.append("Distance to operational metro corridor is currently > 3.0 km; valuation is more reliant on arterial road connectivity.")
        if gov["market_premium_pct"] > 65:
            risks.append("Asset trades at a high premium (>65%) over Ready Reckoner benchmark; indicates strong consumer demand but higher stamp duty delta.")

        if not risks:
            risks.append("Asset exhibits strong liquidity and balanced market metrics across all core hedonic indices.")

        return {
            "memorandum_id": ref_id,
            "valuation_date": now_str,
            "valuation_standard": "RICS / Indian Banking Appraisal Standard (Hedonic Sales Comparison Method)",
            "executive_summary": exec_summary,
            "statutory_analysis": statutory_summary,
            "infrastructure_highlights": infra_summary,
            "comparable_reconciliation": comp_summary,
            "risk_and_sensitivity_factors": risks,
            "appraiser_note": "A.T.L.A.S. automated appraisal models are calibrated with empirical registered deed trends and official IGR Maharashtra ASR tables."
        }

