import React from 'react';
import Modules from '../../helpers/modules';
import { AwesomeButton, AwesomeButtonProgress } from '../../index';

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
  ];
}
