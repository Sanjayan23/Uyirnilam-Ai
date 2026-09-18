# 🌾 Uyirnilam AI — Page-by-Page Functional Map

A read-only technical map of the entire codebase. For every page and endpoint it documents **what actually runs**, whether the behavior is **REAL**, **SIMULATED** (local JS), or **HARDCODED** (fake/inline data), which **APIs/AI models** it talks to, its **storage keys**, and how data flows **across pages**.

Legend:
- 🟢 **REAL** — hits a live backend endpoint / external API with data returned.
- 🟡 **SIMULATED** — client-side math/render; no backend; not fabricated, just computed locally.
- 🔴 **HARDCODED** — fake/static data baked into the code; not live.
- ⚪ **PURE UI** — layout/interaction only, no data.

---

## 0. Cross-Cutting Ground Truth (verified, not inferred)

| Fact | Status | Detail |
|---|---|---|
| Flask backend | exists | `app.py` (78 KB) + `chat_api.py` blueprint |
| Server entrypoint | ✅ | `Procfile`: `gunicorn app:app`; `render.yaml` same; `vercel.json` → `app.py` |
| Python version | ✅ | `runtime.txt`: `python-3.11.0` |
| Database | ✅ | SQLite `instance/uyirnilam.db`; SQLAlchemy models `User`, `Prediction`, `Notification` |
| **`static/css/smooth-scroll.css`** | ❌ **MISSING (404)** | Referenced by `harvest.html`, `irrigation_new.html`, `notifications.html` `+` their `.smooth-scroll-wrapper` markup. Companion JS `smooth-scroll-enhancer.js` exists but its edge-fade styling is dead. |
| `nav-transitions.css` | ✅ cleanly removed | Zero references remain (deletion carried out) |
| `static/css/` inventory | ✅ | `chatbot.css`, `custom.css`, `header_styles.css`, `mobile-responsive.css`, `popup.css` |
| PWA manifest | ⚠️ partial | `static/manifest.json` exists, `<link rel="manifest">` on 9 templates — **but no service worker**, so no real offline capability |
| Crop images | ✅ | `static/images/crop/` — all 14 present (`barley` is `.jpg`, rest `.png`) |
| `models/crop_model.pkl` | ⚠️ **unused** | `app.py` trains a fresh RandomForest at startup from `data/crop_data.csv`; the pickle is never `pickle.load()`-ed |
 **🔑 `WEATHER_API_KEY`** is loaded from the environment; no hardcoded value is present..

### AI / ML model truth table

| Model | Where | Route(s) | Notes |
|---|---|---|---|
| **RandomForestClassifier** | `app.py:108-111` | `/api/predict` | retrained at startup on 14-row CSV; no Gemini dependency (recently decoupled) |
| **Claude `claude-opus-4-5`** | `app.py:1057` | `/analyze-image` | vision pest/disease diagnosis |
| **Claude `claude-sonnet-4-6`** | `chat_api.py:85` | `/chat` | UyirBot assistant (max 512 tokens, rate-limited 20/60s/IP) |
| **Gemini `gemini-2.5-flash`** | `app.py` | `/api/market-trends`, `/api/live-prices`, `/api/analyze-pest`, `/api/chat-pest` | market data, prices, pest enrich |
| **OpenWeatherMap** | `app.py:144` | `/api/predict` (weather) | hardcoded-key fallback |
| **data.gov.in Agmarknet** | `app.py:745` | `/api/live-prices` | India mandi prices, gemini-fills gaps |

### Endpoint ↔ template call matrix (the important one)

| Endpoint | Defined | Called by frontend? |
|---|---|---|
| `/api/update-profile` (POST) | ✅ | ✅ `profile.html` |
| `/api/market-trends` (GET) | ✅ | ✅ `market.html` |
| `/api/live-prices` (GET) | ✅ | ✅ `market.html` ticker |
| `/analyze-image` (POST) | ✅ | ✅ `pest_control.js` |
| `/chat` (POST) | ✅ `chat_api.py` | ✅ `chatbot.js` (all pages) |
| `/api/predict` (POST) | ✅ | ✅ `dashboard.html` |
| `/random-disease` (GET) | ✅ | ❌ **neutered** — honest 503 retry, never fabricates |
| `/api/analyze-pest` (POST) | ✅ | ❌ legacy, unused |
| `/api/chat-pest` (POST) | ✅ | ⚠️ only `uy_header.js` search panel |
| `/get-pest-data` (POST) | ✅ | ❌ legacy, unused |
| `/download_report` (POST) | ✅ | ❌ unused — pages use client-side `pdfGenerator.js` instead |

---

## 1. Auth Pages

### `/login` — `login.html`
- **Flow:** form → `POST /login_submit` → verifies `check_password_hash` → sets session vars → redirect `/dashboard`. 🔴/🟢 REAL (DB auth).
- **API/AI:** none.
- **Storage:** none (server session only).
- **Notes:** loads `main.js`, `chatbot.js`, `popup.js`, `uy_header.js`. Not-logged-in guard.

### `/signup` — `signup.html`
- **Flow:** form → `POST /signup_submit` → `generate_password_hash` → creates `User` row. 🟢 REAL.
- **API/AI:** none.
- **Storage:** none.

### `/logout`
- **Flow:** `session.clear()` → redirect `/login`. Also removes `uyirnilam_active_crop` on `.uy-logout-btn` click. 🟢 REAL.

---

## 2. `/` + Dashboard Family

### `/` — `home()`
- Redirects to `/dashboard` if logged in, else `/login`. ⚪ PURE.

### `/dashboard` — `dashboard.html` (core landing)
- **Purpose:** crop recommendation form + top-5 results + charts + weather.
- **Predict flow:** form → geolocation → `POST /api/predict` → backend `get_weather` (OpenWeatherMap) + `estimate_soil` + RandomForest `predict_proba` → top-5 crops w/ scores → saved to `Prediction` + `Notification` DB. 🟢 REAL.
- **Writes storage:** `recommendedCrops` (the single most important cross-page key — feeds Irrigation, Market, Harvest).
- **Reads storage:** `landSize`, `plantingDate`, selected crop.
- **Charts:** Chart.js via `charts.js` (bar/line/pie/radar helpers). 🟡 SIMULATED (visualizes returned data).
- **Scripts:** `charts.js`, `main.js`, `chatbot.js`, `popup.js`, `uy_header.js`, `pdfGenerator.js`.
- **Note:** 404/500 error handlers also render `dashboard.html`.

### `/create` — `create.html`
- **Purpose:** standalone crop-prediction form page.
- **Flow:** → `POST /api/predict` (same backend as dashboard). 🟢 REAL.
- **API/AI:** RandomForest + weather.
- **Storage:** reads/writes `recommendedCrops`.

### `/profile` — `profile.html`
- **Purpose:** edit profile (name, phone, email, occupation, location, photo, password).
- **Flow:** form → `POST /api/update-profile` → updates **real DB model** `User` + optionally re-hashes password + updates `session['user_photo']`. 🟢 REAL.
- **Browser APIs:** `FileReader` (photo→base64), `navigator.geolocation` (writes raw "lat,lng" — no reverse-geocode).
- **Storage:** none (uses Jinja vars + session).
- **Bug note:** photo stored as huge base64 data URL directly in DB; no resize/compress; `detectLoc` writes coordinates not a readable place.

---

## 3. Feature Pages

### `/irrigation` — `irrigation_new.html`
- **Purpose:** irrigation planning — top-5 recommended crops, 14-crop matrix, per-crop water schedules, weather/AQI "Hydro-Intelligence" hub, PDF, "AI reminders".
- **Backend calls:** **NONE.** ⚪ All planning is client-side.
- **External (browser-direct, NOT proxied):** Open-Meteo weather, Open-Meteo AQI, Nominatim reverse-geocode. 🟢 REAL external.
- **Data source:** hardcoded `irrigationDatabase` (14 crops — water requirement, frequency, method, stages, weekly schedule, tips). 🔴 HARDCODED.
- **Writes storage:** `selected_irrigation_crops`, `activePlans` → **consumed by Harvest page.**
- **Reads storage:** `recommendedCrops` (from dashboard), `plantingDate`, `landSize`.
- **SIMULATED/stubs:** `viewSpecificCrop` fabricates score 85 + ₹50,000 profit for non-recommended crops; `setReminder` = fake 1.5s spinner "Linked to Uyirnilam AI", nothing persisted. 🟡/🔴.
- **Bugs:** `openStageDetails` referenced but **undefined** (throws on click); `landSize` `.toFixed(1)` throws when unset.
- **PDF:** `downloadPlan` → `generatePDF` (client-side jsPDF+html2canvas). Not the `/download_report` server endpoint.

### `/harvest` — `harvest.html`
- **Purpose:** harvest timing — per-crop growth timeline, countdown, revenue/ROI forecast charts, reminders, PDF report.
- **Backend calls:** **NONE.** ⚪ 100% client-side.
- **External:** only Open-Meteo weather + AQI + Nominatim (browser-direct). 🟢 external.
- **Data source:** hardcoded 14-crop `cropDatabase`; economics in hardcoded `yieldPerAcre` + `basePricePerUnit` lookups; revenue from a **sigmoid growth curve seeded by crop name**; ROI doughnut = 40% investment / 60% profit. 🔴 HARDCODED.
  - ⚠️ Two conflicting `yieldPerAcre` tables (line 940 vs in-chart ~1730).
- **Storage reads:** `activePlans`, `selected_irrigation_crops` (from Irrigation), `recommendedCrops` (fallback), `plantingDate`, `landSize`.
- **Storage writes:** `harvestTimers` (only localStorage key this page writes) — `{cropKey: {startTime, durationDays, notified75, notified100}}`.
- **Countdown/reminders:** `updateCardCountdown` — real-time seconds countdown + progress bar; fires `alert()` at 75%/100% gated by flags. 🟡 SIMULATED.
- **Stubs:** `setHarvestReminder` = hardcoded `alert()` only, no scheduling. 🔴.
- **Scripts:** `charts.js`, `smooth-scroll-enhancer.js`, `nav-enhanced.js`, `main.js`, `chatbot.js`, `popup.js`, `uy_header.js`, `pdfGenerator.js`.
- **PDF:** `downloadReport` → `generatePDF` (client-side).
- **Note:** `selectedCrop` is NOT a localStorage key here — selection lives in-memory `selectedCrops[]`; cross-page sync via `window.syncActiveCrop` (defined in `uy_header.js`).

### `/pest` — `pest.html` (the flagship feature)
- **Purpose:** AI vision pest & disease detection — upload leaf image → diagnosis (disease, severity, confidence, symptoms, causes, organic/chemical treatments, prevention).
- **Backend call:** `POST /analyze-image` → Claude **`claude-opus-4-5`** vision via `claude_client.messages.create()`; parses JSON; enrichment via server `PEST_DISEASE_DB.find_pest_disease()` (source `database`) or `PEST_GENERIC_FALLBACK` (source `ai_generic`). 🟢 **REAL** (when `ANTHROPIC_API_KEY` set).
- **Honest fail-soft:** if no key / API fails / 60s timeout → "Analysis unavailable" banner + retry. **Never fabricates a diagnosis** (recently hardened). ⚪.
- **Browser APIs:** `FileReader` (base64), `AbortController` (60s).
- **Storage (localStorage):** writes `uyirnilam_pest_result` + `uyirnilam_pest_image`; restores both if <24h old; clears on reset.
- **Scripts:** `pest_data.js` (client `window.PEST_DATA` — **legacy, pest_control.js never reads it**), `pest_control.js` (active engine), `main.js`, `nav-enhanced.js`, `popup.js`, `uy_header.js`, `pdfGenerator.js`, `chatbot.js`.
- **Dead server endpoints (defined, unused):** `/api/analyze-pest`, `/api/chat-pest` (used only by uy_header search), `/get-pest-data`, `/random-disease` (neutered).
- **Marketing copy:** "Detection Accuracy 92.8% / 10+ / 32+" are hardcoded HTML numbers.

### `/market` — `market.html`
- **Purpose:** market trends dashboard — live price ticker, top-5 crops, 5-day price cards, Chart.js price chart, demand forecast, MSP, nearby markets, buyers, price alerts, listing.
- **Backend calls (REAL):**
  - `GET /api/market-trends?crop=X` → Gemini `gemini-2.5-flash` market JSON (5-day prices, demand, MSP, markets, buyers). On failure falls back to offline cache.
  - `GET /api/live-prices?country=X` → backend tries data.gov.in Agmarknet per crop (gap-filled by Gemini country prices) → hardcoded `fallback_prices` labeled "MSP Reference"; 30-min in-memory cache; ticker auto-refresh 5 min. 🟢.
- **🟡/🔴 SIMULATED/HARDCODED parts:**
  - 30d/90d price charts generated with `Math.random()`.
  - MSP values, nearby markets, buyers (names/distances/phones) are **fabricated** static `DB` strings.
  - `openMap`, `contactBuyer`, `requestQuote`, `setPriceAlert`, `applyScheme`, `postListing` are **`alert()` stubs** — nothing persisted/sent. 🔴.
- **Storage reads:** `selectedCrop`, `recommendedCrops`, `landSize`, `activePlans`, `allCropsData`.
- **Charts:** Chart.js (used here, real canvas `#priceChart`).
- **Bug:** `notification_count` misused as a "Selling Tips" numbering label; `toggleAllCrops`/`toggleSidebar` defined twice (later wins).

### `/notifications` — `notifications.html`
- **Purpose:** notifications list + modal panel.
- **Backend call:** **NONE** despite route passing real DB `notifications` (last 20 `Notification` rows). ⚪ The template **discards the Jinja var and renders a hardcoded `NOTIFS[]` array** (10 static items) instead. 🔴 HARDCODED.
- **Read/unread state:** in-memory only — **does not persist** across reloads; "Mark all read" never touches the DB.
- **Storage:** none.
- **Scripts:** `smooth-scroll-enhancer.js`, `uy_header.js` (×2—duplicate), `chatbot.js`, `popup.js`.
- **Bug:** same missing `smooth-scroll.css` reference.
- **Dead data:** the backend `Notification` DB query is computed and passed but entirely unused.

---

## 4. Global Chrome (loaded on ~all pages)

### Header — `uy_header.js` (2 IIFEs)
- **Part A — Smart Search:** static `SEARCH_DATA` (7 pages, 13 crops, 21 diseases) → typeahead dropdown → detail panel. AI enrichment via `POST /api/chat-pest` (Gemini) with static fallback; bails silently if `#uySearchInput` absent.
- **Part B — Cross-page crop state:** exposes `window.syncActiveCrop(name,label,img)`, `window.getActiveCrop()`, `window.clearActiveCrop()` → localStorage `uyirnilam_active_crop`. This is the **main cross-module handoff key** (also `state.keys.ACTIVE_CROP` in `main.js`). Cleared on logout.

### Chatbot — `chatbot.js` (UyirBot)
- Floating widget on every page. POSTs `/chat` → Claude-sonnet assistant (rate-limited). sessionStorage `uyir_chat_history` (last 40 msgs). Honest failure message.

### `popup.js`
- Welcome popup (once/session) + exit-intent Thank-You popup. sessionStorage `uyir_welcome_shown`, `exitShown`. Zero deps.

### `main.js`
- Global utilities: `navTo` (overlay), toasts, `apiCall`, `formatCurrency`, geolocation (Pune fallback 18.52, 73.85), storage/session wrappers, `window.uyirnilam.state.keys`.
- **Conflict:** `navTo`/`isNavigating` collide with `nav-enhanced.js`; on harvest/pest both load, `nav-enhanced.js` wins.

### `nav-enhanced.js` (harvest + pest only)
- Overlay nav, sidebar, prefetch, keyboard shortcuts, `window.navTo`, `window.toggleSidebar`, `openStageDetails` → writes `selectedStage` → navigates to `irrigation_new.html`.

### `pdfGenerator.js`
- Client-side HTML→PDF via **jsPDF 2.5.1 + html2canvas 1.4.1** (lazily CDN-loaded). Captures container at forced 1440px, splits across A4, adds header/footer overlay, filename `<Title>_DD-MM-YYYY.pdf`. No server call.

### CSS + `mobile-responsive.css`
- Theme in `custom.css` (dark emerald/gold glassmorphism), premium header in `header_styles.css`, mobile/sidebar logic in `mobile-responsive.css`.

---

## 5. Storage Key Map (the cross-page data-flow backbone)

| Key | Written by | Read by | Type |
|---|---|---|---|
| `recommendedCrops` | dashboard, create | irrigation, market, harvest | prediction handoff |
| `uyirnilam_active_crop` | uy_header (`syncActiveCrop`), main.js | uy_header (`getActiveCrop`) | active-crop across 5 modules |
| `selected_irrigation_crops` | irrigation | harvest | irrigation→harvest |
| `activePlans` | irrigation | harvest (+market) | irrigation→harvest |
| `plantingDate` / `landSize` | dashboard/harvest | irrigation, market, harvest | shared params |
| `selectedCrop` | dashboard | market | last-analyzed crop |
| `allCropsData` | dashboard | market (presence only) | cache |
| `uyirnilam_pest_result` / `uyirnilam_pest_image` | pest_control | pest_control (self) | pest result cache (24h) |
| `harvestTimers` | harvest | harvest (self) | countdown state |
| `selectedStage` | nav-enhanced | irrigation | stage handoff |
| `uyir_chat_history` (session) | chatbot | chatbot | chat history |
| `uyir_welcome_shown` / `exitShown` (session) | popup | popup | once-per-session popups |
| `uyirnilam_weather_cache`, `uyirnilam_user_prefs` | — (declared only) | — | unused constants |

---

## 6. Backend API Summary (app.py + chat_api.py)

| Method | Route | Login | Model/API | Purpose |
|---|---|---|---|---|
| GET | `/` | — | — | redirect |
| GET/POST | `/login`, `/login_submit` | — | — | session auth |
| GET/POST | `/signup`, `/signup_submit` | — | — | user creation |
| GET | `/logout` | — | — | clear session |
| GET | `/dashboard` `/create` `/profile` `/notifications` `/irrigation` `/harvest` `/pest` `/market` | ✅ | — | page renders |
| POST | `/api/update-profile` | ✅ | — | real User update |
| GET | `/api/market-trends` | ✅ | Gemini flash | market analysis |
| GET | `/api/live-prices` | — | Agmarknet+Gemini | mandi prices |
| POST | `/api/analyze-pest` | ✅ | Gemini flash | (legacy) |
| POST | `/api/chat-pest` | ✅ | Gemini flash | pest chat / search |
| POST | `/analyze-image` | ✅ | Claude opus-4-5 | **flagship** disease vision |
| POST | `/get-pest-data` | ✅ | — | (legacy) DB lookup |
| GET | `/random-disease` | ✅ | — | honest 503 stub |
| POST | `/api/predict` | ✅ | RandomForest + OWM | crop recommendation |
| POST | `/download_report` | ✅ | ReportLab | (unused PDF) |
| POST | `/chat` | — | Claude sonnet-4-6 | UyirBot |
| GET | `/chat/health` | — | — | health check |
| 404/500 | `page_not_found` / `server_error` | — | — | render dashboard |

---

## 7. Confirmed Bugs & Dead Code (highest-value findings)

1. **❌ `smooth-scroll.css` missing (404)** — linked in `harvest.html`, `irrigation_new.html`, `notifications.html`; edge-fade visuals for `.smooth-scroll-wrapper` dead. *Fix: create the stylesheet or remove the links.*
2. **🔴 `/notifications` page ignores real DB** — backend passes `Notification` rows, template renders hardcoded `NOTIFS[]`; mark-read not persisted.
3. **⚪ Irrigation + Harvest pages are fully client-side** — no backend; economy/hydrology hardcoded; "AI" labels overstate local math + deterministic thresholds.
4. **🔴 Market action stubs** — `postListing`, `setPriceAlert`, `contactBuyer`, `requestQuote`, `applyScheme`, `openMap` are `alert()` only.
5. **🔴 `setReminder` (irrigation) + `setHarvestReminder` (harvest)** — fake spinner / hardcoded alert; nothing scheduled.
6. **👻 Dead endpoints** — `/api/analyze-pest`, `/api/chat-pest` (mostly), `/get-pest-data`, `/random-disease` (neutered), `/download_report` all unused by the active frontend.
7. **⚙️ `models/crop_model.pkl` unused** — retrained every startup.
8. **🪲 JS bugs** — `openStageDetails` undefined (irrigation); duplicate `toggleSidebar`/`toggleAllCrops` (market); `navTo` global collision (`main.js` vs `nav-enhanced.js`); conflicting `yieldPerAcre` tables; `landSize.toFixed()` throws when unset; `notification_count` misused as a label.
9. **🔑 `WEATHER_API_KEY`** is loaded from the environment; no hardcoded value is present.
10. **📦 **No analytics / tracking / FontAwesome injected** — confirmed clean per requirements (only jsPDF/html2canvas/Chart.js CDNs, all functional).

---

*Generated as a read-only analysis. No source files were modified.*