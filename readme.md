# A.T.L.A.S. — Automated Terrain & Asset Location Assessment System
> **See Beyond the Property. Understand Its True Value.**  
> *AI-Powered Statewide Property Valuation & Locality Intelligence Engine for Maharashtra, India.*

---

## 🏆 Project Overview & Expanded Scope

A.T.L.A.S. now covers **each and every point in Maharashtra**.

By combining **continuous spatial inverse-distance weighting (IDW)**, the **Maharashtra IGR Ready Reckoner (ASR) benchmark registry (2024–2026)**, and **real-time surrounding amenity radar**, users can drop a pin anywhere—from South Mumbai high-rises to rural Pune/Nashik agricultural belts—and receive:
1. **Deterministic Mathematical Valuation (Beneath):** Grounded hedonic machine learning (Gradient Boosting Regressor), empirical 85% confidence intervals, and pairwise Sales Comparison Approach (comps).
2. **Real-Time Surrounding Locality Radar:** Scans amenities (transit, hospitals, schools, commercial centers) within 500m, 1.5km, and 3km to compute walkability, transit accessibility, and social infrastructure scores.
3. **Gemini AI Locality Intelligence Layer (On Top):** Qualitative economic synthesis covering neighborhood livability, upcoming infrastructure catalysts, rental yield outlook, and institutional appraiser verdicts.
4. **Statewide District Stamp Duty Calculation:** Exact statutory liability for BMC, TMC, NMMC, PCMC, PMC, NMC, and rural district jurisdictions (6.0% to 7.0%).

---

## 🌟 The 5 Core Differentiating Features

1. **Statewide Maharashtra Coverage (Drop Pin Anywhere):**
   * Covers all 36 Maharashtra districts: Mumbai, Pune, Thane, Navi Mumbai, Nashik, Nagpur, Chhatrapati Sambhajinagar, Kolhapur, Solapur, Amravati, Satara, etc.
   * Click anywhere on the interactive map to pin an exact asset location. Continuous spatial interpolation determines the local Ready Reckoner circle rate floor and market spread.
2. **Gemini AI Locality Intelligence Layer:**
   * Keeps AI as an analytical layer on top while mathematical valuation runs deterministically beneath.
   * Synthesizes neighborhood livability, infrastructure catalysts, demographic demand, and investment appraisal.
3. **Tri-Factor Market Benchmark Bar:**
   * **Government Ready Reckoner (ASR) Floor:** Legal minimum consideration under Section 56(2)(x) of the Income Tax Act.
   * **A.T.L.A.S. Fair Market Estimate:** Evidence-backed clearing value.
   * **Portal Asking Price:** Highlighting the ~12% speculative seller buffer.
4. **Explainable AI (TreeSHAP) Waterfall Ledger:**
   * Itemizes every rupee of premium or discount:
     * `+₹4.20L` (Transit access)
     * `+₹3.50L` (Covered parking allocation)
     * `-₹10.83L` (Building age depreciation)
     * `+₹2.80L` (High floor rise)
5. **Interactive Google Maps / Satellite Inspection:**
   * Switch between **Vector Dark**, **OpenStreetMap Street**, and **Esri High-Resolution Satellite Imagery** to visually inspect tree cover, open space, and building density.
6. **"What-If" Sensitivity Simulator:**
   * Test real-time scenarios: floor elevation (+18 floors), age variation, and Pune Metro commercial operation bonus (+4.5%).
7. **Model Context Protocol (MCP) Server (`backend/mcp_server.py`):**
   * Standard MCP tools (`estimate_property_value`, `analyze_surrounding_locality`, `get_ready_reckoner_rate`, `get_comparable_properties`) for AI agents.

---

## 🚀 Quickstart & Running Locally

### 1-Click Launch (Recommended)
Run the included PowerShell script:
```powershell
.\run_dev.ps1
```
* **Frontend Web Application:** [http://localhost:5173](http://localhost:5173)
* **FastAPI Backend & Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **MCP Agent Server:** `python backend/mcp_server.py`

---

## 🧪 Validated Test Benchmarks Across Maharashtra

| Location | District / Authority | Config | Fair Market Value | Govt ASR Floor | Stamp Duty |
|---|---|---|---|---|---|
| **Moshi (Jal Vayu Vihar)** | Pune (PCMC) | 2 BHK, 600 sqft, 16y | **₹56.04 Lakhs** | ₹38.52 Lakhs | ₹3.92 Lakhs (7%) |
| **Bandra West / Khar** | Mumbai Suburban (BMC) | 3 BHK, 1200 sqft, 3y | **₹5.62 Crore** | ₹3.84 Crore | ₹33.75 Lakhs (6%) |
| **Powai (Hiranandani)** | Mumbai Suburban (BMC) | 2 BHK, 780 sqft, 4y | **₹2.08 Crore** | ₹1.44 Crore | ₹12.48 Lakhs (6%) |
| **Thane (Majiwada)** | Thane (TMC) | 2 BHK, 680 sqft, 5y | **₹98.50 Lakhs** | ₹71.40 Lakhs | ₹6.90 Lakhs (7%) |
| **Nashik (Gangapur Rd)** | Nashik (NMC) | 2 BHK, 750 sqft, 4y | **₹57.57 Lakhs** | ₹39.00 Lakhs | ₹4.03 Lakhs (7%) |
| **Nagpur (Dharampeth)** | Nagpur (NMC) | 3 BHK, 1100 sqft, 5y | **₹1.01 Crore** | ₹63.80 Lakhs | ₹7.04 Lakhs (7%) |
| **Arbitrary Rural Pin** | Lonavala/PMRDA Rural | 2 BHK, 650 sqft, 5y | **₹68.11 Lakhs** | ₹48.83 Lakhs | ₹4.09 Lakhs (6%) |

---

## 🎤 2-Minute Judge Presentation Script

1. **The Hook (15s):**  
   *"Judges, in India, property portals show asking prices inflated by 15%, while government circle rates lag the market by 40%. A.T.L.A.S. is an explainable valuation engine that accurately prices any property across all 36 districts of Maharashtra."*
2. **Statewide Pin-Drop (30s):**  
   *Click anywhere on the map of Maharashtra or switch between presets.*  
   *"Notice how dropping a pin in Bandra gives ₹46,800/sq.ft with 6% BMC stamp duty, while pinning in Moshi, PCMC yields ₹9,340/sq.ft with 7% stamp duty and ₹38.5L circle rate."*
3. **The Gemini AI Layer (30s):**  
   *Switch to the 'Gemini AI Locality Intelligence' tab.*  
   *"We keep AI as an intelligence layer on top while the calculations run deterministically beneath. Gemini analyzes surrounding livability, infrastructure catalysts, gross rental yield (3.8%–4.5%), and tenant demographics."*
4. **Satellite & Comps (20s):**  
   *Switch to 'Statewide Map' and toggle 'Satellite'.*  
   *"Appraisers and judges can visually inspect tree cover and building density using Esri Satellite imagery, while our spatial KD-Tree pulls the nearest verified sales comps with itemized pairwise adjustments."*
5. **The 'What-If' Simulation & Valuation Memo (25s):**  
   *Switch to 'Sensitivity Simulator' and drag the floor slider.*  
   *"Simulate a 15th-floor premium in real time. And with one click on 'Valuation Memo', export a bank-grade appraisal memorandum ready for SBI or HDFC mortgage underwriting."*
