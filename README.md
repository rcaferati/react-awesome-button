# &lt;AwesomeButton /&gt;

[![Travis](https://img.shields.io/travis/rcaferati/react-awesome-button/master.svg)](https://travis-ci.org/rcaferati/react-awesome-button) ![NPM](https://img.shields.io/npm/v/react-awesome-button.svg)

`react-awesome-button` is a performant, extendable, highly customisable, production ready React Component that renders an animated set of 3D UI buttons.

[<img width="400" alt="react-awesome-button demo" src="https://github.com/rcaferati/react-awesome-button/blob/master/demo/images/theme-set.gif?raw=true">](https://caferati.me/demo/react-awesome-button)

## Live demo

Checkout the `CSS customizer` at <a title="React Awesome Button - CSS Customizer" href="https://caferati.me/demo/react-awesome-button" target="_blank">my portfolio</a>
[<img src="https://github.com/rcaferati/react-awesome-button/blob/master/demo/images/react-awesome-button-customizer?raw=true" width="400" />](https://caferati.me/demo/react-awesome-button)

## Examples

### With react-awesome-button and plain CSS
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import 'react-awesome-button/dist/styles.css';

  function Button() {
    return (
      <AwesomeButton type="facebook">Button</AwesomeButton>
    );
  }
```

### With react-awesome-button CSS Modules
```jsx
  import { AwesomeButton } from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

  function Button() {
    return (
      <AwesomeButton
        cssModule={AwesomeButtonStyles}
        type="twitter"
      >
        Share
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

| Attributes            | Type          | Default     | Description |
| :---------            | :--:          | :-----:     | :----------- |
| action                | `function`    | `null`      | Default click function |
| bubbles               | `bool`        | `false`     | Should render the bubbles onClick animation |
| disabled              | `bool`        | `false`     | Should render a disabled button |
| type                  | `string`      | `primary` | Render a specific button type, styled by the .scss type list |
| size                  | `string`      | `auto`    | Render a specific button size, styled by the .scss size list |
| element               | `node`        | `null`      | Overwrites the default container element renderer, useful for using it with react-router Link container. |
| href                  | `string`      | `null`      | Forces the button to be rendered on an `anchor` container and sets the href to the specified value |
| target                | `string`      | `null`      | Render an anchor with a specific target attribute |
| progress              | `bool`        | `false`     | Should render a progress button |
| loadingLabel          | `string`      | `Wait ..` | Progress button loading label text |
| errorLabel            | `string`      | `Error`   | Progress button error label text |
| successLabel          | `string`      | `Success` | Progress button success label text |
| visible               | `bool`        | `true`      | Should the button be visible |

## Author
#### Rafael Caferati
+ Checkout my <a href="https://caferati.me" title="Full-Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full-Stack Web Developer Website</a>
+ Other open source projects @ <a title="Web Software Developer Code Laboratory" target="_blank" href="https://caferati.me/labs">Code Laboratory</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://caferati.me/portfolio">Web Portfolio</a>

## License

MIT. Copyright (c) 2017 Rafael Caferati.
