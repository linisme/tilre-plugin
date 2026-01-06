# Theme API Reference

Complete documentation for creating til.re themes.

## File Structure

A theme consists of three files:

```
themes/your-theme/
├── manifest.json   # Metadata and configuration
├── your-theme.js   # Theme renderer
└── your-theme.css  # Styles
```

## manifest.json

The manifest defines your theme's metadata and configuration.

```json
{
  "id": "your-theme",
  "version": "1.0.0",
  "tilre": ">=1.0.0",
  "name": "Your Theme",
  "description": "A description of your theme",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/your-username"
  },
  "license": "MIT",
  "type": "functional",
  "files": {
    "js": "your-theme.js",
    "css": "your-theme.css"
  },
  "defaults": {
    "myParam": "default-value"
  },
  "parameters": [
    {
      "name": "myParam",
      "type": "string",
      "default": "default-value",
      "description": "Description of this parameter"
    }
  ],
  "keywords": ["your", "keywords"],
  "examples": [
    { "path": "/5m?theme=your-theme", "label": "Basic usage" }
  ]
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (lowercase, alphanumeric, hyphens) |
| `version` | Yes | Semantic version (e.g., "1.0.0") |
| `tilre` | Yes | Required til.re version (e.g., ">=1.0.0") |
| `name` | Yes | Display name |
| `description` | Yes | Short description |
| `author` | No | Author information |
| `license` | No | License identifier |
| `type` | No | "functional" or "immersive" |
| `files` | Yes | File paths for JS and CSS |
| `defaults` | No | Default configuration values |
| `parameters` | No | Parameter documentation |
| `keywords` | No | Search keywords |
| `examples` | No | Usage examples |

### Theme Types

- **functional**: Minimal UI changes, focuses on displaying time
- **immersive**: Full-screen experience with animations and effects

## Theme Renderer

The JavaScript file must export a renderer object.

### Basic Structure

```javascript
;(function(global) {
  'use strict';

  const YourThemeRenderer = {
    id: 'your-theme',
    handlesControls: false,
    defaults: {},

    init(container, config, actions) {},
    render(remainingMs, context) {},
    setTitle(text) {},
    setMessage(text) {},
    setState(state) {},
    destroy() {}
  };

  // Register with ThemeManager (optional, for built-in usage)
  if (global.ThemeManager) {
    global.ThemeManager.register(YourThemeRenderer);
  }

  // Export for external loading (required)
  global.TilrePlugin_yourtheme = YourThemeRenderer;

})(typeof window !== 'undefined' ? window : this);
```

### Properties

#### id (required)

```javascript
id: 'your-theme'
```

Must match the `id` in manifest.json.

#### handlesControls (required)

```javascript
handlesControls: false  // til.re handles clicks/keyboard
handlesControls: true   // Your theme handles interactions
```

When `true`, your theme is responsible for:
- Click to pause/resume
- Keyboard shortcuts (Space, F, M)
- Visual feedback for pause state

#### defaults (optional)

```javascript
defaults: {
  myParam: 'default-value',
  anotherParam: true
}
```

Default values for your theme's custom parameters.

### Methods

#### init(container, config, actions)

Called once when the theme is loaded.

```javascript
init(container, config, actions) {
  // container: HTMLElement - DOM container to render into
  // config: Object - Merged config (defaults + URL params + shortcut config)
  // actions: Object - { togglePause, reset, fullscreen }

  this._container = container;
  this._config = { ...this.defaults, ...config };
  this._actions = actions;

  // Create your DOM structure
  container.innerHTML = `<div class="your-theme">...</div>`;
}
```

##### The `actions` Object

```javascript
actions.togglePause()  // Toggle pause state
actions.reset()        // Reset timer to beginning
actions.fullscreen()   // Enter/exit fullscreen
```

#### render(remainingMs, context)

Called every frame (~60fps) to update the display.

```javascript
render(remainingMs, context) {
  // remainingMs: number
  //   - Positive: countdown mode (time remaining)
  //   - Negative: countup mode (time elapsed)

  // context: Object
  //   - state: 'active' | 'rest' | 'finished' | 'paused' | 'elapsed'
  //   - isElapsed: boolean - true if in countup mode
  //   - totalMs: number - total duration in milliseconds
  //   - cycle: number - current loop iteration (if looping)
  //   - timeData: Object - pre-computed time data
  //   - units: string - configured units (e.g., 'hms')

  if (!context.timeData) return;

  // Display time
  const prefix = context.isElapsed ? '+' : '';
  this._timeEl.textContent = prefix + context.timeData.total;

  // Update document title
  document.title = `${prefix}${context.timeData.total} - til.re`;
}
```

##### The `timeData` Object

```javascript
{
  total: "25:30",        // Formatted total time
  display: [             // Array of display units
    { unit: 'm', value: 25, formatted: '25' },
    { unit: 's', value: 30, formatted: '30' }
  ],
  values: {              // Raw values
    h: 0, m: 25, s: 30
  },
  formatted: { ... }     // Same as values
}
```

#### setTitle(text)

Called when the title changes.

```javascript
setTitle(text) {
  if (this._titleEl) {
    this._titleEl.textContent = text || '';
  }
}
```

#### setMessage(text)

Called when the message changes (typically on timer completion).

```javascript
setMessage(text) {
  if (this._messageEl) {
    this._messageEl.textContent = text || '';
  }
}
```

#### setState(state)

Called when the timer state changes.

```javascript
setState(state) {
  // state: 'active' | 'rest' | 'finished' | 'paused' | 'elapsed'

  const root = this._rootEl;
  root.classList.remove('state-active', 'state-rest', 'state-finished', 'state-paused', 'state-elapsed');

  if (state) {
    root.classList.add(`state-${state}`);
  }
}
```

##### States

| State | Description |
|-------|-------------|
| `active` | Timer is running (countdown) |
| `rest` | Rest period (if loop with rest enabled) |
| `finished` | Timer completed |
| `paused` | Timer is paused |
| `elapsed` | Countup mode (past target time) |

#### destroy()

Called when the theme is unloaded. Clean up resources here.

```javascript
destroy() {
  // Remove event listeners
  if (this._boundKeydown) {
    document.removeEventListener('keydown', this._boundKeydown);
  }

  // Cancel animations
  if (this._animationId) {
    cancelAnimationFrame(this._animationId);
  }

  // Clean up TimerUI
  if (this._timerUI) {
    TimerUI.destroy(this._timerUI);
  }

  // Clear references
  this._container = null;
  this._elements = null;
}
```

## Global Utilities

### TimerUI

Creates and manages timer DOM elements.

```javascript
// Create timer structure
const timerUI = TimerUI.create(container, 'hms');

// Update display
TimerUI.update(timerUI, context.timeData);

// Cleanup
TimerUI.destroy(timerUI);
```

### TimeFormatter

Format time values.

```javascript
// Parse duration string
const seconds = TimeFormatter.parseDuration('25m'); // 1500

// Decompose milliseconds
const timeData = TimeFormatter.decompose(150000, 'hms', 0);
// { total: "02:30", display: [...], values: { h: 0, m: 2, s: 30 } }
```

### Audio

Play sounds.

```javascript
// Play predefined sound
Audio.play('complete');  // Timer complete
Audio.play('tick');      // Tick sound
Audio.play('rest');      // Rest period start

// Custom beep
Audio.beep({
  frequency: 440,
  duration: 200,
  volume: 0.5,
  type: 'sine'  // 'sine' | 'square' | 'sawtooth' | 'triangle'
});

// Toggle mute
const isEnabled = Audio.toggle();

// Check if enabled
if (Audio.isEnabled()) { ... }
```

## CSS Guidelines

### Class Naming

Use a unique prefix to avoid conflicts:

```css
.your-theme { }
.your-theme-time { }
.your-theme-title { }
```

### State Styling

```css
.your-theme.state-active { }
.your-theme.state-paused { }
.your-theme.state-rest { }
.your-theme.state-finished { }
.your-theme.state-elapsed { }
```

### Responsive Design

```css
@media (max-width: 480px) {
  .your-theme-time {
    font-size: 3rem;
  }
}
```

### CSS Custom Properties

Allow customization via config:

```css
.your-theme {
  --primary-color: #667eea;
}
```

```javascript
init(container, config) {
  if (config.color) {
    root.style.setProperty('--primary-color', `#${config.color}`);
  }
}
```

## Best Practices

1. **Performance**
   - Cache DOM references in `init()`
   - Minimize DOM operations in `render()`
   - Use `requestAnimationFrame` for animations

2. **Memory**
   - Always clean up in `destroy()`
   - Remove all event listeners
   - Cancel all timers and animations

3. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels to buttons
   - Ensure sufficient color contrast

4. **Compatibility**
   - Test on mobile devices
   - Handle touch events
   - Use CSS fallbacks for older browsers
