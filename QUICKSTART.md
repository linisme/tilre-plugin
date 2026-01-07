# Quick Start Guide

Create your first til.re plugin in 5 minutes.

## Prerequisites

- A GitHub account
- A text editor
- A local web server (optional, for development)

## Create Your First Theme

### Step 1: Copy the Template

Clone or download this repository:

```bash
git clone https://github.com/til-re/plugin-template.git my-plugins
cd my-plugins
```

### Step 2: Create Theme Directory

Copy the hello theme as a starting point:

```bash
cp -r themes/hello themes/mytheme
```

### Step 3: Update manifest.json

Edit `themes/mytheme/manifest.json`:

```json
{
  "id": "mytheme",
  "version": "1.0.0",
  "tilre": ">=1.0.0",
  "name": "My Theme",
  "description": "My first til.re theme",
  "files": {
    "js": "mytheme.js",
    "css": "mytheme.css"
  },
  "defaults": {}
}
```

### Step 4: Rename Files

```bash
mv themes/mytheme/hello.js themes/mytheme/mytheme.js
mv themes/mytheme/hello.css themes/mytheme/mytheme.css
```

### Step 5: Update JavaScript

Edit `themes/mytheme/mytheme.js`:

1. Change `id: 'hello'` to `id: 'mytheme'`
2. Change `TilrePlugin_hello` to `TilrePlugin_mytheme`
3. Customize the DOM structure and rendering

```javascript
const MyThemeRenderer = {
  id: 'mytheme',  // ← Must match manifest.json
  // ... rest of implementation
};

window.TilrePlugin_mytheme = MyThemeRenderer;  // ← Must match id
```

### Step 6: Customize Styles

Edit `themes/mytheme/mytheme.css`:

```css
.hello-theme {  /* Rename to .mytheme-theme */
  background: #your-color;
  /* ... your styles */
}
```

### Step 7: Update Index

Add your theme to `themes/index.json`:

```json
{
  "version": "1.0.0",
  "themes": [
    {
      "id": "mytheme",
      "name": "My Theme",
      "description": "My first til.re theme",
      "path": "mytheme",
      "preview": "mytheme/preview.png"
    }
  ]
}
```

### Step 8: Test Locally

Start a local server:

```bash
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080/dev-server.html` and select your theme.

### Step 9: Publish

1. Create a new GitHub repository
2. Push your code:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/my-plugins.git
git push -u origin main
```

3. Use your theme:

```
https://til.re/5m?theme=@YOUR-USERNAME/my-plugins:mytheme
```

---

## Create Your First Shortcut

Shortcuts are even easier - just JSON!

### Step 1: Edit shortcuts/demo.json

Add your shortcut:

```json
{
  "id": "demo",
  "version": "1.0.0",
  "shortcuts": {
    "myshortcut": {
      "time": "25m",
      "config": {
        "title": "My Timer",
        "timeup": "Done!"
      }
    }
  }
}
```

### Step 2: Publish

Push to GitHub and use:

```
https://til.re/@YOUR-USERNAME/my-plugins:myshortcut
```

---

## Common Configurations

### Timer with Loop and Rest

```json
{
  "time": "25m",
  "config": {
    "title": "Work",
    "rest_title": "Break",
    "loop": true,
    "rest": "5m"
  }
}
```

### Custom Colors

```json
{
  "time": "10m",
  "config": {
    "color": "ff6b6b",
    "bg": "1a1a2e"
  }
}
```

### Using Your Theme

```json
{
  "time": "5m",
  "config": {
    "theme": "@YOUR-USERNAME/my-plugins:mytheme",
    "title": "Custom Theme Demo"
  }
}
```

---

## Next Steps

- Read [docs/theme-api.md](./docs/theme-api.md) for the complete API
- Study the `gradient` theme for advanced features
- Check [docs/faq.md](./docs/faq.md) for troubleshooting

## Need Help?

- Open an issue on [GitHub](https://github.com/til-re/plugin-template/issues)
- Check the [til.re documentation](https://docs.til.re)
