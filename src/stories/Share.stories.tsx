import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AwesomeButtonSocial from '../components/AwesomeButtonSocial';
// @ts-ignore
import defaultStyles from '../styles/themes/theme-blue';

export default {
  title: 'Example/Social',
  component: AwesomeButtonSocial,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AwesomeButtonSocial>;

const Template: ComponentStory<typeof AwesomeButtonSocial> = (args) => (
  <AwesomeButtonSocial cssModule={defaultStyles.default} {...args} />
);

export const Facebook = Template.bind({});
Facebook.args = {
  type: 'facebook',
  size: 'medium',
  children: 'Button',
};

export const Instagram = Template.bind({});
Instagram.args = {
  type: 'instagram',
  size: 'medium',
  children: 'Button',
};

export const Messenger = Template.bind({});
Messenger.args = {
  type: 'messenger',
  size: 'medium',
  children: 'Button',
};

export const Whatsapp = Template.bind({});
Whatsapp.args = {
  type: 'whatsapp',
  size: 'medium',
  children: 'Button',
};

export const Linkedin = Template.bind({});
Linkedin.args = {
  type: 'linkedin',
  size: 'medium',
  children: 'Button',
};

export const Github = Template.bind({});
Github.args = {
  type: 'github',
  size: 'medium',
  children: 'Button',
};

export const Reddit = Template.bind({});
Reddit.args = {
  type: 'reddit',
  size: 'medium',
  children: 'Button',
};

export const Pinterest = Template.bind({});
Pinterest.args = {
  type: 'pinterest',
  size: 'medium',
  children: 'Button',
};