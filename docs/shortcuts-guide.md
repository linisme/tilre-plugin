# Shortcuts Development Guide

Create predefined timer configurations for til.re.

## What Are Shortcuts?

Shortcuts are named timer presets that encode time and configuration into a simple URL:

```
https://til.re/pomodoro
```

Instead of:

```
https://til.re/25m?title=Focus&loop=true&rest=5m&rest_title=Break
```

## File Structure

```
shortcuts/
├── index.json      # Catalog of shortcut packs
└── your-pack.json  # Your shortcut definitions
```

## Creating a Shortcut Pack

### 1. Create the Pack File

Create `shortcuts/your-pack.json`:

```json
{
  "id": "your-pack",
  "version": "1.0.0",
  "tilre": ">=1.0.0",
  "name": "Your Pack",
  "description": "A collection of useful shortcuts",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/your-username"
  },
  "license": "MIT",
  "shortcuts": {
    "shortcut-name": {
      "time": "25m",
      "config": {
        "title": "My Timer"
      }
    }
  }
}
```

### 2. Add to Index

Update `shortcuts/index.json`:

```json
{
  "version": "1.0.0",
  "packs": [
    {
      "id": "your-pack",
      "name": "Your Pack",
      "description": "A collection of useful shortcuts",
      "file": "your-pack.json"
    }
  ]
}
```

### 3. Use Your Shortcuts

After publishing to GitHub:

```
https://til.re/@your-username/your-repo:shortcut-name
```

## Shortcut Format

Each shortcut has two parts:

```json
{
  "shortcut-name": {
    "time": "...",      // Time expression (required)
    "config": { ... }   // Configuration (optional)
  }
}
```

### Time Expressions

| Type | Example | Description |
|------|---------|-------------|
| Relative | `25m`, `1.5h`, `90s` | Duration from now |
| Absolute | `17:00`, `2026-01-01` | Fixed time point |
| Cycle | `hourofday17` | Periodic time |

### Config Options

All URL parameters can be used in config:

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Timer title |
| `timeup` | string | Message on completion |
| `theme` | string | Theme ID |
| `loop` | boolean | Enable looping |
| `rest` | string | Rest duration (e.g., "5m") |
| `rest_title` | string | Rest period title |
| `color` | string | Primary color (hex) |
| `bg` | string | Background color (hex) |
| `font` | string | Font style |
| `scale` | number | Scale multiplier |
| `units` | string | Time units (e.g., "hms") |
| `compact` | number | Compact display mode |
| `mute` | boolean | Mute sounds |
| `wakelock` | boolean | Keep screen on |

## Examples

### Simple Timer

```json
{
  "tea": {
    "time": "5m",
    "config": {
      "title": "Brewing tea",
      "timeup": "Ready to drink!"
    }
  }
}
```

### Pomodoro Style

```json
{
  "pomodoro": {
    "time": "25m",
    "config": {
      "title": "Focus",
      "rest_title": "Break",
      "loop": true,
      "rest": "5m"
    }
  }
}
```

### HIIT Workout

```json
{
  "hiit": {
    "time": "30s",
    "config": {
      "title": "Work",
      "rest_title": "Rest",
      "loop": true,
      "rest": "10s",
      "color": "ef4444"
    }
  }
}
```

### With Custom Theme

```json
{
  "fancy-timer": {
    "time": "10m",
    "config": {
      "title": "My Fancy Timer",
      "theme": "@your-username/your-repo:your-theme",
      "color": "667eea"
    }
  }
}
```

### Recurring Daily

```json
{
  "lunch": {
    "time": "hourofday12",
    "config": {
      "title": "Until Lunch"
    }
  }
}
```

### Absolute Date

```json
{
  "new-year": {
    "time": "2026-01-01",
    "config": {
      "title": "New Year Countdown",
      "units": "dhms"
    }
  }
}
```

## Priority Order

When the same option is set in multiple places, this priority applies:

1. URL parameters (highest)
2. Shortcut config
3. Theme defaults (lowest)

Example:
```
til.re/@user/repo:shortcut?color=ff0000
```

If shortcut sets `color: "00ff00"`, the URL value `ff0000` wins.

## Best Practices

1. **Use Descriptive Names**
   ```json
   "morning-standup": { ... }    // Good
   "ms": { ... }                 // Avoid
   ```

2. **Set Meaningful Titles**
   ```json
   {
     "title": "Focus Time",      // Good
     "title": "Timer"            // Too generic
   }
   ```

3. **Use timeup Messages**
   ```json
   {
     "title": "Cooking pasta",
     "timeup": "Drain the pasta!"
   }
   ```

4. **Group Related Shortcuts**
   - Create separate packs for different use cases
   - Use clear pack names and descriptions

5. **Test Your Shortcuts**
   - Verify all shortcuts work before publishing
   - Check on both desktop and mobile
