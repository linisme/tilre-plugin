/**
 * Gradient Theme - Advanced Theme Example
 *
 * This theme demonstrates advanced features:
 * - Custom parameters from URL/config
 * - CSS animations controlled by JS
 * - Using the TimerUI component
 * - Handling user interactions (handlesControls: true)
 * - Progress bar based on remaining time
 * - State-based styling
 */
;(function(global) {
  'use strict';

  const GradientRenderer = {
    id: 'gradient',

    // This theme handles clicks and keyboard
    handlesControls: true,

    // Default configuration - these can be overridden by URL params
    defaults: {
      gradientSpeed: 5,
      gradientColors: '667eea,764ba2,f093fb',
      pulseEffect: true,
      showProgress: true
    },

    // Internal state
    _container: null,
    _config: null,
    _actions: null,
    _elements: null,
    _timerUI: null,
    _boundKeydown: null,
    _totalMs: 0,

    /**
     * Initialize the theme
     */
    init(container, config = {}, actions = null) {
      // Merge defaults with provided config
      this._config = { ...this.defaults, ...config };
      this._actions = actions;
      this._container = container;

      // Create DOM structure
      this._createDOM();

      // Cache element references
      this._elements = {
        root: container.querySelector('.gradient-theme'),
        title: container.querySelector('.gradient-title'),
        time: container.querySelector('.gradient-time'),
        message: container.querySelector('.gradient-message'),
        progress: container.querySelector('.gradient-progress-bar'),
        playBtn: container.querySelector('.gradient-play-btn'),
        pauseOverlay: container.querySelector('.gradient-pause-overlay')
      };

      // Create timer UI using the TimerUI component
      // This handles dynamic unit display (hms, ms, etc.)
      const units = this._config.units || 'hms';
      this._timerUI = global.TimerUI.create(this._elements.time, units);

      // Apply configuration to styles
      this._applyConfig();

      // Bind interaction events
      this._bindEvents();
    },

    /**
     * Create the DOM structure
     */
    _createDOM() {
      const { showProgress } = this._config;

      this._container.innerHTML = `
        <div class="gradient-theme">
          <div class="gradient-title"></div>
          <div class="gradient-time"></div>
          <div class="gradient-message"></div>

          ${showProgress ? '<div class="gradient-progress"><div class="gradient-progress-bar"></div></div>' : ''}

          <!-- Pause overlay with play button -->
          <div class="gradient-pause-overlay">
            <button class="gradient-play-btn" aria-label="Resume">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <div class="gradient-hints">
              <span>Click to resume</span>
              <span class="gradient-hint-sep">·</span>
              <span>Press F for fullscreen</span>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Apply configuration to CSS custom properties
     */
    _applyConfig() {
      const root = this._elements.root;
      const { gradientSpeed, gradientColors, pulseEffect } = this._config;

      // Parse colors
      const colors = gradientColors.split(',').map(c => `#${c.trim()}`);

      // Set CSS custom properties
      root.style.setProperty('--gradient-speed', `${gradientSpeed}s`);
      root.style.setProperty('--gradient-color-1', colors[0] || '#667eea');
      root.style.setProperty('--gradient-color-2', colors[1] || '#764ba2');
      root.style.setProperty('--gradient-color-3', colors[2] || colors[0] || '#667eea');

      // Toggle pulse effect
      if (!pulseEffect) {
        root.classList.add('no-pulse');
      }
    },

    /**
     * Bind user interaction events
     */
    _bindEvents() {
      const root = this._elements.root;

      // Click anywhere to pause/resume
      root.addEventListener('click', (e) => {
        // Ignore clicks on buttons
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        if (this._actions && this._actions.togglePause) {
          this._actions.togglePause();
        }
      });

      // Double-click for fullscreen
      root.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (this._actions && this._actions.fullscreen) {
          this._actions.fullscreen();
        }
      });

      // Play button in pause overlay
      if (this._elements.playBtn) {
        this._elements.playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this._actions && this._actions.togglePause) {
            this._actions.togglePause();
          }
        });
      }

      // Keyboard shortcuts
      this._boundKeydown = this._handleKeydown.bind(this);
      document.addEventListener('keydown', this._boundKeydown);
    },

    /**
     * Handle keyboard events
     */
    _handleKeydown(e) {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (this._actions && this._actions.togglePause) {
            this._actions.togglePause();
          }
          break;

        case 'KeyF':
          e.preventDefault();
          if (this._actions && this._actions.fullscreen) {
            this._actions.fullscreen();
          }
          break;

        case 'KeyM':
          e.preventDefault();
          // Toggle mute using global Audio
          if (global.Audio && global.Audio.toggle) {
            global.Audio.toggle();
          }
          break;
      }
    },

    /**
     * Render the timer display
     * Called every frame (~60fps)
     */
    render(remainingMs, context = {}) {
      if (!this._elements || !context.timeData) return;

      const isElapsed = context.isElapsed || remainingMs < 0;

      // Store total for progress calculation
      if (context.totalMs) {
        this._totalMs = context.totalMs;
      }

      // Update timer display using TimerUI
      if (this._timerUI) {
        global.TimerUI.update(this._timerUI, context.timeData);
      }

      // Update document title
      const prefix = isElapsed ? '[+] ' : '';
      document.title = `${prefix}${context.timeData.total} - til.re`;

      // Update progress bar
      this._updateProgress(remainingMs, isElapsed);
    },

    /**
     * Update the progress bar
     */
    _updateProgress(remainingMs, isElapsed) {
      if (!this._elements.progress || !this._totalMs) return;

      let progress;
      if (isElapsed) {
        // In elapsed mode, show 100% (completed)
        progress = 100;
      } else {
        // Calculate percentage completed
        const elapsed = this._totalMs - remainingMs;
        progress = Math.max(0, Math.min(100, (elapsed / this._totalMs) * 100));
      }

      this._elements.progress.style.width = `${progress}%`;
    },

    /**
     * Set the title text
     */
    setTitle(text) {
      if (this._elements && this._elements.title) {
        this._elements.title.textContent = text || '';
      }
    },

    /**
     * Set the message text
     */
    setMessage(text) {
      if (this._elements && this._elements.message) {
        this._elements.message.textContent = text || '';
      }
    },

    /**
     * Handle state changes
     */
    setState(state) {
      if (!this._elements || !this._elements.root) return;

      const root = this._elements.root;

      // Remove all state classes
      root.classList.remove(
        'state-active', 'state-rest', 'state-finished', 'state-paused', 'state-elapsed'
      );

      // Add current state class
      if (state) {
        root.classList.add(`state-${state}`);
      }

      // Play completion sound on finish
      if (state === 'finished' && global.Audio && global.Audio.play) {
        global.Audio.play('complete');
      }
    },

    /**
     * Cleanup when theme is destroyed
     */
    destroy() {
      // Remove keyboard listener
      if (this._boundKeydown) {
        document.removeEventListener('keydown', this._boundKeydown);
        this._boundKeydown = null;
      }

      // Clean up TimerUI
      if (this._timerUI) {
        global.TimerUI.destroy(this._timerUI);
        this._timerUI = null;
      }

      // Clear references
      this._container = null;
      this._config = null;
      this._actions = null;
      this._elements = null;
      this._totalMs = 0;
    }
  };

  // Register with ThemeManager (for built-in usage)
  if (global.ThemeManager) {
    global.ThemeManager.register(GradientRenderer);
  }

  // Export for external plugin loading
  global.TilrePlugin_gradient = GradientRenderer;

})(typeof window !== 'undefined' ? window : this);
