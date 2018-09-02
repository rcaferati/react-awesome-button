import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { List } from './ui';
import defaultStyles from '../src/styles';
import { AwesomeButtonSocial } from '../src/index';

storiesOf('AwesomeButtonShare', module)
  .addDecorator(centered)
  .add('Icons', () => (
    <List>
      <AwesomeButtonSocial
        size="icon"
        type="facebook"
        cssModule={defaultStyles}
        url="https://facebook.com/caferati.me"
      />
      <AwesomeButtonSocial
        size="icon"
        type="pinterest"
        cssModule={defaultStyles}
        url="https://facebook.com/caferati.me"
      />
      <AwesomeButtonSocial
        size="icon"
        type="twitter"
        cssModule={defaultStyles}
        url="https://facebook.com/caferati.me"
      />
      <AwesomeButtonSocial
        size="icon"
        type="linkedin"
        cssModule={defaultStyles}
        url="https://facebook.com/caferati.me"
      />
    </List>
  ))
  .add('Facebook', () => (
    <AwesomeButtonSocial
      type="facebook"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Facebook
    </AwesomeButtonSocial>
  ))
  .add('Pinterest', () => (
    <AwesomeButtonSocial
      type="pinterest"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Pinterest
    </AwesomeButtonSocial>
  ))
  .add('Linkedin', () => (
    <AwesomeButtonSocial
      type="linkedin"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Linkedin
    </AwesomeButtonSocial>
  ))
  .add('Google Plus', () => (
    <AwesomeButtonSocial
      type="gplus"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Google Plus
    </AwesomeButtonSocial>
  ))
  .add('Reddit', () => (
    <AwesomeButtonSocial
      type="reddit"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Reddit
    </AwesomeButtonSocial>
  ))
  .add('Messenger', () => (
    <AwesomeButtonSocial
      type="messenger"
      cssModule={defaultStyles}
      user="caferati.me"
    >
      Messenger
    </AwesomeButtonSocial>
  ))
  .add('Whatsapp', () => (
    <AwesomeButtonSocial
      type="whatsapp"
      cssModule={defaultStyles}
      phone="447392921580"
    >
      Whatsapp
    </AwesomeButtonSocial>
  ))
  .add('Github', () => (
    <AwesomeButtonSocial
      type="github"
      cssModule={defaultStyles}
      target="_blank"
      href="https://github.com/rcaferati"
    >
      Github
    </AwesomeButtonSocial>
  ))
  .add('Youtube', () => (
    <AwesomeButtonSocial
      type="youtube"
      cssModule={defaultStyles}
      target="_blank"
      href="https://youtube.com/"
    >
      Youtube
    </AwesomeButtonSocial>
  ))
  .add('Instagram', () => (
    <AwesomeButtonSocial
      type="instagram"
      cssModule={defaultStyles}
      target="_blank"
      href="https://instagram.com/rcaferati"
    >
      Instagram
    </AwesomeButtonSocial>
  ))
  .add('Twitter', () => (
    <AwesomeButtonSocial
      type="twitter"
      cssModule={defaultStyles}
      url="https://caferati.me"
    >
      Twitter
    </AwesomeButtonSocial>
  ));
