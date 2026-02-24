// src/stories/AwesomeButton.stories.tsx
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';

import AwesomeButton from '../components/AwesomeButton';
import defaultStyles from '../styles/themes/theme-blue';

type AwesomeButtonProps = React.ComponentProps<typeof AwesomeButton>;

const resolvedDefaultStyles =
  (
    defaultStyles as Record<string, string> & {
      default?: Record<string, string>;
    }
  )?.default ?? (defaultStyles as Record<string, string>);

const meta: Meta<typeof AwesomeButton> = {
  title: 'Components/AwesomeButton',
  component: AwesomeButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Button',
    type: 'primary',
    size: 'medium',
    visible: true,
    between: false,
    disabled: false,
    placeholder: false,
    moveEvents: true,
    ripple: false,
    onPress: fn(),
    onPressed: fn(),
    onReleased: fn(),
    onMouseDown: fn(),
    onMouseUp: fn(),

    // Use the package default SCSS module (src/styles/index.ts)
    cssModule: resolvedDefaultStyles,
  },
  argTypes: {
    cssModule: {
      control: false,
      description:
        'Default CSS module object loaded from src/styles (SCSS module mapping).',
      table: {
        category: 'Styling',
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      table: {
        category: 'Styling',
      },
    },
    rootElement: {
      control: 'text',
      table: {
        category: 'Styling',
      },
    },

    type: {
      control: 'text',
      description:
        'Visual variant key (examples: primary, secondary, danger, link).',
      table: {
        category: 'Appearance',
      },
    },
    size: {
      control: 'text',
      description: 'Size key (examples: small, medium, large).',
      table: {
        category: 'Appearance',
      },
    },
    visible: {
      control: 'boolean',
      table: {
        category: 'Appearance',
      },
    },
    between: {
      control: 'boolean',
      table: {
        category: 'Appearance',
      },
    },
    active: {
      control: 'boolean',
      description: 'Controlled pressed/active visual state.',
      table: {
        category: 'State',
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'State',
      },
    },
    placeholder: {
      control: 'boolean',
      description:
        'If true and no children are provided, button becomes placeholder/disabled.',
      table: {
        category: 'State',
      },
    },
    moveEvents: {
      control: 'boolean',
      description: 'Enables pointer move position classes (left/middle/right).',
      table: {
        category: 'Behavior',
      },
    },
    ripple: {
      control: 'boolean',
      table: {
        category: 'Behavior',
      },
    },

    href: {
      control: 'text',
      description: 'If provided, renders anchor behavior.',
      table: {
        category: 'Element',
      },
    },
    element: {
      control: false,
      description: 'Custom forwarded element component.',
      table: {
        category: 'Element',
      },
    },
    containerProps: {
      control: 'object',
      table: {
        category: 'Element',
      },
    },

    before: {
      control: false,
      table: {
        category: 'Slots',
      },
    },
    after: {
      control: false,
      table: {
        category: 'Slots',
      },
    },
    extra: {
      control: false,
      table: {
        category: 'Slots',
      },
    },
    children: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },

    onPress: { action: 'press', table: { category: 'Events' } },
    onPressed: { action: 'pressed', table: { category: 'Events' } },
    onReleased: { action: 'released', table: { category: 'Events' } },
    onMouseDown: { action: 'mouseDown', table: { category: 'Events' } },
    onMouseUp: { action: 'mouseUp', table: { category: 'Events' } },
  },
  render: (args) => <AwesomeButton {...(args as AwesomeButtonProps)} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'medium',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
    size: 'medium',
    children: 'Secondary',
  },
};

export const Danger: Story = {
  args: {
    type: 'danger',
    size: 'medium',
    children: 'Danger',
  },
};

export const LinkStyle: Story = {
  args: {
    type: 'link',
    size: 'medium',
    children: 'Open link',
    href: 'https://example.com',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Placeholder: Story = {
  args: {
    placeholder: true,
    children: null,
  },
};

export const ActiveControlled: Story = {
  args: {
    active: true,
    children: 'Active',
  },
};

export const WithBeforeAfter: Story = {
  args: {
    children: 'Continue',
    before: (
      <span
        aria-hidden="true"
        style={{ display: 'inline-flex', marginRight: 8 }}>
        ←
      </span>
    ),
    after: (
      <span
        aria-hidden="true"
        style={{ display: 'inline-flex', marginLeft: 8 }}>
        →
      </span>
    ),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: 12,
        justifyItems: 'center',
      }}>
      <AwesomeButton {...(args as AwesomeButtonProps)} size="small">
        Small
      </AwesomeButton>
      <AwesomeButton {...(args as AwesomeButtonProps)} size="medium">
        Medium
      </AwesomeButton>
      <AwesomeButton {...(args as AwesomeButtonProps)} size="large">
        Large
      </AwesomeButton>
    </div>
  ),
  args: {
    type: 'primary',
  },
  parameters: {
    controls: {
      exclude: ['children', 'size'],
    },
  },
};

export const AutoSizeAnimatedContentChange: Story = {
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <div
        style={{
          display: 'grid',
          gap: 12,
          justifyItems: 'center',
        }}>
        <AwesomeButton
          {...(args as AwesomeButtonProps)}
          size={null}
          onPress={() => setExpanded((v) => !v)}>
          {expanded ? 'Continue to checkout and review your order' : 'Continue'}
        </AwesomeButton>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{
            border: '1px solid #ccc',
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>
          Toggle content
        </button>
      </div>
    );
  },
  args: {
    type: 'primary',
    size: null,
    children: 'Continue',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses auto width (size=null) and toggles content after first render to validate animated width growth/shrink.',
      },
    },
    controls: {
      exclude: ['children', 'size', 'onPress'],
    },
  },
};

export const LongLabelEllipsis: Story = {
  args: {
    type: 'primary',
    size: 'medium',
    children:
      'This is a very long button label that should truncate with an ellipsis after render',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fixed size + long label to validate one-line truncation (ellipsis) behavior.',
      },
    },
  },
};
