# 🌱 Uyirnilam AI | Comprehensive Smart Farming Ecosystem

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/framework-Flask-green.svg)](https://flask.palletsprojects.com/)
[![AI Powered](https://img.shields.io/badge/AI-Claude%20%7C%20Gemini-orange.svg)](https://anthropic.com)
[![Maintenance Status](https://img.shields.io/badge/Status-Stable%20%2F%20Optimized-success.svg)](#)

**Uyirnilam AI** is a state-of-the-art agricultural platform designed to empower farmers with data-driven insights. From ML-powered crop recommendations to AI Vision-based pest diagnostics, it combines cutting-edge technology with a premium, user-centric glassmorphism interface.

---

## ✨ Core Modules

### 📊 Intelligence Dashboard
- **Universal High-Fidelity Reports**: Optimized PDF generation engine that captures full desktop-grade reports regardless of the export device.
- **Auto-Location Detection**: Real-time GPS-based weather integration using OpenWeatherMap.
- **ML Crop Prediction**: High-accuracy `RandomForest` model suggesting the best crops based on soil, weather, and land size.
- **Data Visualization**: Interactive growth and profit charts powered by `Chart.js`.

### 🛡️ AI Vision Pest Control
- **Deep Learning Diagnostics**: Powered by **Claude 4.6 Sonnet Vision**, providing instant analysis of crop health from uploaded images.
- **Treatment Engine**: Detailed organic and chemical solutions with dosage, frequency, and cost estimates.
- **Expert Chat**: Real-time AI consultation for specific agricultural queries.

### 📈 Market Pulse
- **Global Market Status**: Real-time price tracking for countries like Brazil, USA, China, Vietnam, and Australia.
- **Dynamic Pricing**: Powered by **Gemini 2.5 Flash**, providing real-time APMC Mandi prices across India.
- **Demand Forecasting**: 30-60 day market outlooks to help farmers time their harvest for maximum profit.

### 💧 Smart Irrigation & Harvest
- **Cross-Device Parity**: Smooth, responsive UI alignment across Mobile, Tablet, and Desktop.
- **Water Management**: AI-calculated irrigation schedules based on real-time soil and weather data.
- **Harvest Strategy**: Optimized timing recommendations to ensure peak crop quality and yield.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python (Flask), Flask-SQLAlchemy, Flask-CORS |
| **Frontend** | HTML5, Vanilla JS, CSS3 (Glassmorphism), Chart.js |
| **PDF Engine** | jsPDF + html2canvas (Enhanced with High-Fidelity Pre-processing) |
| **AI / ML** | Anthropic Claude (Vision), Google Gemini, Scikit-learn (RandomForest) |
| **Database** | SQLite (Development) / PostgreSQL (Production) |

---

## 🚀 Quick Start

### 1. Prerequisite
Ensure you have **Python 3.11+** installed.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Sanjayan23/uyirnilam_ai_project.git

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
FLASK_SECRET_KEY=your_secret_key
ANTHROPIC_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY=your_openweathermap_key
```

### 4. Run Locally
```bash
python app.py
```

---

## 📁 Optimized Project Architecture

```text
uyirnilam_ai_project/
├── app.py              # Main Application Entry Point
├── models/             # Database Schemas (User, Prediction, Notification)
├── static/
│   ├── css/            # Premium Styled Themes (Header, Utilities)
│   ├── js/             # Core Logic (PDF Generator, AI Integration)
│   └── images/         # High-resolution Assets
├── templates/          # Modernized HTML Modules (9+ High-Fidelity Pages)
├── venv_stable/        # Primary Consolidated Virtual Environment
├── uyirnilam.db        # Production-Ready SQLite Database
└── requirements.txt    # Project Dependencies
```

---

## 🎨 Visual Aesthetics & Maintenance
- **Responsive Alignment**: Meticulously tuned CSS to ensure NO overlapping or alignment issues on small screens.
- **High-Fidelity PDF**: Custom rendering logic that forces desktop layouts and fixes gradient-text artifacts in exports.
- **Environment Maintenance**: Cleaned directory structure with redundant virtual environments and cache files removed for maximum performance.

---

## 📄 License
This project is licensed under the **MIT License**.

---
*Made with ❤️ for the future of sustainable farming.*
