// src/stories/AwesomeButtonSocial.stories.tsx
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';

import AwesomeButtonSocial from '../components/AwesomeButtonSocial';

type AwesomeButtonSocialProps = React.ComponentProps<
  typeof AwesomeButtonSocial
>;

const DEFAULT_SHARE_URL = 'https://example.com/articles/introducing-awesome-ui';
const DEFAULT_SHARE_MESSAGE =
  'Check out this article about building clean and reusable UI components.';
const DEFAULT_SHARE_USER = 'exampleuser';
const DEFAULT_SHARE_PHONE = '+1 555 123 4567';

// Use null size by default so the component can size naturally based on content.
// Some themes can wrap "medium" labels into 2 lines depending on padding/font.
const AUTO_SIZE = null;

const meta: Meta<typeof AwesomeButtonSocial> = {
  title: 'Components/AwesomeButtonSocial',
  component: AwesomeButtonSocial,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Share',
    type: 'facebook',
    size: AUTO_SIZE,
    visible: true,
    between: false,
    disabled: false,
    placeholder: false,
    moveEvents: true,
    ripple: false,

    // default (non-themed) styling
    cssModule: null,

    sharer: {
      url: DEFAULT_SHARE_URL,
      message: DEFAULT_SHARE_MESSAGE,
      user: DEFAULT_SHARE_USER,
      phone: DEFAULT_SHARE_PHONE,
    },
    dimensions: {
      width: 640,
      height: 480,
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
      description:
        'Share provider key (e.g. facebook, twitter, linkedin, reddit, whatsapp, messenger, mail, instagram).',
      table: { category: 'Share' },
    },
    sharer: {
      control: 'object',
      description: 'Provider payload data used to build the share URL.',
      table: { category: 'Share' },
    },
    dimensions: {
      control: 'object',
      description: 'Popup dimensions for non-native share fallback.',
      table: { category: 'Share' },
    },

    // Removed in v8: icons are user-rendered
    icon: {
      control: false,
      description:
        'Removed in v8 (icons are no longer bundled). Pass your own icon via before/after.',
      table: { category: 'Deprecated' },
    },

    size: {
      control: 'text',
      description:
        'Theme-dependent size key. Leave null to let the button size naturally from its content.',
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

    href: {
      control: 'text',
      description:
        'If provided, native link navigation is used and share handler is skipped.',
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
      description:
        'Optional user-supplied content before label (icons are not bundled in v8).',
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
      action: 'press',
      description:
        'Optional override. If provided, component will call this instead of built-in share logic.',
      table: { category: 'Events' },
    },
    onPressed: { action: 'pressed', table: { category: 'Events' } },
    onReleased: { action: 'released', table: { category: 'Events' } },
    onMouseDown: { action: 'mouseDown', table: { category: 'Events' } },
    onMouseUp: { action: 'mouseUp', table: { category: 'Events' } },
  },
  render: (args) => (
    <AwesomeButtonSocial {...(args as AwesomeButtonSocialProps)} />
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Facebook: Story = {
  args: {
    type: 'facebook',
    children: 'Share on Facebook',
  },
};

export const Twitter: Story = {
  args: {
    type: 'twitter',
    children: 'Share on X/Twitter',
  },
};

export const Linkedin: Story = {
  args: {
    type: 'linkedin',
    children: 'Share on LinkedIn',
  },
};

export const Reddit: Story = {
  args: {
    type: 'reddit',
    children: 'Share on Reddit',
    dimensions: { width: 850, height: 560 },
  },
};

export const WhatsApp: Story = {
  args: {
    type: 'whatsapp',
    children: 'Share on WhatsApp',
    sharer: {
      url: DEFAULT_SHARE_URL,
      message: DEFAULT_SHARE_MESSAGE,
      phone: DEFAULT_SHARE_PHONE,
    },
  },
};

export const Messenger: Story = {
  args: {
    type: 'messenger',
    children: 'Open Messenger',
    sharer: {
      url: DEFAULT_SHARE_URL,
      message: DEFAULT_SHARE_MESSAGE,
      user: DEFAULT_SHARE_USER,
    },
  },
};

export const Mail: Story = {
  args: {
    type: 'mail',
    children: 'Share by Email',
    sharer: {
      url: DEFAULT_SHARE_URL,
      message: DEFAULT_SHARE_MESSAGE,
    },
  },
};

export const InstagramBestEffort: Story = {
  args: {
    type: 'instagram',
    children: 'Open Instagram URL',
    sharer: {
      url: 'https://instagram.com',
      message: DEFAULT_SHARE_MESSAGE,
    },
  },
};

export const WithCustomOnPressOverride: Story = {
  args: {
    type: 'twitter',
    children: 'Custom Share Handler',
    onPress: fn((event) => {
      event.preventDefault?.();
      // eslint-disable-next-line no-alert
      alert('Custom onPress override called (built-in share skipped).');
    }),
  },
};

export const AnchorModeBypassesShare: Story = {
  args: {
    type: 'linkedin',
    children: 'Go to docs',
    href: 'https://example.com/docs',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
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
      <AwesomeButtonSocial
        {...(args as AwesomeButtonSocialProps)}
        cssModule={null}
        size="small">
        Small
      </AwesomeButtonSocial>

      <AwesomeButtonSocial
        {...(args as AwesomeButtonSocialProps)}
        cssModule={null}
        size="medium">
        Medium
      </AwesomeButtonSocial>

      <AwesomeButtonSocial
        {...(args as AwesomeButtonSocialProps)}
        cssModule={null}
        size="large">
        Large
      </AwesomeButtonSocial>
    </div>
  ),
  args: {
    type: 'twitter',
    sharer: {
      url: DEFAULT_SHARE_URL,
      message: DEFAULT_SHARE_MESSAGE,
    },
    cssModule: null,
  },
  parameters: {
    controls: {
      exclude: ['children', 'size'],
    },
  },
};

export const PlaygroundNoIcon: Story = {
  args: {
    type: 'facebook',
    // keep label short to avoid wrapping in themes/default styles
    children: 'Share',
    before: null,
    after: null,
    size: AUTO_SIZE,
  },
};
