import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withKnobs, text, select, number, boolean } from '@storybook/addon-knobs';
import cssModule from '../src/styles';
import { AwesomeButtonProgress } from '../src/index';

storiesOf('AwesomeButtonProgress', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('Success', () => (
    <AwesomeButtonProgress
      size={select('size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', false)}
      fakePress={boolean('fakePress', false)}
      cssModule={cssModule}
      onPress={(element, next) => {
        action('clicked');
        setTimeout(() => {
          next();
        }, 600);
      }}
    >
      {text('text', 'Progress')}
    </AwesomeButtonProgress>
  ))
  .add('Custom Labels', () => (
    <AwesomeButtonProgress
      loadingLabel={text('loadingLabel', 'Wait for it..')}
      resultLabel={text('resultLabel', 'Done!')}
      size={select('size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', false)}
      fakePress={boolean('fakePress', false)}
      cssModule={cssModule}
      onPress={(element, next) => {
        action('clicked');
        setTimeout(() => {
          next();
        }, 600);
      }}
    >
      {text('text', 'Progress')}
    </AwesomeButtonProgress>
  ))
  .add('Error Handling', () => (
    <AwesomeButtonProgress
      loadingLabel={text('loadingLabel', 'Wait for it..')}
      resultLabel={text('resultLabel', 'Done!')}
      releaseDelay={number('releaseDelay', 1000)}
      size={select('size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      disabled={boolean('disabled', false)}
      fakePress={boolean('fakePress', false)}
      cssModule={cssModule}
      onPress={(element, next) => {
        setTimeout(() => {
          next(false, 'Error Message :(');
        }, 500);
      }}
    >
      {text('text', 'Progress')}
    </AwesomeButtonProgress>
  ))
  .add('Disabled Button', () => (
    <AwesomeButtonProgress
      disabled={boolean('disabled', true)}
      size={select('size', [null, 'small', 'medium', 'large'], 'large')}
      type={select('type', ['primary', 'secondary', 'link'], 'primary')}
      cssModule={cssModule}
      onPress={(element, next) => {
        action('clicked');
        setTimeout(() => {
          next();
        }, 600);
      }}
    >
      {text('text', 'Progress')}
    </AwesomeButtonProgress>
  ));
