import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ArrowRight, Download, Play, Search, Sparkles } from 'lucide-react';

import AwesomeButton from '../../components/AwesomeButton';
import defaultStyles from '../../styles/themes/theme-blue';

type AwesomeButtonProps = React.ComponentProps<typeof AwesomeButton>;

type ShowcaseArgs = {
  type: string;
  disabled: boolean;
  ripple: boolean;
};

const resolvedDefaultStyles =
  (
    defaultStyles as Record<string, string> & {
      default?: Record<string, string>;
    }
  )?.default ?? (defaultStyles as Record<string, string>);

const iconSizeByButtonSize: Record<'small' | 'medium' | 'large', number> = {
  small: 14,
  medium: 16,
  large: 18,
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        width: 'min(900px, 94vw)',
      }}>
      <h3
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 700,
          opacity: 0.85,
          letterSpacing: 0.2,
        }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr' }}>
        {children}
      </div>
    </section>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 12,
        background: '#fff',
        display: 'grid',
        gap: 10,
      }}>
      <div
        style={{
          fontSize: 12,
          lineHeight: 1.2,
          fontWeight: 600,
          opacity: 0.8,
        }}>
        {label}
      </div>
      <div
        style={{
          minHeight: 56,
          display: 'grid',
          gap: 10,
          justifyItems: 'start',
          alignItems: 'center',
        }}>
        {children}
      </div>
    </div>
  );
}

function ShowcaseComponent({
  type,
  disabled,
  ripple,
}: ShowcaseArgs): JSX.Element {
  const makeProps = (
    size: 'small' | 'medium' | 'large' | null
  ): Partial<AwesomeButtonProps> => ({
    size,
    type,
    disabled,
    ripple,
    visible: true,
    placeholder: false,
    moveEvents: true,
    cssModule: resolvedDefaultStyles,
  });

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        justifyItems: 'center',
        padding: 8,
        width: 'min(900px, 94vw)',
      }}>
      <Section title="AwesomeButton · Label + icon">
        <Card label="small / medium / large / auto">
          <AwesomeButton
            {...(makeProps('small') as AwesomeButtonProps)}
            before={
              <Sparkles size={iconSizeByButtonSize.small} aria-hidden="true" />
            }
            after={
              <ArrowRight
                size={iconSizeByButtonSize.small}
                aria-hidden="true"
              />
            }>
            Continue
          </AwesomeButton>

          <AwesomeButton
            {...(makeProps('medium') as AwesomeButtonProps)}
            before={
              <Sparkles size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }
            after={
              <ArrowRight
                size={iconSizeByButtonSize.medium}
                aria-hidden="true"
              />
            }>
            Continue
          </AwesomeButton>

          <AwesomeButton
            {...(makeProps('large') as AwesomeButtonProps)}
            before={
              <Sparkles size={iconSizeByButtonSize.large} aria-hidden="true" />
            }
            after={
              <ArrowRight
                size={iconSizeByButtonSize.large}
                aria-hidden="true"
              />
            }>
            Continue
          </AwesomeButton>

          <AwesomeButton
            {...(makeProps(null) as AwesomeButtonProps)}
            before={
              <Sparkles size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }
            after={
              <ArrowRight
                size={iconSizeByButtonSize.medium}
                aria-hidden="true"
              />
            }>
            Auto width grows with content
          </AwesomeButton>
        </Card>

        <Card label="more lucide examples">
          <AwesomeButton
            {...(makeProps('medium') as AwesomeButtonProps)}
            before={
              <Search size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }>
            Search
          </AwesomeButton>

          <AwesomeButton
            {...(makeProps('medium') as AwesomeButtonProps)}
            before={
              <Download size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }>
            Download
          </AwesomeButton>
        </Card>
      </Section>

      <Section title="AwesomeButton · Icon only">
        <Card label="small / medium / large / auto">
          <AwesomeButton
            {...(makeProps('small') as AwesomeButtonProps)}
            className="aws-btn--icon"
            before={
              <Play size={iconSizeByButtonSize.small} aria-hidden="true" />
            }
          />

          <AwesomeButton
            {...(makeProps('medium') as AwesomeButtonProps)}
            className="aws-btn--icon"
            before={
              <Play size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }
          />

          <AwesomeButton
            {...(makeProps('large') as AwesomeButtonProps)}
            className="aws-btn--icon"
            before={
              <Play size={iconSizeByButtonSize.large} aria-hidden="true" />
            }
          />

          <AwesomeButton
            {...(makeProps(null) as AwesomeButtonProps)}
            className="aws-btn--icon"
            before={
              <div style={{display:'flex',alignItems:'center'}}><Play size={iconSizeByButtonSize.medium} style={{width:16,height:16}} aria-hidden="true" /></div>
            }
          />
        </Card>
      </Section>
    </div>
  );
}

const meta: Meta<typeof ShowcaseComponent> = {
  title: 'Icons/AwesomeButton',
  component: ShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    type: 'primary',
    disabled: false,
    ripple: false,
  },
  argTypes: {
    type: {
      control: 'text',
      table: { category: 'Button' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    ripple: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
