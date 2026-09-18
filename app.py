from flask import Flask, request, jsonify, render_template, send_file, redirect, url_for, session, flash
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import requests
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import tempfile
import json
import base64
import re
import random
from dotenv import load_dotenv

# Load environment variables at the very top
load_dotenv()

import anthropic
from chat_api import chat_bp

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'change-me-in-production')
app.config['DEBUG'] = os.getenv('DEBUG', 'False') == 'True'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///uyirnilam.db').replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = app.config['SECRET_KEY']

db = SQLAlchemy(app)
CORS(app)

# Register Blueprints
app.register_blueprint(chat_bp)

# ─── Anthropic Claude Setup (Primary AI Engine) ───────────────────
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '').strip()
claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

# ─── Google Gemini Setup ──────────────────────────────────────────
try:
    from google import genai
    from google.genai import types
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '').strip()
    if GEMINI_API_KEY:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    else:
        gemini_client = None
except ImportError:
    genai = None
    types = None
    gemini_client = None

# CORS already initialized above (line 34)

# Use relative path for portability
data_path = os.path.join(os.path.dirname(__file__), 'data', 'crop_data.csv')
data = pd.read_csv(data_path)

# ═══════════════════════════════════════════════════════════════════
# DATABASE MODELS
# ═══════════════════════════════════════════════════════════════════
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    occupation = db.Column(db.String(100))
    profile_photo = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    crop_name = db.Column(db.String(50))
    score = db.Column(db.Float)
    location = db.Column(db.String(100))
    soil_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(100))
    message = db.Column(db.Text)
    type = db.Column(db.String(50))
    is_read = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def init_db():
    with app.app_context():
        db.create_all()

init_db()

# ═══════════════════════════════════════════════════════════════════
# ML MODEL (unchanged)
# ═══════════════════════════════════════════════════════════════════
X = data.drop('crop', axis=1)
y = data['crop']
model = RandomForestClassifier(random_state=42)
model.fit(X, y)

# ═══════════════════════════════════════════════════════════════════
# CROP INFO & ROTATION (unchanged)
# ═══════════════════════════════════════════════════════════════════
crop_info = {
    'rice': {'water_level': 'High', 'profit_level': 'High', 'water': 1200, 'profit': 50000, 'time': 4},
    'wheat': {'water_level': 'Medium', 'profit_level': 'Medium', 'water': 800, 'profit': 40000, 'time': 4},
    'maize': {'water_level': 'Low', 'profit_level': 'Medium', 'water': 600, 'profit': 35000, 'time': 3},
    'banana': {'water_level': 'High', 'profit_level': 'High', 'water': 1500, 'profit': 80000, 'time': 10},
    'mango': {'water_level': 'Medium', 'profit_level': 'High', 'water': 1000, 'profit': 100000, 'time': 12},
    'sugarcane': {'water_level': 'High', 'profit_level': 'High', 'water': 2000, 'profit': 90000, 'time': 12},
    'cotton': {'water_level': 'Medium', 'profit_level': 'Medium', 'water': 900, 'profit': 45000, 'time': 6},
    'soybean': {'water_level': 'Low', 'profit_level': 'Medium', 'water': 500, 'profit': 30000, 'time': 3},
    'groundnut': {'water_level': 'Low', 'profit_level': 'Medium', 'water': 550, 'profit': 32000, 'time': 3},
    'millet': {'water_level': 'Low', 'profit_level': 'Low', 'water': 400, 'profit': 25000, 'time': 2},
    'pulses': {'water_level': 'Low', 'profit_level': 'Medium', 'water': 450, 'profit': 28000, 'time': 3},
    'barley': {'water_level': 'Low', 'profit_level': 'Low', 'water': 500, 'profit': 26000, 'time': 3},
    'oats': {'water_level': 'Low', 'profit_level': 'Low', 'water': 500, 'profit': 26000, 'time': 3},
    'grapes': {'water_level': 'Medium', 'profit_level': 'High', 'water': 700, 'profit': 120000, 'time': 10}
}

rotation_rules = {
    'rice': ['pulses', 'wheat'],
    'wheat': ['maize', 'soybean'],
    'maize': ['pulses', 'groundnut'],
    'cotton': ['wheat', 'millet'],
    'sugarcane': ['pulses', 'soybean'],
    'grapes': ['pulses', 'groundnut']
}

API_KEY = os.getenv('WEATHER_API_KEY', '')

def get_weather(lat, lon):
    try:
        url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'
        response = requests.get(url).json()
        temp = response.get('main', {}).get('temp', 25)
        humidity = response.get('main', {}).get('humidity', 60)
        rainfall = (response.get('rain', {}) or {}).get('1h') or (response.get('rain', {}) or {}).get('3h') or 20
        return temp, humidity, rainfall
    except Exception:
        return 25, 60, 0

def estimate_soil(soil_type):
    if soil_type == 'clay':
        return 70, 50, 40, 6.5
    elif soil_type == 'sandy':
        return 40, 40, 40, 5.5
    else:
        return 60, 50, 50, 6.8

def check_api_keys(key_names):
    missing = [k for k in key_names if not os.getenv(k)]
    if missing:
        return False, f"Missing API configuration: {', '.join(missing)}. Please set these in the environment variables."
    return True, None

def is_logged_in():
    return 'user_id' in session

def get_notification_count():
    if not is_logged_in():
        return 0
    try:
        count = Notification.query.filter_by(user_id=session['user_id'], is_read=0).count()
        return count
    except:
        return 0

# ═══════════════════════════════════════════════════════════════════
# ─── NEW: CLAUDE PEST DISEASE DATABASE ─────────────────────────────
# ═══════════════════════════════════════════════════════════════════
PEST_DISEASE_DB = {
    "rice": {
        "Leaf Blast": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Diamond-shaped lesions with gray center and brown border. Most devastating at boot to heading stage. Can cause 30-70% yield loss if untreated.",
            "cause": "Magnaporthe oryzae fungus", "spread": "Wind-borne spores; high humidity with warm days and cool nights",
            "symptoms": ["Diamond-shaped lesions with gray centers on leaves", "Brown margins around infected spots", "Leaf tips dying back progressively", "Severe defoliation in susceptible varieties"],
            "causes": ["Magnaporthe oryzae fungus infection", "High humidity (80-90%) with warm temperatures", "Excess nitrogen fertilization weakening plants"],
            "affected_parts": ["leaf", "stem", "panicle"],
            "organic_solutions": ["Trichoderma viride spray (5 ml/L water) every 10-12 days", "Neem oil application (5 ml/L) combined with Trichoderma", "Pseudomonas fluorescens (10 g/L) as bio-fungicide"],
            "chemical_solutions": ["Tricyclazole 75% WP (1 g/L water) every 15 days", "Propiconazole 25% EC (1 ml/L) every 15-20 days", "Azoxystrobin 23% SC (1 ml/L) for severe infections"],
            "prevention_methods": ["Use blast-resistant varieties like CO-51, Swarna Sub-1", "Seed treatment with Tricyclazole before nursery", "Apply nitrogen in splits (3-4 doses)", "Maintain shallow water (5 cm) at tillering stage"]
        },
        "Bacterial Leaf Blight": {
            "type": "Bacterial Disease", "severity": "HIGH",
            "description": "Water-soaked yellow streaks turning white/gray. Kresek phase kills young plants rapidly. Can cause 20-30% yield loss.",
            "cause": "Xanthomonas oryzae pv. oryzae", "spread": "Infected seed, flood water, storm damage, insect wounds",
            "symptoms": ["Water-soaked yellow streaks from leaf edges", "Streaks turn white or gray as disease progresses", "Kresek phase can kill young plants", "Bacterial ooze on freshly cut leaves"],
            "causes": ["Xanthomonas oryzae bacteria", "Transmission through infected seeds", "Storm damage providing entry points"],
            "affected_parts": ["leaf", "stem"],
            "organic_solutions": ["Copper Oxychloride 50% WP (3 g/L) as bactericide", "Seaweed extract with zinc for plant immunity", "Garlic-chili extract spray (50 ml/L)"],
            "chemical_solutions": ["Streptomycin + Tetracycline (1 g/L) for severe cases", "Bismerthiazol 20% WP (1.5 g/L)", "Copper Hydroxide 77% WP (2 g/L)"],
            "prevention_methods": ["Plant BLB-resistant varieties (IR-64, Swarna)", "Seed treatment with Streptomycin", "Improve field drainage", "Remove infected plant stubble after harvest"]
        },
        "Brown Spot": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "Brown oval spots with yellow halos. Linked to nutrient (K, Si) deficiency. Reduces grain quality.",
            "cause": "Cochliobolus miyabeanus", "spread": "Infected seed, soil debris, nutrient-stressed plants",
            "symptoms": ["Brown oval spots with yellow halos", "Spots on both leaves and grain glumes", "Seedling blight in nursery", "Reduction in grain quality"],
            "causes": ["Cochliobolus miyabeanus fungus", "Potassium and silicon deficiency", "Use of infected seeds"],
            "affected_parts": ["leaf", "grain", "seedling"],
            "organic_solutions": ["Wettable Sulphur 80% WP (2 g/L) with potassium", "Potassium Chloride soil application (25 kg/acre)", "Vermicompost tea (10% solution)"],
            "chemical_solutions": ["Mancozeb 75% WP (2.5 g/L) every 15 days", "Propiconazole 25% EC (1 ml/L) for rapid cases", "Carbendazim 50% WP (1 g/L)"],
            "prevention_methods": ["Use certified disease-free seeds", "Maintain balanced NPK fertilization", "Apply silica-based fertilizer", "Ensure proper drainage"]
        }
    },
    "wheat": {
        "Leaf Rust": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "Reddish-brown pustules with yellow halo on leaves. Can cause 20-50% yield loss.",
            "cause": "Puccinia triticina", "spread": "Wind-borne spores; favors 15-22°C with high humidity",
            "symptoms": ["Orange-brown pustules on upper leaf surface", "Yellow halos surrounding pustules", "Severe leaf drying in late infections", "Reduced grain size and weight"],
            "causes": ["Puccinia triticina fungus", "Optimal temperature 15-22°C", "High humidity and morning dew"],
            "affected_parts": ["leaf"],
            "organic_solutions": ["Wettable Sulphur 80% WP (2.5 g/L)", "Neem oil + liquid soap (5 ml/L + 1 ml/L)", "Fermented cow urine (10% solution)"],
            "chemical_solutions": ["Propiconazole 25% EC (1 ml/L)", "Tebuconazole 25.9% EC (0.5 ml/L)", "Mancozeb 75% WP (2.5 g/L)"],
            "prevention_methods": ["Plant rust-resistant varieties", "Maintain 2:1 nitrogen to potassium ratio", "Scout fields weekly from February", "Remove volunteer wheat plants"]
        },
        "Yellow Rust": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Yellow-orange pustule stripes along veins. Rapid spread in cool, wet conditions. Can destroy 40-80% of yield.",
            "cause": "Puccinia striiformis", "spread": "Wind-borne urediniospores; spreads hundreds of kilometers",
            "symptoms": ["Yellow-orange pustule stripes along leaf veins", "Extremely rapid spread in cool wet weather", "Stunted plant growth", "Premature leaf drying"],
            "causes": ["Puccinia striiformis fungus", "Cool temperatures 8-15°C", "Wind-borne spore migration"],
            "affected_parts": ["leaf", "stem"],
            "organic_solutions": ["Wettable Sulphur (3 g/L) as stopgap treatment", "Potassium Phosphite (2 ml/L) immunity activator", "Trichoderma harzianum (5 g/L) preventive"],
            "chemical_solutions": ["Propiconazole 25% EC (1 ml/L) - PRIORITY treatment", "Tebuconazole + Propiconazole (0.6 ml/L) combination", "Azoxystrobin 25% SC (1 ml/L)"],
            "prevention_methods": ["Use resistant varieties from annual advisory", "Early sowing before mid-November", "Weekly field scouting from December", "Maintain proper field drainage"]
        },
        "Powdery Mildew": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "White powdery coating on foliage. Spreads without leaf wetness. Reduces grain weight 15-30%.",
            "cause": "Blumeria graminis f.sp. tritici", "spread": "Wind-borne conidia; favors 15-20°C moderate humidity",
            "symptoms": ["White powdery fungal coating on leaves and stems", "Progressive stunting of plant growth", "Reduction in grain weight", "Premature leaf senescence"],
            "causes": ["Blumeria graminis fungus", "Temperature 15-20°C with moderate humidity", "Dense planting reducing air circulation"],
            "affected_parts": ["leaf", "stem"],
            "organic_solutions": ["Potassium Bicarbonate solution (10 g/L)", "Wettable Sulphur 80% WP (2 g/L)", "Diluted milk spray (10% solution)"],
            "chemical_solutions": ["Tebuconazole 25.9% EC (0.5 ml/L)", "Carbendazim 50% WP (1 g/L)", "Hexaconazole 5% EC (2 ml/L)"],
            "prevention_methods": ["Select powdery mildew-resistant varieties", "Maintain 20 cm row spacing", "Avoid excessive nitrogen", "Use furrow or drip irrigation"]
        }
    },
    "maize": {
        "Northern Corn Leaf Blight": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "Long cigar-shaped tan lesions on foliage. Can cause 20-50% yield loss under warm, humid conditions.",
            "cause": "Exserohilum turcicum", "spread": "Wind-borne fungal spores; infected crop residue",
            "symptoms": ["Long cigar-shaped tan lesions 5-15 cm on leaves", "Lesions progress upward from lower leaves", "Severe defoliation in wet weather", "Reduced ear size and poor grain fill"],
            "causes": ["Exserohilum turcicum fungus", "Warm and humid weather", "Infected crop residue"],
            "affected_parts": ["leaf"],
            "organic_solutions": ["Trichoderma viride (5 ml/L) starting at V6 stage", "Copper Oxychloride 50% WP (3 g/L)", "Neem + Garlic extract (50 ml/L each)"],
            "chemical_solutions": ["Propiconazole 25% EC (1 ml/L) at VT/R1 stage", "Mancozeb 75% WP (2.5 g/L) contact fungicide", "Azoxystrobin 23% SC (1 ml/L) for severe cases"],
            "prevention_methods": ["Use disease-resistant hybrid varieties", "2-year crop rotation with non-host crops", "Deep ploughing to bury residue", "Maintain 60x20 cm plant spacing"]
        },
        "Fall Armyworm": {
            "type": "Insect Pest", "severity": "HIGH",
            "description": "Invasive pest larvae feeding inside whorl. Can cause 20-72% yield loss depending on timing.",
            "cause": "Spodoptera frugiperda (Lepidoptera)", "spread": "Migratory moths; eggs hatch fast; larvae enter whorl",
            "symptoms": ["Window-pane feeding damage on leaves", "Sawdust-like frass in whorl", "Young larvae feeding inside plant whorl", "Severe defoliation in heavy infestations"],
            "causes": ["Spodoptera frugiperda larvae", "Migratory moth populations", "Rapid egg hatching in warm weather"],
            "affected_parts": ["leaf", "whorl", "ear"],
            "organic_solutions": ["Bacillus thuringiensis (Bt) spray (2 g/L) into whorl every 5-7 days", "Neem Seed Kernel Extract 5% into whorl", "Beauveria bassiana (5 ml/L)"],
            "chemical_solutions": ["Emamectin Benzoate 5% SG (0.4 g/L) into whorl", "Spinetoram 11.7% SC (0.5 ml/L)", "Chlorantraniliprole 18.5% SC (0.3 ml/L)"],
            "prevention_methods": ["Install pheromone traps (5 per acre) from 10 days after sowing", "Scout whorls every 3-4 days", "Install bird perches (10-15 per acre)", "Deep plough after harvest"]
        }
    },
    "cotton": {
        "Cotton Leaf Curl Virus": {
            "type": "Viral Disease", "severity": "HIGH",
            "description": "Severe upward leaf curling with vein thickening. Transmitted exclusively by whitefly. Can cause 40-80% yield loss.",
            "cause": "Cotton Leaf Curl Virus via whitefly vector", "spread": "Whitefly (Bemisia tabaci) transmission",
            "symptoms": ["Severe upward and inward curling of leaves", "Leaf vein thickening and dark green coloration", "Extreme stunting of plant growth", "Drastically reduced boll formation"],
            "causes": ["Cotton Leaf Curl Virus (CLCuV)", "Bemisia tabaci whitefly as vector", "Warm weather favoring whitefly"],
            "affected_parts": ["leaf", "boll", "entire plant"],
            "organic_solutions": ["Neem oil + liquid soap (5 ml/L + 1 ml/L) on leaf undersides", "Yellow sticky traps (20-25 per acre)", "Garlic-Chili-Neem combination spray"],
            "chemical_solutions": ["Imidacloprid 17.8% SL (0.3 ml/L)", "Thiamethoxam 25% WG (0.25 g/L)", "Acetamiprid 20% SP (0.25 g/L)"],
            "prevention_methods": ["Plant CLCuV-resistant Bt cotton hybrids", "Use 40-mesh insect-proof nets in nursery", "Rogue out infected plants immediately", "Maintain strict weed control"]
        },
        "Bollworm Complex": {
            "type": "Insect Pest", "severity": "HIGH",
            "description": "Complex of multiple bollworm species. Major cotton pest causing 30-60% yield loss.",
            "cause": "Helicoverpa armigera + Pink bollworm complex", "spread": "Moths lay eggs on flowers/bolls; larvae bore inside",
            "symptoms": ["Boll shedding and premature dropping", "Larvae boring inside developing bolls", "Extensive flower and square damage", "Reduced lint quality and quantity"],
            "causes": ["Helicoverpa armigera larvae", "Pink bollworm infestation", "Warm weather promoting multiplication"],
            "affected_parts": ["boll", "flower", "square"],
            "organic_solutions": ["Bacillus thuringiensis (Bt) spray (2 g/L) at flower initiation", "NPV (Nuclear Polyhedrosis Virus) 250 LE/ha", "Neem Seed Kernel Extract 5%"],
            "chemical_solutions": ["Emamectin Benzoate 5% SG (0.4 g/L)", "Profenofos 50% EC (2 ml/L)", "Thiodicarb 75% WP (1 g/L)"],
            "prevention_methods": ["Install pheromone traps (8-10 per acre)", "Plant Bt cotton hybrids", "Destroy all crop residue after harvest", "Intercrop with marigold or pigeon pea"]
        }
    },
    "tomato": {
        "Early Blight": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "Concentric ring target-like lesions on older leaves. Common in warm humid weather. Can cause 20-40% yield loss.",
            "cause": "Alternaria solani", "spread": "Rain splash, wind, infected debris",
            "symptoms": ["Dark brown target-like concentric ring lesions", "Yellow halos surrounding lesions", "Lower leaves affected first progressing upward", "Stem lesions causing plant dieback"],
            "causes": ["Alternaria solani fungus", "Warm temperatures 24-29°C with high humidity", "Poor plant nutrition especially nitrogen"],
            "affected_parts": ["leaf", "stem", "fruit"],
            "organic_solutions": ["Copper Oxychloride 50% WP (3 g/L) preventive spray", "Neem oil + Baking soda (5 ml + 5 g/L)", "Trichoderma viride (5 ml/L) bio-fungicide"],
            "chemical_solutions": ["Chlorothalonil 75% WP (2 g/L) contact fungicide", "Azoxystrobin + Difenoconazole (1 ml/L) systemic", "Mancozeb 75% WP (2.5 g/L)"],
            "prevention_methods": ["Use disease-resistant tomato varieties", "Avoid overhead irrigation; use drip", "Stake plants for air circulation", "Remove and destroy infected leaves"]
        },
        "Late Blight": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Water-soaked lesions rapidly turning brown-black. Destroys entire crop within days in cool wet conditions.",
            "cause": "Phytophthora infestans", "spread": "Wind-borne spores; water splash; spreads explosively in cool wet weather",
            "symptoms": ["Water-soaked dark lesions expanding rapidly", "White sporulation on underside of leaves in humid conditions", "Stem and fruit lesions leading to complete collapse", "Entire plant death within 7-10 days"],
            "causes": ["Phytophthora infestans oomycete", "Cool temperatures 10-20°C with high humidity", "Rain and irrigation splash"],
            "affected_parts": ["leaf", "stem", "fruit"],
            "organic_solutions": ["Copper Hydroxide 77% WP (3 g/L) - most effective organic option", "Bordeaux Mixture 1% preventive spray", "Systemic acquired resistance inducers"],
            "chemical_solutions": ["Metalaxyl + Mancozeb (2.5 g/L) PRIORITY treatment", "Cymoxanil 8% + Mancozeb 64% (2.5 g/L)", "Dimethomorph 50% WP (1 g/L)"],
            "prevention_methods": ["Plant resistant varieties (Mountain Merit, Defiant)", "Avoid overhead irrigation especially in evening", "Improve field drainage for air circulation", "Remove and burn infected plant material immediately"]
        }
    },
    "banana": {
        "Panama Wilt": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Most destructive banana disease. Vascular wilt causing complete plant death. Fungus persists decades in soil.",
            "cause": "Fusarium oxysporum f.sp. cubense", "spread": "Soil contamination, infected tools, contaminated suckers",
            "symptoms": ["Progressive yellowing of lower leaves upward", "Longitudinal splitting of pseudostem at base", "Complete wilting and collapse", "Brown-black vascular tissue discoloration"],
            "causes": ["Fusarium oxysporum f.sp. cubense", "Contaminated agricultural tools", "Infected planting material (suckers)"],
            "affected_parts": ["root", "pseudostem", "vascular system"],
            "organic_solutions": ["Trichoderma harzianum soil incorporation (1 kg/acre)", "Pseudomonas fluorescens (10 g/L) monthly drench", "Neem cake soil amendment (200 kg/acre)"],
            "chemical_solutions": ["Carbendazim 50% WP (2 g/L) sucker dipping", "Propiconazole 25% EC (2 ml/L) soil drench", "Copper Oxychloride 50% WP (3 g/L) on pseudostem"],
            "prevention_methods": ["Use tissue-culture disease-free plants only", "Destroy infected plants by burning", "Avoid banana for 3-5 years in infected soil", "Disinfect tools with 10% bleach between plants"]
        },
        "Sigatoka Leaf Spot": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "Yellow/black leaf spots reducing photosynthetic area. Can cause 20-50% yield reduction.",
            "cause": "Mycosphaerella spp. fungi", "spread": "Wind-borne spores, rain splash, high humidity",
            "symptoms": ["Small yellow streaks on young leaves", "Streaks enlarge into brown-black necrotic spots", "Premature leaf drying and death", "Reduced bunch weight"],
            "causes": ["Mycosphaerella musicola (Yellow)", "Mycosphaerella fijiensis (Black - more severe)", "High humidity and frequent rainfall"],
            "affected_parts": ["leaf"],
            "organic_solutions": ["Bordeaux Mixture 1% every 15 days preventive", "Neem Oil + Wettable Sulphur (5 ml + 2 g/L)", "Regular de-leafing every 2 weeks"],
            "chemical_solutions": ["Propiconazole 25% EC (1 ml/L)", "Mancozeb 75% WP (2.5 g/L)", "Azoxystrobin 23% SC (1 ml/L)"],
            "prevention_methods": ["Plant resistant varieties like Grand Naine", "Wide spacing (2mx2m) for air circulation", "Regular cultural de-leafing", "Improve drainage to reduce humidity"]
        }
    },
    "mango": {
        "Anthracnose": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Most serious mango disease. Dark lesions causing pre and post-harvest losses. Can cause 50-80% fruit loss.",
            "cause": "Colletotrichum gloeosporioides", "spread": "Rain splash, wind, contaminated harvesting tools",
            "symptoms": ["Dark sunken circular lesions on ripening fruits", "Black spots with pink spore masses", "Blossom blight causing flower death", "Severe post-harvest fruit rot"],
            "causes": ["Colletotrichum gloeosporioides fungus", "High humidity during flowering", "Mechanical wounds on fruits"],
            "affected_parts": ["fruit", "flower", "leaf"],
            "organic_solutions": ["Bordeaux Mixture 1% every 15 days during flowering", "Pseudomonas fluorescens (10 g/L) for blossom protection", "Post-harvest hot water treatment (52°C for 5 min)"],
            "chemical_solutions": ["Carbendazim 50% WP (1 g/L) at pre-flowering stages", "Mancozeb 75% WP (2.5 g/L) during monsoon", "Hexaconazole 5% EC (2 ml/L) for severe infections"],
            "prevention_methods": ["Prune trees for good air circulation", "Remove infected debris and mummified fruits", "Avoid overhead irrigation during flowering", "Apply protective fungicide before monsoon"]
        },
        "Powdery Mildew": {
            "type": "Fungal Disease", "severity": "MODERATE",
            "description": "White powdery coating on inflorescence. Critical during flowering causing fruit set reduction.",
            "cause": "Oidium mangiferae", "spread": "Wind-borne conidia; dry weather favors development",
            "symptoms": ["White powdery growth on flowers and young leaves", "Panicle distortion and malformation", "Flower drop leading to poor fruit set", "Young fruit deformation"],
            "causes": ["Oidium mangiferae fungus", "Dry weather with cool nights and warm days", "Dense canopy restricting air movement"],
            "affected_parts": ["flower", "panicle", "young leaf"],
            "organic_solutions": ["Wettable Sulphur 80% WP (3 g/L) at panicle emergence", "Potassium Bicarbonate solution (5 g/L)", "Neem oil (5 ml/L) with spreader-sticker"],
            "chemical_solutions": ["Hexaconazole 5% EC (2 ml/L) most effective systemic", "Triadimefon 25% WP (1 g/L) at panicle emergence", "Sulphur 80% WP (3 g/L) as economical option"],
            "prevention_methods": ["Prune trees annually to maintain open canopy", "Remove water sprouts and dense internal branches", "Apply first preventive spray at panicle emergence", "Maintain tree nutrition with balanced NPK"]
        }
    },
    "sugarcane": {
        "Red Rot": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Most destructive sugarcane disease. Red internal discoloration with white external patches. Can cause total crop loss.",
            "cause": "Colletotrichum falcatum", "spread": "Infected seed sets, mechanical wounds, waterlogged conditions",
            "symptoms": ["Internal red discoloration of stem tissues", "External white patches with black dots", "Wilting and drying of top leaves", "Characteristic alcoholic smell from infected stalks"],
            "causes": ["Colletotrichum falcatum fungus", "Planting infected seed cane sets", "Waterlogging creating anaerobic conditions"],
            "affected_parts": ["stem", "internal tissues"],
            "organic_solutions": ["Trichoderma viride sett treatment (10 g/L water soak 30 min)", "Copper Oxychloride 50% WP (3 g/L) spray after cutting", "Bordeaux Mixture 1% sett dipping for 10 minutes"],
            "chemical_solutions": ["Carbendazim 50% WP (2 g/L) sett treatment", "Propiconazole 25% EC (1 ml/L) foliar spray every 30 days", "Thiophanate-methyl 70% WP (1 g/L) as systemic fungicide"],
            "prevention_methods": ["Use only disease-free certified seed cane", "Plant red rot-resistant varieties (CoC series)", "Improve field drainage; avoid waterlogging", "Rogue out infected clumps and destroy by burning"]
        }
    },
    "groundnut": {
        "Tikka Leaf Spot": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Most important groundnut disease. Circular spots causing severe defoliation. Can reduce yields by 50-70%.",
            "cause": "Cercospora & Phaeoisariopsis fungi", "spread": "Rain splash, wind-borne spores, infected crop debris",
            "symptoms": ["Small circular dark brown spots on leaves", "Yellow halo surrounding each spot", "Severe premature defoliation", "Reduced pod filling and yield quality"],
            "causes": ["Cercospora arachidicola (Early leaf spot)", "Phaeoisariopsis personata (Late leaf spot)", "High humidity with warm temperatures"],
            "affected_parts": ["leaf"],
            "organic_solutions": ["Pseudomonas fluorescens (10 g/L) bio-fungicide spray", "Trichoderma viride (5 ml/L) preventive applications", "Copper Oxychloride 50% WP (3 g/L)"],
            "chemical_solutions": ["Chlorothalonil 75% WP (2 g/L) broad-spectrum contact", "Carbendazim + Mancozeb (1 g + 2 g/L) combination", "Tebuconazole 25.9% EC (1 ml/L)"],
            "prevention_methods": ["Plant leaf spot-resistant groundnut varieties", "Practice 2-3 year crop rotation with cereals", "Deep plough and bury infected crop residue", "Begin preventive fungicide sprays at 30 days after sowing"]
        }
    },
    "soybean": {
        "Rust": {
            "type": "Fungal Disease", "severity": "HIGH",
            "description": "Devastating disease with pustules on leaf undersides. Can cause 40-80% yield loss in susceptible varieties.",
            "cause": "Phakopsora pachyrhizi", "spread": "Wind-borne urediniospores traveling long distances",
            "symptoms": ["Small tan to brown pustules on lower leaf surface", "Angular lesions confined by leaf veins", "Premature leaf yellowing and drop", "Reduced pod fill and seed quality"],
            "causes": ["Phakopsora pachyrhizi fungus", "High humidity (>80%)", "Warm temperatures 20-28°C"],
            "affected_parts": ["leaf", "pod"],
            "organic_solutions": ["Neem oil + Wettable Sulphur (5 ml + 2 g/L) combination", "Trichoderma viride (5 ml/L) bio-fungicide", "Potassium Phosphite (2 ml/L) plant immunity activator"],
            "chemical_solutions": ["Trifloxystrobin + Tebuconazole (0.75 ml/L) - most effective", "Azoxystrobin 23% SC (1 ml/L) premium systemic", "Propiconazole 25% EC (1 ml/L) at early appearance"],
            "prevention_methods": ["Plant rust-resistant soybean varieties", "Early sowing (June) to escape peak rust season", "Scout fields weekly from flowering stage", "Apply preventive fungicide at R3 (pod formation) stage"]
        },
        "Yellow Mosaic Virus": {
            "type": "Viral Disease", "severity": "HIGH",
            "description": "Viral disease causing yellow mosaic patterns. Transmitted by whitefly. Can cause 20-80% yield loss.",
            "cause": "Mungbean Yellow Mosaic Virus via whitefly", "spread": "Whitefly vector transmission; no direct cure for virus",
            "symptoms": ["Yellow mosaic patterns on leaves", "Severe stunting of plant growth", "Reduced pod formation and seed size", "Distorted and puckered leaf appearance"],
            "causes": ["Mungbean Yellow Mosaic Virus (MYMV)", "Whitefly (Bemisia tabaci) vector", "Warm weather favoring whitefly multiplication"],
            "affected_parts": ["leaf", "entire plant"],
            "organic_solutions": ["Neem oil + soap spray (5 ml/L + 1 ml/L) targeting whitefly", "Yellow sticky traps (15-20 per acre)", "Reflective mulches (silver plastic) repelling whitefly"],
            "chemical_solutions": ["Imidacloprid 17.8% SL (0.3 ml/L) for vector control", "Thiamethoxam 25% WG (0.25 g/L)", "Acetamiprid 20% SP (0.25 g/L)"],
            "prevention_methods": ["Plant virus-resistant soybean varieties", "Rogue out infected plants within first 30 days", "Control whitefly from seedling stage", "Avoid late sowing which increases disease pressure"]
        }
    }
}

PEST_GENERIC_FALLBACK = {
    "type": "Fungal Disease", "severity": "MODERATE",
    "description": "Plant disease detected showing typical stress symptoms. Specific pathogen identification requires laboratory confirmation.",
    "cause": "Fungal/Bacterial pathogen", "spread": "Environmental conditions - humidity, wind, rain splash",
    "symptoms": ["Discoloration of plant tissue", "Lesions or spots on leaves", "Wilting or drooping", "Abnormal growth patterns"],
    "causes": ["Pathogenic infection", "Environmental stress conditions", "Poor soil nutrition", "Water stress"],
    "affected_parts": ["leaf", "stem"],
    "organic_solutions": ["Neem oil spray (5 ml/L water) as broad-spectrum organic treatment", "Trichoderma viride (5 ml/L) as bio-fungicide", "Copper Oxychloride 50% WP (3 g/L) as protective spray"],
    "chemical_solutions": ["Mancozeb 75% WP (2.5 g/L) broad-spectrum contact fungicide", "Carbendazim 50% WP (1 g/L) systemic fungicide", "Propiconazole 25% EC (1 ml/L) for systemic control"],
    "prevention_methods": ["Maintain proper spacing for air circulation", "Use disease-resistant varieties", "Practice crop rotation", "Ensure balanced nutrition and irrigation management"]
}

CLAUDE_SYSTEM_PROMPT = """You are an expert agricultural plant disease AI diagnostician with 20+ years of experience.
Analyze the provided plant/crop image and identify diseases, pests, or health issues.

You MUST respond ONLY with valid JSON, no additional text, no markdown.

Respond in this exact format:
{
  "crop": "rice|wheat|maize|cotton|banana|mango|tomato|potato|grapes|groundnut|soybean|sugarcane|unknown",
  "disease": "exact disease name",
  "confidence": 85,
  "severity": "LOW|MODERATE|HIGH",
  "type": "Fungal Disease|Bacterial Disease|Viral Disease|Insect Pest|Nutrient Deficiency|Unknown",
  "visual_findings": "Brief description of what you observe in the image",
  "detected_region": "leaves|stem|fruit|root|whole plant",
  "is_healthy": false,
  "health_note": "only if plant is healthy, describe what you see"
}

Be specific and precise. If the image is unclear or not a plant, set confidence below 40 and crop to "unknown".
For healthy plants, set is_healthy to true and confidence to 90+."""


def find_pest_disease(crop: str, disease_name: str):
    """Fuzzy search in PEST_DISEASE_DB."""
    crop_lower = crop.lower()
    disease_lower = disease_name.lower()
    if crop_lower in PEST_DISEASE_DB:
        for db_disease, data in PEST_DISEASE_DB[crop_lower].items():
            if db_disease.lower() in disease_lower or disease_lower in db_disease.lower():
                return {"disease_name": db_disease, **data}
    for crop_key, diseases in PEST_DISEASE_DB.items():
        for db_disease, data in diseases.items():
            if db_disease.lower() in disease_lower or disease_lower in db_disease.lower():
                return {"disease_name": db_disease, **data}
    return None


# ═══════════════════════════════════════════════════════════════════
# ERROR HANDLERS (unchanged)
# ═══════════════════════════════════════════════════════════════════
@app.errorhandler(404)
def page_not_found(e):
    return render_template('dashboard.html', error_msg="Page not found",
                           notification_count=get_notification_count()), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('dashboard.html', error_msg="Something went wrong",
                           notification_count=get_notification_count()), 500


# ═══════════════════════════════════════════════════════════════════
# AUTH ROUTES (unchanged)
# ═══════════════════════════════════════════════════════════════════
@app.route('/')
def home():
    if is_logged_in():
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login_submit', methods=['POST'])
def login_submit():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['user_name'] = user.name
        session['user_email'] = user.email
        session['user_photo'] = user.profile_photo
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/signup_submit', methods=['POST'])
def signup_submit():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone', '')
    location = data.get('location', '')
    hashed_password = generate_password_hash(password)
    try:
        new_user = User(name=name, email=email, password=hashed_password, phone=phone, location=location)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Registration successful'})
    except Exception:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Email already exists or database error'})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ═══════════════════════════════════════════════════════════════════
# PAGE ROUTES (unchanged)
# ═══════════════════════════════════════════════════════════════════
@app.route('/dashboard')
def dashboard():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('dashboard.html',
                           user_name=session.get('user_name'),
                           user_photo=session.get('user_photo'),
                           crop_info=crop_info,
                           notification_count=get_notification_count())

@app.route('/create')
def create():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('create.html',
                           user_name=session.get('user_name'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())

@app.route('/profile')
def profile():
    if not is_logged_in():
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    return render_template('profile.html',
                           user_name=session.get('user_name'),
                           user_email=user.email,
                           user_phone=user.phone,
                           user_location=user.location,
                           user_occupation=user.occupation,
                           user_photo=user.profile_photo,
                           notification_count=get_notification_count())

@app.route('/api/update-profile', methods=['POST'])
def update_profile():
    if not is_logged_in():
        return jsonify({'success': False, 'message': 'Please login first'}), 401
    data = request.json
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
        
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.location = data.get('location', user.location)
    user.occupation = data.get('occupation', user.occupation)
    
    if data.get('photo'):
        user.profile_photo = data.get('photo')
        session['user_photo'] = user.profile_photo
    
    if data.get('password'):
        user.password = generate_password_hash(data.get('password'))
        
    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)})

@app.route('/notifications')
def notifications():
    if not is_logged_in():
        return redirect(url_for('login'))
    notifications = Notification.query.filter_by(user_id=session['user_id'])\
        .order_by(Notification.created_at.desc()).limit(20).all()
    return render_template('notifications.html',
                           notifications=notifications,
                           user_name=session.get('user_name'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())

@app.route('/irrigation')
def irrigation():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('irrigation_new.html',
                           user_name=session.get('user_name', 'Farmer'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())

@app.route('/harvest')
def harvest():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('harvest.html',
                           user_name=session.get('user_name', 'Farmer'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())

@app.route('/pest')
def pest():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('pest.html',
                           user_name=session.get('user_name', 'Farmer'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())

@app.route('/market')
def market():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('market.html',
                           user_name=session.get('user_name', 'Farmer'),
                           user_photo=session.get('user_photo'),
                           notification_count=get_notification_count())


# ═══════════════════════════════════════════════════════════════════
# MARKET TRENDS API (GEMINI POWERED)
# ═══════════════════════════════════════════════════════════════════
@app.route('/api/market-trends', methods=['GET'])
def get_market_trends():
    crop = request.args.get('crop', 'rice').lower()
    if not is_logged_in():
        return jsonify({'error': 'Please login first', 'fallback': True}), 401
    
    if not gemini_client or not os.getenv('GEMINI_API_KEY'):
        return jsonify({'error': 'GEMINI_API_KEY not configured', 'fallback': True}), 503

    today_str = datetime.now().strftime('%d %B %Y')

    try:
        prompt = f"""You are an expert agricultural market analyst in India. Today's date is {today_str}.
Provide REALISTIC current market data for {crop} in India as of today.
Use your knowledge of current Indian commodity prices from APMC mandis.
Return ONLY a valid JSON object (no markdown, no extra text):
{{
  "fiveDayPrices": [1980, 2000, 2020, 2040, 2050],
  "demand": {{ "current": "HIGH", "d30": "MODERATE", "d60": "LOW" }},
  "demandNote": "Short real market explanation based on today {today_str} (max 2 sentences)",
  "msp": 2183,
  "nearbyMarkets": [
    {{ "name": "Vashi APMC", "type": "APMC Mandi", "distance": "12 km", "today": 2050, "yesterday": 2040, "open": "Mon-Sat 6 AM" }},
    {{ "name": "Kalyan Market", "type": "Wholesale", "distance": "18 km", "today": 2045, "yesterday": 2035, "open": "Mon-Sat 7 AM" }}
  ],
  "buyers": [
    {{ "name": "ABC Traders", "buying": 500, "price": 2060, "contact": "98765-10001", "rating": "4.8 ⭐" }}
  ]
}}
IMPORTANT:
- Prices must be in INR (₹) per 100kg (Quintal) — realistic for Indian mandis as of {today_str}.
- fiveDayPrices: exactly 5 integer values (last = today's modal price).
- Demand: EXACTLY one of "HIGH", "MODERATE", "LOW".
- Be consistent: if {crop} season is on, reflect higher prices. If off-season, reflect lower."""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        data = json.loads(text)
        return jsonify(data)
    except Exception as e:
        print(f"Gemini Market API Error: {e}")
        return jsonify({'error': str(e), 'fallback': True}), 500


# ═══════════════════════════════════════════════════════════════════
# LIVE PRICE TICKER API — data.gov.in (Agmarknet) + Gemini fallback
# ═══════════════════════════════════════════════════════════════════
# Commodity name map: our key → Agmarknet commodity name
AGMARK_COMMODITY_MAP = {
    'rice':      'Rice',
    'wheat':     'Wheat',
    'maize':     'Maize',
    'cotton':    'Cotton',
    'sugarcane': 'Sugarcane',
    'banana':    'Banana',
    'soybean':   'Soyabean',
    'grapes':    'Grapes',
    'mango':     'Mango',
    'millet':    'Bajra(Pearl Millet/Cumbu)',
    'pulses':    'Arhar (Tur/Red Gram)(Whole)',
    'groundnut': 'Groundnut',
    'barley':    'Barley (Jau)',
    'oats':      'Oats',
}

# data.gov.in public demo API key for Agmarknet daily prices
# Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
DATA_GOV_API_KEY = os.getenv('DATA_GOV_API_KEY', '')
DATA_GOV_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'

# Simple in-memory cache: {date_str: {crop: price_data}}
_live_price_cache = {}
_live_price_cache_time = None

def _get_agmarknet_price(commodity_name):
    """Fetch modal price from data.gov.in Agmarknet for a given commodity."""
    try:
        from datetime import date
        today = date.today().strftime('%d/%m/%Y')
        url = (
            f"https://api.data.gov.in/resource/{DATA_GOV_RESOURCE_ID}"
            f"?api-key={DATA_GOV_API_KEY}"
            f"&format=json&offset=0&limit=20"
            f"&filters[Commodity]={requests.utils.quote(commodity_name)}"
        )
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            records = data.get('records', [])
            if records:
                # Get modal price from most recent record
                modal_prices = []
                for rec in records:
                    mp = rec.get('Modal_Price') or rec.get('modal_price') or rec.get('Modal Price')
                    if mp:
                        try:
                            modal_prices.append(float(str(mp).replace(',', '')))
                        except:
                            pass
                if modal_prices:
                    avg_modal = sum(modal_prices) / len(modal_prices)
                    return round(avg_modal / 100) * 100  # round to nearest 100
    except Exception as e:
        print(f"Agmarknet fetch failed for {commodity_name}: {e}")
    return None


def _get_gemini_live_prices():
    """Use Gemini to get today's realistic price estimates for all crops."""
    if not gemini_client or not os.getenv('GEMINI_API_KEY'):
        return None
    today_str = datetime.now().strftime('%d %B %Y')
    try:
        prompt = f"""Today is {today_str}. You are an Indian agricultural market price expert.

Provide TODAY's realistic modal (mandi) prices in INR per quintal (100kg) for these Indian crops:
rice, wheat, maize, cotton, sugarcane, banana, soybean, grapes, mango, millet, pulses, groundnut, barley, oats

Return ONLY a JSON object. No markdown. No extra text. Format:
{{
  "rice": {{"price": 2200, "change": 1.5, "trend": "up"}},
  "wheat": {{"price": 2280, "change": -0.5, "trend": "down"}},
  "maize": {{"price": 1950, "change": 2.0, "trend": "up"}},
  "cotton": {{"price": 6800, "change": 3.0, "trend": "up"}},
  "sugarcane": {{"price": 320, "change": 0.5, "trend": "stable"}},
  "banana": {{"price": 2100, "change": 1.0, "trend": "up"}},
  "soybean": {{"price": 4500, "change": 2.5, "trend": "up"}},
  "grapes": {{"price": 8200, "change": 4.0, "trend": "up"}},
  "mango": {{"price": 17500, "change": 12.0, "trend": "up"}},
  "millet": {{"price": 2300, "change": 2.0, "trend": "up"}},
  "pulses": {{"price": 7600, "change": 5.0, "trend": "up"}},
  "groundnut": {{"price": 6200, "change": 3.5, "trend": "up"}},
  "barley": {{"price": 1950, "change": 1.5, "trend": "up"}},
  "oats": {{"price": 4000, "change": 4.0, "trend": "up"}}
}}

RULES:
- Prices must be realistic Indian APMC mandi modal prices as of {today_str}
- Reflect current season (April harvest season in India - wheat harvesting, mango peak season)
- change is % change from yesterday (can be negative for "down" trend)
- trend is one of: "up", "down", "stable"
"""
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini live prices error: {e}")
        return None


def _get_gemini_live_prices_for_country(country):
    """Refined prompt to ensure proper fetching for international markets with local currencies"""
    if not gemini_client or not os.getenv('GEMINI_API_KEY'): return None
    today_str = datetime.now().strftime('%d %B %Y')
    
    try:
        prompt = f"""Today is {today_str}. Act as a global commodities analyst for {country}.
        Provide the latest realistic modal market prices for the following crops in {country} (convert to local currency per 100kg/quintal):
        rice, wheat, maize, cotton, sugarcane, banana, soybean, grapes, mango, millet, pulses, groundnut, barley, oats

        Return ONLY a JSON object:
        {{
          "crop_name": {{"price": 1234, "change": 1.2, "trend": "up", "symbol": "$"}}
        }}
        Ensure prices reflect current {country} market conditions for April 2026. Use the correct local currency symbol (e.g. ₹ for India, $ for USA/Australia/etc, ¥ for China, ₫ for Vietnam, R$ for Brazil).
        """
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini live prices error: {e}")
        return None

@app.route('/api/live-prices', methods=['GET'])
def get_live_prices():
    global _live_price_cache, _live_price_cache_time
    from datetime import datetime as dt

    # Get country from URL parameters
    country = request.args.get('country', 'India')
    cache_key = f"prices_{country}"

    now = dt.now()
    # Cache per country
    if _live_price_cache_time and (now - _live_price_cache_time).seconds < 1800 and cache_key in _live_price_cache:
        return jsonify({'prices': _live_price_cache[cache_key], 'source': 'cache', 'country': country})

    prices = {}

    # Logic: Only use Agmarknet if country is India
    if country.lower() == 'india':
        agmark_success_count = 0
        for crop_key, agmark_name in AGMARK_COMMODITY_MAP.items():
            price = _get_agmarknet_price(agmark_name)
            if price and price > 0:
                prices[crop_key] = {
                    'price': int(price),
                    'source': 'Agmarknet (Govt)',
                    'change': round(random.uniform(-1.0, 3.0), 1),
                    'trend': 'up' if random.random() > 0.4 else 'down',
                    'symbol': '₹'
                }
                agmark_success_count += 1

    # If not India OR Agmarknet failed on some, use Gemini for the specific country
    missing_crops = [c for c in AGMARK_COMMODITY_MAP.keys() if c not in prices]
    if missing_crops:
        gemini_prices = _get_gemini_live_prices_for_country(country)
        if gemini_prices:
            for crop_key in missing_crops:
                if crop_key in gemini_prices:
                    gdata = gemini_prices[crop_key]
                    prices[crop_key] = {
                        'price': int(gdata.get('price', 0)),
                        'source': f'Gemini ({country})',
                        'change': float(gdata.get('change', 0)),
                        'trend': gdata.get('trend', 'stable'),
                        'symbol': gdata.get('symbol', '$')
                    }

    # Hard fallback
    fallback_prices = {
        'rice': 2200, 'wheat': 2275, 'maize': 1980, 'cotton': 6900,
        'sugarcane': 315, 'banana': 2100, 'soybean': 4550, 'grapes': 8300,
        'mango': 18000, 'millet': 2400, 'pulses': 7750, 'groundnut': 6350,
        'barley': 1975, 'oats': 4100
    }
    for crop_key, fp in fallback_prices.items():
        if crop_key not in prices:
            prices[crop_key] = {
                'price': fp,
                'source': 'MSP Reference',
                'change': round(random.uniform(0, 2), 1),
                'trend': 'stable',
                'symbol': '₹' if country.lower() == 'india' else '$'
            }

    _live_price_cache[cache_key] = prices
    _live_price_cache_time = now
    return jsonify({'prices': prices, 'source': 'live', 'country': country})

# ═══════════════════════════════════════════════════════════════════
# GEMINI AI PEST ROUTES (Refactored to new google.genai SDK)
# ═══════════════════════════════════════════════════════════════════

@app.route('/api/analyze-pest', methods=['POST'])
def analyze_pest():
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401
    
    # Check for Gemini key
    ok, error = check_api_keys(['GEMINI_API_KEY'])
    if not ok:
        return jsonify({'error': error, 'type': 'CONFIG_REQUIRED'})
        
    try:
        data = request.json
        image_data = data.get('image')
        crop = data.get('crop', 'General Crop')
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400

        # Prepare image parts
        if ',' in image_data:
            image_header, image_data = image_data.split(',', 1)
        media_type = 'image/jpeg'
        if image_data.startswith('iVBORw0KGgo'): media_type = 'image/png'
        
        prompt = f"""You are an expert agronomist. Analyze this {crop} crop image and identify any pest, disease, or deficiency.
Return ONLY a valid JSON object with this structure:
{{
  "disease_name": "Disease Name",
  "type": "Fungal/Insect/Viral/Bacterial/Nutrient Deficiency",
  "severity": "HIGH/MODERATE/LOW",
  "confidence": 90,
  "description": "Short diagnosis.",
  "cause": "Specific cause",
  "spread": "How it spreads",
  "organic_treatment": [{{"name": "X", "dosage": "Y", "frequency": "every Z days", "duration": "Z weeks", "timeTaken": "Z days", "costPerAcre": "INR", "notes": "note"}}],
  "chemical_treatment": [{{"name": "X", "dosage": "Y", "frequency": "every Z days", "duration": "Z weeks", "timeTaken": "Z days", "costPerAcre": "INR", "notes": "note"}}],
  "prevention": ["Tip 1", "Tip 2"]
}}"""

        try:
            image_bytes = base64.b64decode(image_data)
            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type=media_type
            )
            response = gemini_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[image_part, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return jsonify({'error': f"AI Analysis failed: {str(e)}"}), 500
        
        json_str = response.text.strip()
        analysis_result = json.loads(json_str)
        return jsonify(analysis_result)
    except Exception as e:
        print(f"Gemini Vision Error: {e}")
        return jsonify({'error': f"AI Analysis failed: {str(e)}"}), 500

@app.route('/api/chat-pest', methods=['POST'])
def chat_pest():
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401
    try:
        data = request.json
        user_msg = data.get('message')
        crop = data.get('crop', 'General Crop')
        last_diagnosis = data.get('last_diagnosis', 'None')
        if not user_msg:
            return jsonify({'error': 'Message required'}), 400
            
        system_prompt = f"Expert agronomist assistant. Context: {crop}, Last Scan: {last_diagnosis}. Be concise and helpful."
        
        # Expert Chat using Gemini
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_prompt}\n\nFarmer: {user_msg}"
        )
        return jsonify({'reply': response.text.strip()})
    except Exception as e:
        print(f"Gemini Chat Error: {e}")
        return jsonify({'error': str(e)}), 500


# ═══════════════════════════════════════════════════════════════════
# ─── NEW: CLAUDE VISION PEST ANALYSIS ROUTES ───────────────────────
# These power the pest.html + pest_control.js image upload system
# ═══════════════════════════════════════════════════════════════════

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    """
    Claude Vision AI endpoint.
    Accepts base64 image → calls Claude → enriches with PEST_DISEASE_DB → returns JSON.
    Called by pest_control.js → callAnalysisAPI()
    """
    if not is_logged_in():
        return jsonify({'error': 'Please login first', 'fallback': True}), 401

    if not claude_client:
        return jsonify({'error': 'ANTHROPIC_API_KEY not configured', 'fallback': True}), 503

    # ── Parse image from request ──────────────────────────────────
    image_data = None
    media_type = 'image/jpeg'
    active_crop = ''

    if request.is_json:
        body = request.get_json()
        raw = body.get('imageData', '')
        active_crop = (body.get('crop') or '').strip()
        if raw.startswith('data:'):
            parts = raw.split(',', 1)
            media_type = parts[0].split(':')[1].split(';')[0]
            image_data = parts[1]
        else:
            image_data = raw
    elif 'image' in request.files:
        file = request.files['image']
        image_bytes = file.read()
        image_data = base64.standard_b64encode(image_bytes).decode('utf-8')
        media_type = file.content_type or 'image/jpeg'

    if not image_data:
        return jsonify({'error': 'No image data received', 'fallback': True}), 400

    # ── Call Claude Vision ────────────────────────────────────────
    try:
        message = claude_client.messages.create(
            model='claude-opus-4-5',
            max_tokens=800,
            messages=[{
                'role': 'user',
                'content': [
                    {
                        'type': 'image',
                        'source': {
                            'type': 'base64',
                            'media_type': media_type,
                            'data': image_data,
                        },
                    },
                    {
                        'type': 'text',
                        'text': (
                            'Analyze this plant image for diseases, pests, or health issues. '
                            f'The farmer selected {active_crop} as the active crop context. '
                            'Use that context when relevant, but do not invent findings. '
                            'Respond ONLY with the JSON format specified in your instructions.'
                        )
                    }
                ],
            }],
            system=CLAUDE_SYSTEM_PROMPT,
        )

        raw_text = message.content[0].text.strip()
        raw_text = re.sub(r'```(?:json)?', '', raw_text).strip('` \n')
        ai_result = json.loads(raw_text)

    except json.JSONDecodeError:
        return jsonify({'error': 'AI returned invalid response', 'fallback': True}), 422
    except anthropic.APIError as e:
        return jsonify({'error': f'Claude API error: {str(e)}', 'fallback': True}), 503
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}', 'fallback': True}), 500

    # ── Map AI result to disease database ─────────────────────────
    crop = ai_result.get('crop', 'unknown')
    disease_name = ai_result.get('disease', 'Unknown Disease')
    confidence = ai_result.get('confidence', 75)
    is_healthy = ai_result.get('is_healthy', False)

    if is_healthy:
        return jsonify({
            'success': True, 'is_healthy': True,
            'crop': crop, 'disease': 'No Disease Detected',
            'confidence': confidence,
            'health_note': ai_result.get('health_note', 'Plant appears healthy'),
            'visual_findings': ai_result.get('visual_findings', ''),
            'severity': 'NONE', 'type': 'Healthy Plant',
            'symptoms': ['No visible disease symptoms detected'],
            'causes': ['N/A - Plant is healthy'],
            'organic_solutions': ['Continue current management practices', 'Regular monitoring recommended'],
            'chemical_solutions': [],
            'prevention_methods': ['Maintain current crop health practices', 'Regular field monitoring', 'Balanced nutrition and irrigation']
        })

    disease_data = find_pest_disease(crop, disease_name)

    if disease_data:
        return jsonify({
            'success': True, 'is_healthy': False, 'source': 'database',
            'crop': crop,
            'disease': disease_data.get('disease_name', disease_name),
            'confidence': confidence,
            'severity': disease_data.get('severity', ai_result.get('severity', 'MODERATE')),
            'type': disease_data.get('type', ai_result.get('type', 'Fungal Disease')),
            'description': disease_data.get('description', ''),
            'cause': disease_data.get('cause', ''),
            'spread': disease_data.get('spread', ''),
            'visual_findings': ai_result.get('visual_findings', ''),
            'detected_region': ai_result.get('detected_region', 'leaf'),
            'symptoms': disease_data.get('symptoms', []),
            'causes': disease_data.get('causes', []),
            'affected_parts': disease_data.get('affected_parts', []),
            'organic_solutions': disease_data.get('organic_solutions', []),
            'chemical_solutions': disease_data.get('chemical_solutions', []),
            'prevention_methods': disease_data.get('prevention_methods', [])
        })
    else:
        resp = {
            'success': True, 'is_healthy': False, 'source': 'ai_generic',
            'crop': crop, 'disease': disease_name,
            'confidence': max(40, confidence - 15),
            'severity': ai_result.get('severity', 'MODERATE'),
            'type': ai_result.get('type', 'Fungal Disease'),
            'description': f"{disease_name} detected on {crop}. {ai_result.get('visual_findings', '')}",
            'visual_findings': ai_result.get('visual_findings', ''),
            'detected_region': ai_result.get('detected_region', 'leaf'),
            **PEST_GENERIC_FALLBACK
        }
        resp['disease'] = disease_name
        return jsonify(resp)


@app.route('/get-pest-data', methods=['POST'])
def get_pest_data():
    """
    Lookup disease details by crop + disease name from PEST_DISEASE_DB.
    Called by pest_control.js as a reference lookup.
    """
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401

    body = request.get_json()
    crop = (body.get('crop') or '').lower()
    disease = (body.get('disease') or '').lower()

    result = find_pest_disease(crop, disease)
    if result:
        return jsonify({'success': True, 'data': result})

    return jsonify({
        'success': True,
        'data': {'disease_name': disease or 'Unknown Disease', **PEST_GENERIC_FALLBACK}
    })


@app.route('/random-disease', methods=['GET'])
def random_disease():
    """
    Honest analysis-unavailable response.

    This route previously returned a RANDOM disease with a fabricated
    confidence score (65-85) as an 'offline fallback' after Claude Vision
    failed. A guessed diagnosis could mislead a farmer into the wrong
    treatment, so that behavior is removed. No disease name, severity,
    confidence, or treatment is fabricated here.

    The frontend no longer calls this route; it is kept only for
    backward-compatibility with any stale caller, and now truthfully
    reports that detection is unavailable and to retry.
    """
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401

    return jsonify({
        'success': False,
        'available': False,
        'error': 'AI detection analysis is currently unavailable. Please try again with a clear image.',
        'retry': True,
    }), 503


# ═══════════════════════════════════════════════════════════════════
# PREDICTION & REPORT ROUTES (unchanged)
# ═══════════════════════════════════════════════════════════════════
@app.route('/api/predict', methods=['POST'])
def predict():
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401

    # Prediction is pure RandomForest and does not depend on Gemini.
    # No Gemini configuration is required for this endpoint.
    req = request.json or {}
    lat = req.get('lat', 18.52)
    lon = req.get('lon', 73.85)
    soil_type = req.get('soil_type', 'loamy')
    land_type = req.get('land_type', 'flat')
    previous_crop = req.get('previous_crop', '')
    mode = req.get('mode', 'basic')
    land_size = 1
    try:
        land_size = float(req.get('land_size', 1))
    except (TypeError, ValueError):
        land_size = 1
    temp, humidity, rainfall = get_weather(lat, lon)
    N, P, K, ph = estimate_soil(soil_type)
    input_data = np.array([[N, P, K, temp, humidity, rainfall, ph]])
    probs = model.predict_proba(input_data)[0]
    crops = model.classes_
    top_indices = np.argsort(probs)[-5:][::-1]
    recommendations = []
    for i in top_indices:
        name = crops[i]
        info = crop_info.get(name, {})
        water_per_acre = info.get('water', 0)
        profit_per_acre = info.get('profit', 0)
        time = info.get('time', 0)
        total_water = water_per_acre * land_size
        total_profit = profit_per_acre * land_size
        score = probs[i] * 100
        if mode == 'moderate':
            score += 5
        elif mode == 'advanced':
            score += 10
        rotation_bonus = 0
        rotation_reason = ''
        if previous_crop in rotation_rules and name in rotation_rules[previous_crop]:
            rotation_bonus = 10
            rotation_reason = f'Best crop after {previous_crop}'
        score = round(score + rotation_bonus, 2)
        land_type_bonus = 0
        water_level = info.get('water_level', 'Medium')
        if land_type == 'wet' and water_level == 'High':
            land_type_bonus = 8
        elif land_type == 'dry' and water_level == 'Low':
            land_type_bonus = 8
        elif land_type == 'flat' and water_level == 'Medium':
            land_type_bonus = 5
        score = round(score + land_type_bonus, 2)
        if score >= 80:
            confidence = 'High'
        elif score >= 60:
            confidence = 'Medium'
        else:
            confidence = 'Low'
        if rotation_reason:
            reason = rotation_reason
        elif water_per_acre < 600:
            reason = 'Low water requirement'
        elif profit_per_acre > 70000:
            reason = 'High profit crop'
        else:
            reason = 'Balanced crop'
        ai_message = f"{name.capitalize()} is suitable because your soil is {soil_type} and rainfall is {rainfall} mm. Expected profit is \u20b9{total_profit}."
        if water_per_acre >= 1200:
            schedule = 'Morning, Afternoon, Evening'
        elif water_per_acre >= 700:
            schedule = 'Morning & Evening'
        else:
            schedule = 'Morning only'
        recommendations.append({
            'name': name, 'score': score,
            'water': info.get('water_level', 'Unknown'),
            'profit': info.get('profit_level', 'Unknown'),
            'time': time, 'total_water': total_water, 'total_profit': total_profit,
            'schedule': schedule, 'reason': reason, 'ai_message': ai_message,
            'confidence': confidence,
        })
    if recommendations:
        top_crop = recommendations[0]
        try:
            prediction = Prediction(
                user_id=session['user_id'],
                crop_name=top_crop['name'],
                score=top_crop['score'],
                location=f"{lat},{lon}",
                soil_type=soil_type
            )
            db.session.add(prediction)
            notification = Notification(
                user_id=session['user_id'],
                title='New Crop Recommendation',
                message=f"We recommend {top_crop['name'].capitalize()} with {top_crop['score']:.1f}% confidence",
                type='success'
            )
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"DB save error: {e}")
    return jsonify({
        'recommended_crops': recommendations,
        'temperature': temp, 'humidity': humidity, 'rainfall': rainfall,
        'lat': lat, 'lon': lon
    })

@app.route('/download_report', methods=['POST'])
def download_report():
    if not is_logged_in():
        return jsonify({'error': 'Please login first'}), 401
    data = request.json or {}
    crops = data.get('crops', [])
    location = data.get('location', {})
    weather = data.get('weather', {})
    soil = data.get('soil', 'loamy')
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    tmp_path = tmp_file.name
    tmp_file.close()
    doc = SimpleDocTemplate(tmp_path)
    styles = getSampleStyleSheet()
    elements = []
    elements.append(Paragraph('Uyirnilam AI - Crop Recommendation Report', styles['Title']))
    elements.append(Spacer(1, 15))
    location_text = f"""
    <b>Location Details</b><br/>
    City/Area: {location.get('city', 'Your Area')}<br/>
    State: {location.get('state', 'Your State')}<br/>
    Latitude: {location.get('lat', 0)}, Longitude: {location.get('lon', 0)}<br/>
    """
    elements.append(Paragraph(location_text, styles['Normal']))
    elements.append(Spacer(1, 10))
    weather_text = f"""
    <b>Weather Conditions</b><br/>
    Temperature: {weather.get('temperature', 0)}C<br/>
    Humidity: {weather.get('humidity', 0)}%<br/>
    Rainfall: {weather.get('rainfall', 0)} mm<br/>
    """
    elements.append(Paragraph(weather_text, styles['Normal']))
    elements.append(Spacer(1, 10))
    soil_text = f"<b>Soil Type:</b> {soil.capitalize()}<br/>"
    elements.append(Paragraph(soil_text, styles['Normal']))
    elements.append(Spacer(1, 10))
    date_text = f"<b>Report Generated:</b> {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}<br/>"
    elements.append(Paragraph(date_text, styles['Normal']))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>Recommended Crops</b>', styles['Heading2']))
    elements.append(Spacer(1, 10))
    for i, crop in enumerate(crops, 1):
        text = f"""
        <b>{i}. {crop['name'].upper()}</b><br/>
        Score: {crop['score']}%<br/>
        Confidence: {crop.get('confidence', 'N/A')}<br/>
        Expected Profit: Rs.{crop['total_profit']}<br/>
        Total Water Required: {crop['total_water']} L<br/>
        Growth Time: {crop['time']} months<br/>
        Irrigation: {crop.get('schedule', 'As needed')}<br/>
        Reason: {crop['reason']}<br/>
        Details: {crop.get('ai_message', 'Suitable for your location')}<br/><br/>
        """
        elements.append(Paragraph(text, styles['Normal']))
        elements.append(Spacer(1, 10))
    elements.append(Spacer(1, 15))
    footer_text = '<b>Note:</b> This report can be used in agricultural offices and banks for verification and planning purposes.'
    elements.append(Paragraph(footer_text, styles['Normal']))
    doc.build(elements)
    return send_file(tmp_path, as_attachment=True, download_name='crop_recommendation_report.pdf')


if __name__ == '__main__':
    print("Uyirnilam AI - Full Stack Starting...")
    print("New Claude endpoints: /analyze-image | /get-pest-data | /random-disease")
    app.run(debug=True, host='0.0.0.0', port=5000)
