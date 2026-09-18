// ════════════════════════════════════════════════════════════════════════════
// 🚀 UYIRNILAM AI - ENHANCED NAVIGATION SYSTEM
// Provides instant, smooth page transitions with powerful visual effects
// ════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    let isNavigating = false;
    let transitionOverlay = null;
    const TRANSITION_DURATION = 280; // milliseconds
    const ANIMATION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

    /**
     * Initialize the navigation transition overlay
     * This overlay provides visual feedback during page transitions
     */
    function initTransitionOverlay() {
        let overlay = document.getElementById('nav-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'nav-transition-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(2, 15, 12, 0.98) 0%, rgba(4, 59, 37, 0.98) 100%);
                opacity: 0;
                pointer-events: none;
                z-index: 9998;
                transition: opacity 0.35s ${ANIMATION_EASING};
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                backdrop-filter: blur(8px);
            `;
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <span class="material-symbols-outlined" style="
                        font-size: 48px;
                        color: #10b981;
                        opacity: 0.8;
                        animation: spin 2s linear infinite;
                        display: inline-block;
                        margin-bottom: 16px;
                    ">settings_b_roll</span>
                    <p style="
                        color: #10b981;
                        font-weight: 600;
                        font-size: 14px;
                        margin-top: 8px;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                    "><span id="nav-current-page">Loading</span>...</p>
                </div>
            `;
            document.body.appendChild(overlay);
            transitionOverlay = overlay;
        }
        return transitionOverlay;
    }

    /**
     * Enhanced navigation function with visual feedback
     * @param {string} url - The URL to navigate to
     * @param {string} name - The name of the page (for display)
     */
    window.navTo = function (url, name) {
        if (isNavigating) return; // Prevent rapid successive clicks
        isNavigating = true;

        // Close sidebar on mobile
        closeSidebar();

        // Show transition overlay
        const overlay = initTransitionOverlay();
        const pageNameElement = document.getElementById('nav-current-page');
        if (pageNameElement) {
            pageNameElement.textContent = name;
            pageNameElement.style.animation = 'fadeIn 0.3s ease-in-out';
        }

        // Fade in overlay with delay-free appearance
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });

        // Navigate after visual feedback completes
        setTimeout(() => {
            window.location.href = url;
        }, TRANSITION_DURATION);
    };

    /**
     * Close sidebar with smooth animation
     */
    function closeSidebar() {
        const sidebar = document.getElementById('mainSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');

        if (sidebar && sidebar.classList.contains('sidebar-open')) {
            sidebar.style.animation = `slideOutLeft 0.35s ${ANIMATION_EASING} forwards`;
            if (backdrop) {
                backdrop.style.animation = `fadeOut 0.35s ${ANIMATION_EASING} forwards`;
            }

            setTimeout(() => {
                sidebar.classList.remove('sidebar-open');
                if (backdrop) backdrop.classList.remove('visible');
                document.body.classList.remove('overflow-hidden');
            }, 350);
        }
    }

    /**
     * Enhanced sidebar toggle with smooth animations
     */
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('mainSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');

        if (!sidebar || !backdrop) return;

        const isOpen = sidebar.classList.contains('sidebar-open');

        if (isOpen) {
            // Close animation
            sidebar.style.animation = `slideOutLeft 0.35s ${ANIMATION_EASING} forwards`;
            backdrop.style.animation = `fadeOut 0.35s ${ANIMATION_EASING} forwards`;

            setTimeout(() => {
                sidebar.classList.remove('sidebar-open');
                backdrop.classList.remove('visible');
                document.body.classList.remove('overflow-hidden');
            }, 350);
        } else {
            // Open animation
            sidebar.classList.add('sidebar-open');
            backdrop.classList.add('visible');
            document.body.classList.add('overflow-hidden');

            sidebar.style.animation = `slideInLeft 0.35s ${ANIMATION_EASING} forwards`;
            backdrop.style.animation = `fadeIn 0.35s ${ANIMATION_EASING} forwards`;
        }
    };

    /**
     * Prefetch pages for faster navigation
     */
    function prefetchPages() {
        const pages = [
            '/dashboard',
            '/irrigation',
            '/harvest',
            '/pest',
            '/market'
        ];

        const prefetch = (url) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        };

        if ('requestIdleCallback' in window) {
            pages.forEach(page => {
                requestIdleCallback(() => prefetch(page), { timeout: 2000 });
            });
        } else {
            pages.forEach((page, index) => {
                setTimeout(() => prefetch(page), 500 + (index * 200));
            });
        }
    }

    /**
     * Add hover prefetch for immediate response
     */
    function setupHoverPrefetch() {
        document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('[onclick*="navTo"]');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const href = link.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                    if (href) {
                        const prefetchLink = document.createElement('link');
                        prefetchLink.rel = 'prefetch';
                        prefetchLink.href = href;
                        document.head.appendChild(prefetchLink);
                    }
                });
            });
        });
    }

    /**
     * Update active navigation item based on current URL
     */
    function updateActiveNavItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('[onclick*="navTo"]');

        navItems.forEach(item => {
            const href = item.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (href === currentPath) {
                item.classList.add('active');
                item.style.background = 'rgba(16, 185, 129, 0.15)';
                item.style.color = '#10b981';
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Add keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC to close sidebar
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('mainSidebar');
                if (sidebar && sidebar.classList.contains('sidebar-open')) {
                    window.toggleSidebar();
                }
            }
        });
    }

    /**
     * Handle sidebar backdrop click to close
     */
    function setupBackdropClick() {
        const backdrop = document.getElementById('sidebarBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    window.toggleSidebar();
                }
            });
        }
    }

    /**
     * Initialize all navigation enhancements
     */
    function initializeNavigation() {
        // Initialize overlay
        initTransitionOverlay();

        // Setup event listeners
        document.addEventListener('DOMContentLoaded', () => {
            updateActiveNavItem();
            setupHoverPrefetch();
            setupBackdropClick();
        });

        // Setup keyboard shortcuts
        setupKeyboardShortcuts();

        // Prefetch pages on load
        window.addEventListener('load', () => {
            prefetchPages();

            // Hide overlay when page is loaded
            const overlay = document.getElementById('nav-transition-overlay');
            if (overlay && overlay.style.opacity !== '0') {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                    isNavigating = false;
                }, 100);
            }
        });

        // Reset navigation flag on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isNavigating = false;
            }
        });

        // Add click feedback for nav items
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[onclick*="navTo"]');
            if (link) {
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    function openStageDetails(cropName, stageName) {
        const data = {
            crop: cropName,
            stage: stageName
        };

        localStorage.setItem("selectedStage", JSON.stringify(data));

        window.location.href = "irrigation_new.html";
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }

    // Expose functions globally
    window.navToEnhanced = {
        navTo: window.navTo,
        toggleSidebar: window.toggleSidebar,
        updateActiveNavItem,
        prefetchPages
    };

})();
