"""
A.T.L.A.S. - Model Context Protocol (MCP) Server (Statewide Maharashtra)
Exposes real-time property valuation, Ready Reckoner benchmarks,
geospatial surrounding analysis, and Gemini AI intelligence as standard MCP tools.
"""

import sys
import os
import json
from typing import Optional, Dict, Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.valuation_engine import ValuationEngine
from services.narrative_service import NarrativeService
from services.places_service import PlacesService
from data.maharashtra_registry import resolve_maharashtra_location, MAHARASHTRA_LOCALITY_HUBS

try:
    from mcp.server.mcpserver import MCPServer
    mcp = MCPServer("ATLAS-Valuation-Engine")
except ImportError:
    try:
        from mcp.server.fastmcp import FastMCP
        mcp = FastMCP("ATLAS-Valuation-Engine")
    except ImportError:
        mcp = None

engine = ValuationEngine()


if mcp is not None:
    @mcp.tool()
    def estimate_property_value(
        locality: str = "Moshi",
        bhk: int = 2,
        carpet_sqft: float = 600.0,
        floor: int = 2,
        total_floors: int = 4,
        age_years: int = 16,
        parking: str = "Covered",
        facing: str = "East",
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> str:
        """
        Estimate fair market value, confidence range, SHAP explainability,
        and Gemini AI intelligence for ANY coordinate in Maharashtra.
        """
        prop = {
            "locality": locality,
            "bhk": bhk,
            "carpet_sqft": carpet_sqft,
            "floor": floor,
            "total_floors": total_floors,
            "age_years": age_years,
            "parking": parking,
            "facing": facing,
            "lat": lat,
            "lng": lng
        }
        res = engine.estimate_valuation(prop)
        return json.dumps(res, indent=2)

    @mcp.tool()
    def analyze_surrounding_locality(lat: float, lng: float) -> str:
        """
        Real-time surrounding locality analysis for ANY coordinate in Maharashtra:
        Returns POIs (transit, schools, hospitals), walkability and transit scores.
        """
        surrounding = PlacesService.analyze_surrounding_locality(lat, lng)
        loc_meta = resolve_maharashtra_location(lat, lng)
        return json.dumps({
            "resolved_location": loc_meta,
            "surrounding_analysis": surrounding
        }, indent=2)

    @mcp.tool()
    def get_ready_reckoner_rate(lat: float, lng: float) -> str:
        """
        Retrieve official Maharashtra IGR Ready Reckoner (ASR) circle rate
        and stamp duty liability for ANY coordinate in Maharashtra.
        """
        loc_meta = resolve_maharashtra_location(lat, lng)
        return json.dumps(loc_meta, indent=2)

    @mcp.tool()
    def get_comparable_properties(
        lat: float = 18.6750,
        lng: float = 73.8450,
        bhk: int = 2,
        carpet_sqft: float = 600.0
    ) -> str:
        """
        Find nearest registered comparable properties in Maharashtra with pairwise adjustments.
        """
        comps = engine.find_comparable_properties(
            lat=lat,
            lng=lng,
            bhk=bhk,
            carpet_sqft=carpet_sqft,
            max_results=5
        )
        return json.dumps(comps, indent=2)

    @mcp.tool()
    def generate_appraisal_report(
        locality: str = "Moshi",
        bhk: int = 2,
        carpet_sqft: float = 600.0,
        floor: int = 2,
        total_floors: int = 4,
        age_years: int = 16,
        parking: str = "Covered",
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> str:
        """
        Generate formal bank-grade Real Estate Appraisal Memorandum.
        """
        prop = {
            "locality": locality,
            "bhk": bhk,
            "carpet_sqft": carpet_sqft,
            "floor": floor,
            "total_floors": total_floors,
            "age_years": age_years,
            "parking": parking,
            "lat": lat,
            "lng": lng
        }
        res = engine.estimate_valuation(prop)
        memo = NarrativeService.generate_appraisal_memorandum(res)
        return json.dumps(memo, indent=2)


if __name__ == "__main__":
    if mcp:
        print("Starting A.T.L.A.S. Statewide MCP Server on stdio...")
        mcp.run()
    else:
        print("MCP library not installed.")
