# A.T.L.A.S. — Automated Transaction & Land Appraisal System
### Institutional Automated Valuation Model (AVM) & Mortgage Underwriting Risk Engine
**Developed for the E-Cell IIT Bombay — Housing Finance Challenge 2026**

[![E-Cell IIT Bombay](https://img.shields.io/badge/Competition-E--Cell%20IIT%20Bombay%20Housing%20Finance-orange?style=for-the-badge&logo=iit&logoColor=white)](https://ecell.in)
[![Live Demo](https://img.shields.io/badge/Live%20Deployment-Vercel%20Production-black?style=for-the-badge&logo=vercel&logoColor=white)](https://atlas-atharvchaskar.vercel.app/)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Pro%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![OpenStreetMap](https://img.shields.io/badge/Spatial%20Data-OpenStreetMap%20Overpass-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![Compliance](https://img.shields.io/badge/Benchmark-IGR%20ASR%202024--2026%20Compliant-red?style=for-the-badge)](https://igrmaharashtra.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Production Deployment

* **Web Application:** [https://atlas-atharvchaskar.vercel.app/](https://atlas-atharvchaskar.vercel.app/)
* **Platform:** Vercel Global Edge & Serverless Python Runtime
* **Cold-Start Performance:** Optimized from 20.4s to **0.21s** via pre-compiled spatial tree cache (`engine_cache.pkl`)

---

## 📌 Executive Summary & Problem Statement

In the Indian Housing Finance sector, mortgage lending decisions are severely hindered by structural market imperfections:

1. **Information Asymmetry & Portal Markup Inflation:** Public real estate listing portals (e.g., MagicBricks, 99acres) feature seller asking prices inflated by **10% to 15%** above real transaction values to reserve bargaining margins. Underwriting loans against unverified listing prices introduces systemic collateral overvaluation risk.
2. **Statutory Lag of Ready Reckoner (ASR) Rates:** Government Annual Statement of Rates (ASR / Circle Rates) serve as the legal floor for stamp duty and capital gains taxation under Section 56(2)(x) of the Income Tax Act. However, circle rates lag actual market transactions by **20% to 45%**, making them insufficient as standalone loan-to-value (LTV) indicators.
3. **Turnaround Time (TAT) & Appraiser Discretion:** Conventional manual appraisal takes **3 to 7 business days** and incurs high operational expenditure, relying on subjective valuer impressions rather than econometric hedonic regression.
4. **Unstructured Loan Applications:** Borrowers describe collateral using natural language expressions (e.g., *"1rk flat in the mazgaon hattibaugh area near mtnl building 300 sq ft with parking on 2nd floor"*), requiring automated parsing into bankable property typologies.

### The A.T.L.A.S. Solution
**A.T.L.A.S.** (*Automated Transaction & Land Appraisal System*) is an enterprise-grade Automated Valuation Model (AVM) designed for Indian Housing Finance Companies (HFCs) and retail banks. It fuses **5,845 registered sale deeds**, **continuous inverse-distance weighting (IDW) geospatial interpolation**, **Scikit-learn Hedonic Gradient Boosting Regression**, and **IGR Maharashtra ASR Ready Reckoner safeguards** to calculate:
* True transacted fair market value formatted simultaneously in **Lakhs and Crores**.
* Statutory government floor valuation and jurisdiction-specific stamp duty (6.0%–7.0%).
* Institutional mortgage underwriting classification (e.g., Standard 80% LTV Loan Eligibility).
* Natural-language NLP entity extraction supporting Indian residential typologies (1 RK, 1 BHK, 2 BHK, 3 BHK, 4+ BHK, Penthouses).

---

## 🏛️ System Architecture

### 1. High-Contrast Interactive Dataflow

```mermaid
flowchart TD
    %% Global High-Contrast Styling for Dark & Light GitHub Views
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef api fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#ffffff;
    classDef nlp fill:#312e81,stroke:#a5b4fc,stroke-width:2px,color:#ffffff;
    classDef core fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#ffffff;
    classDef statutory fill:#701a75,stroke:#f472b6,stroke-width:2px,color:#ffffff;
    classDef intelligence fill:#4c1d95,stroke:#c084fc,stroke-width:2px,color:#ffffff;
    classDef output fill:#0f766e,stroke:#2dd4bf,stroke-width:2px,color:#ffffff;

    subgraph S1 ["1. CLIENT PRESENTATION LAYER"]
        C1["<b>Frontend Client</b><br/>React 19 • TypeScript • Tailwind CSS"]:::client
        C2["<b>Natural Language Input</b><br/>Loan applications & deed uploads"]:::client
        C3["<b>3D Dynamic Interface</b><br/>React Bits TiltedCard & CountUp"]:::client
    end

    subgraph S2 ["2. GATEWAY & ENTITY EXTRACTION"]
        G1["<b>Serverless Gateway</b><br/>FastAPI ASGI (api/index.py)"]:::api
        N1["<b>NLP Typology Classifier</b><br/>Gemini 1.5 Flash + Deterministic Fallback"]:::nlp
        N2["<b>Spec Resolver</b><br/>Carpet sq.ft, Floor, Age, 1RK / BHK"]:::nlp
    end

    subgraph S3 ["3. DETERMINISTIC VALUATION ENGINE"]
        D1["<b>Spatial cKDTree Index</b><br/>43 Maharashtra Reference Hubs"]:::core
        D2["<b>Continuous IDW (p=2.0)</b><br/>Inverse-Distance Interpolator"]:::core
        D3["<b>Hedonic ML Regressor</b><br/>Gradient Boosting (5,845 Comps)"]:::core
        D4["<b>Pairwise Comps Matcher</b><br/>85% Confidence Parity Interval"]:::core
    end

    subgraph S4 ["4. STATUTORY & RISK SAFEGUARDS"]
        R1["<b>Ready Reckoner ASR Floor</b><br/>IGR Maharashtra 2024–2026 Registry"]:::statutory
        R2["<b>Sec 56(2)(x) IT Act Guard</b><br/>Hard floor prevents collateral dilution"]:::statutory
        R3["<b>District Stamp Duty</b><br/>Exact 6.0% to 7.0% statutory liability"]:::statutory
    end

    subgraph S5 ["5. QUALITATIVE & UNDERWRITING"]
        Q1["<b>Radial Amenity Radar</b><br/>OpenStreetMap Overpass (3,000m)"]:::intelligence
        Q2["<b>Gemini Appraiser Layer</b><br/>Livability synthesis & rental yield"]:::intelligence
        O1["<b>Institutional Verdict</b><br/>Standard 80% LTV Loan Eligibility"]:::output
        O2["<b>Dual Currency Output</b><br/>Formatted in Lakhs & Crores"]:::output
    end

    C2 --> G1
    G1 --> N1
    N1 --> N2
    N2 --> D1
    D1 --> D2
    D2 --> D3
    D1 --> D4
    D3 --> R2
    R1 --> R2
    R2 --> R3
    D1 --> Q1
    Q1 --> Q2
    R2 --> O1
    Q2 --> O1
    R2 --> O2
    O1 --> C1
    O2 --> C1
    C1 --> C3
```

### 2. Architecture Layer Specifications

| Architecture Tier | Primary Technologies | Core Responsibilities & Logic | Housing Finance Impact |
|---|---|---|---|
| **1. Client Presentation** | React 19, TypeScript, Tailwind CSS, Lucide, React Bits 3D | Captures unstructured property notes; provides instant copy & print appraisal memo; dual currency view. | Enables credit officers and retail borrowers to get instant valuations in plain language without manual form friction. |
| **2. API & NLP Gateway** | FastAPI, Vercel Serverless, Pydantic V2, Google Gemini | Parses natural language strings into structured schemas; preserves granular Indian typologies (e.g. 1RK vs 1BHK). | Eliminates underwriting misclassification of micro-apartments; validates payload types and security headers. |
| **3. Spatial & ML Core** | Scipy `cKDTree`, Scikit-learn Gradient Boosting, NumPy, Pandas | Continuous Inverse-Distance Weighting (IDW); trains on 5,845 registered sale deeds across 43 Maharashtra hubs. | Replaces 3–7 day manual inspection bottlenecks with deterministic, sub-second mathematical valuations. |
| **4. Statutory Safeguards** | IGR Maharashtra ASR 2024–2026 Registry, Stamp Act | Enforces statutory circle rate floor ($V_{\text{ASR}} = \text{Area} \times \text{ASR}$); calculates exact district stamp duty (6%–7%). | Protects banks from collateral liquidation below the legal benchmark and prevents Section 56(2)(x) tax penalties. |
| **5. Locality Intelligence** | OpenStreetMap Overpass API, Google Gemini 1.5 Flash | Radial 3km infrastructure scan (metros, highways, schools, IT parks); qualitative economic appraisal verdict. | Provides Loan-to-Value (LTV) risk scoring, demographic demand profiling, and gross rental yield benchmarking. |

---

---

## 📐 Mathematical Formulation & Econometric Methodology

### 1. Hedonic Pricing Model
The fair market asset value $P_{\text{fair}}$ decomposes residential utility into structural, spatial, and market attributes:

$$P_{\text{fair}} = \max\left( V_{\text{ASR}}, \; f_{\text{hedonic}}(X_{\text{structural}}) \cdot \left(1 + \sum_{k} \delta_k\right) \right)$$

Where:
* $V_{\text{ASR}} = \text{Carpet Area} \times \text{ASR Circle Rate}$: Statutory floor value.
* $f_{\text{hedonic}}(X)$: Non-linear Gradient Boosted decision tree ensemble trained on registered deed variables:
  $$X = \left[ \text{Area}_{\text{sqft}}, \; \text{BHK}, \; \text{Floor}, \; \text{Total Floors}, \; \text{Building Age}, \; \text{Parking Slots} \right]$$
* $\delta_k$: Marginal hedonic adjustments:
  * High floor rise adjustment: $\delta_{\text{floor}} = \min(0.12, \; 0.004 \times (\text{Floor} - 1))$
  * Age depreciation: $\delta_{\text{age}} = -0.008 \times \min(\text{Age}, 40)$
  * Covered parking allocation premium: $\delta_{\text{parking}} = +0.045$ per reserved slot.
  * Rapid transit proximity bonus: $\delta_{\text{transit}} = +0.035$ if metro/rail $\le 800\text{m}$.

### 2. Spatial Inverse-Distance Weighting (IDW)
To determine circle rates and market baseline rates for any coordinate $(\phi_0, \lambda_0)$ across Maharashtra without geographic blindspots:

$$\hat{R}(\phi_0, \lambda_0) = \frac{\sum_{i=1}^{K} w_i R_i}{\sum_{i=1}^{K} w_i}, \quad w_i = \frac{1}{d((\phi_0, \lambda_0), (\phi_i, \lambda_i))^p}$$

Where:
* $K = 5$: Nearest registered institutional reference hubs retrieved via `scipy.spatial.cKDTree`.
* $p = 2.0$: Quadratic distance decay parameter.
* $d(\cdot)$: Haversine geodesic distance metric on the WGS-84 ellipsoid.

### 3. TreeSHAP Attribution & Margin of Safety
For explainable housing finance underwriting, the model outputs an empirical 85% registered comps confidence interval:

$$\text{Range}_{\text{fair}} = \left[ P_{\text{fair}} \times (1 - z \cdot \sigma_{\text{local}}), \quad P_{\text{fair}} \times (1 + z \cdot \sigma_{\text{local}}) \right]$$

---

## 🏦 Housing Finance Underwriting Decision Matrix

| Metric | A.T.L.A.S. Output | Underwriting Implication |
|---|---|---|
| **Fair Market Value** | Dual display (Lakhs & Crores) | Eliminates 10%–15% portal asking markup; sets benchmark for maximum loan sizing. |
| **ASR Government Floor** | ₹/sq.ft + Total Statutory Base | Verifies compliance under Section 56(2)(x); ensures collateral cannot be liquidated below legal floor. |
| **Market-to-ASR Spread** | Typical: +15% to +45% premium | Ratios $> +80\%$ trigger speculative volatility flags; ratios $< +5\%$ trigger high-safety accumulation ratings. |
| **Standard LTV Rating** | 80% Loan Eligibility Guidance | Provides automated pre-qualification for Tier-1 mortgage lenders (HDFC, SBI, ICICI). |
| **Stamp Duty Liability** | Exact district calculation (6%–7%) | Pre-computes borrower closing cash requirements (e.g., 6% in BMC Mumbai, 7% in PCMC Pune). |
| **Typology Integrity** | 1 RK, 1 BHK, 2 BHK, 3 BHK, 4+ BHK | Prevents underwriting mismatches (e.g., categorizing a 300 sq.ft 1RK studio as a standard 1BHK). |

---

## 📂 Project Structure

```
ATLAS/
├── api/
│   └── index.py                     # Vercel Serverless ASGI entrypoint
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application & REST endpoints
│   │   ├── valuation_engine.py      # Hedonic ML regressor & cKDTree spatial engine
│   │   ├── gemini_appraisal.py      # Google Gemini 1.5 Flash NLP & livability engine
│   │   ├── database.py              # IGR Ready Reckoner ASR benchmarks & deed registry
│   │   └── models/
│   │       └── valuation.py         # Pydantic V2 data contracts & schemas
│   ├── models/
│   │   └── engine_cache.pkl         # Pre-compiled Scikit-learn model & spatial tree cache
│   └── requirements.txt             # Backend dependencies (FastAPI, Scikit-learn, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx        # High-contrast 2-box valuation workspace
│   │   │   ├── LandingPage.tsx      # Overview landing with CountUp metrics & showcase
│   │   │   ├── ScrollStack.tsx      # Stacking feature cards with crisp white borders
│   │   │   ├── AsciiArchitecture.tsx # Real-time ASCII architectural blueprint terminal
│   │   │   ├── Navbar.tsx           # Navigation header & view mode toggles
│   │   │   └── reactbits/           # Dynamic UI components (TiltedCard, SpotlightCard, etc.)
│   │   ├── types.ts                 # TypeScript interfaces for API schemas
│   │   └── App.tsx                  # Root application controller
│   ├── package.json                 # Frontend dependencies (React 19, Lucide, Tailwind)
│   └── vite.config.ts               # Vite bundler configuration & proxy routes
├── vercel.json                      # Vercel deployment routing & serverless build config
├── requirements.txt                 # Root Python requirements for Vercel builds
├── package.json                     # Root npm script wrapper
└── README.md                        # Technical documentation & competition dossier
```

---

## ⚡ API Reference

### 1. Natural Language Parse & Valuation
* **Endpoint:** `POST /api/valuation/chat-parse`
* **Description:** Ingests an unstructured property description or loan application note and returns the parsed typology, fair market value, statutory floor, and bank verdict.
* **Request Payload:**
```json
{
  "text": "1rk flat in the mazgaon hattibaugh area near mtnl building the square foot area is 300 sq ft also the society is having parking and the floor is 2nd with lift also the flat is semi furnished with ac provided i want to know the value of flat for bank"
}
```
* **Sample Response:**
```json
{
  "property_summary": {
    "locality": "Mazgaon / Byculla (Hattibaugh)",
    "typology": "1 RK",
    "bhk": 1,
    "carpet_sqft": 300,
    "floor": 2,
    "total_floors": 4,
    "age_years": 18,
    "parking": "Covered"
  },
  "estimated_value_lakhs": 97.94,
  "rate_per_sqft_carpet": 32646,
  "value_range_lakhs": {
    "min": 93.53,
    "max": 102.35
  },
  "government_benchmark": {
    "ready_reckoner_rate_carpet": 26000,
    "government_floor_value_lakhs": 78.00,
    "stamp_duty_estimate_lakhs": 4.68,
    "stamp_duty_pct": 6.0
  },
  "gemini_ai_layer": {
    "appraisal_verdict": "STABLE / ACCUMULATE (80% Standard Loan Eligible)",
    "livability_summary": "High connectivity corridor in South Mumbai with proximity to Eastern Freeway and Harbour Line transit hubs."
  }
}
```

### 2. Structured Valuation Query
* **Endpoint:** `POST /api/valuation/estimate`
* **Description:** Directly queries the hedonic regression engine using structured specifications.

### 3. Health Check
* **Endpoint:** `GET /api/health`
* **Response:** `{"status": "healthy", "service": "ATLAS AVM Engine", "version": "2.4.0"}`

---

## 🛠️ Local Development Setup

### Prerequisites
* **Python:** 3.11+
* **Node.js:** 18.0+
* **Package Manager:** `npm` or `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/Atharvchaskar008/ATLAS.git
cd ATLAS
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
* Access the local frontend at: `http://localhost:5173`
* Access interactive Swagger docs at: `http://localhost:8000/docs`

---

## 🏆 E-Cell IIT Bombay Evaluation Criteria Alignment

| Judging Dimension | A.T.L.A.S. Implementation |
|---|---|
| **Financial Innovation** | Bridges the critical gap between inflated portal asking prices and lagging government circle rates using non-linear hedonic regression. |
| **Technical Rigor** | Sub-second spatial cKDTree index across 43 reference hubs, 5,845 real comps, and dual-layer architecture (deterministic math beneath, LLM qualitative analysis on top). |
| **User Experience (Fintech UI/UX)** | Ultra-clean high-contrast dark aesthetic, 3D tilted interaction cards with crisp white borders, dynamic count-up metrics, and ASCII architectural blueprint telemetry. |
| **Production Readiness** | Fully deployed and operating live on Vercel with zero-latency cold-start optimization. |
| **Regulatory Grounding** | Full alignment with Maharashtra Stamp Act, UDCPR guidelines, and Income Tax Act Section 56(2)(x) Ready Reckoner benchmark requirements. |

---

## 👥 Contributors & Acknowledgements

* **Author:** Atharv Chaskar
* **Challenge:** E-Cell IIT Bombay — Housing Finance Challenge 2026
* **Data Sources:** Maharashtra Department of Registration and Stamps (IGR Maharashtra), OpenStreetMap Overpass API, and public registered property deed records.

*Copyright © 2026 A.T.L.A.S. Released under the [MIT License](LICENSE).*
