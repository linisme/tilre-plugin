# Frequently Asked Questions

## General

### How do I use my plugin after publishing?

After pushing to GitHub, your plugins are available via:

```
# Theme
https://til.re/5m?theme=@YOUR-USERNAME/YOUR-REPO:theme-id

# Shortcut
https://til.re/@YOUR-USERNAME/YOUR-REPO:shortcut-name
```

### How long until my changes are live?

GitHub's CDN (jsDelivr) caches files. Changes may take up to 24 hours to propagate. For immediate updates, you can:

1. Create a new release/tag
2. Append a cache-busting query: `?v=1.0.1`

### Can I use private repositories?

No, plugins must be in public GitHub repositories to be accessible via the CDN.

---

## Themes

### My theme doesn't load. What's wrong?

Check these common issues:

1. **ID Mismatch**: Ensure `id` in manifest.json matches:
   - The renderer's `id` property
   - The export name: `TilrePlugin_[id]`

2. **File Names**: Verify files match manifest.json:
   ```json
   "files": {
     "js": "mytheme.js",   // Must exist
     "css": "mytheme.css"  // Must exist
   }
   ```

3. **JavaScript Errors**: Check browser console for errors

4. **Export**: Ensure you export correctly:
   ```javascript
   window.TilrePlugin_mytheme = MyThemeRenderer;
   ```

### How do I add custom parameters?

1. Define in manifest.json:
   ```json
   "defaults": {
     "myParam": "default"
   },
   "parameters": [{
     "name": "myParam",
     "type": "string",
     "default": "default"
   }]
   ```

2. Read in JavaScript:
   ```javascript
   init(container, config) {
     const myParam = config.myParam || this.defaults.myParam;
   }
   ```

3. Use via URL:
   ```
   til.re/5m?theme=@user/repo:mytheme&myParam=custom
   ```

### How do I handle click interactions?

Set `handlesControls: true` and add event listeners:

```javascript
init(container, config, actions) {
  this._actions = actions;

  container.addEventListener('click', () => {
    this._actions.togglePause();
  });
}
```

### My animations lag. How do I optimize?

1. **Use CSS animations** instead of JavaScript when possible

2. **Cache DOM references**:
   ```javascript
   init(container) {
     this._timeEl = container.querySelector('.time');
   }
   ```

3. **Minimize DOM operations** in `render()`:
   ```javascript
   render(ms, context) {
     // Only update if changed
     if (this._lastTime !== context.timeData.total) {
       this._timeEl.textContent = context.timeData.total;
       this._lastTime = context.timeData.total;
     }
   }
   ```

4. **Use `will-change`** for animated elements:
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

### How do I play sounds?

Use the global `Audio` utility:

```javascript
// Play predefined sounds
Audio.play('complete');  // Timer done
Audio.play('tick');      // Every second
Audio.play('rest');      // Rest period

// Custom beep
Audio.beep({
  frequency: 440,
  duration: 200,
  volume: 0.5
});

// Check mute state
if (Audio.isEnabled()) { ... }
```

### How do I support dark/light modes?

Check the system preference:

```javascript
init(container) {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

Or use CSS:

```css
@media (prefers-color-scheme: light) {
  .mytheme {
    background: white;
    color: black;
  }
}
```

---

## Shortcuts

### Can I reference another shortcut?

No, shortcuts cannot reference other shortcuts. Each shortcut must define its own time and config.

### Can I use external themes in shortcuts?

Yes! Use the full theme identifier:

```json
{
  "my-shortcut": {
    "time": "5m",
    "config": {
      "theme": "@username/repo:theme-id"
    }
  }
}
```

### How do I set up a countdown to a specific date?

Use absolute time format:

```json
{
  "event": {
    "time": "2026-12-25",
    "config": {
      "title": "Christmas Countdown",
      "units": "dhms"
    }
  }
}
```

### How do I create recurring timers?

Use cycle expressions:

```json
{
  "daily-standup": {
    "time": "hourofday9",
    "config": {
      "title": "Until Standup"
    }
  }
}
```

Available cycles:
- `hourofday[0-23]`
- `dayofweek[1-7]` (Monday=1)
- `minuteofhour[0-59]`

---

## Development

### How do I debug my theme?

1. **Use dev-server.html** for local testing

2. **Add console logs**:
   ```javascript
   render(ms, context) {
     console.log('Render:', ms, context);
   }
   ```

3. **Check browser DevTools**:
   - Console for errors
   - Network tab for failed loads
   - Elements tab for DOM issues

### My CSS isn't loading

Check these:

1. File path in manifest.json is correct
2. CSS syntax is valid
3. Class names match between JS and CSS
4. No caching issues (try hard refresh)

### How do I test different states?

Use the dev server controls or manually trigger:

```javascript
// In browser console
const theme = window.TilrePlugin_mytheme;
theme.setState('paused');
theme.setState('rest');
theme.setState('finished');
```

---

## Publishing

### What license should I use?

MIT is recommended for maximum compatibility. Add a `LICENSE` file to your repository.

### Should I minify my code?

Not required. The CDN handles compression. Keep code readable for easier debugging and contributions.

### How do I update my plugin?

1. Update version in manifest.json
2. Push changes to GitHub
3. Wait for CDN cache to refresh (up to 24 hours)

For immediate updates, use a new version tag.

### Can others contribute to my plugin?

Yes! Set up your repository like any open source project:
- Add CONTRIBUTING.md
- Enable issues and pull requests
- Add a code of conduct if desired
