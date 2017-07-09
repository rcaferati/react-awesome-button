# &lt;ReactAwesomeButton /&gt;

[![Travis](https://img.shields.io/travis/rcaferati/react-awesome-button/master.svg)](https://travis-ci.org/rcaferati/react-awesome-button) ![NPM](https://img.shields.io/npm/v/react-awesome-button.svg)

`ReactAwesomeButton` is a performant, extendable, highly customisable, production ready React Component that renders an animated set of UI buttons.

## Key Features
+ Look and feel customisable and extendable via SASS variables and lists ([scss config file](https://github.com/rcaferati/react-awesome-button/blob/master/src/styles/default.scss))
+ Use it with CSSModules or Plain CSS (NO inline-styles)
+ Render any tag as the component\'s child (text, icon, img, svg)
+ Animated progress button
+ OnClick bubble animation

### Live demo and examples
+ <a href="https://caferati.me/demo/react-awesome-button" target="_blank">On my portfolio</a>
+ <a href="https://www.webpackbin.com/bins/-Kod7WV_1sLWnwxPdZJ-" target="_blank">Live code at Webpackbin</a>

## Examples

### With plain CSS
```jsx
  import AwesomeButton from 'react-awesome-button';
  import 'react-awesome-button/dist/styles.css';
  
  function Button() {
    return (
      <AwesomeButton>Primary Button</AwesomeButton>
    );
  }
  
```

### With CSS Modules
```jsx
  import AwesomeButton from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles.scss'
  
  function Button() {
    return (
      <AwesomeButton
        cssModule={AwesomeButtonStyles}
      >Primary Button</AwesomeButton>
    );
  }
  
```
