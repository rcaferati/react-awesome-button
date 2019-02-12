# &lt;AwesomeButton /&gt;

[![Travis](https://img.shields.io/travis/rcaferati/react-awesome-button/master.svg)](https://travis-ci.org/rcaferati/react-awesome-button) ![NPM](https://img.shields.io/npm/v/react-awesome-button.svg)

`react-awesome-button` is a performant, extendable, highly customisable, production ready React Component that renders an animated set of 3D UI buttons. Bundled together with a *social share* and *progress enabled* components.

[<img width="400" alt="react-awesome-button demo" src="https://github.com/rcaferati/react-awesome-button/blob/master/demo/public/images/theme-set.gif?raw=true">](https://caferati.me/demo/react-awesome-button)

## Live demo

Checkout the `CSS customizer` at <a title="React Awesome Button - CSS Customizer" href="https://caferati.me/demo/react-awesome-button" target="_blank">my portfolio</a>

[<img src="https://github.com/rcaferati/react-awesome-button/blob/master/demo/public/images/react-awesome-button-customizer.png?raw=true" width="800" />](https://caferati.me/demo/react-awesome-button)

## Storybook

Checkout the `Storybook` at <a title="React Awesome Button - CSS Customizer" href="https://caferati.me/demo/react-awesome-button/storybook" target="_blank">my portfolio</a>

[<img src="https://github.com/rcaferati/react-awesome-button/blob/master/demo/public/images/react-awesome-button-storybook.png?raw=true" width="800" />](https://caferati.me/demo/react-awesome-button/storybook)

## Styling with plain CSS and CSS Modules

### Plain CSS
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import 'react-awesome-button/dist/styles.css';

  function Button() {
    return (
      <AwesomeButton type="primary">Button</AwesomeButton>
    );
  }
```

### CSS Modules
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButton
        cssModule={AwesomeButtonStyles}
        type="primary"
      >
        Button
      </AwesomeButton>
    );
  }
```

## Key Features

+ Look and feel customisable and extendable via SASS variables and lists ([scss config file](https://github.com/rcaferati/react-awesome-button/blob/master/src/styles/default.scss))
+ Use it with CSSModules or Plain CSS (NO inline-styles)
+ Render any tag as the component\'s child (text, icon, img, svg)
+ Animated progress button
+ OnClick bubble animation

### <AwesomeButton /> Button Example
Renders a `Button` tag with a callback function on animation release.
Checkout this example live on the storyboard.
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButton
        cssModule={AwesomeButtonStyles}
        type="primary"
        ripple
        onPress={() => {
          alert('pressed');
        }}
      >
        Button
      </AwesomeButton>
    );
  }
```

### <AwesomeButton /> Anchor Example
Render the component with an `anchor` tag setting the href and target attributes.
Checkout this example live on the storyboard.
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButton
        cssModule={AwesomeButtonStyles}
        type="primary"
        href="https://google.com"
        target="_blank"
      >
        Button
      </AwesomeButton>
    );
  }
```

### <AwesomeButton /> Props

| Attribute             | Type          | Default     | Description |
| :---------            | :--:          | :-----:     | :----------- |
| type                  | `string`      | `primary`   | Render a specific button type, styled by the .scss type list |
| size                  | `string`      | `auto`      | Render a specific button size, styled by the .scss size list |
| element               | `node`        | `null`      | Overwrites the default container element renderer, useful for using it with react-router Link component. |
| disabled              | `bool`        | `false`     | Should render a disabled button |
| visible               | `bool`        | `true`      | Should the button be visible |
| ripple               | `bool`        | `false`      | Should render the animated ripple effect |
| action                | `function`    | `null`      | Default click function |
| href                  | `string`      | `null`      | Forces the button to be rendered on an `anchor` container and sets the href to the specified value |
| target                | `string`      | `null`      | When used together with `href` renders an anchor with a specific target attribute |

### <AwesomeButtonProgress /> Basic Example
Checkout this example live on the storyboard.
```jsx
  import { AwesomeButtonProgress } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButtonProgress
        cssModule={AwesomeButtonStyles}
        type="primary"
        onPress={(next) => {
          // do something then -- next()
        }}
      >
        Button
      </AwesomeButton>
    );
  }
```

### <AwesomeButtonProgress /> Props

| Attribute             | Type          | Default     | Description |
| :---------            | :--:          | :-----:     | :----------- |
| loadingLabel          | `string`      | `Wait ..`   | Progress button loading label text |
| resultLabel           | `string`      | `Success`   | Progress button success label text |
| resultLabel           | `string`      | `Success`   | Progress button success label text |
| releaseDelay          | `number`      | 500         | Delay for releasing the button after the progress animation |
| fakePress             | `boolean`     | `false`     | When set to `true` triggers a fake button press |

### <AwesomeButtonSocial /> Basic Example
Checkout this example live on the storyboard.
```jsx
  import { AwesomeButtonProgress } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButtonSocial
        cssModule={AwesomeButtonStyles}
        icon
        type="facebook"
        onPress={(next) => {
          // do something then -- next()
        }}
      >
        Button
      </AwesomeButton>
    );
  }
```

### <AwesomeButtonShare /> Props
| icon              | `bool`        | `false`     | Should render the social icon relative to the button type |
| iconHeight        | `number`      | `23`          | Rendered icon height |
| icon              | `number`      | `30`          | Rendered icon width |
| url               | `string`      | `null`        | Url string to be used on the sharer |
| image             | `string`      | `null`        | Image url to be rendered on the sharer |
| message           | `string`      | `null`        | Message string to be rendered on the sharer |
| phone             | `string`      | `null`        | Phone number to be used on the Whatsapp sharer |
| user              | `string`      | `null`        | Username to be used on the Messenger sharer |

## Author
#### Rafael Caferati
+ Checkout my <a href="https://caferati.me" title="Full-Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full-Stack Web Developer Website</a>
+ Other open source projects @ <a title="Web Software Developer Code Laboratory" target="_blank" href="https://caferati.me/labs">Code Laboratory</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://caferati.me/portfolio">Web Portfolio</a>

## License

MIT. Copyright (c) 2017 Rafael Caferati.
