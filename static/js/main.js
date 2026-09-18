/* =================================
   UYIRNILAM AI - MAIN JAVASCRIPT
   Common functions for all pages
   ================================= */

// ═══════════════════════════════════════════════════════════════════
// ⚡ PREMIUM NAVIGATION SYSTEM ⚡
// ═══════════════════════════════════════════════════════════════════
let isNavigating = false;
let transitionOverlay = null;

function initTransitionOverlay() {
    const overlay = document.getElementById('nav-transition-overlay');
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.id = 'nav-transition-overlay';
        newOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(2, 15, 12, 0.98) 0%, rgba(4, 59, 37, 0.98) 100%);
            opacity: 0;
            pointer-events: none;
            z-index: 99999;
            transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        `;
        newOverlay.innerHTML = `
            <div style="text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 64px; color: #10b981; opacity: 0.8; animation: spin 2s linear infinite; display: inline-block; margin-bottom: 20px;">
                    settings_b_roll
                </span>
                <div style="padding: 2px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 100px;">
                    <p style="color: #10b981; font-weight: 800; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">
                        <span id="nav-current-page">Loading</span>...
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(newOverlay);
        transitionOverlay = newOverlay;
    }
    return transitionOverlay;
}

function navTo(url, name) {
    if (isNavigating) return;
    isNavigating = true;

    // Handle sidebars if they exist
    const sidebar = document.getElementById('mainSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar && !sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        if (backdrop) backdrop.classList.remove('visible', 'show');
    }

    const overlay = initTransitionOverlay();
    const pageNameElement = document.getElementById('nav-current-page');
    if (pageNameElement) {
        pageNameElement.textContent = name;
    }

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });

    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Show loading spinner (Fallback/Legacy)
function showLoading(message = 'Loading...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingOverlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(2, 20, 13, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 9999;
    `;
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="color: #10b981; margin-top: 24px; font-size: 16px; font-weight: 600; letter-spacing: 0.05em;">${message}</p>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide loading spinner
function hideLoading() {
    const loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show success message
function showSuccess(message, duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-success';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: fadeIn 0.3s ease-in-out;
        max-width: 400px;
    `;
    alertDiv.innerHTML = `✓ ${message}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Show error message
function showError(message, duration = 4000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-error';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: fadeIn 0.3s ease-in-out;
        max-width: 400px;
    `;
    alertDiv.innerHTML = `✗ ${message}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format currency (Indian Rupees)
function formatCurrency(amount) {
    return '₹' + formatNumber(Math.round(amount));
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number (Indian)
function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Get current location
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        showLoading('Getting your location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                hideLoading();
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    success: true
                });
            },
            function(error) {
                hideLoading();
                showError('Location access denied. Using default location.');
                callback({
                    latitude: 18.52,
                    longitude: 73.85,
                    success: false
                });
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
        callback({
            latitude: 18.52,
            longitude: 73.85,
            success: false
        });
    }
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        function() {
            showSuccess('Copied to clipboard!');
        },
        function() {
            showError('Failed to copy.');
        }
    );
}

// Debounce function (for search inputs)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
}

// Time ago (e.g., "2 hours ago")
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
}

// Local storage helpers
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

// Session storage helpers
const session = {
    set: function(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Session storage error:', e);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Session storage error:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Session storage error:', e);
            return false;
        }
    },
    
    clear: function() {
        try {
            sessionStorage.clear();
            return true;
        } catch (e) {
            console.error('Session storage error:', e);
            return false;
        }
    }
};

// API call helper
async function apiCall(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showError('Connection error. Please try again.');
        return null;
    }
}

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            input.style.borderColor = 'rgba(124, 255, 178, 0.2)';
        }
    });
    
    return isValid;
}


// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-popup';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: #7CFFB2;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// Page load animation & initialization
document.addEventListener('DOMContentLoaded', function() {
    initTransitionOverlay();
    
    // Smooth reveal from transition
    const overlay = document.getElementById('nav-transition-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }, 100);
    }

    document.body.classList.add('page-transition');
    initTooltips();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .glass-card, .page-section');
    cards.forEach((card, index) => {
        if (card.classList.contains('no-animate')) return;
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
});

// Log console message
console.log('%c🌱 Uyirnilam AI', 'color: #00ff9c; font-size: 24px; font-weight: bold;');
console.log('%cSmart Farming Platform', 'color: #7CFFB2; font-size: 14px;');
console.log('%cVersion 1.0.0', 'color: #8cb3a5; font-size: 12px;');

// Export functions for use in other scripts
window.uyirnilam = {
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    formatNumber,
    formatCurrency,
    validateEmail,
    validatePhone,
    getCurrentLocation,
    smoothScrollTo,
    copyToClipboard,
    debounce,
    formatDate,
    timeAgo,
    storage,
    session,
    apiCall,
    validateForm,
    
    // State management
    state: {
        keys: {
            ACTIVE_CROP: 'uyirnilam_active_crop',
            PEST_RESULT: 'uyirnilam_pest_result',
            WEATHER_DATA: 'uyirnilam_weather_cache',
            USER_PREFS: 'uyirnilam_user_prefs'
        },
        
        save: function(key, data) {
            return storage.set(key, data);
        },
        
        load: function(key) {
            return storage.get(key);
        },
        
        syncActiveCrop: function(cropName) {
            this.save(this.keys.ACTIVE_CROP, {
                name: cropName,
                timestamp: new Date().getTime()
            });
            console.log(`🌱 State Sync: Active crop set to ${cropName}`);
        }
    }
};
