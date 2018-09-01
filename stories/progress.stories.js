import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { List } from './ui';
import cssModule from '../src/styles';
import { AwesomeButtonProgress } from '../src/index';

storiesOf('AwesomeButtonProgress', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('Progress', () => (
    <AwesomeButtonProgress
      size={select('Size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      cssModule={cssModule}
      action={(element, next) => {
        action('clicked');
        setTimeout(() => {
          next();
        }, 600);
      }}
    >
      {text('Text', 'Progress')}
    </AwesomeButtonProgress>
  ))
  .add('Custom Text', () => (
    <AwesomeButtonProgress
      loadingLabel="Wait for it.."
      resultLabel="Done!"
      size={select('Size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
      cssModule={cssModule}
      action={(element, next) => {
        action('clicked');
        setTimeout(() => {
          next();
        }, 600);
      }}
    >
      {text('Text', 'Progress')}
    </AwesomeButtonProgress>
  ))
  .add('Error Handling', () => {
    return (
      <AwesomeButtonProgress
        loadingLabel="Wait for it.."
        resultLabel="Done!"
        releaseDelay={1000}
        size={select('Size', [null, 'small', 'medium', 'large'], 'large')}
        type={select('Type', ['primary', 'secondary', 'link'], 'primary')}
        cssModule={cssModule}
        action={(element, next) => {
          setTimeout(() => {
            next(false, 'Error 23 :(');
          }, 500);
        }}
      >
        {text('Text', 'Progress')}
      </AwesomeButtonProgress>
    );
  });
