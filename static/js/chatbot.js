/**
 * UYIRNILAM AI — Floating Chatbot
 * Version: 1.0
 * Smart agricultural AI assistant
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════
       CONFIG
    ═══════════════════════════════════════ */
    const CONFIG = {
        STORAGE_KEY: 'uyir_chat_history',
        MAX_HISTORY: 40,          // messages to keep in sessionStorage
        API_ENDPOINT: '/chat',     // your Flask backend
        BOT_NAME: 'UyirBot',
        WELCOME_MSG: 'Vanakkam! 🌱 I\'m UyirBot, your farming assistant. Ask me about crops, irrigation, pests, or market prices.',
        SUGGESTIONS: [
            '🌾 Best crops for my soil',
            '💧 Irrigation schedule',
            '🐛 Pest identification',
            '📈 Market prices today',
        ],
    };

    /* ═══════════════════════════════════════
       STATE
    ═══════════════════════════════════════ */
    let isOpen = false;
    let isTyping = false;
    let history = [];       // {role, content}[] for API context

    /* ═══════════════════════════════════════
       DOM INJECTION
    ═══════════════════════════════════════ */
    function buildHTML() {
        const wrap = document.createElement('div');
        wrap.id = 'uyir-chatbot-root';
        wrap.innerHTML = `
      <!-- Toggle Button -->
      <button id="uyir-chat-toggle" aria-label="Open AI Chat" title="Ask UyirBot">
        <div class="notif-dot"></div>
        <!-- Chat icon -->
        <svg class="icon-chat" fill="none" viewBox="0 0 24 24" stroke="#4ade80" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0
               012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"/>
        </svg>
        <!-- Close icon -->
        <svg class="icon-close" fill="none" viewBox="0 0 24 24" stroke="#4ade80" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Chat Panel -->
      <div id="uyir-chat-panel" role="dialog" aria-label="UyirBot Chat">
        <!-- Header -->
        <div id="uyir-chat-header">
          <div class="chat-avatar">🌱</div>
          <div class="chat-header-info">
            <h4>${CONFIG.BOT_NAME}</h4>
            <span>Online · Agricultural AI</span>
          </div>
          <button class="chat-clear-btn" id="uyir-clear-btn" title="Clear chat">Clear</button>
        </div>

        <!-- Messages -->
        <div id="uyir-chat-messages"></div>

        <!-- Input Area -->
        <div id="uyir-chat-input-area">
          <textarea
            id="uyir-chat-input"
            placeholder="Ask about crops, irrigation, pests..."
            rows="1"
            maxlength="500"
          ></textarea>
          <button id="uyir-chat-send" aria-label="Send message">
            <!-- Paper Plane Icon -->
            <svg fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
        document.body.appendChild(wrap);
    }

    /* ═══════════════════════════════════════
       STORAGE
    ═══════════════════════════════════════ */
    function loadHistory() {
        try {
            const raw = sessionStorage.getItem(CONFIG.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    }

    function saveHistory() {
        try {
            const trimmed = history.slice(-CONFIG.MAX_HISTORY);
            sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(trimmed));
        } catch (_) { }
    }

    function clearHistory() {
        history = [];
        sessionStorage.removeItem(CONFIG.STORAGE_KEY);
    }

    /* ═══════════════════════════════════════
       RENDER MESSAGES
    ═══════════════════════════════════════ */
    function getMsgContainer() {
        return document.getElementById('uyir-chat-messages');
    }

    function addBubble(role, text, animate = true) {
        const container = getMsgContainer();
        const div = document.createElement('div');
        div.className = `chat-bubble ${role}`;
        if (!animate) div.style.animation = 'none';

        if (role === 'ai') {
            div.innerHTML = `<span class="bubble-label">${CONFIG.BOT_NAME}</span>${formatText(text)}`;
        } else {
            div.textContent = text;
        }

        container.appendChild(div);
        autoScroll();
        return div;
    }

    function showTyping() {
        const container = getMsgContainer();
        const div = document.createElement('div');
        div.className = 'chat-bubble typing';
        div.id = 'uyir-typing';
        div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        container.appendChild(div);
        autoScroll();
    }

    function removeTyping() {
        const el = document.getElementById('uyir-typing');
        if (el) el.remove();
    }

    function showSuggestions() {
        const container = getMsgContainer();
        const wrap = document.createElement('div');
        wrap.className = 'chat-suggestions';
        wrap.id = 'uyir-suggestions';
        CONFIG.SUGGESTIONS.forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'chat-suggestion-chip';
            btn.textContent = s;
            btn.addEventListener('click', () => {
                wrap.remove();
                sendMessage(s);
            });
            wrap.appendChild(btn);
        });
        container.appendChild(wrap);
        autoScroll();
    }

    function autoScroll() {
        const container = getMsgContainer();
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }

    /* Minimal markdown: bold, newlines */
    function formatText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    /* ═══════════════════════════════════════
       RENDER FULL HISTORY (on reopen)
    ═══════════════════════════════════════ */
    function renderHistory() {
        const container = getMsgContainer();
        container.innerHTML = '';

        if (history.length === 0) {
            addBubble('ai', CONFIG.WELCOME_MSG, false);
            showSuggestions();
            return;
        }

        history.forEach(msg => {
            addBubble(msg.role === 'user' ? 'user' : 'ai', msg.content, false);
        });
    }

    /* ═══════════════════════════════════════
       API CALL
    ═══════════════════════════════════════ */
    async function callChatAPI(userMessage) {
        const payload = {
            message: userMessage,
            history: history.slice(-12),   // last 12 for context window efficiency
        };

        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.reply || data.message || 'Sorry, I could not process that.';
    }

    /* ═══════════════════════════════════════
       SEND MESSAGE
    ═══════════════════════════════════════ */
    async function sendMessage(text) {
        const msg = text.trim();
        if (!msg || isTyping) return;

        // Remove suggestion chips if still visible
        const chips = document.getElementById('uyir-suggestions');
        if (chips) chips.remove();

        // Render user bubble
        addBubble('user', msg);
        history.push({ role: 'user', content: msg });
        saveHistory();

        // Lock UI
        isTyping = true;
        const sendBtn = document.getElementById('uyir-chat-send');
        const inputEl = document.getElementById('uyir-chat-input');
        sendBtn.disabled = true;
        inputEl.value = '';
        inputEl.style.height = 'auto';

        showTyping();

        try {
            const reply = await callChatAPI(msg);
            removeTyping();
            addBubble('ai', reply);
            history.push({ role: 'assistant', content: reply });
            saveHistory();
        } catch (err) {
            removeTyping();
            const errMsg = err.message.includes('Failed to fetch')
                ? 'Could not reach the server. Please check your connection.'
                : `Error: ${err.message}`;
            addBubble('ai', `⚠️ ${errMsg}`);
        } finally {
            isTyping = false;
            sendBtn.disabled = false;
            inputEl.focus();
        }
    }

    /* ═══════════════════════════════════════
       TOGGLE PANEL
    ═══════════════════════════════════════ */
    function togglePanel() {
        isOpen = !isOpen;
        const panel = document.getElementById('uyir-chat-panel');
        const toggle = document.getElementById('uyir-chat-toggle');

        panel.classList.toggle('open', isOpen);
        toggle.classList.toggle('open', isOpen);

        if (isOpen) {
            renderHistory();
            setTimeout(() => {
                document.getElementById('uyir-chat-input')?.focus();
            }, 320);
        }
    }

    /* ═══════════════════════════════════════
       AUTO-RESIZE TEXTAREA
    ═══════════════════════════════════════ */
    function autoResize(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    }

    /* ═══════════════════════════════════════
       INIT
    ═══════════════════════════════════════ */
    function init() {
        // Load CSS
        if (!document.getElementById('uyir-chat-styles')) {
            const link = document.createElement('link');
            link.id = 'uyir-chat-styles';
            link.rel = 'stylesheet';
            link.href = '/static/css/chatbot.css';
            document.head.appendChild(link);
        }

        buildHTML();

        // Load existing history
        history = loadHistory();

        // Events
        document.getElementById('uyir-chat-toggle')
            .addEventListener('click', togglePanel);

        document.getElementById('uyir-clear-btn')
            .addEventListener('click', () => {
                clearHistory();
                renderHistory();
            });

        document.getElementById('uyir-chat-send')
            .addEventListener('click', () => {
                const val = document.getElementById('uyir-chat-input').value;
                sendMessage(val);
            });

        const inputEl = document.getElementById('uyir-chat-input');
        inputEl.addEventListener('input', () => autoResize(inputEl));
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputEl.value);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!isOpen) return;
            const root = document.getElementById('uyir-chatbot-root');
            if (root && !root.contains(e.target)) togglePanel();
        });
    }

    /* ── Boot ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
