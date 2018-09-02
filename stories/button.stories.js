import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { List } from './ui';
import defaultStyles from '../src/styles';
import { AwesomeButton } from '../src/index';

const buttons = (
  <List>
    <AwesomeButton
      size="medium"
      type="primary"
      cssModule={defaultStyles} /* Skipped props */
      action={action('clicked')}
    >
      Primary
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      type="secondary"
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      Secondary
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      type="link"
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      Link
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      disabled
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      Disabled
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      disabled
      placeholder
      cssModule={defaultStyles}
      action={action('clicked')}
    />
  </List>
);

storiesOf('AwesomeButton', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('All Types', () => buttons)
  .add('Primary', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('Disabled', false)}
      bubbles={boolean('Bubbles', false)}
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', 'Primary')}
    </AwesomeButton>
  ))
  .add('Secondary', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'secondary')}
      disabled={boolean('Disabled', false)}
      bubbles={boolean('Bubbles', false)}
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', 'Primary')}
    </AwesomeButton>
  ))
  .add('Link', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'link')}
      disabled={boolean('Disabled', false)}
      bubbles={boolean('Bubbles', false)}
      href="https://github.com/rcaferati"
      target="_blank"
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', 'Link')}
    </AwesomeButton>
  ))
  .add('Disabled', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('Disabled', true)}
      bubbles={boolean('Bubbles', false)}
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', 'Disabled')}
    </AwesomeButton>
  ))
  .add('Placeholder', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('Disabled', false)}
      bubbles={boolean('Bubbles', false)}
      placeholder={boolean('Placeholder', true)}
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', null)}
    </AwesomeButton>
  ));
