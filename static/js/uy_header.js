/**
 * UYIRNILAM AI — SMART SEARCH ENGINE v2.0
 * Real inline results panel | Gemini AI powered details | Full crop info
 * ─────────────────────────────────────────────────────────────────────
 * FILE:  static/js/uy_header.js
 * LOAD:  just before </body> in every template
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // SEARCH MASTER DATASET
    // ═══════════════════════════════════════════════════════════════
    const SEARCH_DATA = [
        // ── Pages ────────────────────────────────────────────────────
        { name: 'Dashboard', type: 'page', icon: '⊞', url: '/dashboard', hint: 'Overview farming dashboard' },
        { name: 'Irrigation', type: 'page', icon: '💧', url: '/irrigation', hint: 'Water & irrigation management' },
        { name: 'Harvest', type: 'page', icon: '🌾', url: '/harvest', hint: 'Crop harvest planning' },
        { name: 'Pest Control', type: 'page', icon: '🛡', url: '/pest', hint: 'Disease detection and pest AI' },
        { name: 'Market', type: 'page', icon: '📈', url: '/market', hint: 'Market prices and trends' },
        { name: 'Profile', type: 'page', icon: '👤', url: '/profile', hint: 'Your farmer profile' },
        { name: 'Notifications', type: 'page', icon: '🔔', url: '/notifications', hint: 'Alerts and notifications' },

        // ── Crops ────────────────────────────────────────────────────
        {
            name: 'Rice', type: 'crop', icon: '🌾', url: '/harvest', hint: 'Paddy, Dhan, Chawal',
            season: 'Kharif (Jun–Nov)', water: '1200 L/acre', profit: '₹50,000/acre', time: '4 months',
            soil: 'Clay / Loamy', states: 'West Bengal, Punjab, UP, AP', diseases: ['Leaf Blast', 'Bacterial Leaf Blight', 'Brown Spot']
        },

        {
            name: 'Wheat', type: 'crop', icon: '🌿', url: '/harvest', hint: 'Gehu, Gehun',
            season: 'Rabi (Nov–Apr)', water: '800 L/acre', profit: '₹40,000/acre', time: '4 months',
            soil: 'Loamy / Clay Loam', states: 'Punjab, Haryana, UP, MP', diseases: ['Leaf Rust', 'Yellow Rust', 'Powdery Mildew']
        },

        {
            name: 'Maize', type: 'crop', icon: '🌽', url: '/harvest', hint: 'Corn, Makka, Bhutta',
            season: 'Kharif (Jun–Sep)', water: '600 L/acre', profit: '₹35,000/acre', time: '3 months',
            soil: 'Sandy Loam / Loamy', states: 'Karnataka, MP, Bihar, Rajasthan', diseases: ['Northern Corn Leaf Blight', 'Fall Armyworm']
        },

        {
            name: 'Cotton', type: 'crop', icon: '🪴', url: '/pest', hint: 'Kapas, Rui',
            season: 'Kharif (May–Dec)', water: '900 L/acre', profit: '₹45,000/acre', time: '6 months',
            soil: 'Black / Alluvial', states: 'Gujarat, Maharashtra, Telangana, AP', diseases: ['Cotton Leaf Curl Virus', 'Bollworm Complex']
        },

        {
            name: 'Sugarcane', type: 'crop', icon: '🎋', url: '/harvest', hint: 'Ganna, Ukh',
            season: 'Annual (Oct–Mar plant)', water: '2000 L/acre', profit: '₹90,000/acre', time: '12 months',
            soil: 'Deep Loamy / Clay', states: 'UP, Maharashtra, Karnataka, TN', diseases: ['Red Rot', 'Whip Smut']
        },

        {
            name: 'Banana', type: 'crop', icon: '🍌', url: '/pest', hint: 'Kela, Plantain',
            season: 'Year-round', water: '1500 L/acre', profit: '₹80,000/acre', time: '10–12 months',
            soil: 'Rich Loamy / Alluvial', states: 'Tamil Nadu, AP, Gujarat, Maharashtra', diseases: ['Panama Wilt', 'Sigatoka Leaf Spot']
        },

        {
            name: 'Mango', type: 'crop', icon: '🥭', url: '/market', hint: 'Aam, Mangoes',
            season: 'Mar–Jun (fruit)', water: '1000 L/acre', profit: '₹100,000/acre', time: '12 months',
            soil: 'Deep Well-drained Loamy', states: 'UP, AP, TN, Maharashtra, Gujarat', diseases: ['Anthracnose', 'Powdery Mildew']
        },

        {
            name: 'Grapes', type: 'crop', icon: '🍇', url: '/market', hint: 'Angur',
            season: 'Jan–May (fruit)', water: '700 L/acre', profit: '₹120,000/acre', time: '10 months',
            soil: 'Sandy Loam / Gravelly', states: 'Maharashtra, Karnataka, AP', diseases: ['Downy Mildew', 'Powdery Mildew']
        },

        {
            name: 'Groundnut', type: 'crop', icon: '🥜', url: '/harvest', hint: 'Peanut, Moongphali',
            season: 'Kharif (Jun–Oct)', water: '550 L/acre', profit: '₹32,000/acre', time: '3–4 months',
            soil: 'Sandy Loam / Red Soil', states: 'Gujarat, AP, Tamil Nadu, Rajasthan', diseases: ['Tikka Leaf Spot', 'Collar Rot']
        },

        {
            name: 'Soybean', type: 'crop', icon: '🌱', url: '/harvest', hint: 'Soya, Soy',
            season: 'Kharif (Jun–Oct)', water: '500 L/acre', profit: '₹30,000/acre', time: '3 months',
            soil: 'Well-drained Loamy', states: 'MP, Maharashtra, Rajasthan', diseases: ['Soybean Rust', 'Yellow Mosaic Virus']
        },

        {
            name: 'Tomato', type: 'crop', icon: '🍅', url: '/pest', hint: 'Vegetable crop',
            season: 'Year-round (irrigated)', water: '700 L/acre', profit: '₹60,000/acre', time: '3–4 months',
            soil: 'Loamy / Sandy Loam', states: 'Karnataka, AP, Maharashtra, UP', diseases: ['Early Blight', 'Late Blight']
        },

        {
            name: 'Potato', type: 'crop', icon: '🥔', url: '/pest', hint: 'Aloo, Batata',
            season: 'Rabi (Oct–Mar)', water: '600 L/acre', profit: '₹40,000/acre', time: '3 months',
            soil: 'Sandy Loam / Loamy', states: 'UP, West Bengal, Bihar, Punjab', diseases: ['Late Blight']
        },

        // ── Diseases ─────────────────────────────────────────────────
        { name: 'Leaf Blast', type: 'disease', icon: '🔬', url: '/pest', hint: 'Rice fungal', crop: 'Rice', severity: 'HIGH' },
        { name: 'Bacterial Leaf Blight', type: 'disease', icon: '🔬', url: '/pest', hint: 'Rice bacterial', crop: 'Rice', severity: 'HIGH' },
        { name: 'Brown Spot', type: 'disease', icon: '🔬', url: '/pest', hint: 'Rice fungal', crop: 'Rice', severity: 'MODERATE' },
        { name: 'Leaf Rust', type: 'disease', icon: '🔬', url: '/pest', hint: 'Wheat fungal', crop: 'Wheat', severity: 'MODERATE' },
        { name: 'Yellow Rust', type: 'disease', icon: '🔬', url: '/pest', hint: 'Wheat rust', crop: 'Wheat', severity: 'HIGH' },
        { name: 'Powdery Mildew', type: 'disease', icon: '🔬', url: '/pest', hint: 'Fungal coating', crop: 'Wheat/Mango/Grape', severity: 'MODERATE' },
        { name: 'Fall Armyworm', type: 'disease', icon: '🐛', url: '/pest', hint: 'Maize pest', crop: 'Maize', severity: 'HIGH' },
        { name: 'Northern Corn Leaf Blight', type: 'disease', icon: '🔬', url: '/pest', hint: 'Maize fungal', crop: 'Maize', severity: 'MODERATE' },
        { name: 'Cotton Leaf Curl Virus', type: 'disease', icon: '🦠', url: '/pest', hint: 'Cotton viral', crop: 'Cotton', severity: 'HIGH' },
        { name: 'Bollworm Complex', type: 'disease', icon: '🐛', url: '/pest', hint: 'Cotton pest', crop: 'Cotton', severity: 'HIGH' },
        { name: 'Panama Wilt', type: 'disease', icon: '🔬', url: '/pest', hint: 'Banana wilt', crop: 'Banana', severity: 'HIGH' },
        { name: 'Sigatoka Leaf Spot', type: 'disease', icon: '🔬', url: '/pest', hint: 'Banana fungal', crop: 'Banana', severity: 'MODERATE' },
        { name: 'Anthracnose', type: 'disease', icon: '🔬', url: '/pest', hint: 'Mango fungal', crop: 'Mango', severity: 'HIGH' },
        { name: 'Red Rot', type: 'disease', icon: '🔬', url: '/pest', hint: 'Sugarcane', crop: 'Sugarcane', severity: 'HIGH' },
        { name: 'Whip Smut', type: 'disease', icon: '🔬', url: '/pest', hint: 'Sugarcane', crop: 'Sugarcane', severity: 'MODERATE' },
        { name: 'Tikka Leaf Spot', type: 'disease', icon: '🔬', url: '/pest', hint: 'Groundnut', crop: 'Groundnut', severity: 'HIGH' },
        { name: 'Soybean Rust', type: 'disease', icon: '🔬', url: '/pest', hint: 'Soybean', crop: 'Soybean', severity: 'HIGH' },
        { name: 'Yellow Mosaic Virus', type: 'disease', icon: '🦠', url: '/pest', hint: 'Soybean viral', crop: 'Soybean', severity: 'HIGH' },
        { name: 'Early Blight', type: 'disease', icon: '🔬', url: '/pest', hint: 'Tomato fungal', crop: 'Tomato', severity: 'MODERATE' },
        { name: 'Late Blight', type: 'disease', icon: '🔬', url: '/pest', hint: 'Tomato/Potato', crop: 'Tomato', severity: 'HIGH' },
        { name: 'Downy Mildew', type: 'disease', icon: '🔬', url: '/pest', hint: 'Grape fungal', crop: 'Grapes', severity: 'HIGH' },
    ];

    const TYPE_LABELS = { page: 'Pages', crop: 'Crops', disease: 'Diseases & Pests' };
    const TYPE_ORDER = ['page', 'crop', 'disease'];
    const MAX_SUGGEST = 5; // items per type in dropdown

    // ═══════════════════════════════════════════════════════════════
    // DOM REFS
    // ═══════════════════════════════════════════════════════════════
    const input = document.getElementById('uySearchInput');
    const dropdown = document.getElementById('uySearchDropdown');
    const clearBtn = document.getElementById('uySearchClear');
    const toggle = document.getElementById('uySearchToggle');
    const wrap = document.getElementById('uySearchWrap');

    if (!input) return; // header not on this page — exit silently

    // Build the result panel and overlay (injected into body once)
    injectResultPanel();

    const panel = document.getElementById('uyResultPanel');
    const overlay = document.getElementById('uyResultOverlay');

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════
    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function highlight(text, q) {
        if (!q) return esc(text);
        const i = text.toLowerCase().indexOf(q.toLowerCase());
        if (i < 0) return esc(text);
        return esc(text.slice(0, i))
            + '<mark class="uy-hl">' + esc(text.slice(i, i + q.length)) + '</mark>'
            + esc(text.slice(i + q.length));
    }

    // ═══════════════════════════════════════════════════════════════
    // SEARCH CORE
    // ═══════════════════════════════════════════════════════════════
    function searchItems(query) {
        const q = query.trim().toLowerCase();
        if (!q) return {};
        const res = {};
        for (const item of SEARCH_DATA) {
            const hay = [item.name, item.hint, item.crop || ''].join(' ').toLowerCase();
            if (!hay.includes(q)) continue;
            if (!res[item.type]) res[item.type] = [];
            if (res[item.type].length < MAX_SUGGEST) res[item.type].push(item);
        }
        return res;
    }

    // ═══════════════════════════════════════════════════════════════
    // DROPDOWN (quick suggestions while typing)
    // ═══════════════════════════════════════════════════════════════
    let focusedIdx = -1, dropItems = [];

    function renderDropdown(query) {
        if (!query.trim()) { closeDropdown(); return; }
        const results = searchItems(query);
        let html = '';

        if (!Object.keys(results).length) {
            html = `<div class="uy-drop-empty">No results for "<strong>${esc(query)}</strong>" — press Enter for AI search</div>`;
        } else {
            for (const type of TYPE_ORDER) {
                if (!results[type]) continue;
                html += `<div class="uy-drop-section"><div class="uy-drop-label">${TYPE_LABELS[type]}</div>`;
                for (const item of results[type]) {
                    html += `<div class="uy-drop-item" data-name="${esc(item.name)}" data-type="${item.type}" tabindex="-1">
            <div class="uy-drop-icon ${item.type}">${item.icon}</div>
            <div class="uy-drop-text">
              <span class="uy-drop-name">${highlight(item.name, query)}</span>
              <span class="uy-drop-hint">${esc(item.hint)}</span>
            </div>
            <span class="uy-drop-tag ${item.type}">${item.type}</span>
          </div>`;
                }
                html += `</div>`;
            }
            html += `<div class="uy-drop-footer">Press <kbd>Enter</kbd> to see full details</div>`;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('open');
        dropItems = Array.from(dropdown.querySelectorAll('.uy-drop-item'));
        focusedIdx = -1;

        dropItems.forEach(el => {
            el.addEventListener('mousedown', e => {
                e.preventDefault();
                openResultPanel(el.dataset.name, el.dataset.type);
            });
        });
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        focusedIdx = -1; dropItems = [];
    }

    function moveFocus(dir) {
        if (!dropItems.length) return;
        dropItems[focusedIdx]?.classList.remove('focused');
        focusedIdx = (focusedIdx + dir + dropItems.length) % dropItems.length;
        dropItems[focusedIdx]?.classList.add('focused');
        dropItems[focusedIdx]?.scrollIntoView({ block: 'nearest' });
    }

    // ═══════════════════════════════════════════════════════════════
    // RESULT PANEL  (full detail modal / side panel)
    // ═══════════════════════════════════════════════════════════════
    function openResultPanel(name, type) {
        closeDropdown();
        input.value = name;
        clearBtn.classList.add('visible');

        const item = SEARCH_DATA.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (!item) return;

        // Show panel with skeleton
        panel.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        panel.innerHTML = buildSkeleton(item);

        // Fetch AI details then fill
        fetchDetails(item).then(details => {
            panel.innerHTML = buildFullPanel(item, details);
            attachPanelListeners();
        }).catch(() => {
            panel.innerHTML = buildFullPanel(item, null);
            attachPanelListeners();
        });
    }

    function closeResultPanel() {
        panel.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function attachPanelListeners() {
        panel.querySelector('#uyPanelClose')?.addEventListener('click', closeResultPanel);
        panel.querySelectorAll('[data-goto]').forEach(el => {
            el.addEventListener('click', () => { window.location.href = el.dataset.goto; });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // GEMINI API CALL  (uses your existing /api/chat-pest endpoint)
    // ═══════════════════════════════════════════════════════════════
    async function fetchDetails(item) {
        const prompt = item.type === 'crop'
            ? `Give complete farming details for ${item.name} crop in India. Return ONLY JSON (no markdown):
{
  "overview": "2 sentence overview",
  "best_season": "planting season",
  "harvest_time": "months to harvest",
  "water_req": "water requirement",
  "expected_profit": "profit per acre in INR",
  "top_states": ["state1","state2","state3"],
  "soil_type": "ideal soil",
  "fertilizer": "main fertilizers needed",
  "common_diseases": ["disease1","disease2"],
  "organic_tips": ["tip1","tip2","tip3"],
  "market_price": "current market price range per quintal",
  "fun_fact": "one interesting fact about this crop"
}`
            : `Give complete details about ${item.name} plant disease that affects ${item.crop || 'crops'} in India. Return ONLY JSON (no markdown):
{
  "overview": "2 sentence overview of this disease",
  "pathogen": "causative organism",
  "symptoms": ["symptom1","symptom2","symptom3"],
  "affected_parts": ["part1","part2"],
  "spread": "how it spreads",
  "severity": "LOW/MODERATE/HIGH",
  "organic_treatment": ["treatment1","treatment2"],
  "chemical_treatment": ["product1 with dosage","product2 with dosage"],
  "prevention": ["tip1","tip2","tip3"],
  "economic_impact": "yield loss percentage"
}`;

        const res = await fetch('/api/chat-pest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                crop: item.type === 'crop' ? item.name : (item.crop || 'General'),
                last_diagnosis: item.type === 'disease' ? item.name : 'None'
            })
        });

        if (!res.ok) throw new Error('API failed');
        const data = await res.json();

        // Extract JSON from the reply text
        const text = data.reply || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON in response');
        return JSON.parse(match[0]);
    }

    // ═══════════════════════════════════════════════════════════════
    // PANEL HTML BUILDERS
    // ═══════════════════════════════════════════════════════════════
    function buildSkeleton(item) {
        return `
    <div class="uyp-header">
      <div class="uyp-header-left">
        <span class="uyp-icon">${item.icon}</span>
        <div>
          <h2 class="uyp-title">${esc(item.name)}</h2>
          <span class="uyp-badge ${item.type}">${item.type}</span>
        </div>
      </div>
      <button class="uyp-close" id="uyPanelClose">✕</button>
    </div>
    <div class="uyp-body">
      <div class="uyp-skeleton-line w80"></div>
      <div class="uyp-skeleton-line w60"></div>
      <div class="uyp-skeleton-grid">
        <div class="uyp-skeleton-card"></div>
        <div class="uyp-skeleton-card"></div>
        <div class="uyp-skeleton-card"></div>
        <div class="uyp-skeleton-card"></div>
      </div>
      <div class="uyp-skeleton-line w100"></div>
      <div class="uyp-skeleton-line w80"></div>
      <div class="uyp-skeleton-line w90"></div>
      <p class="uyp-loading-text">✨ Fetching AI-powered details…</p>
    </div>`;
    }

    function buildFullPanel(item, d) {
        if (item.type === 'crop') return buildCropPanel(item, d);
        if (item.type === 'disease') return buildDiseasePanel(item, d);
        return buildPagePanel(item);
    }

    function buildCropPanel(item, d) {
        const season = d?.best_season || item.season || '—';
        const water = d?.water_req || item.water || '—';
        const profit = d?.expected_profit || item.profit || '—';
        const time = d?.harvest_time || item.time || '—';
        const soil = d?.soil_type || item.soil || '—';
        const states = d?.top_states || (item.states ? item.states.split(', ') : []);
        const diseases = d?.common_diseases || item.diseases || [];
        const overview = d?.overview || `${item.name} is an important crop in Indian agriculture.`;
        const fertilizer = d?.fertilizer || '—';
        const marketPrice = d?.market_price || '—';
        const funFact = d?.fun_fact || '';
        const organicTips = d?.organic_tips || [];

        return `
    <div class="uyp-header">
      <div class="uyp-header-left">
        <span class="uyp-icon">${item.icon}</span>
        <div>
          <h2 class="uyp-title">${esc(item.name)}</h2>
          <span class="uyp-badge crop">Crop</span>
        </div>
      </div>
      <button class="uyp-close" id="uyPanelClose">✕</button>
    </div>

    <div class="uyp-body">
      <p class="uyp-overview">${esc(overview)}</p>

      <div class="uyp-stat-grid">
        <div class="uyp-stat"><span class="uyp-stat-label">📅 Season</span><span class="uyp-stat-val">${esc(season)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">⏱ Harvest</span><span class="uyp-stat-val">${esc(time)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">💧 Water</span><span class="uyp-stat-val">${esc(water)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">💰 Profit</span><span class="uyp-stat-val crop-profit">${esc(profit)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">🌍 Soil</span><span class="uyp-stat-val">${esc(soil)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">📦 Market</span><span class="uyp-stat-val">${esc(marketPrice)}</span></div>
      </div>

      ${states.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🗺 Top Growing States</h4>
        <div class="uyp-tags">${states.map(s => `<span class="uyp-tag blue">${esc(s)}</span>`).join('')}</div>
      </div>` : ''}

      ${fertilizer !== '—' ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🧪 Fertilizer</h4>
        <p class="uyp-text">${esc(fertilizer)}</p>
      </div>` : ''}

      ${organicTips.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🌿 Organic Farming Tips</h4>
        <ul class="uyp-list green">${organicTips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>` : ''}

      ${diseases.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">⚠️ Common Diseases</h4>
        <div class="uyp-tags">${diseases.map(d => `<span class="uyp-tag red">${esc(d)}</span>`).join('')}</div>
      </div>` : ''}

      ${funFact ? `
      <div class="uyp-funfact">
        <span class="uyp-funfact-icon">💡</span>
        <p>${esc(funFact)}</p>
      </div>` : ''}

      <div class="uyp-actions">
        <button class="uyp-btn primary" data-goto="${item.url}">Go to ${esc(item.name)} Page →</button>
        <button class="uyp-btn secondary" data-goto="/pest">Check Diseases</button>
      </div>
    </div>`;
    }

    function buildDiseasePanel(item, d) {
        const overview = d?.overview || `${item.name} is a plant disease affecting ${item.crop}.`;
        const pathogen = d?.pathogen || '—';
        const symptoms = d?.symptoms || [];
        const parts = d?.affected_parts || [];
        const spread = d?.spread || '—';
        const severity = d?.severity || item.severity || 'MODERATE';
        const organic = d?.organic_treatment || [];
        const chemical = d?.chemical_treatment || [];
        const prevention = d?.prevention || [];
        const impact = d?.economic_impact || '—';

        const sevColor = severity === 'HIGH' ? 'red' : severity === 'MODERATE' ? 'orange' : 'green';

        return `
    <div class="uyp-header">
      <div class="uyp-header-left">
        <span class="uyp-icon">${item.icon}</span>
        <div>
          <h2 class="uyp-title">${esc(item.name)}</h2>
          <span class="uyp-badge disease">Disease</span>
          ${item.crop ? `<span class="uyp-badge blue" style="margin-left:6px">${esc(item.crop)}</span>` : ''}
        </div>
      </div>
      <button class="uyp-close" id="uyPanelClose">✕</button>
    </div>

    <div class="uyp-body">
      <p class="uyp-overview">${esc(overview)}</p>

      <div class="uyp-stat-grid">
        <div class="uyp-stat"><span class="uyp-stat-label">🦠 Pathogen</span><span class="uyp-stat-val">${esc(pathogen)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">🌡 Severity</span><span class="uyp-stat-val sev-${sevColor}">${esc(severity)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">💸 Yield Loss</span><span class="uyp-stat-val">${esc(impact)}</span></div>
        <div class="uyp-stat"><span class="uyp-stat-label">🌱 Affects</span><span class="uyp-stat-val">${esc(item.crop || '—')}</span></div>
      </div>

      ${symptoms.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🔍 Symptoms</h4>
        <ul class="uyp-list orange">${symptoms.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>` : ''}

      ${parts.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🍃 Affected Parts</h4>
        <div class="uyp-tags">${parts.map(p => `<span class="uyp-tag orange">${esc(p)}</span>`).join('')}</div>
      </div>` : ''}

      ${spread !== '—' ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">💨 How It Spreads</h4>
        <p class="uyp-text">${esc(spread)}</p>
      </div>` : ''}

      ${organic.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🌿 Organic Treatment</h4>
        <ul class="uyp-list green">${organic.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>` : ''}

      ${chemical.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🧪 Chemical Treatment</h4>
        <ul class="uyp-list red">${chemical.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>` : ''}

      ${prevention.length ? `
      <div class="uyp-section">
        <h4 class="uyp-section-title">🛡 Prevention</h4>
        <ul class="uyp-list blue">${prevention.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>` : ''}

      <div class="uyp-actions">
        <button class="uyp-btn primary" data-goto="/pest">Go to Pest Control →</button>
        <button class="uyp-btn secondary" data-goto="/dashboard">Dashboard</button>
      </div>
    </div>`;
    }

    function buildPagePanel(item) {
        return `
    <div class="uyp-header">
      <div class="uyp-header-left">
        <span class="uyp-icon">${item.icon}</span>
        <div><h2 class="uyp-title">${esc(item.name)}</h2><span class="uyp-badge page">Page</span></div>
      </div>
      <button class="uyp-close" id="uyPanelClose">✕</button>
    </div>
    <div class="uyp-body">
      <p class="uyp-overview">${esc(item.hint)}</p>
      <div class="uyp-actions">
        <button class="uyp-btn primary" data-goto="${item.url}">Open ${esc(item.name)} →</button>
      </div>
    </div>`;
    }

    // ═══════════════════════════════════════════════════════════════
    // INJECT PANEL + OVERLAY + STYLES INTO DOM
    // ═══════════════════════════════════════════════════════════════
    function injectResultPanel() {
        // Overlay
        const ov = document.createElement('div');
        ov.id = 'uyResultOverlay';
        ov.addEventListener('click', closeResultPanel);
        document.body.appendChild(ov);

        // Panel
        const pn = document.createElement('div');
        pn.id = 'uyResultPanel';
        document.body.appendChild(pn);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
      /* ── Highlight ── */
      .uy-hl { background: transparent; color: #10b981; font-weight: 700; }

      /* ── Dropdown enhancements ── */
      .uy-drop-hint { font-size: 11px; color: rgba(148,163,184,0.55); display: block; }
      .uy-drop-text { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
      .uy-drop-footer {
        padding: 8px 14px; text-align: center;
        font-size: 11px; color: rgba(148,163,184,0.4); border-top: 1px solid rgba(255,255,255,0.04);
      }
      .uy-drop-footer kbd {
        background: rgba(255,255,255,0.08); border-radius: 4px;
        padding: 1px 5px; font-size: 10px; color: rgba(148,163,184,0.7);
        border: 1px solid rgba(255,255,255,0.1);
      }

      /* ── Overlay ── */
      #uyResultOverlay {
        display: none; position: fixed; inset: 0; z-index: 99998;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      }
      #uyResultOverlay.open { display: block; animation: uyFadeIn .2s ease; }

      /* ── Result Panel ── */
      #uyResultPanel {
        display: none; position: fixed; top: 0; right: 0; bottom: 0;
        width: min(520px, 100vw); z-index: 99999;
        background: #041c17; border-left: 1px solid rgba(255,255,255,0.07);
        overflow-y: auto; flex-direction: column;
        box-shadow: -20px 0 60px rgba(0,0,0,0.5);
      }
      #uyResultPanel.open {
        display: flex; flex-direction: column;
        animation: uySlideIn .25s cubic-bezier(.4,0,.2,1);
      }
      @keyframes uyFadeIn { from{opacity:0} to{opacity:1} }
      @keyframes uySlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

      /* ── Panel Header ── */
      .uyp-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
        position: sticky; top: 0; background: #041c17; z-index: 2;
      }
      .uyp-header-left { display: flex; align-items: center; gap: 14px; }
      .uyp-icon { font-size: 36px; line-height: 1; }
      .uyp-title { font-size: 22px; font-weight: 800; color: #ecfdf5; letter-spacing: -0.03em; margin: 0 0 4px; }
      .uyp-close {
        width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04); color: rgba(148,163,184,0.7); font-size: 14px;
        cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: all .15s;
      }
      .uyp-close:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }

      /* ── Badges ── */
      .uyp-badge {
        display: inline-block; font-size: 10px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase;
        padding: 2px 8px; border-radius: 6px;
      }
      .uyp-badge.crop    { background: rgba(16,185,129,0.15); color: #10b981; }
      .uyp-badge.disease { background: rgba(239,68,68,0.15);  color: #f87171; }
      .uyp-badge.page    { background: rgba(59,130,246,0.15); color: #60a5fa; }
      .uyp-badge.blue    { background: rgba(59,130,246,0.15); color: #60a5fa; }

      /* ── Body ── */
      .uyp-body { padding: 20px 24px 32px; display: flex; flex-direction: column; gap: 18px; }
      .uyp-overview { font-size: 14px; color: rgba(236,253,245,0.8); line-height: 1.65; margin: 0; }
      .uyp-text     { font-size: 13px; color: rgba(236,253,245,0.7); line-height: 1.6; margin: 0; }

      /* ── Stat Grid ── */
      .uyp-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .uyp-stat {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px;
      }
      .uyp-stat-label { font-size: 10.5px; color: rgba(148,163,184,0.55); font-weight: 600; letter-spacing: .05em; }
      .uyp-stat-val   { font-size: 13.5px; font-weight: 700; color: #ecfdf5; }
      .uyp-stat-val.crop-profit { color: #10b981; }
      .uyp-stat-val.sev-red    { color: #f87171; }
      .uyp-stat-val.sev-orange { color: #fb923c; }
      .uyp-stat-val.sev-green  { color: #4ade80; }

      /* ── Sections ── */
      .uyp-section { display: flex; flex-direction: column; gap: 8px; }
      .uyp-section-title {
        font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
        color: rgba(148,163,184,0.6); margin: 0;
      }
      .uyp-list { margin: 0; padding: 0 0 0 16px; display: flex; flex-direction: column; gap: 5px; }
      .uyp-list li { font-size: 13px; color: rgba(236,253,245,0.8); line-height: 1.5; }
      .uyp-list.green li::marker { color: #10b981; }
      .uyp-list.red   li::marker { color: #f87171; }
      .uyp-list.orange li::marker { color: #fb923c; }
      .uyp-list.blue  li::marker { color: #60a5fa; }

      /* ── Tags ── */
      .uyp-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .uyp-tag {
        font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 8px;
      }
      .uyp-tag.blue   { background: rgba(59,130,246,0.12); color: #93c5fd; }
      .uyp-tag.red    { background: rgba(239,68,68,0.12);  color: #fca5a5; }
      .uyp-tag.orange { background: rgba(251,146,60,0.12); color: #fdba74; }
      .uyp-tag.green  { background: rgba(16,185,129,0.12); color: #6ee7b7; }

      /* ── Fun Fact ── */
      .uyp-funfact {
        display: flex; gap: 10px; align-items: flex-start;
        background: rgba(232,195,81,0.06); border: 1px solid rgba(232,195,81,0.15);
        border-radius: 12px; padding: 14px;
      }
      .uyp-funfact-icon { font-size: 20px; flex-shrink: 0; }
      .uyp-funfact p { font-size: 13px; color: rgba(232,195,81,0.9); line-height: 1.6; margin: 0; }

      /* ── Actions ── */
      .uyp-actions { display: flex; gap: 10px; flex-wrap: wrap; padding-top: 4px; }
      .uyp-btn {
        padding: 11px 20px; border-radius: 12px; font-size: 13.5px; font-weight: 700;
        cursor: pointer; border: none; transition: all .15s; font-family: inherit;
      }
      .uyp-btn.primary {
        background: #10b981; color: #020f0c;
        box-shadow: 0 0 20px rgba(16,185,129,0.25);
      }
      .uyp-btn.primary:hover { background: #059669; transform: translateY(-1px); }
      .uyp-btn.secondary {
        background: rgba(255,255,255,0.06); color: #ecfdf5;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .uyp-btn.secondary:hover { background: rgba(255,255,255,0.1); }

      /* ── Skeleton ── */
      .uyp-skeleton-line, .uyp-skeleton-card {
        background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
        background-size: 200% 100%; border-radius: 8px;
        animation: uySkel 1.4s infinite;
      }
      .uyp-skeleton-line { height: 14px; margin-bottom: 10px; }
      .uyp-skeleton-line.w80 { width: 80%; }
      .uyp-skeleton-line.w60 { width: 60%; }
      .uyp-skeleton-line.w100 { width: 100%; }
      .uyp-skeleton-line.w90 { width: 90%; }
      .uyp-skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
      .uyp-skeleton-card { height: 70px; border-radius: 12px; }
      @keyframes uySkel { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      .uyp-loading-text {
        text-align: center; font-size: 13px; color: rgba(148,163,184,0.4);
        animation: uyPulse 1.5s infinite;
      }
      @keyframes uyPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

      /* ── Mobile ── */
      @media (max-width: 600px) {
        #uyResultPanel { width: 100vw; border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
        .uyp-stat-grid { grid-template-columns: 1fr 1fr; }
      }
    `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT WIRING
    // ═══════════════════════════════════════════════════════════════
    let debounce;

    input.addEventListener('input', () => {
        const q = input.value;
        clearBtn.classList.toggle('visible', q.length > 0);
        clearTimeout(debounce);
        debounce = setTimeout(() => renderDropdown(q), 90);
    });

    input.addEventListener('focus', () => {
        if (input.value.trim()) renderDropdown(input.value);
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
        if (e.key === 'Escape') { closeDropdown(); input.blur(); closeResultPanel(); }
        if (e.key === 'Enter') {
            e.preventDefault();
            const focused = dropdown.querySelector('.uy-drop-item.focused');
            if (focused) {
                openResultPanel(focused.dataset.name, focused.dataset.type);
            } else if (input.value.trim()) {
                // Direct open: find best match
                const q = input.value.trim().toLowerCase();
                const best = SEARCH_DATA.find(d => d.name.toLowerCase().includes(q));
                if (best) openResultPanel(best.name, best.type);
            }
        }
    });

    clearBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = '';
        clearBtn.classList.remove('visible');
        closeDropdown();
        input.focus();
    });

    document.addEventListener('mousedown', e => {
        if (!wrap.contains(e.target) && !document.getElementById('uyResultPanel')?.contains(e.target)) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeResultPanel();
    });

    // Mobile expand
    function isMobile() { return window.innerWidth <= 768; }
    if (isMobile()) wrap.classList.add('mobile-collapsed');
    toggle.addEventListener('click', () => {
        if (!isMobile()) { input.focus(); return; }
        wrap.classList.remove('mobile-collapsed');
        wrap.classList.add('mobile-expanded');
        input.focus();
    });
    document.addEventListener('mousedown', e => {
        if (isMobile() && !wrap.contains(e.target) && wrap.classList.contains('mobile-expanded')) {
            wrap.classList.remove('mobile-expanded');
            wrap.classList.add('mobile-collapsed');
            closeDropdown();
        }
    });
    window.addEventListener('resize', () => {
        if (!isMobile()) wrap.classList.remove('mobile-collapsed', 'mobile-expanded');
        else if (!wrap.classList.contains('mobile-expanded')) wrap.classList.add('mobile-collapsed');
    });

})();

// ═══════════════════════════════════════════════════════════════
// CROSS-PAGE CROP STATE MANAGEMENT
// Shared across all 5 modules via localStorage.
// Usage:
//   Write: window.syncActiveCrop('rice', 'Rice', '/path/to/rice.jpg');
//   Read:  const crop = window.getActiveCrop(); // { name, label, img }
// ═══════════════════════════════════════════════════════════════
(function () {
    'use strict';

    const CROP_KEY = 'uyirnilam_active_crop';

    /**
     * Persist the active crop selection globally.
     * @param {string} name  - Machine name e.g. 'rice'
     * @param {string} label - Display label e.g. 'Rice'
     * @param {string} [img] - Optional crop image URL/path
     */
    window.syncActiveCrop = function (name, label, img) {
        if (!name) return;
        try {
            const payload = { name: name.toLowerCase(), label: label || name, img: img || '', ts: Date.now() };
            localStorage.setItem(CROP_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn('[UY] Could not sync active crop:', e);
        }
    };

    /**
     * Retrieve the persisted active crop.
     * @returns {{ name: string, label: string, img: string, ts: number } | null}
     */
    window.getActiveCrop = function () {
        try {
            const raw = localStorage.getItem(CROP_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    };

    /**
     * Clear the active crop from storage (called on logout).
     */
    window.clearActiveCrop = function () {
        try { localStorage.removeItem(CROP_KEY); } catch (e) { /* silent */ }
    };

    // Auto-clear crop state on logout navigation
    document.addEventListener('DOMContentLoaded', function () {
        const logoutBtn = document.querySelector('.uy-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                window.clearActiveCrop();
            });
        }
    });

})();
