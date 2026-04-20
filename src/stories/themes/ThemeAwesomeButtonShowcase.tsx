import * as React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

import AwesomeButton from '../../components/AwesomeButton';

type AwesomeButtonProps = React.ComponentProps<typeof AwesomeButton>;
type ThemeModule = Record<string, string> & {
  default?: Record<string, string>;
};

export function resolveThemeModule(themeModule: ThemeModule): Record<string, string> {
  return themeModule.default ?? themeModule;
}

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

function makeButtonProps(
  cssModule: Record<string, string>,
  type: string,
  size: 'small' | 'medium' | 'large' | null = 'medium'
): Partial<AwesomeButtonProps> {
  return {
    cssModule,
    type,
    size,
    visible: true,
    placeholder: false,
    disabled: false,
    moveEvents: true,
    ripple: false,
  };
}

export default function ThemeAwesomeButtonShowcase({
  themeLabel,
  cssModule,
}: {
  themeLabel: string;
  cssModule: Record<string, string>;
}): JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        justifyItems: 'center',
        padding: 8,
        width: 'min(900px, 94vw)',
      }}>
      <Section title={`${themeLabel} theme`}>
        <Card label="AwesomeButton overview">
          <AwesomeButton {...(makeButtonProps(cssModule, 'primary') as AwesomeButtonProps)}>
            Primary
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(cssModule, 'secondary') as AwesomeButtonProps)}>
            Secondary
          </AwesomeButton>

          <AwesomeButton {...(makeButtonProps(cssModule, 'danger') as AwesomeButtonProps)}>
            Danger
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(cssModule, 'link') as AwesomeButtonProps)}
            href="https://github.com/rcaferati"
            containerProps={{ target: '_blank', rel: 'noreferrer noopener' }}>
            Open link
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(cssModule, 'primary') as AwesomeButtonProps)}
            disabled>
            Disabled
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(
              cssModule,
              'primary',
              null
            ) as AwesomeButtonProps)}>
            Auto width grows with content
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(cssModule, 'primary') as AwesomeButtonProps)}
            before={<Sparkles size={16} aria-hidden="true" />}
            after={<ArrowRight size={16} aria-hidden="true" />}>
            Continue
          </AwesomeButton>

          <AwesomeButton
            {...(makeButtonProps(cssModule, 'primary') as AwesomeButtonProps)}
            active>
            Active
          </AwesomeButton>
        </Card>
      </Section>
    </div>
  );
}
