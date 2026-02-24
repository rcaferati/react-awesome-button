# React `<AwesomeButton />` UI Components

`@rcaferati/react-awesome-button` provides three related button components:

- **`AwesomeButton`** — animated base button
- **`AwesomeButtonProgress`** — progress flow wrapper on top of `AwesomeButton`
- **`AwesomeButtonSocial`** — social/share wrapper on top of `AwesomeButton`

This README is updated for the current component patterns and prop behavior.

---

## Installation

```bash
npm install @rcaferati/react-awesome-button
```

---

## Quick Start

### Plain CSS (no CSS Modules)

```jsx
import React from 'react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';
import '@rcaferati/react-awesome-button/styles.css';

export default function Example() {
  return <AwesomeButton type="primary">Button</AwesomeButton>;
}
```

---

## Styling with Theme CSS Modules (Blue Theme)

If you want to use the package theme module object (for `cssModule`), import a built theme module and pass it to the component.

> Note: depending on your bundler/module interop, the imported theme may be on `.default`.

```jsx
import React from 'react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

export default function Example() {
  return (
    <AwesomeButton cssModule={blueTheme} type="primary">
      Button
    </AwesomeButton>
  );
}
```

---

## `AwesomeButton`

### Basic button (`button` element)

If `href` is **not** provided, `AwesomeButton` renders a button-like element and calls `onPress` on release.

```jsx
import React from 'react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

export default function Example() {
  return (
    <AwesomeButton
      cssModule={blueTheme}
      type="primary"
      onPress={() => {
        // do something
      }}>
      Button
    </AwesomeButton>
  );
}
```

### Anchor mode (`href` provided)

If `href` is provided, it renders anchor-like behavior and lets native navigation happen.

```jsx
import React from 'react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

export default function Example() {
  return (
    <AwesomeButton
      cssModule={blueTheme}
      type="primary"
      href="https://example.com"
      containerProps={{ target: '_blank', rel: 'noreferrer noopener' }}>
      Open website
    </AwesomeButton>
  );
}
```

### Icons (recommended pattern)

Use `before` / `after` to render icons.  
For **icon-only** buttons, pass the icon using `before` and omit children.

```jsx
import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

export default function Example() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <AwesomeButton
        cssModule={blueTheme}
        type="primary"
        size="medium"
        before={<Sparkles size={16} aria-hidden="true" />}
        after={<ArrowRight size={16} aria-hidden="true" />}>
        Continue
      </AwesomeButton>

      {/* Icon-only button */}
      <AwesomeButton
        cssModule={blueTheme}
        type="primary"
        size="medium"
        before={<Play size={16} aria-hidden="true" />}
      />
    </div>
  );
}
```

### Sizes and auto width

- `size="small" | "medium" | "large"` → fixed-size button
- `size={null}` → **auto width** (content-driven width)

```jsx
import React from 'react';
import { AwesomeButton } from '@rcaferati/react-awesome-button';

export default function Example() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <AwesomeButton size="small" type="primary">
        Small
      </AwesomeButton>
      <AwesomeButton size="medium" type="primary">
        Medium
      </AwesomeButton>
      <AwesomeButton size="large" type="primary">
        Large
      </AwesomeButton>
      <AwesomeButton size={null} type="primary">
        Auto width grows with content
      </AwesomeButton>
    </div>
  );
}
```

---

## `AwesomeButton` Props (current)

| Prop             | Type                             |     Default | Description                                                                 |
| ---------------- | -------------------------------- | ----------: | --------------------------------------------------------------------------- |
| `type`           | `string`                         | `'primary'` | Visual variant key (styled by theme/class names)                            |
| `size`           | `string \| null`                 |      `null` | Button size key (`'small'`, `'medium'`, `'large'`) or `null` for auto width |
| `active`         | `boolean`                        |     `false` | Controlled pressed/active visual state                                      |
| `disabled`       | `boolean`                        |     `false` | Disables interactions                                                       |
| `visible`        | `boolean`                        |      `true` | Toggles visible state class                                                 |
| `placeholder`    | `boolean`                        |      `true` | If `true` and `children` is empty, renders placeholder/disabled state       |
| `between`        | `boolean`                        |     `false` | Uses `space-between` layout for content (useful with icons)                 |
| `ripple`         | `boolean`                        |     `false` | Enables ripple effect on successful press release                           |
| `moveEvents`     | `boolean`                        |      `true` | Enables pointer move position classes (`left/middle/right`)                 |
| `href`           | `string \| null`                 |      `null` | Enables anchor-like mode                                                    |
| `element`        | `React component \| null`        |      `null` | Custom forwarded root element component                                     |
| `rootElement`    | `string`                         | `'aws-btn'` | Base class prefix                                                           |
| `className`      | `string \| null`                 |      `null` | Extra class names                                                           |
| `style`          | `React.CSSProperties`            |        `{}` | Inline styles for root element                                              |
| `containerProps` | `object`                         |        `{}` | Additional props forwarded to root element                                  |
| `cssModule`      | `Record<string, string> \| null` |      `null` | CSS module mapping (theme object)                                           |
| `before`         | `React.ReactNode`                |      `null` | Content rendered before label                                               |
| `after`          | `React.ReactNode`                |      `null` | Content rendered after label                                                |
| `extra`          | `React.ReactNode`                |      `null` | Extra content rendered inside wrapper (used by wrappers like Progress)      |
| `children`       | `React.ReactNode`                |      `null` | Main label/content                                                          |
| `onPress`        | `(event) => void`                |      `null` | Called on press release/activation                                          |
| `onPressed`      | `(event) => void`                |      `null` | Called when press-in animation completes                                    |
| `onReleased`     | `(element: HTMLElement) => void` |      `null` | Called when release cycle is cleared                                        |
| `onMouseDown`    | `(event) => void`                |      `null` | Pointer/mouse/touch down callback                                           |
| `onMouseUp`      | `(event) => void`                |      `null` | Pointer/mouse/touch up callback                                             |

---

## `AwesomeButtonProgress`

`AwesomeButtonProgress` wraps `AwesomeButton` and manages a progress lifecycle.  
Its `onPress` receives a second callback argument:

- `next(true)` → success flow
- `next(false, 'Failed')` → error flow

### Basic success flow (async)

```jsx
import React from 'react';
import { AwesomeButtonProgress } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Example() {
  return (
    <AwesomeButtonProgress
      cssModule={blueTheme}
      type="primary"
      loadingLabel="Verifying…"
      resultLabel="Verified!"
      releaseDelay={500}
      onPress={async (_event, next) => {
        await sleep(900);
        next(true);
      }}>
      Verify
    </AwesomeButtonProgress>
  );
}
```

### Error flow

```jsx
import React from 'react';
import { AwesomeButtonProgress } from '@rcaferati/react-awesome-button';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Example() {
  return (
    <AwesomeButtonProgress
      type="danger"
      loadingLabel="Publishing…"
      resultLabel="Done!"
      onPress={async (_event, next) => {
        await sleep(900);
        next(false, 'Failed');
      }}>
      Publish
    </AwesomeButtonProgress>
  );
}
```

### With icon (`before`)

```jsx
import React from 'react';
import { Shield } from 'lucide-react';
import { AwesomeButtonProgress } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Example() {
  return (
    <AwesomeButtonProgress
      cssModule={blueTheme}
      type="primary"
      size="medium"
      before={<Shield size={16} aria-hidden="true" />}
      loadingLabel="Verifying…"
      resultLabel="Verified!"
      onPress={async (_event, next) => {
        await sleep(900);
        next(true);
      }}>
      Verify signature
    </AwesomeButtonProgress>
  );
}
```

### `AwesomeButtonProgress` specific props

> `AwesomeButtonProgress` accepts all `AwesomeButton` props **except** `active` and replaces `onPress` with the progress version below.

| Prop           | Type                    |      Default | Description                                                         |
| -------------- | ----------------------- | -----------: | ------------------------------------------------------------------- |
| `onPress`      | `(event, next) => void` |       `null` | Progress action handler. Call `next(true)` or `next(false, label?)` |
| `loadingLabel` | `string`                |   `'Wait..'` | Loading phase label                                                 |
| `resultLabel`  | `string`                | `'Success!'` | Success label                                                       |
| `releaseDelay` | `number`                |        `500` | Delay before reset after progress end                               |

---

## `AwesomeButtonSocial`

`AwesomeButtonSocial` wraps `AwesomeButton` and builds a social/share action when no custom `onPress` is provided.

### Behavior summary (current)

On press, the component follows this order:

1. If you provide `onPress`, **your handler is used** (full override)
2. If `href` is provided, **native anchor navigation** is used
3. Otherwise it builds a share payload and:
   - tries `navigator.share(...)` on mobile (when supported)
   - falls back to popup/window share (or direct URL fallback for some types like `instagram`)

### Basic share example (GitHub style + custom icon)

```jsx
import React from 'react';
import { Github } from 'lucide-react';
import { AwesomeButtonSocial } from '@rcaferati/react-awesome-button';
import themeBlue from '@rcaferati/react-awesome-button/themes/theme-blue';

const blueTheme = themeBlue?.default ?? themeBlue;

export default function Example() {
  return (
    <AwesomeButtonSocial
      cssModule={blueTheme}
      type="github"
      before={<Github size={16} aria-hidden="true" />}
      sharer={{
        url: 'https://example.com',
        message: 'Check this out',
      }}>
      GitHub
    </AwesomeButtonSocial>
  );
}
```

### WhatsApp example

```jsx
import React from 'react';
import { AwesomeButtonSocial } from '@rcaferati/react-awesome-button';

export default function Example() {
  return (
    <AwesomeButtonSocial
      type="whatsapp"
      sharer={{
        phone: '5511999999999',
        message: 'Hello from AwesomeButton',
        url: 'https://example.com',
      }}>
      WhatsApp
    </AwesomeButtonSocial>
  );
}
```

### Instagram-style button (direct URL fallback)

`instagram` is treated as a direct URL fallback (no dedicated web popup sharer endpoint).

```jsx
import React from 'react';
import { AwesomeButtonSocial } from '@rcaferati/react-awesome-button';

export default function Example() {
  return (
    <AwesomeButtonSocial
      type="instagram"
      sharer={{
        url: 'https://example.com',
        message: 'Open this link',
      }}>
      Instagram
    </AwesomeButtonSocial>
  );
}
```

### `href` mode (bypass sharer logic)

If `href` is present, the component behaves like an anchor and does **not** execute the share flow.

```jsx
import React from 'react';
import { AwesomeButtonSocial } from '@rcaferati/react-awesome-button';

export default function Example() {
  return (
    <AwesomeButtonSocial
      type="github"
      href="https://github.com/your-org/your-repo"
      containerProps={{ target: '_blank', rel: 'noreferrer noopener' }}>
      Open GitHub
    </AwesomeButtonSocial>
  );
}
```

### `AwesomeButtonSocial` specific props

> `AwesomeButtonSocial` accepts all `AwesomeButton` props and adds the props below.

| Prop             | Type                                |                       Default | Description                                                     |
| ---------------- | ----------------------------------- | ----------------------------: | --------------------------------------------------------------- |
| `sharer`         | `object`                            |                          `{}` | Share payload source (falls back to page metadata when omitted) |
| `dimensions`     | `{ width: number; height: number }` | `{ width: 640, height: 480 }` | Popup window dimensions for share flows                         |
| `sharer.url`     | `string`                            |              current page URL | URL to share (falls back to `window.location.href`)             |
| `sharer.message` | `string`                            |                    page title | Share message/text (falls back to document title)               |
| `sharer.image`   | `string`                            |               `og:image` meta | Image URL used by supported sharers (e.g. Pinterest)            |
| `sharer.phone`   | `string`                            |                        `null` | Phone for WhatsApp                                              |
| `sharer.user`    | `string`                            |                        `null` | Username for Messenger direct flow                              |

### Supported share `type` values (Sharer utility)

The built-in sharer currently recognizes these values:

- `facebook`
- `twitter`
- `pinterest`
- `linkedin`
- `reddit`
- `whatsapp`
- `messenger`
- `mail`
- `instagram`

> Any other value can still be used as a visual button type, but the built-in share payload may return empty if the sharer type is unsupported.

---

## Notes on CSS Modules / Theme Objects

When using the theme module import, some bundlers expose the object as `default`.  
This pattern is safe:

```js
const blueTheme = themeBlue?.default ?? themeBlue;
```

Then pass it to any button component via:

```jsx
<AwesomeButton cssModule={blueTheme}>Button</AwesomeButton>
```

---

## Recommended patterns (current)

### ✅ Icon-only buttons

Use `before` and omit `children`:

```jsx
<AwesomeButton before={<Play size={16} aria-hidden="true" />} />
```

### ✅ Progress buttons

Use `onPress={async (_event, next) => { ...; next(true|false); }}`  
Do **not** pass manual `loading` props to `AwesomeButtonProgress`.

### ✅ Social buttons

Use `before` for icons (e.g. Lucide icons).  
The social component does **not** need built-in icon usage to work.

---

## License

MIT
