/**
 * UYIRNILAM AI — Popup System
 * Welcome Popup + Exit / Thank You Popup
 * Version: 1.0 | Zero dependencies
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════
       CONFIG
    ═══════════════════════════════════════ */
    const CFG = {
        WELCOME_KEY: 'uyir_welcome_shown',  // sessionStorage key
        EXIT_KEY: 'exitShown',            // sessionStorage key (as specified)
        EXIT_THRESHOLD: 0,                     // 🔹 Updated: only clientY <= 0 (exact top edge)
        LOGO_SRC: '/static/images/logo.jpg',
        LOGO_FALLBACK: '🌱',
        EXIT_INIT_DELAY: 2500,                 // ms before exit listeners are armed (avoids instant mis-fire)
        EXIT_DEBOUNCE: 150,                  // ms debounce on exit triggers
    };

    /* ═══════════════════════════════════════
       STATE
    ═══════════════════════════════════════ */
    let exitTriggered = false;   // single-fire guard
    let welcomeShown = false;
    let exitDebounceId = null;    // 🔹 debounce timer for exit triggers
    let beforeUnloadBound = false; // prevent duplicate beforeunload bindings

    /* ═══════════════════════════════════════
       HTML TEMPLATES
    ═══════════════════════════════════════ */
    function getWelcomeHTML() {
        return `
    <div id="uyir-welcome-popup" class="uyir-popup-overlay" role="dialog"
         aria-modal="true" aria-labelledby="uyir-welcome-title">

      <div class="uyir-popup-card">

        <!-- Logo -->
        <div class="uyir-popup-logo" id="uyir-welcome-logo">
          <img src="${CFG.LOGO_SRC}" alt="Uyirnilam AI"
               onerror="this.style.display='none'; this.parentNode.textContent='${CFG.LOGO_FALLBACK}'">
        </div>

        <!-- Badge -->
        <div class="uyir-popup-badge">AI-Powered Agriculture</div>

        <!-- Title -->
        <h2 class="uyir-popup-title" id="uyir-welcome-title">
          Welcome to Uyirnilam AI 🌱
        </h2>

        <!-- Subtitle -->
        <p class="uyir-popup-subtitle">Smart Crop Intelligence System</p>

        <!-- Divider -->
        <div class="uyir-popup-divider"></div>

        <!-- Description -->
        <p class="uyir-popup-desc">
          Your intelligent farming companion — powered by AI to help you choose
          the right crops, plan irrigation, identify pests, and predict market
          trends. Built for Indian farmers. Designed for smart agriculture.
        </p>

        <!-- Feature Pills -->
        <div class="uyir-popup-features">
          <div class="uyir-popup-pill">
            <span>🌾</span><span>Crop Recommendations</span>
          </div>
          <div class="uyir-popup-pill">
            <span>💧</span><span>Irrigation Planning</span>
          </div>
          <div class="uyir-popup-pill">
            <span>🐛</span><span>Pest Detection</span>
          </div>
          <div class="uyir-popup-pill">
            <span>📈</span><span>Market Trends</span>
          </div>
        </div>

        <!-- CTA Button -->
        <button class="uyir-popup-btn" id="uyir-welcome-cta">
          Get Started
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>

        <!-- Skip -->
        <button class="uyir-popup-skip" id="uyir-welcome-skip">
          Continue without intro
        </button>

      </div>
    </div>`;
    }

    function getExitHTML() {
        return `
    <div id="uyir-exit-popup" class="uyir-popup-overlay" role="dialog"
         aria-modal="true" aria-labelledby="uyir-exit-title">

      <div class="uyir-popup-card">

        <!-- Logo -->
        <div class="uyir-popup-logo" id="uyir-exit-logo">
          <img src="${CFG.LOGO_SRC}" alt="Uyirnilam AI"
               onerror="this.style.display='none'; this.parentNode.textContent='🌾'">
        </div>

        <!-- Badge -->
        <div class="uyir-popup-badge">See You Soon</div>

        <!-- Title -->
        <h2 class="uyir-popup-title" id="uyir-exit-title">
          Thank You for Visiting 🌾
        </h2>

        <!-- Subtitle -->
        <p class="uyir-popup-subtitle">Your Farm, Our Mission</p>

        <!-- Divider -->
        <div class="uyir-popup-divider"></div>

        <!-- Stats strip -->
        <div class="uyir-popup-stats">
          <div class="uyir-stat">
            <span class="uyir-stat-value">5+</span>
            <span class="uyir-stat-label">AI Features</span>
          </div>
          <div class="uyir-stat-sep"></div>
          <div class="uyir-stat">
            <span class="uyir-stat-value">100%</span>
            <span class="uyir-stat-label">Free to Use</span>
          </div>
          <div class="uyir-stat-sep"></div>
          <div class="uyir-stat">
            <span class="uyir-stat-value">24/7</span>
            <span class="uyir-stat-label">AI Support</span>
          </div>
        </div>

        <!-- Description -->
        <p class="uyir-popup-desc">
          Thank you for exploring Uyirnilam AI. Your crops deserve the smartest
          guidance available. Come back anytime — your personalized farm
          intelligence is always here waiting for you. நன்றி! 🙏
        </p>

        <!-- CTA -->
        <button class="uyir-popup-btn" id="uyir-exit-cta">
          Visit Again
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>

        <!-- Skip -->
        <button class="uyir-popup-skip" id="uyir-exit-skip">
          Leave page
        </button>

      </div>
    </div>`;
    }

    /* ═══════════════════════════════════════
       OPEN / CLOSE HELPERS
    ═══════════════════════════════════════ */
    function openPopup(id) {
        const el = document.getElementById(id);
        if (!el) return;
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            el.classList.add('active');
            // Focus trap — focus the CTA button
            const btn = el.querySelector('.uyir-popup-btn');
            if (btn) setTimeout(() => btn.focus(), 400);
        });
    }

    function closePopup(id, callback) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('active');
        document.body.style.overflow = '';
        // Wait for animation to finish before removing
        setTimeout(() => {
            if (callback) callback();
        }, 420);
    }

    /* ═══════════════════════════════════════
       WELCOME POPUP
    ═══════════════════════════════════════ */
    // 🔹 UPDATED WELCOME LOGIC — show immediately on page load, once per session
    function initWelcomePopup() {
        if (sessionStorage.getItem(CFG.WELCOME_KEY)) return;

        // Inject HTML
        document.body.insertAdjacentHTML('beforeend', getWelcomeHTML());

        // CTA → animated transition | Skip/Overlay/ESC → instant close
        document.getElementById('uyir-welcome-cta').addEventListener('click', animatedCloseWelcome);
        document.getElementById('uyir-welcome-skip').addEventListener('click', closeWelcome);

        // Overlay background click
        document.getElementById('uyir-welcome-popup').addEventListener('click', (e) => {
            if (e.target.id === 'uyir-welcome-popup') closeWelcome();
        });

        // ESC key
        document.addEventListener('keydown', onWelcomeEsc);

        // 🔹 No delay — open instantly on page load
        openPopup('uyir-welcome-popup');
        welcomeShown = true;
    }

    function closeWelcome() {
        sessionStorage.setItem(CFG.WELCOME_KEY, '1');
        document.removeEventListener('keydown', onWelcomeEsc);
        closePopup('uyir-welcome-popup');
    }

    // ── Full-screen logo splash on "Get Started" click ──
    function animatedCloseWelcome() {
        const overlay = document.getElementById('uyir-welcome-popup');
        const btn     = document.getElementById('uyir-welcome-cta');
        if (!overlay || !btn) { closeWelcome(); return; }

        // Guard: prevent double-fire
        btn.disabled = true;

        // Step 1: Instantly close popup (no delay)
        sessionStorage.setItem(CFG.WELCOME_KEY, '1');
        document.removeEventListener('keydown', onWelcomeEsc);
        overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Step 2: Inject full-screen splash overlay
        const splash = document.createElement('div');
        splash.id = 'uyir-splash-screen';
        splash.innerHTML = `
            <div class="uyir-splash-bg-anim"></div>
            <div class="uyir-splash-inner">
                <div class="uyir-splash-halo">
                    <div class="uyir-splash-ring-spin"></div>
                    <img class="uyir-splash-logo-img" src="${CFG.LOGO_SRC}" alt="Uyirnilam AI">
                </div>
                <p class="uyir-splash-name">Uyirnilam AI</p>
                <div class="uyir-splash-bar"><div class="uyir-splash-bar-fill"></div></div>
            </div>`;
        document.body.appendChild(splash);

        // Step 3: Fade splash in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => splash.classList.add('uyir-splash-visible'));
        });

        // Step 4: After 2s, fade splash out then remove
        setTimeout(() => {
            splash.classList.add('uyir-splash-out');
            setTimeout(() => splash.remove(), 600);
        }, 2000);
    }

    function onWelcomeEsc(e) {
        if (e.key === 'Escape') closeWelcome();
    }

    /* ═══════════════════════════════════════
       EXIT POPUP
    ═══════════════════════════════════════ */
    // 🔹 UPDATED EXIT LOGIC — armed after delay to avoid mis-fires
    function initExitPopup() {
        if (sessionStorage.getItem(CFG.EXIT_KEY)) return;

        // Inject HTML
        document.body.insertAdjacentHTML('beforeend', getExitHTML());

        // Button events
        document.getElementById('uyir-exit-cta').addEventListener('click', () => closeExit());
        document.getElementById('uyir-exit-skip').addEventListener('click', () => closeExit());

        // Overlay background click
        document.getElementById('uyir-exit-popup').addEventListener('click', (e) => {
            if (e.target.id === 'uyir-exit-popup') closeExit();
        });

        // ESC key
        document.addEventListener('keydown', onExitEsc);

        // 🔹 Case 1: Mouse exits through the very top of viewport (desktop)
        document.addEventListener('mouseleave', onMouseLeave);

        // 🔹 Case 2: Tab hidden (switch tab / minimize)
        document.addEventListener('visibilitychange', onVisibilityChange);

        // 🔹 Case 3: Page refresh / close (beforeunload)
        if (!beforeUnloadBound) {
            window.addEventListener('beforeunload', onBeforeUnload);
            beforeUnloadBound = true;
        }
    }

    // 🔹 UPDATED triggerExit — single-fire, debounced, blocks during welcome
    function triggerExit() {
        if (exitTriggered) return;
        if (sessionStorage.getItem(CFG.EXIT_KEY)) return;

        // Don't interrupt welcome popup if still open
        const welcomeEl = document.getElementById('uyir-welcome-popup');
        if (welcomeEl && welcomeEl.classList.contains('active')) return;

        // Debounce: cancel previous pending trigger
        clearTimeout(exitDebounceId);
        exitDebounceId = setTimeout(() => {
            if (exitTriggered) return;
            if (sessionStorage.getItem(CFG.EXIT_KEY)) return;

            exitTriggered = true;

            // Remove all exit trigger listeners once fired
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('beforeunload', onBeforeUnload);

            openPopup('uyir-exit-popup');
        }, CFG.EXIT_DEBOUNCE);
    }

    function closeExit() {
        sessionStorage.setItem(CFG.EXIT_KEY, 'true');
        clearTimeout(exitDebounceId);
        document.removeEventListener('keydown', onExitEsc);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('beforeunload', onBeforeUnload);
        closePopup('uyir-exit-popup');
    }

    // 🔹 Case 1: Strict top-edge detection (clientY <= 0 only)
    function onMouseLeave(e) {
        if (e.clientY <= CFG.EXIT_THRESHOLD) {
            triggerExit();
        }
    }

    // 🔹 Case 2: Tab hidden — trigger immediately on hide (not on return)
    function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            triggerExit();
        }
    }

    // 🔹 Case 3: Refresh / tab close via beforeunload
    function onBeforeUnload() {
        // Mark intent; use a tight debounce since beforeunload fires fast
        triggerExit();
    }

    function onExitEsc(e) {
        if (e.key === 'Escape') closeExit();
    }

    /* ═══════════════════════════════════════
       BOOT
    ═══════════════════════════════════════ */
    function init() {
        // Self-inject CSS if not already loaded via <link> in HTML
        if (!document.getElementById('uyir-popup-styles')) {
            const link = document.createElement('link');
            link.id = 'uyir-popup-styles';
            link.rel = 'stylesheet';
            link.href = '/static/css/popup.css';
            document.head.appendChild(link);
        }

        // 🔹 Welcome: immediate, no delay
        initWelcomePopup();

        // 🔹 Exit: arm listeners after a safe delay to avoid accidental first-trigger
        setTimeout(initExitPopup, CFG.EXIT_INIT_DELAY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
