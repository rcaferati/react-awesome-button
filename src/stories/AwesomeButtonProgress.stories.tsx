// src/stories/AwesomeButtonProgress.stories.tsx
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';

import AwesomeButtonProgress from '../components/AwesomeButtonProgress';

type AwesomeButtonProgressProps = React.ComponentProps<
  typeof AwesomeButtonProgress
>;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta: Meta<typeof AwesomeButtonProgress> = {
  title: 'Components/AwesomeButtonProgress',
  component: AwesomeButtonProgress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Submit',
    type: 'primary',
    size: 'medium',
    disabled: false,
    visible: true,
    between: false,
    placeholder: false,
    moveEvents: true,
    ripple: false,

    loadingLabel: 'Wait..',
    resultLabel: 'Success!',
    releaseDelay: 500,

    // Important: use default (non-themed) styling for this story file
    cssModule: null,

    // Demo async handler: completes successfully after a short delay
    onPress: async (_event, next) => {
      await sleep(900);
      next(true);
    },

    onMouseDown: fn(),
    onMouseUp: fn(),
    onPressed: fn(),
    onReleased: fn(),
  },
  argTypes: {
    cssModule: {
      control: false,
      description:
        'Theme CSS module object. Set to null in this story file to use default class names.',
      table: { category: 'Styling' },
    },
    className: {
      control: 'text',
      table: { category: 'Styling' },
    },
    style: {
      control: 'object',
      table: { category: 'Styling' },
    },
    rootElement: {
      control: 'text',
      table: { category: 'Styling' },
    },

    type: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    visible: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    between: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },

    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    placeholder: {
      control: 'boolean',
      table: { category: 'State' },
    },

    moveEvents: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
    ripple: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },

    loadingLabel: {
      control: 'text',
      table: { category: 'Progress' },
    },
    resultLabel: {
      control: 'text',
      table: { category: 'Progress' },
    },
    releaseDelay: {
      control: { type: 'number', min: 0, step: 100 },
      table: { category: 'Progress' },
    },

    href: {
      control: 'text',
      description:
        'If provided, renders anchor behavior (share-like navigation).',
      table: { category: 'Element' },
    },
    element: {
      control: false,
      table: { category: 'Element' },
    },
    containerProps: {
      control: 'object',
      table: { category: 'Element' },
    },

    before: {
      control: false,
      table: { category: 'Slots' },
    },
    after: {
      control: false,
      table: { category: 'Slots' },
    },
    extra: {
      control: false,
      table: { category: 'Slots' },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },

    onPress: {
      control: false,
      description:
        'Signature: (event, next) => void. Call next(true) for success, next(false, label?) for error.',
      table: { category: 'Events' },
    },
    onPressed: { action: 'pressed', table: { category: 'Events' } },
    onReleased: { action: 'released', table: { category: 'Events' } },
    onMouseDown: { action: 'mouseDown', table: { category: 'Events' } },
    onMouseUp: { action: 'mouseUp', table: { category: 'Events' } },
  },
  render: (args) => (
    <AwesomeButtonProgress {...(args as AwesomeButtonProgressProps)} />
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimarySuccess: Story = {
  args: {
    children: 'Submit',
    type: 'primary',
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(900);
      next(true);
    },
  },
};

export const SuccessCustomLabel: Story = {
  args: {
    children: 'Save',
    type: 'secondary',
    resultLabel: 'Saved!',
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(700);
      next(true);
    },
  },
};

export const ErrorFlow: Story = {
  args: {
    children: 'Publish',
    type: 'danger',
    resultLabel: 'Done!',
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(900);
      next(false, 'Failed');
    },
  },
};

export const FastRelease: Story = {
  args: {
    children: 'Quick action',
    releaseDelay: 150,
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(400);
      next(true);
    },
  },
};

export const SlowOperation: Story = {
  args: {
    children: 'Processing...',
    loadingLabel: 'Processing...',
    releaseDelay: 900,
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(1800);
      next(true);
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
    cssModule: null,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <AwesomeButtonProgress
        {...(args as AwesomeButtonProgressProps)}
        cssModule={null}
        size="small">
        Small
      </AwesomeButtonProgress>
      <AwesomeButtonProgress
        {...(args as AwesomeButtonProgressProps)}
        cssModule={null}
        size="medium">
        Medium
      </AwesomeButtonProgress>
      <AwesomeButtonProgress
        {...(args as AwesomeButtonProgressProps)}
        cssModule={null}
        size="large">
        Large
      </AwesomeButtonProgress>
    </div>
  ),
  args: {
    type: 'primary',
    cssModule: null,
    onPress: async (_event, next) => {
      await sleep(700);
      next(true);
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'size'],
    },
  },
};

export const PlaygroundWithCustomHandler: Story = {
  args: {
    children: 'Run task',
    cssModule: null,
    onPress: async (_event, next) => {
      // Random success/error demo for interactive testing
      await sleep(800);
      const ok = Math.random() > 0.5;
      next(ok, ok ? null : 'Try again');
    },
  },
};
