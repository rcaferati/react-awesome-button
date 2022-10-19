import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AwesomeButton from '../components/AwesomeButton';
// @ts-ignore
import defaultStyles from '../styles/themes/theme-eric';

export default {
  title: 'Example/Button',
  component: AwesomeButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AwesomeButton>;

const Template: ComponentStory<typeof AwesomeButton> = (args) => (
  <AwesomeButton cssModule={defaultStyles.default} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  size: 'medium',
  children: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  size: 'medium',
  children: 'Button',
};

export const Anchor = Template.bind({});
Anchor.args = {
  type: 'link',
  size: 'medium',
  children: 'Button',
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  size: 'medium',
  children: 'Button',
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  type: 'primary',
  size: 'medium',
  children: null,
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'primary',
  size: 'medium',
  disabled: true,
  children: 'Button',
};
