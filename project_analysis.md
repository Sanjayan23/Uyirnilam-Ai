# 🌾 Uyirnilam AI — Problem Statement Submission
**Problem Statement Title:** Early Detection and Management of Crop Diseases & Pest Infestations
**Theme:** Agriculture & Rural Development

---

## 1. 💡 IDEA TITLE

**Uyirnilam AI — AI-Powered Smart Farming Platform for Early Crop Disease & Pest Detection**

An end-to-end intelligent agricultural platform that empowers farmers with AI Vision-based early detection of crop diseases and pest infestations, combined with smart irrigation management, real-time market pricing, harvest planning, and ML-based crop recommendations — all in one mobile-friendly web application.

---

## 2. 🔧 TECHNICAL APPROACH

### Core Problem — Pest & Disease Detection
- Farmer uploads a photo of the affected crop via the web interface
- **Claude 4.6 Sonnet Vision AI** analyzes the image and identifies the disease or pest
- System returns: disease/pest name, severity level, organic & chemical treatment options, dosage, frequency, and estimated cost
- **Real-time AI Expert Chat** (Claude) allows farmers to ask follow-up questions

### Key Supporting Features
| Feature | How It Works |
|---|---|
| 📊 ML Crop Prediction | RandomForest model suggests best crops based on soil NPK, pH, rainfall & temperature |
| 💧 Smart Irrigation | AI calculates water schedules from real-time soil moisture & weather data |
| 📈 Market Pulse | Gemini 2.5 Flash fetches live APMC Mandi prices + 30–60 day demand forecasts |
| 🌾 Harvest Strategy | AI recommends optimal harvest timing for peak quality and maximum yield |
| 🌦️ Weather Integration | GPS-based auto location using OpenWeatherMap API |
| 📄 Report Export | High-fidelity PDF reports using jsPDF + html2canvas |

### Technology Stack
| Layer | Technologies |
|---|---|
| **Backend** | Python 3.11, Flask, Flask-SQLAlchemy, Flask-CORS |
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JS, Chart.js |
| **AI / Vision** | Anthropic Claude 4.6 Sonnet (image diagnosis + chat) |
| **AI / NLP** | Google Gemini 2.5 Flash (market data, advisory) |
| **ML Model** | Scikit-learn — RandomForest Classifier |
| **Database** | SQLite (development) / PostgreSQL (production) |
| **Deployment** | Gunicorn, Render / Netlify / Vercel |

---

## 3. ✅ FEASIBILITY AND VIABILITY

- **Already Built & Running:** The platform is fully functional and deployable
- **No App Install Required:** Runs as a web app — accessible from any smartphone browser
- **Low Cost:** Uses free-tier AI APIs and cloud hosting (Render, Netlify)
- **Scalable Architecture:** Modular Flask backend — new crops, languages, or regions can be added easily
- **Minimal Farmer Requirement:** Only needs a smartphone with camera and basic internet connection
- **Real Data Sources:** Live weather API + actual APMC Mandi government pricing data
- **Secure:** JWT authentication, Flask-Limiter (rate limiting), Flask-Talisman (HTTPS enforcement)

---

## 4. 🌍 IMPACT AND BENEFITS

| Stakeholder | Benefit |
|---|---|
| **Farmers** | Instant 24/7 diagnosis — no waiting for agricultural officers |
| **Crop Yield** | Early detection prevents large-scale crop loss before it spreads |
| **Rural Economy** | Smarter market timing → higher income for farmers |
| **Environment** | Targeted, precise treatment → reduced chemical overuse and runoff |
| **Government** | Scalable digital tool aligned with Digital India, PM-KISAN, and AgriStack missions |

**Broader Impact:**
- Potential to reduce crop loss by up to **40%** through early intervention
- Supports **multiple crop types** on a single unified platform
- Bridges the gap between **technology and rural farming communities**
- Reduces dependency on expensive agronomists and field visits

---

## 5. 📚 RESEARCH AND REFERENCES

1. **Anthropic Claude Vision API** — AI image analysis for crop disease & pest diagnosis
   → https://www.anthropic.com/claude

2. **Google Gemini API** — NLP-based agricultural market advisory and forecasting
   → https://ai.google.dev/

3. **Scikit-learn RandomForest** — ML-based crop recommendation model
   → https://scikit-learn.org/

4. **OpenWeatherMap API** — Real-time GPS-based weather data for irrigation & pest spread prediction
   → https://openweathermap.org/api

5. **APMC Agmarknet** — Indian government agricultural market pricing data
   → https://agmarknet.gov.in/

6. **Flask Framework** — Lightweight Python web backend for rapid deployment
   → https://flask.palletsprojects.com/

7. **Chart.js** — Interactive data visualization for crop analytics and reports
   → https://www.chartjs.org/

8. **jsPDF + html2canvas** — Client-side PDF report generation
   → https://github.com/parallax/jsPDF
