import React from 'react';
import AwesomeButton from '../react-awesome-button';

export default {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The AwesomeButton is a performant, extendable, highly customisable, production ready react component that renders an animated basic set of UI buttons.',
  size: '~3KB compressed ( js + css )',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  features: [
    'Styles customisable and extendable via sass variables',
    'Render any tag as the component\'s child (text, icon, img, svg)',
    'No inline-styles',
    'Animated progress button',
    'Button types/colors can be extended via sass list variables',
  ],
  examples: [
    {
      title: 'Primary button',
      text: `
<AwesomeButton>Primary Button</AwesomeButton>`,
      button: (<AwesomeButton>Primary Button</AwesomeButton>),
    },
    {
      title: 'Secondary button',
      text: `
<AwesomeButton type="secondary">Secondary Button</AwesomeButton>`,
      button: (<AwesomeButton type="secondary">Secondary Button</AwesomeButton>),
    },
    {
      title: 'Animated progress button',
      text: `
<AwesomeButton
  progress
  action={(next) => {
    ... doSomething
    next();
  }}
>Progress Button</AwesomeButton>`,
      button: (
        <div>
          <AwesomeButton
            progress
            action={(element, next) => {
              setTimeout(() => {
                next();
              }, 600);
            }}
          >Progress Button</AwesomeButton>
          <AwesomeButton
            progress
            type="secondary"
            action={(element, next) => {
              setTimeout(() => {
                next();
              }, 500);
            }}
          >Progress Button</AwesomeButton>
        </div>),
    },
    {
      title: 'Hover and Bubble Animations',
      text: `
    <AwesomeButton>Primary Button</AwesomeButton>`,
      button: (
        <div>
          <AwesomeButton>With Move Events</AwesomeButton>
          <AwesomeButton
            moveEvents={false}
          >Without Move Events</AwesomeButton>
          <AwesomeButton
            bubbles
            moveEvents={false}
          >Bubble Animation</AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Icon font button — Using children',
      description: `This example use font-awesome to render the icons but you can
      use almost anything as the component's child. i.e. <img> or <svg> tags.`,
      text: `
<AwesomeButton
  type="facebook"
  size="icon"
><i className="fa fa-facebook" /></AwesomeButton>
...`,
      button: (
        <div>
          <AwesomeButton
            type="facebook"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-facebook" />
          </AwesomeButton>
          <AwesomeButton
            type="twitter"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-twitter" />
          </AwesomeButton>
          <AwesomeButton
            type="github"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-github" />
          </AwesomeButton>
          <AwesomeButton
            type="linkedin"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-linkedin" />
          </AwesomeButton>
          <AwesomeButton
            type="whatsapp"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-whatsapp" />
          </AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Disabled button',
      text: `
<AwesomeButton disabled>Disabled Button</AwesomeButton>`,
      button: (<AwesomeButton
        disabled
      >Disabled Button</AwesomeButton>),
    },
  ],
};
