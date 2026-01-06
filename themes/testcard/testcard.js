/**
 * Testcard Theme - PM5544 Style
 */
;(function(global) {
  'use strict';

  const Testcard = {
    id: 'testcard',
    handlesControls: true, // We handle controls ourselves
    defaults: { showCrtEffect: true, logo: 'TIL.RE' },

    _container: null,
    _config: null,
    _actions: null,
    _el: null,
    _timerUI: null,
    _hideTimer: null,
    _isPaused: false,

    init(container, config = {}, actions = null) {
      this._config = { ...this.defaults, ...config };
      this._container = container;
      this._actions = actions;
      this._render();
      this._el = {
        root: container.querySelector('.testcard-theme'),
        cornerBl: container.querySelector('.tc-corner-bl'),
        time: container.querySelector('.tc-time'),
        msg: container.querySelector('.tc-msg'),
        playBtn: container.querySelector('.tc-btn-play'),
        resetBtn: container.querySelector('.tc-btn-reset'),
        fsBtn: container.querySelector('.tc-btn-fs')
      };
      if (!this._config.showCrtEffect) this._el.root.classList.add('no-crt');
      if (global.TimerUI) {
        this._timerUI = global.TimerUI.create(this._el.time, this._config.units || 'hms');
      }
      this._bindEvents();
    },

    _render() {
      const { logo } = this._config;

      // Stripes: gradient black -> white -> black
      const stripeColors = [];
      for (let i = 0; i <= 15; i++) {
        const v = Math.round(i * 255 / 15).toString(16).padStart(2, '0');
        stripeColors.push(`#${v}${v}${v}`);
      }
      for (let i = 14; i >= 0; i--) {
        const v = Math.round(i * 255 / 15).toString(16).padStart(2, '0');
        stripeColors.push(`#${v}${v}${v}`);
      }
      const stripes = stripeColors.map(c => `<div style="background:${c}"></div>`).join('');

      // Gray rows (11 blocks each)
      const g1 = [], g2 = [];
      for (let i = 0; i <= 10; i++) {
        const v1 = Math.round(i * 255 / 10).toString(16).padStart(2, '0');
        g1.push(`#${v1}${v1}${v1}`);
        const v2 = Math.round(i * 240 / 10 + 8).toString(16).padStart(2, '0');
        g2.push(`#${v2}${v2}${v2}`);
      }
      const gr1 = g1.map(c => `<div style="background:${c}"></div>`).join('');
      const gr2 = g2.map(c => `<div style="background:${c}"></div>`).join('');

      // SVG icons
      const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      const resetIcon = `<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`;
      const fsIcon = `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;

      this._container.innerHTML = `
<div class="testcard-theme">
  <div class="tc-grid"></div>

  <!-- Corners -->
  <div class="tc-corner tc-corner-tl"><div class="tc-b"></div><div class="tc-w"></div><div class="tc-w"></div><div class="tc-b"></div></div>
  <div class="tc-corner tc-corner-tr"><div class="tc-w"></div><div class="tc-b"></div><div class="tc-b"></div><div class="tc-w"></div></div>
  <div class="tc-corner tc-corner-bl">
    <button class="tc-btn tc-btn-play tc-w" title="Play/Pause">${pauseIcon}</button>
    <button class="tc-btn tc-btn-reset tc-b" title="Reset">${resetIcon}</button>
    <button class="tc-btn tc-btn-fs tc-b" title="Fullscreen">${fsIcon}</button>
    <div class="tc-w"></div>
  </div>
  <div class="tc-corner tc-corner-br"><div class="tc-b"></div><div class="tc-w"></div><div class="tc-w"></div><div class="tc-b"></div></div>

  <!-- Side bars -->
  <div class="tc-side tc-side-l"><div class="s1"></div><div class="s2"></div><div class="s3"></div><div class="s4"></div></div>
  <div class="tc-side tc-side-r"><div class="s1"></div><div class="s2"></div><div class="s3"></div><div class="s4"></div></div>

  <!-- Circles -->
  <div class="tc-circle-w"></div>
  <div class="tc-circle-b">
    <div class="tc-inner">
      <!-- Time -->
      <div class="tc-time-box"><span class="tc-time">00:00:00</span></div>

      <!-- Vertical line -->
      <div class="tc-vline"></div>

      <!-- Stripes -->
      <div class="tc-stripes">${stripes}</div>

      <!-- Color bars -->
      <div class="tc-colors">
        <div class="c1"></div><div class="c2"></div><div class="c3"></div>
        <div class="c4"></div><div class="c5"></div><div class="c6"></div>
      </div>

      <!-- Center crosshair -->
      <div class="tc-center">
        <div class="tc-cross-v"></div>
        <div class="tc-cross-h"></div>
        <div class="tc-cross-box"></div>
      </div>

      <!-- Grayscale -->
      <div class="tc-gray">
        <div class="tc-gray-row">${gr1}</div>
        <div class="tc-gray-row">${gr2}</div>
      </div>

      <!-- Resolution -->
      <div class="tc-res">
        <div style="background:#000"></div>
        <div class="tc-res-sparse"></div>
        <div class="tc-res-lines"></div>
        <div style="background:#000"></div>
      </div>

      <!-- Yellow -->
      <div class="tc-yellow">
        <div class="tc-yellow-br-l"></div>
        <div class="tc-yellow-arc"></div>
        <div class="tc-yellow-red"></div>
        <div class="tc-yellow-br-r"></div>
      </div>
    </div>
  </div>

  <!-- Logo -->
  <div class="tc-logo"><span>${this._esc(logo)}</span></div>

  <div class="tc-msg"></div>
  <div class="tc-crt"></div>
</div>`;

      // Store icons for later use
      this._icons = { play: playIcon, pause: pauseIcon };
    },

    _bindEvents() {
      const root = this._el.root;

      // Mouse movement - show controls
      this._onMouseMove = () => {
        root.classList.add('show-controls');
        clearTimeout(this._hideTimer);
        this._hideTimer = setTimeout(() => {
          root.classList.remove('show-controls');
        }, 2500);
      };
      root.addEventListener('mousemove', this._onMouseMove);
      root.addEventListener('mouseenter', this._onMouseMove);

      // Mouse leave - hide controls
      this._onMouseLeave = () => {
        clearTimeout(this._hideTimer);
        root.classList.remove('show-controls');
      };
      root.addEventListener('mouseleave', this._onMouseLeave);

      // Play/Pause button
      this._el.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._actions?.togglePause) {
          this._actions.togglePause();
        }
      });

      // Reset button
      this._el.resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._actions?.reset) {
          this._actions.reset();
        }
      });

      // Fullscreen button
      this._el.fsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._actions?.fullscreen) {
          this._actions.fullscreen();
        } else {
          // Fallback
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }
      });

      // Keyboard shortcuts
      this._onKeydown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.code) {
          case 'Space':
            e.preventDefault();
            if (this._actions?.togglePause) this._actions.togglePause();
            break;
          case 'KeyR':
            e.preventDefault();
            if (this._actions?.reset) this._actions.reset();
            break;
          case 'KeyF':
            e.preventDefault();
            if (this._actions?.fullscreen) {
              this._actions.fullscreen();
            } else if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
            break;
        }
      };
      document.addEventListener('keydown', this._onKeydown);
    },

    _esc(s) {
      const d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    },

    render(ms, ctx = {}) {
      if (!this._el?.time || !ctx.timeData) return;
      if (this._timerUI && global.TimerUI) {
        global.TimerUI.update(this._timerUI, ctx.timeData);
      } else {
        this._el.time.textContent = ctx.timeData.total || '00:00:00';
      }
      document.title = `${ctx.isElapsed ? '[+] ' : ''}${ctx.timeData.total} - til.re`;
    },

    setTitle() {},
    setMessage(t) { if (this._el?.msg) this._el.msg.textContent = t || ''; },

    setState(s) {
      if (!this._el?.root) return;

      // Update class
      const classes = ['testcard-theme'];
      if (s) classes.push(`state-${s}`);
      if (!this._config.showCrtEffect) classes.push('no-crt');
      if (this._el.root.classList.contains('show-controls')) classes.push('show-controls');
      this._el.root.className = classes.join(' ');

      // Update play/pause button icon
      this._isPaused = (s === 'paused');
      if (this._el.playBtn && this._icons) {
        this._el.playBtn.innerHTML = this._isPaused ? this._icons.play : this._icons.pause;
      }

      if (s === 'finished' && global.Audio?.play) global.Audio.play('complete');
    },

    destroy() {
      // Remove event listeners
      if (this._el?.root) {
        this._el.root.removeEventListener('mousemove', this._onMouseMove);
        this._el.root.removeEventListener('mouseenter', this._onMouseMove);
        this._el.root.removeEventListener('mouseleave', this._onMouseLeave);
      }
      document.removeEventListener('keydown', this._onKeydown);
      clearTimeout(this._hideTimer);

      if (this._timerUI && global.TimerUI) global.TimerUI.destroy(this._timerUI);
      this._timerUI = null;
      this._container = null;
      this._el = null;
      this._actions = null;
    }
  };

  if (global.ThemeManager) global.ThemeManager.register(Testcard);
  global.TilrePlugin_testcard = Testcard;
})(typeof window !== 'undefined' ? window : this);
