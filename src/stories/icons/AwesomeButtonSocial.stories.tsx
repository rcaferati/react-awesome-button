import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Github, Instagram } from 'lucide-react';

import AwesomeButtonSocial from '../../components/AwesomeButtonSocial';
import defaultStyles from '../../styles/themes/theme-blue';

type AwesomeButtonSocialProps = React.ComponentProps<
  typeof AwesomeButtonSocial
>;

type ShowcaseArgs = {
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

function ShowcaseComponent({ disabled, ripple }: ShowcaseArgs): JSX.Element {
  const makeProps = (
    size: 'small' | 'medium' | 'large' | null
  ): Partial<AwesomeButtonSocialProps> => ({
    size,
    disabled,
    ripple,
    visible: true,
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
      <Section title="AwesomeButtonSocial · Instagram">
        <Card label="small / medium / large / auto">
          <AwesomeButtonSocial
            {...(makeProps('small') as AwesomeButtonSocialProps)}
            type="instagram"
            before={
              <Instagram size={iconSizeByButtonSize.small} aria-hidden="true" />
            }>
            Instagram
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps('medium') as AwesomeButtonSocialProps)}
            type="instagram"
            before={
              <Instagram
                size={iconSizeByButtonSize.medium}
                aria-hidden="true"
              />
            }>
            Instagram
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps('large') as AwesomeButtonSocialProps)}
            type="instagram"
            before={
              <Instagram size={iconSizeByButtonSize.large} aria-hidden="true" />
            }>
            Instagram
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps(null) as AwesomeButtonSocialProps)}
            type="instagram"
            before={
              <Instagram
                size={iconSizeByButtonSize.medium}
                aria-hidden="true"
              />
            }>
            Instagram Auto
          </AwesomeButtonSocial>
        </Card>
      </Section>

      <Section title="AwesomeButtonSocial · GitHub">
        <Card label="small / medium / large / auto">
          <AwesomeButtonSocial
            {...(makeProps('small') as AwesomeButtonSocialProps)}
            type="github"
            before={
              <Github size={iconSizeByButtonSize.small} aria-hidden="true" />
            }>
            GitHub
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps('medium') as AwesomeButtonSocialProps)}
            type="github"
            before={
              <Github size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }>
            GitHub
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps('large') as AwesomeButtonSocialProps)}
            type="github"
            before={
              <Github size={iconSizeByButtonSize.large} aria-hidden="true" />
            }>
            GitHub
          </AwesomeButtonSocial>

          <AwesomeButtonSocial
            {...(makeProps(null) as AwesomeButtonSocialProps)}
            type="github"
            before={
              <Github size={iconSizeByButtonSize.medium} aria-hidden="true" />
            }>
            GitHub Auto
          </AwesomeButtonSocial>
        </Card>
      </Section>
    </div>
  );
}

const meta: Meta<typeof ShowcaseComponent> = {
  title: 'Icons/AwesomeButtonSocial',
  component: ShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    disabled: false,
    ripple: false,
  },
  argTypes: {
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
