import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AwesomeButtonProgress from '../components/AwesomeButtonProgress';
// @ts-ignore
import defaultStyles from '../styles/themes/theme-blue';

export default {
  title: 'Example/ButtonProgress',
  component: AwesomeButtonProgress,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AwesomeButtonProgress>;

const Template: ComponentStory<typeof AwesomeButtonProgress> = (args) => (
  <AwesomeButtonProgress cssModule={defaultStyles.default} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  onPress: (ev: any, next: any) => setTimeout(next, 1000),
  size: 'medium',
  children: 'Progress',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  onPress: (ev: any, next: any) => setTimeout(next, 1000),
  size: 'medium',
  children: 'Progress',
};

export const Anchor = Template.bind({});
Anchor.args = {
  type: 'link',
  onPress: (ev: any, next: any) => setTimeout(next, 1000),
  size: 'medium',
  children: 'Progress',
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  onPress: (ev: any, next: any) => setTimeout(next, 1000),
  size: 'medium',
  children: 'Progress',
};
