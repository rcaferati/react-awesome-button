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
    animateSize: true,
    visible: true,
    between: false,
    disabled: false,
    placeholder: false,
    textTransition: false,
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
    textTransition: {
      control: 'boolean',
      description:
        'Animates string-only label changes with a scrambling transition.',
      table: {
        category: 'Behavior',
      },
    },
    animateSize: {
      control: 'boolean',
      description:
        'Animates fixed-size changes and measured auto-width changes when enabled.',
      table: {
        category: 'Behavior',
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
    href: 'https://github.com/rcaferati',
    containerProps: {
      target: '_blank',
      rel: 'noreferrer noopener',
    },
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

export const TextTransition: Story = {
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
          textTransition
          onPress={() => setExpanded((value) => !value)}>
          {expanded ? 'Processing settlement report' : 'Generate report'}
        </AwesomeButton>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          style={{
            border: '1px solid #ccc',
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>
          Toggle label
        </button>
      </div>
    );
  },
  args: {
    children: 'Generate report',
    textTransition: true,
  },
  parameters: {
    controls: {
      exclude: ['children', 'onPress'],
    },
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

export const AnimatedSizeChange: Story = {
  render: (args) => {
    const sizes: Array<'small' | 'medium' | 'large'> = [
      'small',
      'medium',
      'large',
    ];
    const [index, setIndex] = React.useState(0);
    const nextSize = sizes[index] ?? 'small';

    return (
      <div
        style={{
          display: 'grid',
          gap: 12,
          justifyItems: 'center',
        }}>
        <div
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
          }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>animated</span>
          <AwesomeButton {...(args as AwesomeButtonProps)} size={nextSize}>
            {nextSize}
          </AwesomeButton>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
          }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>instant opt-out</span>
          <AwesomeButton
            {...(args as AwesomeButtonProps)}
            animateSize={false}
            size={nextSize}>
            {nextSize}
          </AwesomeButton>
        </div>

        <button
          type="button"
          onClick={() => setIndex((value) => (value + 1) % sizes.length)}
          style={{
            border: '1px solid #ccc',
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>
          Cycle size
        </button>
      </div>
    );
  },
  args: {
    type: 'primary',
    size: 'small',
  },
  parameters: {
    controls: {
      exclude: ['children', 'animateSize', 'size'],
    },
  },
};

export const MultipleAutoSize: Story = {
  render: (args) => {
    const labels = [
      'Go',
      'Save',
      'Submit',
      'Launch Now',
      'Continue',
      'Review Details',
      'Open Dashboard',
      'Create New Project',
      'Generate Monthly Report',
      'Proceed to Final Confirmation',
    ];

    return (
      <div
        style={{
          display: 'grid',
          gap: 12,
          justifyItems: 'center',
        }}>
        {labels.map((label) => (
          <AwesomeButton
            key={label}
            {...(args as AwesomeButtonProps)}
            size={null}>
            {label}
          </AwesomeButton>
        ))}
      </div>
    );
  },
  args: {
    type: 'primary',
    size: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Renders ten auto-width buttons with progressively different label lengths to validate intrinsic sizing.',
      },
    },
    controls: {
      exclude: ['children', 'size'],
    },
  },
};

export const AutoSizeAnimatedContentChange: Story = {
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);
    const label = expanded ? 'Open analytics dashboard' : 'Open';

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
          textTransition>
          {label}
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
          Toggle label length
        </button>
      </div>
    );
  },
  args: {
    type: 'primary',
    size: null,
    textTransition: true,
    children: 'Open',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses an external toggle with auto width (size=null) and textTransition to validate Vue-parity grow-first and shrink-last choreography.',
      },
    },
    controls: {
      exclude: ['children', 'size', 'textTransition'],
    },
  },
};

export const AnimatedAutoWidthChange: Story = {
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);
    const label = expanded ? 'Open analytics dashboard' : 'Open';

    return (
      <div
        style={{
          display: 'grid',
          gap: 12,
          justifyItems: 'center',
        }}>
        <div
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
          }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>animated</span>
          <AwesomeButton
            {...(args as AwesomeButtonProps)}
            size={null}
            textTransition>
            {label}
          </AwesomeButton>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
          }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>instant opt-out</span>
          <AwesomeButton
            {...(args as AwesomeButtonProps)}
            animateSize={false}
            size={null}
            textTransition>
            {label}
          </AwesomeButton>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          style={{
            border: '1px solid #ccc',
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>
          Toggle label length
        </button>
      </div>
    );
  },
  args: {
    type: 'primary',
    size: null,
    textTransition: true,
    children: 'Open',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compares animated and animateSize={false} auto-width label changes using the same external toggle flow as the Vue reference story.',
      },
    },
    controls: {
      exclude: ['children', 'animateSize', 'size', 'textTransition'],
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
