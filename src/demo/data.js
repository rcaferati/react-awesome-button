import React from 'react';
import {
  AwesomeButton,
  AwesomeButtonShare,
  AwesomeButtonProgress,
} from '../index';
import AwsBtnStyles from '../styles/themes/theme-blue/styles.scss';
import AwsBtnThemeMorty from '../styles/themes/theme-c137/styles.scss';
import AwsBtnThemeRick from '../styles/themes/theme-rickiest/styles.scss';
import Theme from './components/theme';

const Div = props => (<div {... props} />);

const features = [
  'Look and feel customisable and extendable via SASS variables and lists',
  'Use it with CSSModules or Plain CSS (NO inline-styles)',
  'Render any tag as the component\'s child (text, icon, img, svg)',
  'Animated progress button',
  'OnClick bubble animation',
];

const examples = [
  {
    title: 'Button Types',
    description: 'All button types can be changed or extended by manipulating the .scss $button-colors list. If no type prop is passed, it defaults to "primary".',
    jsx: `
<AwesomeButton type="primary">Primary Button</AwesomeButton>
<AwesomeButton type="secondary">Secondary Button</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton bubbles cssModule={AwsBtnStyles}>Primary Button</AwesomeButton>
        <AwesomeButton bubbles cssModule={AwsBtnStyles} type="secondary">Secondary Button</AwesomeButton>
      </div>),
  },
  {
    title: 'Button Sizes',
    description: 'All button types can be changed or extended by manipulating the .scss $button-colors list. If no type prop is passed, it defaults to "primary".',
    jsx: `
<AwesomeButton type="primary" size="medium">Primary Button</AwesomeButton>
<AwesomeButton type="secondary" size="large">Secondary Button</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton bubbles size="medium" cssModule={AwsBtnStyles}>Primary</AwesomeButton>
        <AwesomeButton bubbles size="large" cssModule={AwsBtnStyles} type="secondary">Secondary</AwesomeButton>
      </div>),
  },
  {
    title: 'Using children elements',
    description: `This example use font-awesome to render the icons but you can
    use almost anything as the component's child. i.e. <img> or <svg> tags.`,
    jsx: `
<AwesomeButton
  type="facebook"
  size="icon"
>
  <i className="fa fa-facebook" />
</AwesomeButton>
<AwesomeButton
  type="twitter"
  size="icon"
>
  <i className="fa fa-facebook" />
</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton
          type="facebook"
          size="icon"
          cssModule={AwsBtnStyles}
        >
          <i className="fa fa-facebook" />
        </AwesomeButton>
        <AwesomeButton
          type="twitter"
          size="icon"
          cssModule={AwsBtnStyles}
        >
          <i className="fa fa-twitter" />
        </AwesomeButton>
      </div>
    ),
  },
  {
    title: 'Animated progress button',
    description: `The AwesomeButtonProgress is an aditional component that
    extends the AwesomeButton functionalities adding a controlled progress
    animation. On the component's action prop it is required for you to call
    the next() function in order to finish the loading cycle.`,
    js: `
const action = (element, next) => {
  // ... do something
  next();
}`,
    jsx: `
<AwesomeButton
  progress
  action={action}
>
  Progress Button
</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButtonProgress
          cssModule={AwsBtnStyles}
          type="primary"
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 750);
          }}
        >
          Progress Button
        </AwesomeButtonProgress>
        <AwesomeButtonProgress
          cssModule={AwsBtnStyles}
          type="secondary"
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 750);
          }}
        >
          Progress Button
        </AwesomeButtonProgress>
      </div>),
  },
  {
    title: 'Customisable styles and CSSModules',
    description: 'Change button raised level, color and extend types through SCSS variables and list tweak',
    scss: `
$button-default-height: 48px;
$button-default-border-radius: 6px;
$button-horizontal-padding: 20px;
$button-raise-level: 6px;
$transform-speed: 0.185s;
$button-hover-pressure: 2;
    `,
    button: (
      <div>
        <Theme theme={AwsBtnThemeMorty} />
        <Theme theme={AwsBtnThemeRick} />
      </div>
    ),
  },
  {
    title: 'Hover Animations',
    description: `The Button default behaviour is to use mouse events to simulate
    pressure on both sides of the element. By setting moveEvents to false you'll be cancelling this lateral movement
    by removing the onMouseMove event.`,
    jsx: `
<AwesomeButton>With Move Events</AwesomeButton>
<AwesomeButton moveEvents={false}>Without Move Events</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton cssModule={AwsBtnStyles}>With Move Events</AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          moveEvents={false}
        >
          Without Move Events
        </AwesomeButton>
      </div>
    ),
  },
  {
    title: 'Overwrite Component Renderer',
    description: `The button is usually rendered on a Button HTML element.
    If the href prop is present it renders an Anchor. You can overwrite this behaviour by passing a element prop. Render overwrite is specially
    usefull when you want to render the button with the Link component from react-router.`,
    js: 'const Div = props => (<div {... props} />);',
    jsx: `
<AwesomeButton element={Div}>With Div Container</AwesomeButton>`,
    button: (
      <AwesomeButton element={Div} cssModule={AwsBtnStyles}>
        Rendered w/ a Div container
      </AwesomeButton>
    ),
  },
  {
    title: 'Placeholder',
    description: 'Render a placeholder before children data is available. Usefull if for any reason the children data is available in an asynchronous way.',
    jsx: `
<AwesomeButton placeholder></AwesomeButton>
<AwesomeButton size="small" type="secondary" placeholder></AwesomeButton>
<AwesomeButton size="icon" placeholder></AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton placeholder cssModule={AwsBtnStyles} />
        <AwesomeButton size="small" type="secondary" placeholder cssModule={AwsBtnStyles} />
        <AwesomeButton size="icon" placeholder cssModule={AwsBtnStyles} />
      </div>
    ),
  },
  {
    title: 'Extended Types',
    description: 'Extending a button type is easy. Just add the new type to the $Button-Something .scss list.',
    scss: `
    $new-button-color: ();
    append($button-colors, $button-link);
    `,
    jsx: `
<AwesomeButton placeholder></AwesomeButton>
<AwesomeButton size="small" type="secondary" placeholder></AwesomeButton>
<AwesomeButton size="icon" placeholder></AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton placeholder cssModule={AwsBtnStyles} />
        <AwesomeButton size="small" type="secondary" placeholder cssModule={AwsBtnStyles} />
        <AwesomeButton size="icon" placeholder cssModule={AwsBtnStyles} />
      </div>
    ),
  },
];

export default {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The AwesomeButton is a performant, extendable, highly customisable, production ready react component that renders an animated basic set of UI buttons.',
  size: '~5KB compressed',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  features,
  examples,
};
