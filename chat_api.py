import os
import time
import anthropic
from collections import defaultdict
from functools import wraps
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

# Load env in case this module is imported before main app load_dotenv
load_dotenv()

# ── Blueprint ──────────────────────────────────────────────
chat_bp = Blueprint('chat', __name__)

# ── Claude setup ───────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '').strip()
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

SYSTEM_PROMPT = """You are UyirBot, an expert AI agricultural assistant
for Indian farmers. You specialize in:
- Crop recommendations based on soil, season, and location
- Irrigation scheduling and water management
- Pest & disease identification and organic/chemical treatments
- Harvest timing and yield optimization
- Market prices and MSP information for Indian crops

Rules:
- Be concise, helpful, and practical
- Use simple language (mix English with Tamil words occasionally like Vanakkam, Nandri)
- Always consider Indian farming context (monsoon seasons, local crops like paddy, sugarcane, cotton, turmeric)
- Provide actionable advice with specific quantities/schedules when relevant
- Format responses clearly: use bullet points for lists, **bold** for key terms
- Keep responses under 200 words unless a detailed plan is needed"""

# ── Rate limiter ───────────────────────────────────────────
_rate_store = defaultdict(list)
RATE_LIMIT  = 20
RATE_WINDOW = 60

def rate_limited(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = request.remote_addr or 'unknown'
        now = time.time()
        _rate_store[ip] = [t for t in _rate_store[ip] if t > now - RATE_WINDOW]
        if len(_rate_store[ip]) >= RATE_LIMIT:
            return jsonify({'error': 'Too many requests. Please wait.'}), 429
        _rate_store[ip].append(now)
        return f(*args, **kwargs)
    return decorated

# ── Route ──────────────────────────────────────────────────
@chat_bp.route('/chat', methods=['POST'])
@rate_limited
def chat():
    try:
        if not client:
            return jsonify({'error': 'Anthropic API key is missing. Please check your .env file.'}), 503

        data = request.get_json(silent=True) or {}
        user_message = str(data.get('message', '')).strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required.'}), 400
        if len(user_message) > 500:
            return jsonify({'error': 'Message too long (max 500 chars).'}), 400

        raw_history = data.get('history', [])
        if not isinstance(raw_history, list):
            raw_history = []

        # Build conversation history for Claude
        messages = []
        for item in raw_history[-10:]:
            if isinstance(item, dict) and 'role' in item and 'content' in item:
                # Claude expects 'user' and 'assistant' roles
                role = 'assistant' if item['role'] == 'assistant' else 'user'
                messages.append({"role": role, "content": str(item['content'])[:1000]})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Priority Model for this account
        model_to_use = "claude-sonnet-4-6"
        response = client.messages.create(
            model=model_to_use,
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=messages,
            temperature=0.7
        )
        reply = response.content[0].text.strip()

        return jsonify({'reply': reply})

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"[UyirBot Error] Full Traceback:\n{error_details}")
        return jsonify({'error': str(e), 'traceback': error_details}), 503

# ── Health check ───────────────────────────────────────────
@chat_bp.route('/chat/health', methods=['GET'])
def chat_health():
    return jsonify({'status': 'ok', 'model': 'claude-sonnet-4-6'})