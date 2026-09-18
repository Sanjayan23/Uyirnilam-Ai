/**
 * SmoothScrollEnhancer.js
 * Professional horizontal scroll interaction system for Uyirnilam AI.
 */

class SmoothScrollEnhancer {
    constructor(elementOrId, options = {}) {
        this.container = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        if (!this.container) return;

        this.options = Object.assign({
            scrollSpeed: 3,         // Base scroll speed (pixels per frame)
            acceleration: 1.2,      // Increase speed as mouse gets closer to edge
            hoverZoneWidth: 0.15,   // 15% of container width on either side
            dragInertia: 0.92,      // Inertia multiplier for dragging
            enableDrag: true,        // Enable mouse-drag (grab and scroll)
            enableEdgeFades: true    // Show gradient fades at edges
        }, options);

        this.scrollDir = 0; // -1 (left), 1 (right), or 0 (none)
        this.rafId = null;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.velocity = 0;
        this.lastX = 0;
        this.lastTime = 0;

        this.init();
    }

    init() {
        // Essential wrapper for edge fades if enabled
        if (this.options.enableEdgeFades) {
            this.setupEdgeFades();
        }

        // Mouse Events for Edge-Hover Auto-scroll
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.stopScrolling());

        // Mouse Events for Dragging (Grab & Scroll)
        if (this.options.enableDrag) {
            this.container.addEventListener('mousedown', (e) => this.startDragging(e));
            window.addEventListener('mousemove', (e) => this.drag(e));
            window.addEventListener('mouseup', () => this.stopDragging());
        }

        // Scroll position monitoring (for edge fades visibility)
        this.container.addEventListener('scroll', () => this.updateFadeVisibility());
        window.addEventListener('resize', () => this.updateFadeVisibility());
        this.updateFadeVisibility();
    }

    setupEdgeFades() {
        // Ensure parent is relative
        const wrapper = this.container.parentElement;
        if (getComputedStyle(wrapper).position === 'static') {
            wrapper.style.position = 'relative';
        }

        // Add fades if not exist
        if (!wrapper.querySelector('.scroll-fade-left')) {
            const leftFade = document.createElement('div');
            leftFade.className = 'scroll-fade-left';
            wrapper.appendChild(leftFade);
        }
        if (!wrapper.querySelector('.scroll-fade-right')) {
            const rightFade = document.createElement('div');
            rightFade.className = 'scroll-fade-right';
            wrapper.appendChild(rightFade);
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) return;

        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const zoneWidth = width * this.options.hoverZoneWidth;

        if (x < zoneWidth) {
            // Mouse is on LEFT side
            const factor = Math.max(1, (zoneWidth - x) / zoneWidth * this.options.acceleration);
            this.startScrolling(-1, factor);
        } else if (x > width - zoneWidth) {
            // Mouse is on RIGHT side
            const factor = Math.max(1, (x - (width - zoneWidth)) / zoneWidth * this.options.acceleration);
            this.startScrolling(1, factor);
        } else {
            this.stopScrolling();
        }
    }

    startScrolling(dir, factor = 1) {
        if (this.scrollDir === dir) return;
        this.scrollDir = dir;
        this.scrollFactor = factor;

        if (!this.rafId) {
            const scrollLoop = () => {
                if (this.scrollDir !== 0) {
                    this.container.scrollLeft += this.scrollDir * this.options.scrollSpeed * (this.scrollFactor || 1);
                    this.rafId = requestAnimationFrame(scrollLoop);
                } else {
                    this.rafId = null;
                }
            };
            this.rafId = requestAnimationFrame(scrollLoop);
        }
    }

    stopScrolling() {
        this.scrollDir = 0;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    startDragging(e) {
        if (e.button !== 0) return; // Only left-click
        this.isDragging = true;
        this.container.style.scrollBehavior = 'auto'; // Disable smooth scroll during drag
        this.startX = e.pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
        this.velocity = 0;
        this.lastX = e.pageX;
        this.lastTime = Date.now();
        this.stopScrolling();
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - this.container.offsetLeft;
        const walk = (x - this.startX); 
        this.container.scrollLeft = this.scrollLeft - walk;

        // Calculate velocity for inertia
        const now = Date.now();
        const dt = now - this.lastTime;
        if (dt > 0) {
            this.velocity = (e.pageX - this.lastX) / dt;
        }
        this.lastX = e.pageX;
        this.lastTime = now;
    }

    stopDragging() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.scrollBehavior = 'smooth';

        // Apply Inertia
        if (Math.abs(this.velocity) > 0.1) {
            this.applyInertia();
        }
    }

    applyInertia() {
        const inertiaLoop = () => {
            if (Math.abs(this.velocity) < 0.05 || this.isDragging) {
                this.velocity = 0;
                return;
            }
            this.container.scrollLeft -= this.velocity * 16; // Approx 16ms frame
            this.velocity *= this.options.dragInertia;
            requestAnimationFrame(inertiaLoop);
        };
        requestAnimationFrame(inertiaLoop);
    }

    updateFadeVisibility() {
        const c = this.container;
        const wrapper = c.parentElement;
        const tolerance = 5;

        const isLeftScrollable = c.scrollLeft > tolerance;
        const isRightScrollable = c.scrollLeft < (c.scrollWidth - c.clientWidth - tolerance);

        if (isLeftScrollable) {
            wrapper.classList.add('is-scrollable-left');
        } else {
            wrapper.classList.remove('is-scrollable-left');
        }

        if (isRightScrollable) {
            wrapper.classList.add('is-scrollable-right');
        } else {
            wrapper.classList.remove('is-scrollable-right');
        }
    }
}

// Global initialization helper
window.initSmoothScroll = (selector, options) => {
    const els = document.querySelectorAll(selector);
    return Array.from(els).map(el => new SmoothScrollEnhancer(el, options));
};
