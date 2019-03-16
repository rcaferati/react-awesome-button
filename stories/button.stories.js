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
      onPress={action('clicked')}
    >
      Primary
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      type="secondary"
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      Secondary
    </AwesomeButton>
    <AwesomeButton size="medium" type="link" cssModule={defaultStyles} onPress={action('clicked')}>
      Link
    </AwesomeButton>
    <AwesomeButton size="medium" disabled cssModule={defaultStyles} onPress={action('clicked')}>
      Disabled
    </AwesomeButton>
    <AwesomeButton
      size="medium"
      disabled
      placeholder
      cssModule={defaultStyles}
      onPress={action('clicked')}
    />
  </List>
);

storiesOf('AwesomeButton', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('All Types', () => buttons)
  .add('Primary', () => (
    <AwesomeButton
      size={select('size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', false)}
      ripple={boolean('ripple', false)}
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      {text('text', 'Primary')}
    </AwesomeButton>
  ))
  .add('Secondary', () => (
    <AwesomeButton
      size={select('size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('type', ['primary', 'secondary', 'link'], 'secondary')}
      disabled={boolean('disabled', false)}
      ripple={boolean('ripple', false)}
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      {text('text', 'Secondary')}
    </AwesomeButton>
  ))
  .add('Link', () => (
    <AwesomeButton
      size={select('size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('type', ['primary', 'secondary', 'link'], 'link')}
      disabled={boolean('disabled', false)}
      ripple={boolean('ripple', false)}
      href={text('href', 'https://github.com/rcaferati')}
      target={select('target', ['_blank', '_self', '_parent', '_top'], '_blank')}
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      {text('text', 'Anchored Link')}
    </AwesomeButton>
  ))
  .add('Disabled', () => (
    <AwesomeButton
      size={select('size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', true)}
      ripple={boolean('ripple', false)}
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      {text('Text', 'Disabled')}
    </AwesomeButton>
  ))
  .add('Placeholder', () => (
    <AwesomeButton
      size={select('size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', false)}
      ripple={boolean('ripple', false)}
      placeholder={boolean('placeholder', true)}
      cssModule={defaultStyles}
      onPress={action('clicked')}
    >
      {text('text', null)}
    </AwesomeButton>
  ));
