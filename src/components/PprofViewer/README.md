# PProf Viewer React Component

A clean, production-ready React component for visualizing pprof profiles with interactive flame graphs.

## Features

- 🔥 **Interactive Flame Graphs** - Click to focus, hover for details
- 🎨 **Customizable Colors** - Built-in color schemes or custom color functions
- 📱 **Responsive Design** - Works in any container size
- 🎯 **TypeScript Support** - Full type safety and IntelliSense
- 🔍 **Search & Filter** - Find functions by name
- 📊 **Multiple Sample Types** - CPU time, memory, custom metrics
- 🎨 **Themeable** - CSS custom properties for easy customization
- 📦 **Self-Contained** - No external dependencies beyond React and pprof-format

## Installation

```bash
npm install pprof-format react react-dom
```

## Basic Usage

```tsx
import { PprofViewer } from './components/PprofViewer';
import { Profile } from 'pprof-format';

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Load your profile data...

  return (
    <div style={{ height: '100vh' }}>
      <PprofViewer profile={profile} />
    </div>
  );
}
```

## Advanced Usage

### Custom Color Schemes

```tsx
import { PprofViewer, flamegraphColorSchemes } from './components/PprofViewer';

// Use built-in color schemes
<PprofViewer
  profile={profile}
  colorFunction={flamegraphColorSchemes.classic} // orange/brown flame graph colors
/>

// Or create your own
const customColors = (functionName: string) => {
  // Your color logic here
  return '#ff6b6b';
};

<PprofViewer
  profile={profile}
  colorFunction={customColors}
/>
```

### Compact Layout

Perfect for embedding in sidebars or constrained spaces:

```tsx
<PprofViewer
  profile={profile}
  headerStyle="compact"
  width={400}
  height={600}
/>
```

### Custom Theming

```tsx
<PprofViewer
  profile={profile}
  theme={{
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    headerBackgroundColor: '#2d2d2d',
    borderColor: '#404040',
  }}
/>
```

## Component API

### PprofViewerProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `profile` | `Profile` | Required | Pre-parsed profile from pprof-format |
| `colorFunction` | `(name: string) => string` | Built-in pastel | Custom color function for flame boxes |
| `headerStyle` | `'default' \| 'compact'` | `'default'` | Layout style for controls |
| `theme` | `PprofTheme` | - | Theme customization object |
| `width` | `number \| string` | `'100%'` | Container width |
| `height` | `number \| string` | `'100%'` | Container height |
| `initialSampleType` | `number` | Last available | Initial sample type to display |
| `className` | `string` | - | CSS class for root container |
| `style` | `CSSProperties` | - | Inline styles for root container |

### Built-in Color Schemes

- `flamegraphColorSchemes.pastel` - Default deterministic pastel colors
- `flamegraphColorSchemes.classic` - Traditional orange/brown flame graph colors
- `flamegraphColorSchemes.blue` - Blue color palette
- `flamegraphColorSchemes.green` - Green color palette
- `flamegraphColorSchemes.monochrome` - Grayscale colors

### Theme Properties

```typescript
interface PprofTheme {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  tooltipBackgroundColor?: string;
  tooltipTextColor?: string;
  highlightColor?: string;
  focusedFontWeight?: string;
  // ... and more
}
```

## Loading Profile Data

The component expects a `Profile` object from the `pprof-format` package:

```tsx
import { Profile } from 'pprof-format';

async function loadProfile(file: File): Promise<Profile> {
  const arrayBuffer = await file.arrayBuffer();
  let data;

  // Handle gzipped files
  const head = new Uint8Array(arrayBuffer.slice(0, 2));
  const isGz = head[0] === 0x1f && head[1] === 0x8b;

  if (isGz) {
    const ds = new DecompressionStream("gzip");
    const decompressed = file.stream().pipeThrough(ds);
    const decompressedBuffer = await new Response(decompressed).arrayBuffer();
    data = new Uint8Array(decompressedBuffer);
  } else {
    data = new Uint8Array(arrayBuffer);
  }

  return Profile.decode(data);
}
```

## CSS Customization

The component uses CSS modules with CSS custom properties for easy theming:

```css
.my-pprof-container {
  --pprof-background-color: #1a1a1a;
  --pprof-text-color: #ffffff;
  --pprof-border-color: #404040;
  --pprof-header-background-color: #2d2d2d;
  /* ... other properties */
}
```

## Standalone Usage

This component is designed to be easily extracted as a standalone npm package. It has minimal dependencies and uses CSS modules for scoped styling.

To extract:
1. Copy the `PprofViewer` directory
2. Add dependencies: `react`, `react-dom`, `pprof-format`
3. Ensure CSS modules support in your build system
4. Export from `index.ts`

## Browser Support

- Modern browsers with ES2020+ support
- CSS custom properties support
- CompressionStream API for gzipped files (or provide a polyfill)

## Performance

- Optimized for large profiles with thousands of stack frames
- Uses React.memo and useMemo for efficient re-renders
- Virtualizes flame graph rendering for smooth scrolling
- Minimal DOM manipulation, pure React patterns