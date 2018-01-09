import React from 'react';
import AwesomeButton from '../component';
import AwsBtnStyles from '../styles/default.scss';
import AwsBtnStylesThemeTwo from '../styles/themes/theme-two.scss';

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
    title: 'Primary, Secondary and Disabled buttons',
    text: `
<AwesomeButton bubbles>Primary Button</AwesomeButton>
<AwesomeButton bubbles type="secondary">Secondary Button</AwesomeButton>
<AwesomeButton disabled>Disabled Button</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton bubbles>Primary Button</AwesomeButton>
        <AwesomeButton bubbles cssModule={AwsBtnStyles} type="secondary">Secondary Button</AwesomeButton>
        <AwesomeButton cssModule={AwsBtnStyles} disabled>Disabled Button</AwesomeButton>
      </div>),
  },
  {
    title: 'Icon font button — Using children',
    description: `This example use font-awesome to render the icons but you can
    use almost anything as the component's child. i.e. <img> or <svg> tags.`,
    text: `
<AwesomeButton
  type="facebook"
  size="icon"
  bubbles
>
  <i className="fa fa-facebook" aria-hidden />
</AwesomeButton>
...`,
    button: (
      <div>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="facebook"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-facebook" aria-hidden />
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="twitter"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-twitter" aria-hidden />
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="github"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-github" aria-hidden />
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="linkedin"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-linkedin" aria-hidden />
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="whatsapp"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-whatsapp" aria-hidden />
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          type="instagram"
          size="icon"
          bubbles
          moveEvents={false}
        >
          <i className="fa fa-instagram" aria-hidden />
        </AwesomeButton>
      </div>
    ),
  },
  {
    title: 'Animated progress button',
    js: `
const action = (next) => {
  // ... do something
  next();
}
    `,
    text: `
<AwesomeButton
  progress
  action={action}
>Progress Button</AwesomeButton>`,
    button: (
      <div>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          progress
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 600);
          }}
        >
          Progress Button
        </AwesomeButton>
        <AwesomeButton
          cssModule={AwsBtnStyles}
          progress
          type="secondary"
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 500);
          }}
        >
          Progress Button
        </AwesomeButton>
      </div>),
  },
  {
    title: 'Customisable styles and CSSModules',
    description: 'Change button raised level, color and extend types through SCSS variables and list tweak',
    scss: `
$button-default-border-radius: 40px;
$button-horizontal-padding: 20px;
$button-raise-level: 4px;
    `,
    text: `
<AwesomeButton
  cssModule={AwsBtnStylesThemeTwo}
>Themed Button</AwesomeButton>
<AwesomeButton
  cssModule={AwsBtnStylesThemeTwo}
  type="secondary"
>Themed Button</AwesomeButton>
<AwesomeButton
  cssModule={AwsBtnStylesThemeTwo}
  disabled
>Themed Button</AwesomeButton>`,
    button: (
      <div>
        <div>
          <AwesomeButton
            cssModule={AwsBtnStylesThemeTwo}
          >
            Themed Button
          </AwesomeButton>
          <AwesomeButton
            cssModule={AwsBtnStylesThemeTwo}
            type="secondary"
          >
            Themed Button
          </AwesomeButton>
          <AwesomeButton
            cssModule={AwsBtnStylesThemeTwo}
            disabled
          >
            Themed Button
          </AwesomeButton>
        </div>
      </div>
    ),
  },
  {
    title: 'Hover Animations',
    text: `
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
    description: 'Render overwrite is specially usefull when you want to render the button with the Link component from react-router.',
    js: 'const Div = props => (<div {... props} />);',
    text: `
<AwesomeButton element={Div}>With Div Container</AwesomeButton>`,
    button: (
      <AwesomeButton element={Div} cssModule={AwsBtnStyles}>With Div Container</AwesomeButton>
    ),
  },
];

export default {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The AwesomeButton is a performant, extendable, highly customisable, production ready react component that renders an animated basic set of UI buttons.',
  size: '~3KB compressed <script + styles>',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  features,
  examples,
};
