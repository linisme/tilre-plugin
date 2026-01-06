# til.re Plugin Template

A template repository for creating custom themes and shortcuts for [til.re](https://til.re).

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a step-by-step guide to create your first plugin.

## What's Included

### Example Themes

| Theme | Type | Description |
|-------|------|-------------|
| `hello` | functional | Minimal starter theme - perfect for learning |
| `gradient` | immersive | Advanced theme with animations and custom parameters |

### Example Shortcuts

| Shortcut | Time | Description |
|----------|------|-------------|
| `focus` | 25m | Simple focus timer |
| `break` | 5m | Short break with green color |
| `focus-loop` | 25m | Pomodoro-style with rest periods |
| `workout` | 30s | HIIT-style workout intervals |
| `demo-gradient` | 5m | Demo using the gradient theme |

## Using This Template

### 1. Create Your Repository

Click "Use this template" on GitHub or clone this repository:

```bash
git clone https://github.com/til-re/plugin-template.git my-plugins
cd my-plugins
```

### 2. Local Development

Start a local server to preview your themes:

```bash
# Using Node.js
npx serve .

# Or using Python
python -m http.server 8080
```

Then open `http://localhost:8080/dev-server.html` in your browser.

### 3. Create Your Plugin

- **Theme**: Copy `themes/hello/` and modify
- **Shortcut**: Add entries to `shortcuts/demo.json` or create a new pack

### 4. Publish

Push your repository to GitHub. Your plugins will be available at:

```
# Theme
https://til.re/25m?theme=@your-username/your-repo:your-theme

# Shortcut
https://til.re/@your-username/your-repo:your-shortcut
```

## Plugin Types

### Themes

Themes control the visual appearance and user interactions of the timer.

```
themes/
├── index.json          # Theme catalog
└── your-theme/
    ├── manifest.json   # Theme metadata
    ├── your-theme.js   # Theme renderer
    └── your-theme.css  # Theme styles
```

See [docs/theme-api.md](./docs/theme-api.md) for the complete API reference.

### Shortcuts

Shortcuts are predefined timer configurations with semantic names.

```
shortcuts/
├── index.json          # Shortcut catalog
└── your-pack.json      # Shortcut definitions
```

See [docs/shortcuts-guide.md](./docs/shortcuts-guide.md) for details.

## Theme API Overview

A theme must implement these methods:

```javascript
const MyTheme = {
  id: 'my-theme',           // Must match manifest.json
  handlesControls: false,    // Set true to handle click/keyboard
  defaults: {},              // Default config values

  init(container, config, actions) { /* Create DOM */ },
  render(remainingMs, context) { /* Update display */ },
  setTitle(text) { /* Update title */ },
  setMessage(text) { /* Update message */ },
  setState(state) { /* Handle state changes */ },
  destroy() { /* Cleanup */ }
};

// Export for plugin loading
window.TilrePlugin_mytheme = MyTheme;
```

## Global Utilities

These utilities are available in the til.re environment:

| Utility | Description |
|---------|-------------|
| `TimerUI.create(container, units)` | Create timer DOM structure |
| `TimerUI.update(elements, timeData)` | Update timer display |
| `TimeFormatter.decompose(ms, units, compact)` | Format time data |
| `Audio.play(type)` | Play sound ('tick', 'complete', 'rest') |
| `Audio.toggle()` | Toggle mute |

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [docs/theme-api.md](./docs/theme-api.md) - Complete theme API reference
- [docs/shortcuts-guide.md](./docs/shortcuts-guide.md) - Shortcuts development guide
- [docs/faq.md](./docs/faq.md) - Frequently asked questions

## Examples in Action

After publishing to GitHub:

```
# Use the hello theme
https://til.re/5m?theme=@til-re/plugin-template:hello

# Use the gradient theme
https://til.re/5m?theme=@til-re/plugin-template:gradient

# Use the focus shortcut
https://til.re/@til-re/plugin-template:focus

# Use gradient with custom colors
https://til.re/5m?theme=@til-re/plugin-template:gradient&gradientColors=ff6b6b,4ecdc4
```

## License

MIT
