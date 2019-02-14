import React from 'react';
import Modules from '../helpers/modules';
import { AwesomeButton, AwesomeButtonProgress } from '../../src/index';

export const properties = [
  {
    name: 'General',
    props: [
      {
        name: 'button-default-height',
        type: 'range',
        max: 100,
        min: 30,
        suffix: 'px',
      },
      {
        name: 'button-default-font-size',
        type: 'range',
        max: 25,
        min: 10,
        suffix: 'px',
      },
      {
        name: 'button-default-border-radius',
        type: 'range',
        max: 25,
        suffix: 'px',
      },
      {
        name: 'button-horizontal-padding',
        type: 'range',
        max: 50,
        suffix: 'px',
      },
      {
        name: 'button-raise-level',
        type: 'range',
        max: 10,
        suffix: 'px',
      },
    ],
  },
  {
    name: 'Animations',
    props: [
      {
        name: 'button-hover-pressure',
        type: 'range',
        max: 4,
        step: 0.5,
      },
      {
        name: 'transform-speed',
        type: 'range',
        max: 0.60,
        step: 0.025,
        suffix: 's',
      },
    ],
  },
  {
    name: 'Primary',
    props: [
      {
        name: 'button-primary-color',
        type: 'color',
      },
      {
        name: 'button-primary-color-dark',
        type: 'color',
      },
      {
        name: 'button-primary-color-light',
        type: 'color',
      },
      {
        name: 'button-primary-color-hover',
        type: 'color',
      },
      {
        name: 'button-primary-border',
        type: 'border',
      },
    ],
  },
  {
    name: 'Secondary',
    props: [
      {
        name: 'button-secondary-color',
        type: 'color',
      },
      {
        name: 'button-secondary-color-dark',
        type: 'color',
      },
      {
        name: 'button-secondary-color-light',
        type: 'color',
      },
      {
        name: 'button-secondary-color-hover',
        type: 'color',
      },
      {
        name: 'button-secondary-border',
        type: 'border',
      },
    ],
  },
  {
    name: 'Anchor',
    props: [
      {
        name: 'button-anchor-color',
        type: 'color',
      },
      {
        name: 'button-anchor-color-dark',
        type: 'color',
      },
      {
        name: 'button-anchor-color-light',
        type: 'color',
      },
      {
        name: 'button-anchor-color-hover',
        type: 'color',
      },
      {
        name: 'button-anchor-border',
        type: 'border',
      },
    ],
  },
];

export const features = [
  'Look and feel customisable and extendable via SASS variables and lists',
  'Use it with CSSModules or Plain CSS (NO inline-styles)',
  'Render any tag as the component\'s child (text, icon, img, svg)',
  'Animated progress button',
  'OnClick bubble animation',
];

export function examples(theme) {
  return [
    {
      title: 'Installation',
      command: 'npm install --save react-awesome-button',
    },
    {
      title: 'Multiple Import',
      jsx: `
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';
`,
    },
    {
      title: 'Single Import',
      jsx: `
import AwesomeButton from 'react-awesome-button/src/components/AwesomeButton';
import AwesomeButtonProgress from 'react-awesome-button/src/components/AwesomeButtonProgress';
import AwesomeButtonSocial from 'react-awesome-button/src/components/AwesomeButtonSocial';
`,
    },
    {
      title: 'Primary Button',
      jsx: '<AwesomeButton type="primary">Primary</AwesomeButton>',
      component: (
        <AwesomeButton
          cssModule={Modules.Modules[theme]}
          type="primary"
        >
          Primary
        </AwesomeButton>
      ),
    },
    {
      title: 'Secondary Progress Button',
      jsx: `
<AwesomeButtonProgress
  type="secondary"
  size="medium"
  action={(element, next) => doSomethingThenCall(next)}
>
  Primary
</AwesomeButtonProgress>`,
      component: (
        <AwesomeButtonProgress
          type="secondary"
          size="medium"
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 1000);
          }}
          cssModule={Modules.Modules[theme]}
        >
          Progress
        </AwesomeButtonProgress>
      ),
    },
    {
      title: 'Multiple Sizes',
      jsx: `
<AwesomeButton
  size="icon"
  type="primary"
>
  <i className="fa fa-codepen" />
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Small
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Medium
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Large
</AwesomeButton>`,
      component: (
        <div>
          <AwesomeButton
            cssModule={Modules.Modules[theme]}
            size="icon"
            type="primary"
          >
            <i className="fa fa-codepen" aria-hidden />
          </AwesomeButton>
          <AwesomeButton
            cssModule={Modules.Modules[theme]}
            size="small"
            type="primary"
          >
            Small
          </AwesomeButton>
          <AwesomeButton
            cssModule={Modules.Modules[theme]}
            size="medium"
            type="primary"
          >
            Medium
          </AwesomeButton>
          <AwesomeButton
            cssModule={Modules.Modules[theme]}
            size="large"
            type="primary"
          >
            Large
          </AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Styling with - CSS',
      description: 'For styling with CSS you can access all themes on the /dist folder and append it via <link> or import into your .js or .css files.',
      jsx: 'import \'react-awesome-button/dist/themes/theme-blue.css\';',
    },
    {
      title: 'Styling with - CSS Modules',
      description: 'For styling it through CSS Modules, import the file from the themes folder inside the src. You\'ll need a .scss loader in place in order to build it.',
      jsx: `
import AwesomeButton from 'react-awesome-button/src/components/AwesomeButton';
import styles from 'react-awesome-button/src/styles/themes/theme-blue';

...

function Component() {
  return (
    <AwesomeButton
      cssModule={styles}
      type="primary"
    >
      Primary Blue Themed Button
    </AwesomeButton>
  );
}
`,
    },
  ];
}
