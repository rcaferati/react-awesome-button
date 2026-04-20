import * as React from 'react';

export type RootDomElement =
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLDivElement;

export type CssModuleMap = Record<string, string>;

export type CssEventClearableElement = HTMLSpanElement & {
  clearCssEvent?: () => void;
};

export type PointerMoveState = 'left' | 'middle' | 'right';

export type PressPhase = 0 | 1 | 2 | 3;

export type AutoWidthValues = {
  content: number | null;
  label: number | null;
};

export type AutoTextTransitionFlow = 'grow-first' | 'text-first' | 'text-only';

export type AutoTextTransitionPhase =
  | 'grow-sizing'
  | 'grow-text'
  | 'shrink-text'
  | 'shrink-sizing';

export type AutoTextTransitionState = {
  phase: AutoTextTransitionPhase;
  runId: number;
  targetText: string;
  targetWidths: AutoWidthValues;
};

export type AutoWidthInlineStyleSnapshot = {
  contentFlexBasis: string;
  contentFlexGrow: string;
  contentFlexShrink: string;
  contentTransition: string;
  contentWidth: string;
  labelFlexBasis: string;
  labelFlexGrow: string;
  labelFlexShrink: string;
  labelTransition: string;
  labelWidth: string;
};

export type PressLikeEvent =
  | React.KeyboardEvent<RootDomElement>
  | React.MouseEvent<RootDomElement>
  | React.PointerEvent<RootDomElement>
  | React.TouchEvent<RootDomElement>;

export type PointerLikeEvent =
  | React.MouseEvent<RootDomElement>
  | React.PointerEvent<RootDomElement>
  | React.TouchEvent<RootDomElement>;

export type ForwardableElementComponent = React.ForwardRefExoticComponent<any>;

export type TextTransitionFrame = {
  from: string;
  startedAt: number;
  to: string;
};

export type ButtonType = {
  active?: boolean;
  after?: React.ReactNode;
  animateSize?: boolean;
  before?: React.ReactNode;
  between?: boolean;
  children?: React.ReactNode;
  className?: string | null;
  containerProps?: Record<string, unknown>;
  cssModule?: CssModuleMap | null;
  disabled?: boolean;
  element?: ForwardableElementComponent | null;
  extra?: React.ReactNode;
  href?: string | null;
  moveEvents?: boolean;
  onMouseDown?: (event: PointerLikeEvent) => void;
  onMouseUp?: (event: PointerLikeEvent) => void;
  onPress?: (event: PressLikeEvent) => void;
  onPressed?: (event: PressLikeEvent) => void;
  onReleased?: (element: HTMLElement) => void;
  placeholder?: boolean;
  ripple?: boolean;
  rootElement?: string;
  size?: string | null;
  style?: React.CSSProperties;
  textTransition?: boolean;
  type?: string;
  visible?: boolean;
};
