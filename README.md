
# MotionS 🚀

The premium animation engine for high-end web interactions. Fluid, organic, and powerful.

## ✨ New in V1.2: "The Continuity Update"

- **🧬 3D Continuity**: Advanced `rotateX`, `rotateY`, and `z` transforms with perspective inheritance.
- **🎨 Color Interpolation**: Smoothly animate backgrounds, fill, and borders between hex, rgb, and named colors.
- **🧩 Automatic Layout**: Just add the `layout` prop to any motion component for buttery-smooth FLIP transitions.
- **🌫️ Filter Suite**: Animate `blur`, `grayscale`, `hue-rotate`, and more using the same spring physics.
- **⚡ Fixed-Timestep Engine**: Zero jitters. Precise calculation even under heavy CPU load.

---

## 📦 One-Click Installation (PowerShell)

The fastest way to get started. Run this command in your project root:

```powershell
irm https://motions.dev/install.ps1 | iex
```
*(Replace URL with your actual hosted link when live)*

Alternative local manual install:
```bash
npm install @motions/react # For React
npm install @motions/dom   # For Vanilla JS
```

---

## 🚀 Quick Start

### React 3D Card

```tsx
<motion.div
  initial={{ rotateX: -45, opacity: 0 }}
  animate={{ rotateX: 0, opacity: 1 }}
  whileHover={{ scale: 1.1, rotateY: 15 }}
  transition={{ spring: 'bouncy' }}
  style={{ perspective: 1000 }}
>
  I'm a 3D Card!
</motion.div>
```

### Layout Transitions

```tsx
<motion.div layout>
  This box automagically animates when its position changes!
</motion.div>
```

---

## 🔥 Pro Features

### Custom Spring Physics
Control the feel with surgical precision or use our curated presets:
- `gentle`: Smooth and organic.
- `bouncy`: Energetic with overshoot.
- `stiff`: Rapid and decisive.
- `snappy`: High velocity, minimal bounce.

### SVG Drawing
Animate SVG paths by simply passing `pathLength`.
```tsx
<motion.path
  d="..."
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
/>
```

### Hooks API
- `useCycle`: Minimalist state switcher.
- `useFollowPointer`: Effortless mouse/touch interaction.
- `useAnimation`: Pro-level imperative control.

---

## 🛠️ Development

1. `npm install`
2. `npm run build`
3. `cd demo && npm run dev`

Stay fluid. Stay MotionS.
