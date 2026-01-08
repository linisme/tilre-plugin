/**
 * Chinese New Year Theme - Universal Edition
 * 
 * Features:
 * - Auto-detects Zodiac animal based on year.
 * - Dynamic Paper Cut background (12 Zodiacs).
 * - Relative Date Logic: Treats the countdown target as "Day 1".
 * - Interactive Firecrackers & Particle System.
 */
;(function(global) {
  'use strict';

  // Simplified paths for 12 Zodiacs (Paper Cut Style)
  // These represent the Chinese characters or stylized forms
  const ZODIACS = [
    { name: 'Rat', char: '鼠', path: 'M20,80 Q50,10 80,80 Q50,60 20,80 M30,40 Q20,20 40,20 Q60,20 50,40' },
    { name: 'Ox', char: '牛', path: 'M20,30 Q50,10 80,30 L50,80 Z M30,30 L20,10 M70,30 L80,10' },
    { name: 'Tiger', char: '虎', path: 'M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20 M40,40 L60,40 M50,40 L50,70' },
    { name: 'Rabbit', char: '兔', path: 'M30,50 Q30,20 40,10 Q50,20 50,40 Q50,20 60,10 Q70,20 70,50 Q80,80 50,90 Q20,80 30,50' },
    { name: 'Dragon', char: '龙', path: 'M20,80 Q40,20 80,20 Q60,50 80,80 Q50,70 20,80 M30,40 L50,30 L40,60' },
    { name: 'Snake', char: '蛇', path: 'M40,90 Q10,70 40,50 Q70,30 40,10 Q60,10 70,20' },
    { name: 'Horse', char: '马', path: 'M20,40 Q30,10 50,20 Q70,10 80,40 Q80,70 50,60 Q20,70 20,40 M30,20 L30,10' },
    { name: 'Goat', char: '羊', path: 'M20,30 Q50,80 80,30 M30,30 L20,10 M70,30 L80,10 M50,30 L50,80' },
    { name: 'Monkey', char: '猴', path: 'M30,30 Q50,10 70,30 Q90,50 70,80 Q50,90 30,80 Q10,50 30,30 M20,40 Q10,40 10,50 M80,40 Q90,40 90,50' },
    { name: 'Rooster', char: '鸡', path: 'M30,80 Q50,20 80,50 Q80,80 50,90 M30,30 L40,20 L50,30' },
    { name: 'Dog', char: '狗', path: 'M20,50 Q30,20 50,30 Q70,20 80,50 Q70,90 50,80 Q30,90 20,50 M30,30 L20,10 M70,30 L80,10' },
    { name: 'Pig', char: '猪', path: 'M20,40 Q50,10 80,40 Q90,70 80,90 Q50,100 20,90 Q10,70 20,40 M35,55 Q50,55 65,55' }
  ];

  const COUPLETS = {
    default: ['岁岁平安', '年年有余'],
    eve: ['欢声辞旧', '笑语迎新'],
    day1: ['恭喜发财', '万事如意'],
    day2: ['迎春接福', '回娘家去'],
    post: ['五福临门', '六六大顺']
  };

  const ChunjieRenderer = {
    id: 'chunjie',
    handlesControls: true,

    _container: null,
    _elements: null,
    _currentMode: null,
    _actions: null,
    _boundKeydown: null,
    _particleInterval: null,
    
    // Config state
    _year: 0,
    _zodiacIndex: 0,
    _targetDate: 0, // Should be Day 1 00:00:00

    init(container, config = {}, actions = null) {
      this._container = container;
      this._actions = actions;

      // 1. Determine Target Year and Date
      // If config.targetDate exists (from til.re core), use it as CNY Day 1.
      // Otherwise, try to parse year from config, or default to next year.
      const now = new Date();
      if (config.targetDate) {
        this._targetDate = new Date(config.targetDate).getTime();
        this._year = new Date(this._targetDate).getFullYear();
      } else if (config.year) {
        this._year = parseInt(config.year, 10);
        // Fallback: If only year is given, we don't know the exact CNY date,
        // so we can't do exact Eve/Day1 logic unless we have a lunar library.
        // For now, we'll assume Feb 1st as a rough placeholder if no date given
        this._targetDate = new Date(`${this._year}-02-01`).getTime(); 
      } else {
        // Default to current year or next if close to end
        this._year = now.getFullYear();
        if (now.getMonth() > 6) this._year++;
        // Rough estimate for demo purposes if no URL provided
        this._targetDate = new Date(`${this._year}-02-01`).getTime(); 
      }

      // 2. Calculate Zodiac
      // 0: Rat, 1: Ox, ... (Year - 4) % 12
      this._zodiacIndex = (this._year - 4) % 12;
      if (this._zodiacIndex < 0) this._zodiacIndex += 12;
      
      const zodiac = ZODIACS[this._zodiacIndex];

      // Icons
      const fsIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
      const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

      // Build DOM
      container.innerHTML = `
        <div class="chunjie-theme">
          <!-- Background Decor (Dynamic Zodiac) -->
          <div class="chunjie-bg-zodiac">
             <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
               <path d="${zodiac.path}" fill="currentColor" opacity="0.8" />
               <text x="50" y="55" font-size="40" text-anchor="middle" fill="currentColor" dy=".3em" style="font-weight:bold; opacity: 0.3">${zodiac.char}</text>
             </svg>
          </div>

          <!-- Decorations -->
          <div class="chunjie-lantern lantern-left"></div>
          <div class="chunjie-lantern lantern-right"></div>
          
          <div class="chunjie-couplet couplet-left"></div>
          <div class="chunjie-couplet couplet-right"></div>

          <!-- Firecrackers -->
          <div class="chunjie-firecracker-string fc-left" title="Click to explode!">
             <div class="fc-head"></div>
             ${this._generateFirecrackers()}
          </div>
          <div class="chunjie-firecracker-string fc-right" title="Click to explode!">
             <div class="fc-head"></div>
             ${this._generateFirecrackers()}
          </div>

          <!-- Main Content -->
          <div class="chunjie-content">
            <div class="chunjie-title"></div>
            <div class="chunjie-time"></div>
            <div class="chunjie-message"></div>
          </div>

          <!-- Controls -->
          <div class="chunjie-controls">
            <button class="chunjie-btn btn-pause" title="Play/Pause (Space)">${pauseIcon}</button>
            <button class="chunjie-btn btn-fullscreen" title="Fullscreen (F)">${fsIcon}</button>
          </div>

          <!-- Pause Overlay -->
          <div class="chunjie-pause-overlay">
            <div class="chunjie-pause-text">已暂停</div>
          </div>
        </div>
      `;

      this._elements = {
        root: container.querySelector('.chunjie-theme'),
        title: container.querySelector('.chunjie-title'),
        time: container.querySelector('.chunjie-time'),
        message: container.querySelector('.chunjie-message'),
        coupletLeft: container.querySelector('.couplet-left'),
        coupletRight: container.querySelector('.couplet-right'),
        btnPause: container.querySelector('.btn-pause'),
        btnFullscreen: container.querySelector('.btn-fullscreen'),
        firecrackers: container.querySelectorAll('.chunjie-firecracker-string')
      };

      this._bindEvents();
      this._updateDailyMode(); // Initial check
      this._startParticles();
    },

    _generateFirecrackers() {
      let html = '';
      for (let i = 0; i < 12; i++) {
        const r = Math.random() * 20 - 10;
        html += `<div class="fc-item" style="--r:${r}deg"></div>`;
      }
      return html;
    },

    _bindEvents() {
      // Fullscreen
      this._elements.btnFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._actions && this._actions.fullscreen) this._actions.fullscreen();
      });

      // Pause
      this._elements.btnPause.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._actions && this._actions.togglePause) this._actions.togglePause();
      });

      // Firecrackers
      this._elements.firecrackers.forEach(fc => {
        fc.addEventListener('click', (e) => {
          e.stopPropagation();
          this._explodeFirecracker(fc);
        });
      });

      // Keyboard
      this._boundKeydown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'KeyF') {
          e.preventDefault();
          if (this._actions?.fullscreen) this._actions.fullscreen();
        } else if (e.code === 'Space') {
          e.preventDefault();
          if (this._actions?.togglePause) this._actions.togglePause();
        }
      };
      document.addEventListener('keydown', this._boundKeydown);
    },

    _explodeFirecracker(el) {
      if (el.classList.contains('firecracker-exploding')) return;
      el.classList.add('firecracker-exploding');
      setTimeout(() => {
        el.classList.remove('firecracker-exploding');
        // Reset view
        const items = el.querySelectorAll('.fc-item');
        items.forEach(item => { item.style.opacity = '1'; item.style.transform = 'none'; });
      }, 1000);
    },

    _startParticles() {
      this._particleInterval = setInterval(() => {
        if (document.hidden) return;
        this._spawnParticle();
      }, 400);
    },

    _spawnParticle() {
      if (!this._elements || !this._elements.root) return;
      const p = document.createElement('div');
      p.classList.add('chunjie-particle');
      
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 3;
      const isSquare = Math.random() > 0.5;

      if (isSquare) p.classList.add('shape-square');
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.animationDuration = `${duration}s`;

      this._elements.root.appendChild(p);
      setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, duration * 1000);
    },

    render(remainingMs, context = {}) {
      if (!this._elements) return;

      const timeStr = context.timeData ? context.timeData.total : '--:--';
      const prefix = context.isElapsed ? '+' : '';
      this._elements.time.textContent = prefix + timeStr;
      
      document.title = `${prefix}${timeStr} - 春节`;

      // Check mode occasionally
      if (Math.random() < 0.05) this._updateDailyMode();
    },

    /**
     * Determines the current "mode" (Eve, Day1, Day2) based on the target date.
     * Logic:
     * - Target Date (00:00:00) is the start of Day 1.
     * - Eve is 24h before Day 1.
     * - Day 2 is 24h after Day 1.
     */
    _updateDailyMode() {
      const now = Date.now();
      let mode = 'default';

      const day1Start = this._targetDate;
      const eveStart = day1Start - 86400000; // -24h
      const day2Start = day1Start + 86400000; // +24h
      const day3Start = day2Start + 86400000; // +48h

      if (now >= eveStart && now < day1Start) mode = 'eve';
      else if (now >= day1Start && now < day2Start) mode = 'day1';
      else if (now >= day2Start && now < day3Start) mode = 'day2';
      else if (now >= day3Start) mode = 'post';

      if (this._currentMode === mode) return;
      this._currentMode = mode;

      // Update CSS classes
      const root = this._elements.root;
      root.classList.remove('mode-eve', 'mode-day1', 'mode-day2');
      if (mode !== 'default' && mode !== 'post') {
        root.classList.add(`mode-${mode}`);
      }

      // Update Text
      const text = COUPLETS[mode] || COUPLETS.default;
      this._elements.coupletLeft.textContent = text[0];
      this._elements.coupletRight.textContent = text[1];

      // Dynamic Title
      if (mode === 'day1') this._elements.title.textContent = "大年初一 · 新年快乐";
      else if (mode === 'day2') this._elements.title.textContent = "大年初二 · 吉祥如意";
      else if (mode === 'eve') this._elements.title.textContent = "除夕倒计时";
      else this._elements.title.textContent = `春节倒计时 (${this._year})`;
    },

    setTitle() {},
    setMessage(t) { if (this._elements?.message) this._elements.message.textContent = t || ''; },

    setState(state) {
      if (!this._elements?.root) return;
      this._elements.root.classList.remove('state-active', 'state-rest', 'state-finished', 'state-paused', 'state-elapsed');
      if (state) this._elements.root.classList.add(`state-${state}`);
      
      if (this._elements.btnPause) {
        const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        this._elements.btnPause.innerHTML = state === 'paused' ? playIcon : pauseIcon;
      }
    },

    destroy() {
      if (this._boundKeydown) document.removeEventListener('keydown', this._boundKeydown);
      if (this._particleInterval) clearInterval(this._particleInterval);
      this._container = null;
      this._elements = null;
      this._actions = null;
    }
  };

  if (global.ThemeManager) global.ThemeManager.register(ChunjieRenderer);
  global.TilrePlugin_chunjie = ChunjieRenderer;

})(typeof window !== 'undefined' ? window : this);
