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
  .add('Default', () => buttons)
  .add('Customizable', () => (
    <AwesomeButton
      size={select('Size', [null, 'small', 'medium', 'large'], 'medium')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('Disabled', false)}
      cssModule={defaultStyles}
      action={action('clicked')}
    >
      {text('Text', 'Customizable')}
    </AwesomeButton>
  ));
