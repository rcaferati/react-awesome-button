import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { List } from './ui';
import defaultStyles from '../src/styles';
import { withKnobs, text, select, number, boolean } from '@storybook/addon-knobs';
import { AwesomeButtonSocial } from '../src/index';

storiesOf('AwesomeButtonSocial', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
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
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'facebook')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Facebook')}
    </AwesomeButtonSocial>
  ))
  .add('Pinterest', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'pinterest')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Pinterest')}
    </AwesomeButtonSocial>
  ))
  .add('Twitter', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'twitter')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Twitter')}
    </AwesomeButtonSocial>
  ))
  .add('Linkedin', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'linkedin')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Linkedin')}
    </AwesomeButtonSocial>
  ))
  .add('Google Plus', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'gplus')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Google Plus')}
    </AwesomeButtonSocial>
  ))
  .add('Reddit', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'reddit')}
      cssModule={defaultStyles}
      url={text('url', 'https://caferati.me')}
    >
      {text('Text', 'Reddit')}
    </AwesomeButtonSocial>
  ))
  .add('Messenger', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'messenger')}
      cssModule={defaultStyles}
      user={text('user', 'caferati.me')}
    >
      {text('Text', 'Messenger')}
    </AwesomeButtonSocial>
  ))
  .add('Whatsapp', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'whatsapp')}
      cssModule={defaultStyles}
      phone={text('phone', '+447392921580')}
    >
      {text('Text', 'Whatsapp')}
    </AwesomeButtonSocial>
  ))
  .add('Github', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'github')}
      cssModule={defaultStyles}
      target={select('target', ['_blank', '_self', '_parent', '_top'], '_blank')}
      href={text('href', 'https://github.com/rcaferati')}
    >
      {text('Text', 'Github')}
    </AwesomeButtonSocial>
  ))
  .add('Youtube', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'youtube')}
      cssModule={defaultStyles}
      target={select('target', ['_blank', '_self', '_parent', '_top'], '_blank')}
      href={text('href', 'https://youtube.com/')}
    >
      {text('Text', 'Youtube')}
    </AwesomeButtonSocial>
  ))
  .add('Instagram', () => (
    <AwesomeButtonSocial
      type={select('Type', [null, 'facebook', 'instagram', 'twitter', 'github', 'youtube', 'linkedin', 'pinterest', 'reddit', 'messenger', 'whatsapp', 'gplus'], 'instagram')}
      cssModule={defaultStyles}
      target={select('target', ['_blank', '_self', '_parent', '_top'], '_blank')}
      href={text('href', 'https://instagram.com/rcaferati')}
    >
      {text('Text', 'Instagram')}
    </AwesomeButtonSocial>
  ));
