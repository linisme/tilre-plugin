/**
 * Hello Theme - A Minimal Starter Theme
 *
 * This is the simplest possible theme implementation.
 * Use this as a starting point for your own themes.
 *
 * Theme Lifecycle:
 * 1. init() - Called once when theme loads
 * 2. render() - Called every frame (~60fps) with time data
 * 3. setTitle() - Called when title changes
 * 4. setMessage() - Called when message changes
 * 5. setState() - Called when state changes (active/paused/finished/etc)
 * 6. destroy() - Called when theme is unloaded
 */
;(function(global) {
  'use strict';

  const HelloRenderer = {
    // Unique theme ID - must match manifest.json "id"
    id: 'hello',

    // Whether this theme handles user interactions (click, keyboard)
    // Set to false to let til.re handle default controls
    handlesControls: false,

    // Default configuration values
    defaults: {},

    // Internal state
    _container: null,
    _elements: null,

    /**
     * Initialize the theme
     * @param {HTMLElement} container - DOM container to render into
     * @param {Object} config - Merged config (defaults + URL params + shortcut config)
     * @param {Object} actions - App actions: { togglePause, reset, fullscreen }
     */
    init(container, config = {}, actions = null) {
      this._container = container;

      // Create DOM structure
      container.innerHTML = `
        <div class="hello-theme">
          <div class="hello-title"></div>
          <div class="hello-time"></div>
          <div class="hello-message"></div>
        </div>
      `;

      // Cache element references for better performance
      this._elements = {
        root: container.querySelector('.hello-theme'),
        title: container.querySelector('.hello-title'),
        time: container.querySelector('.hello-time'),
        message: container.querySelector('.hello-message')
      };
    },

    /**
     * Render the timer display
     * Called every frame (~60fps)
     *
     * @param {number} remainingMs - Remaining time in milliseconds
     *   - Positive: countdown mode
     *   - Negative: countup/elapsed mode (use Math.abs() for display)
     * @param {Object} context - Current state context
     *   - context.state: 'active' | 'rest' | 'finished' | 'paused' | 'elapsed'
     *   - context.isElapsed: true if in countup mode
     *   - context.totalMs: total duration in milliseconds
     *   - context.timeData: pre-computed time data from TimeFormatter
     *   - context.units: configured units string (e.g., 'hms')
     */
    render(remainingMs, context = {}) {
      if (!this._elements || !context.timeData) return;

      // Display time with + prefix for elapsed mode
      const prefix = context.isElapsed ? '+' : '';
      this._elements.time.textContent = prefix + context.timeData.total;

      // Update document title
      document.title = `${prefix}${context.timeData.total} - til.re`;
    },

    /**
     * Set the title text
     * @param {string} text - Title text
     */
    setTitle(text) {
      if (this._elements && this._elements.title) {
        this._elements.title.textContent = text || '';
      }
    },

    /**
     * Set the message text (shown when timer finishes)
     * @param {string} text - Message text
     */
    setMessage(text) {
      if (this._elements && this._elements.message) {
        this._elements.message.textContent = text || '';
      }
    },

    /**
     * Handle state changes
     * @param {string} state - One of: 'active', 'rest', 'finished', 'paused', 'elapsed'
     */
    setState(state) {
      if (!this._elements || !this._elements.root) return;

      // Remove all state classes
      this._elements.root.classList.remove(
        'state-active', 'state-rest', 'state-finished', 'state-paused', 'state-elapsed'
      );

      // Add current state class
      if (state) {
        this._elements.root.classList.add(`state-${state}`);
      }
    },

    /**
     * Cleanup when theme is destroyed
     * Always clean up event listeners and timers here
     */
    destroy() {
      this._container = null;
      this._elements = null;
    }
  };

  // Register with ThemeManager (for built-in usage)
  if (global.ThemeManager) {
    global.ThemeManager.register(HelloRenderer);
  }

  // Export for external plugin loading
  // The name MUST be: TilrePlugin_[theme-id]
  global.TilrePlugin_hello = HelloRenderer;

})(typeof window !== 'undefined' ? window : this);
