/**
 * UYIRNILAM AI - PEST CONTROL ENGINE v4.0
 * Real AI-Powered Image Analysis | Persistent State | Modular Architecture
 * ============================================================
 */

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const PEST_CONFIG = {
    API_BASE: window.location.origin,           // Same origin (Flask serves both)
    STORAGE_KEY: "uyirnilam_pest_result",
    IMAGE_STORAGE_KEY: "uyirnilam_pest_image",
    MAX_IMAGE_MB: 10,
    ANALYSIS_TIMEOUT_MS: 60000,                 // 60 seconds
    SCAN_STEPS: [
        "Initializing AI engine...",
        "Decoding image data...",
        "Identifying crop type...",
        "Scanning for disease patterns...",
        "Analyzing symptom clusters...",
        "Cross-referencing disease database...",
        "Generating treatment protocol...",
        "Finalizing recommendations..."
    ]
};

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
const PestState = {
    uploadedImageData: null,
    lastScanResult: null,
    isAnalyzing: false,
};

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
window.addEventListener("load", () => {
    setupDragDrop();
    restorePersistedResult();
    console.log("✅ Uyirnilam AI Pest Control Engine v4.0 Initialized");
});

// ═══════════════════════════════════════════════════════════════
// DRAG & DROP
// ═══════════════════════════════════════════════════════════════
function setupDragDrop() {
    const zone = document.getElementById("uploadZone");
    if (!zone) return;

    ["dragenter", "dragover", "dragleave", "drop"].forEach(e =>
        zone.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); })
    );
    ["dragenter", "dragover"].forEach(e =>
        zone.addEventListener(e, () => zone.classList.add("dragover"))
    );
    ["dragleave", "drop"].forEach(e =>
        zone.addEventListener(e, () => zone.classList.remove("dragover"))
    );
    zone.addEventListener("drop", e => {
        const files = e.dataTransfer.files;
        if (files.length > 0) processImageFile(files[0]);
    });
}

// ═══════════════════════════════════════════════════════════════
// IMAGE HANDLING
// ═══════════════════════════════════════════════════════════════
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) processImageFile(file);
}

function processImageFile(file) {
    if (!file.type.startsWith("image/")) {
        showToast("⚠️ Please upload a valid image file (JPG, PNG, WebP)", "warning");
        return;
    }
    if (file.size > PEST_CONFIG.MAX_IMAGE_MB * 1024 * 1024) {
        showToast(`⚠️ Image too large. Maximum size is ${PEST_CONFIG.MAX_IMAGE_MB}MB`, "warning");
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        PestState.uploadedImageData = e.target.result;

        // Show preview
        document.getElementById("previewImage").src = e.target.result;
        document.getElementById("uploadPrompt").classList.add("hidden");
        document.getElementById("uploadedPreview").classList.remove("hidden");

        // Reset previous results when new image loaded
        hideResults();
    };
    reader.readAsDataURL(file);

    // Reset file input so same file can be re-uploaded
    const fi = document.getElementById("fileInput");
    if (fi) fi.value = "";
}

// ═══════════════════════════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════
async function analyzeImage() {
    if (!PestState.uploadedImageData) return;
    if (PestState.isAnalyzing) return;

    PestState.isAnalyzing = true;
    showScanningAnimation();

    try {
        // Try real AI API first
        const result = await callAnalysisAPI(PestState.uploadedImageData);
        completeScan(result);
    } catch (err) {
        // Honest failure: no fabricated diagnosis is shown. A guessed
        // disease/confidence could mislead the farmer, so on failure we
        // simply report that detection is unavailable and prompt a retry.
        console.warn("🔄 AI analysis unavailable:", err.message);
        hideScanningAnimation();
        hideResults();
        showApiFallbackBanner();
        showToast("⚠️ Analysis unavailable. Please try again.", "warning");
    } finally {
        PestState.isAnalyzing = false;
    }
}

// ── Real AI API Call ────────────────────────────────────────────
async function callAnalysisAPI(imageData) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PEST_CONFIG.ANALYSIS_TIMEOUT_MS);

    const response = await fetch(`${PEST_CONFIG.API_BASE}/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
        signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.fallback) throw new Error("API requested fallback");
        throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error("API returned failure");

    return normalizeAPIResponse(data);
}

// ── Normalize API response to internal format ──────────────────
function normalizeAPIResponse(data) {
    return {
        crop: data.crop || "unknown",
        disease_name: data.disease || data.disease_name || "Unknown Disease",
        type: data.type || "Fungal Disease",
        severity: data.severity || "MODERATE",
        confidence: data.confidence || 78,
        description: data.description || "Disease detected. Consult local agronomist for confirmation.",
        cause: data.cause || "Pathogenic infection",
        spread: data.spread || "Environmental conditions",
        visual_findings: data.visual_findings || "",
        detected_region: data.detected_region || "leaf",
        symptoms: data.symptoms || [],
        causes: data.causes || [],
        affected_parts: data.affected_parts || ["leaf"],
        organic_solutions: data.organic_solutions || [],
        chemical_solutions: data.chemical_solutions || [],
        prevention_methods: data.prevention_methods || [],
        is_healthy: data.is_healthy || false,
        health_note: data.health_note || "",
        source: data.source || "api",
        _timestamp: Date.now()
    };
}

// ═══════════════════════════════════════════════════════════════
// SCAN ANIMATION CONTROLLER
// ═══════════════════════════════════════════════════════════════
let _scanInterval = null;

function showScanningAnimation() {
    const animation = document.getElementById("scanningAnimation");
    const statusText = document.getElementById("scanningStatus");
    const progressFill = document.getElementById("scanProgress");

    animation.classList.remove("hidden");
    let progress = 0;
    let stepIndex = 0;

    _scanInterval = setInterval(() => {
        if (progress < 88) {
            progress += 1.2;
            progressFill.style.width = Math.min(progress, 88) + "%";
            const newStep = Math.floor(progress / 11);
            if (newStep !== stepIndex && newStep < PEST_CONFIG.SCAN_STEPS.length) {
                stepIndex = newStep;
                statusText.textContent = PEST_CONFIG.SCAN_STEPS[stepIndex];
            }
        }
    }, 100);
}

function hideScanningAnimation() {
    clearInterval(_scanInterval);
    const animation = document.getElementById("scanningAnimation");
    const progressFill = document.getElementById("scanProgress");
    animation.classList.add("hidden");
    progressFill.style.width = "0%";
}

function completeScan(result) {
    clearInterval(_scanInterval);
    const progressFill = document.getElementById("scanProgress");
    const statusText = document.getElementById("scanningStatus");

    progressFill.style.width = "100%";
    statusText.textContent = "✅ Analysis Complete!";

    setTimeout(() => {
        hideScanningAnimation();
        PestState.lastScanResult = result;
        persistResult(result);
        displayResults(result);
    }, 700);
}

// ═══════════════════════════════════════════════════════════════
// DISPLAY RESULTS
// ═══════════════════════════════════════════════════════════════
function displayResults(data) {
    if (!data) return;

    const crop = (data.crop || "Crop").toUpperCase();
    document.getElementById("analysisCropContext").textContent = crop;

    // ── Disease Header ──────────────────────────────────────────
    document.getElementById("detectedDisease").textContent = data.disease_name || "Disease Detected";
    document.getElementById("diseaseType").textContent = data.type || "Fungal Disease";

    // ── Visual Findings (AI Description) ───────────────────────
    const visualEl = document.getElementById("aiVisualFindings");
    if (visualEl && data.visual_findings) {
        visualEl.textContent = data.visual_findings;
        visualEl.closest(".ai-findings-box")?.classList.remove("hidden");
    }

    // ── Severity Badge ──────────────────────────────────────────
    const severity = (data.severity || "MODERATE").toUpperCase();
    const severityEl = document.getElementById("severityLevel");
    severityEl.textContent = severity;
    severityEl.className = "text-2xl font-black " + {
        HIGH: "text-red-400",
        MODERATE: "text-orange-400",
        LOW: "text-yellow-400",
        NONE: "text-emerald-400"
    }[severity] || "text-orange-400";
    document.getElementById("severityDesc").textContent =
        severity === "HIGH" ? "Immediate action required" :
            severity === "MODERATE" ? "Treatment recommended soon" :
                severity === "LOW" ? "Monitor closely" : "No intervention needed";

    // ── Confidence ──────────────────────────────────────────────
    const confidence = parseInt(data.confidence) || 78;
    document.getElementById("confidencePercent").textContent = confidence + "%";
    document.getElementById("confidenceBar").style.width = confidence + "%";
    const confBar = document.getElementById("confidenceBar");
    confBar.className = "h-full rounded-full transition-all duration-700 " +
        (confidence >= 85 ? "bg-emerald-400" :
            confidence >= 65 ? "bg-yellow-400" : "bg-red-400");

    // ── Description ─────────────────────────────────────────────
    document.getElementById("diseaseDescription").textContent = data.description || "--";
    document.getElementById("diseaseCause").textContent = data.cause || "--";
    document.getElementById("diseaseSpread").textContent = data.spread || "--";

    // ── Symptoms ────────────────────────────────────────────────
    document.getElementById("symptomsList").innerHTML =
        (data.symptoms || []).map(s => `
            <li class="flex items-start gap-2 text-sm">
                <span class="material-symbols-outlined text-red-400 text-sm mt-0.5">radio_button_checked</span>
                <span class="text-on-surface-variant">${escHtml(s)}</span>
            </li>
        `).join("") || '<li class="text-sm text-on-surface-variant">No symptoms data</li>';

    // ── Causes ──────────────────────────────────────────────────
    document.getElementById("causesList").innerHTML =
        (data.causes || []).map(c => `
            <li class="flex items-start gap-2 text-sm">
                <span class="material-symbols-outlined text-yellow-400 text-sm mt-0.5">error</span>
                <span class="text-white">${escHtml(c)}</span>
            </li>
        `).join("") || '<li class="text-sm text-on-surface-variant">No causes data</li>';

    // ── Affected Parts ──────────────────────────────────────────
    document.getElementById("affectedPartsList").innerHTML =
        (data.affected_parts || []).map(p =>
            `<span class="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">${escHtml(p)}</span>`
        ).join("") || '<span class="text-xs text-on-surface-variant">Not specified</span>';

    // ── Organic Solutions ───────────────────────────────────────
    document.getElementById("organicTreatment").innerHTML =
        (data.organic_solutions || []).map((sol, i) => `
            <div class="p-4 rounded-2xl bg-white/5 border border-emerald-500/10 hover:border-emerald-400/30 transition-all">
                <div class="flex justify-between items-start gap-2">
                    <p class="font-semibold text-white text-sm leading-relaxed">${i + 1}. ${escHtml(sol)}</p>
                    <span class="shrink-0 text-[8px] font-black text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded">ECO</span>
                </div>
            </div>
        `).join("") || '<p class="text-sm text-on-surface-variant">No organic solutions available</p>';

    // ── Chemical Solutions ──────────────────────────────────────
    document.getElementById("chemicalTreatment").innerHTML =
        (data.chemical_solutions || []).map((sol, i) => `
            <div class="p-4 rounded-2xl bg-white/5 border border-orange-500/10 hover:border-orange-400/30 transition-all">
                <div class="flex justify-between items-start gap-2">
                    <p class="font-semibold text-white text-sm leading-relaxed">${i + 1}. ${escHtml(sol)}</p>
                    <span class="shrink-0 text-[8px] font-black text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded">CHEM</span>
                </div>
            </div>
        `).join("") || '<p class="text-sm text-on-surface-variant">No chemical solutions available</p>';

    // ── Prevention ──────────────────────────────────────────────
    document.getElementById("preventionTips").innerHTML =
        (data.prevention_methods || []).map(tip => `
            <div class="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all">
                <span class="material-symbols-outlined text-blue-400 text-sm mt-0.5 shrink-0">check_circle</span>
                <p class="text-xs text-white leading-relaxed">${escHtml(tip)}</p>
            </div>
        `).join("") || '<p class="text-sm text-on-surface-variant">No prevention data available</p>';

    // ── Source Badge ────────────────────────────────────────────
    updateSourceBadge(data.source);

    // ── Show sections ───────────────────────────────────────────
    const resultsEl = document.getElementById("resultsSection");
    const causesEl = document.getElementById("diseaseCausesSection");

    resultsEl.classList.remove("hidden");
    causesEl.classList.remove("hidden");

    // Re-trigger animation
    resultsEl.style.animation = "none";
    resultsEl.offsetHeight; // Force reflow
    resultsEl.style.animation = "";

    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideResults() {
    document.getElementById("resultsSection").classList.add("hidden");
    document.getElementById("diseaseCausesSection").classList.add("hidden");
    const apiBanner = document.getElementById("apiFallbackBanner");
    if (apiBanner) apiBanner.classList.add("hidden");
}

function updateSourceBadge(source) {
    const badge = document.getElementById("analysisSourceBadge");
    if (!badge) return;

    const config = {
        database: { text: "AI Vision + Database", color: "text-emerald-400", icon: "database" },
        ai_generic: { text: "AI Vision (Generic)", color: "text-yellow-400", icon: "psychology" },
        api: { text: "Live AI Analysis", color: "text-emerald-400", icon: "smart_toy" }
    };

    const cfg = config[source] || config.api;
    badge.innerHTML = `
        <span class="material-symbols-outlined text-sm ${cfg.color}">${cfg.icon}</span>
        <span class="text-[10px] font-black uppercase tracking-widest ${cfg.color}">${cfg.text}</span>
    `;
}

// ═══════════════════════════════════════════════════════════════
// LOCALSTORAGE PERSISTENCE
// ═══════════════════════════════════════════════════════════════
function persistResult(result) {
    try {
        localStorage.setItem(PEST_CONFIG.STORAGE_KEY, JSON.stringify(result));
        // Also persist the preview image (may be large - use try/catch)
        if (PestState.uploadedImageData) {
            try {
                localStorage.setItem(PEST_CONFIG.IMAGE_STORAGE_KEY, PestState.uploadedImageData);
            } catch (_) {
                // Storage quota exceeded for image - skip image but keep result
                localStorage.removeItem(PEST_CONFIG.IMAGE_STORAGE_KEY);
            }
        }
    } catch (err) {
        console.warn("Could not persist result:", err);
    }
}

function restorePersistedResult() {
    try {
        const stored = localStorage.getItem(PEST_CONFIG.STORAGE_KEY);
        if (!stored) return;

        const result = JSON.parse(stored);

        // Check if result is older than 24 hours
        const age = Date.now() - (result._timestamp || 0);
        if (age > 24 * 60 * 60 * 1000) {
            clearPersistedResult();
            return;
        }

        // Restore image preview if available
        const storedImage = localStorage.getItem(PEST_CONFIG.IMAGE_STORAGE_KEY);
        if (storedImage) {
            PestState.uploadedImageData = storedImage;
            document.getElementById("previewImage").src = storedImage;
            document.getElementById("uploadPrompt").classList.add("hidden");
            document.getElementById("uploadedPreview").classList.remove("hidden");
        }

        // Show restored result with indicator
        PestState.lastScanResult = result;
        displayResults(result);
        showRestoredIndicator();

        console.log("♻️ Restored previous analysis from storage");

    } catch (err) {
        console.warn("Could not restore persisted result:", err);
        clearPersistedResult();
    }
}

function clearPersistedResult() {
    localStorage.removeItem(PEST_CONFIG.STORAGE_KEY);
    localStorage.removeItem(PEST_CONFIG.IMAGE_STORAGE_KEY);
}

function showRestoredIndicator() {
    const banner = document.getElementById("restoredBanner");
    if (banner) {
        banner.classList.remove("hidden");
        setTimeout(() => banner.classList.add("hidden"), 5000);
    }
}

// ═══════════════════════════════════════════════════════════════
// RESET FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function resetUpload() {
    PestState.uploadedImageData = null;
    PestState.lastScanResult = null;
    PestState.isAnalyzing = false;

    clearPersistedResult();

    const fi = document.getElementById("fileInput");
    if (fi) fi.value = "";

    document.getElementById("uploadPrompt").classList.remove("hidden");
    document.getElementById("uploadedPreview").classList.add("hidden");
    hideResults();

    // Hide fallback banner
    const apiBanner = document.getElementById("apiFallbackBanner");
    if (apiBanner) apiBanner.classList.add("hidden");
}

function resetAndAnalyzeNew() {
    resetUpload();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════
function showApiFallbackBanner() {
    const banner = document.getElementById("apiFallbackBanner");
    if (banner) banner.classList.remove("hidden");
}

function showToast(message, type = "info") {
    const existing = document.getElementById("pest-toast");
    if (existing) existing.remove();

    const colors = {
        info: "bg-blue-500/20 border-blue-500/30 text-blue-300",
        warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
        error: "bg-red-500/20 border-red-500/30 text-red-300",
        success: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
    };

    const toast = document.createElement("div");
    toast.id = "pest-toast";
    toast.className = `fixed bottom-6 right-6 z-[9999] px-5 py-4 rounded-2xl border backdrop-blur-xl text-sm font-semibold shadow-2xl transition-all duration-300 flex items-center gap-3 ${colors[type] || colors.info}`;
    toast.innerHTML = `<span class="material-symbols-outlined text-lg">notifications</span>${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
