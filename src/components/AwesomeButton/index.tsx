import * as React from 'react';
import { setCssEndEvent } from '@rcaferati/wac';
import {
  classToModules,
  getClassName,
  createRippleEffect,
  toggleMoveClasses,
} from '../../helpers/components';

const ROOTELM = 'aws-btn';
const DEFAULT_AUTO_WIDTHS: {
  content: number | null;
  label: number | null;
} = {
  content: null,
  label: null,
};

type RootDomElement = HTMLAnchorElement | HTMLButtonElement | HTMLDivElement;
type CssModuleMap = Record<string, string>;
type CssEventClearableElement = HTMLSpanElement & {
  clearCssEvent?: () => void;
};

type PointerMoveState = 'left' | 'middle' | 'right';
type PressPhase = 0 | 1 | 2 | 3; // 0 idle, 1 pressed, 2 locked(active external), 3 releasing

type PressLikeEvent =
  | React.MouseEvent<RootDomElement>
  | React.TouchEvent<RootDomElement>
  | React.PointerEvent<RootDomElement>
  | React.KeyboardEvent<RootDomElement>;

type PointerLikeEvent =
  | React.PointerEvent<RootDomElement>
  | React.MouseEvent<RootDomElement>
  | React.TouchEvent<RootDomElement>;

type ForwardableElementComponent = React.ForwardRefExoticComponent<any>;
type TextTransitionFrame = {
  from: string;
  to: string;
  startedAt: number;
};

const Anchor = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a ref={ref} {...props} />);
Anchor.displayName = 'AwesomeButtonAnchor';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => <button ref={ref} {...props} />);
Button.displayName = 'AwesomeButtonButton';

export type ButtonType = {
  active?: boolean;
  after?: React.ReactNode;
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

function isActivationKey(event: React.KeyboardEvent<RootDomElement>): boolean {
  return event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
}

function getMoveState(clientX: number, element: HTMLElement): PointerMoveState {
  const { left } = element.getBoundingClientRect();
  const width = element.offsetWidth;

  if (clientX < left + width * 0.3) return 'left';
  if (clientX > left + width * 0.65) return 'right';
  return 'middle';
}

function isKeyboardClick(event: React.MouseEvent<RootDomElement>): boolean {
  // Keyboard / AT "click" commonly has detail = 0
  return event.detail === 0;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const TEXT_TRANSITION_DURATION = 320;
const TEXT_TRANSITION_SETTLE_START = 0.45;
const UPPERCASE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_POOL = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT_POOL = '0123456789';
const SYMBOL_POOL = '#%&^+=-';

function extractStringChild(children: React.ReactNode): string | null {
  return typeof children === 'string' ? children : null;
}

function getTransitionCharacterPool(character: string): string {
  if (/[A-Z]/.test(character)) {
    return UPPERCASE_POOL;
  }
  if (/[a-z]/.test(character)) {
    return LOWERCASE_POOL;
  }
  if (/\d/.test(character)) {
    return DIGIT_POOL;
  }

  return SYMBOL_POOL;
}

function getRandomTransitionCharacter(character: string): string {
  if (!character || /\s/.test(character)) {
    return character;
  }

  const pool = getTransitionCharacterPool(character);
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || character;
}

function buildTextTransitionFrame(from: string, to: string, progress: number) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const peakLength = Math.max(from.length, to.length);
  const settleProgress =
    clampedProgress <= TEXT_TRANSITION_SETTLE_START
      ? 0
      : (clampedProgress - TEXT_TRANSITION_SETTLE_START) /
        (1 - TEXT_TRANSITION_SETTLE_START);

  const currentLength =
    clampedProgress < TEXT_TRANSITION_SETTLE_START
      ? Math.ceil(
          from.length +
            (peakLength - from.length) *
              (clampedProgress / TEXT_TRANSITION_SETTLE_START)
        )
      : Math.ceil(peakLength - (peakLength - to.length) * settleProgress);

  const lockedCharacters = Math.floor(to.length * settleProgress);
  let nextText = '';

  for (let index = 0; index < currentLength; index += 1) {
    const sourceCharacter = from[index] ?? to[index] ?? ' ';
    const targetCharacter = to[index] ?? '';

    if (/\s/.test(targetCharacter || sourceCharacter)) {
      nextText += targetCharacter || sourceCharacter || ' ';
      continue;
    }

    if (settleProgress >= 1 && index < to.length) {
      nextText += targetCharacter;
      continue;
    }

    if (index < lockedCharacters && index < to.length) {
      nextText += targetCharacter;
      continue;
    }

    nextText += getRandomTransitionCharacter(targetCharacter || sourceCharacter);
  }

  return nextText;
}

function readSnappedWidth(element: HTMLElement | null): number | null {
  if (!element) {
    return null;
  }

  const scrollWidth = element.scrollWidth;
  if (scrollWidth > 0) {
    return scrollWidth;
  }

  const rectWidth = element.getBoundingClientRect().width;
  if (Number.isFinite(rectWidth) && rectWidth > 0) {
    return Math.ceil(rectWidth);
  }

  return null;
}

const AwesomeButton = ({
  active = false,
  after = null,
  before = null,
  between = false,
  children = null,
  className = null,
  containerProps = {},
  cssModule = null,
  disabled = false,
  element = null,
  extra = null,
  href = null,
  moveEvents = true,
  onMouseDown = null,
  onMouseUp = null,
  onPress = null,
  onPressed = null,
  onReleased = null,
  placeholder = true,
  ripple = false,
  rootElement = ROOTELM,
  size = null,
  style = {},
  textTransition = false,
  type = 'primary',
  visible = true,
}: ButtonType) => {
  const stringChild = React.useMemo(() => extractStringChild(children), [children]);
  const [pressPosition, setPressPosition] = React.useState<string | null>(
    active ? `${rootElement}--active` : null
  );
  const [autoWidths, setAutoWidths] = React.useState<{
    content: number | null;
    label: number | null;
  }>(DEFAULT_AUTO_WIDTHS);
  const [displayedText, setDisplayedText] = React.useState<string | null>(
    stringChild
  );

  const rootRef = React.useRef<RootDomElement | null>(null);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);
  const contentRef = React.useRef<CssEventClearableElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);

  const pressedRef = React.useRef<PressPhase>(0);
  const activePointerIdRef = React.useRef<number | null>(null);
  const pointerStartYRef = React.useRef<number | null>(null);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const textTransitionRafRef = React.useRef<number | null>(null);
  const mountedRef = React.useRef(true);
  const displayedTextRef = React.useRef<string | null>(stringChild);
  const targetTextRef = React.useRef<string | null>(stringChild);
  const releaseRunRef = React.useRef(0);

  const RenderComponent = (element || (href ? Anchor : Button)) as
    | typeof Anchor
    | typeof Button
    | ForwardableElementComponent;
  const activeClassName = `${rootElement}--active`;
  const releasingClassName = `${rootElement}--releasing`;

  const isDisabled = React.useMemo(() => {
    if (placeholder === true && !children) {
      return true;
    }
    return disabled;
  }, [placeholder, children, disabled]);

  const isAutoSize = size == null;
  const shouldSnapAutoWidth = isAutoSize && !(placeholder === true && !children);
  const sizeModeClass = isAutoSize
    ? `${rootElement}--auto`
    : `${rootElement}--fixed`;

  const isNativeButton = RenderComponent === Button;
  const isAnchorLike = Boolean(href);

  const needsButtonRole = !isNativeButton && !isAnchorLike;
  const interactiveRole = needsButtonRole ? 'button' : undefined;

  const rootClassName = React.useMemo(() => {
    const classList: string[] = [
      rootElement,
      sizeModeClass,
      ...(type ? [`${rootElement}--${type}`] : []),
      ...(size ? [`${rootElement}--${size}`] : []),
      ...(visible ? [`${rootElement}--visible`] : []),
      ...(between ? [`${rootElement}--between`] : []),
      ...(placeholder && !children ? [`${rootElement}--placeholder`] : []),
      ...(isDisabled ? [`${rootElement}--disabled`] : []),
      ...(pressPosition ? [pressPosition] : []),
    ];

    if (className) {
      classList.push(...className.trim().split(/\s+/).filter(Boolean));
    }

    if (cssModule && cssModule[rootElement]) {
      return classList
        .map((item) => cssModule[item] || item)
        .join(' ')
        .trim()
        .replace(/\s+/g, ' ');
    }

    return classList.join(' ').trim().replace(/\s+/g, ' ');
  }, [
    rootElement,
    sizeModeClass,
    type,
    size,
    visible,
    between,
    placeholder,
    children,
    isDisabled,
    pressPosition,
    className,
    cssModule,
  ]);

  const handleAction = React.useCallback(
    (event: PressLikeEvent) => {
      if (!rootRef.current || isDisabled) return;
      onPress?.(event);
    },
    [isDisabled, onPress]
  );

  const finalizeRelease = React.useCallback(
    (runId: number) => {
      if (!mountedRef.current || releaseRunRef.current !== runId) {
        return;
      }

      pressedRef.current = 0;
      setPressPosition((previous) =>
        previous === releasingClassName ? null : previous
      );

      if (rootRef.current) {
        onReleased?.(rootRef.current);
      }
    },
    [onReleased, releasingClassName]
  );

  const cancelPendingRelease = React.useCallback(() => {
    releaseRunRef.current += 1;
    contentRef.current?.clearCssEvent?.();
  }, []);

  const clearPress = React.useCallback(
    ({
      force = false,
      leave = false,
    }: { force?: boolean; leave?: boolean } = {}) => {
      toggleMoveClasses({
        element: rootRef.current,
        root: rootElement,
        cssModule,
      });

      // soft clear-press
      if (leave === true && pressedRef.current === 0) {
        return;
      }

      if (pressedRef.current === 3 && pressPosition === releasingClassName) {
        return;
      }

      if (active && !force) {
        pressedRef.current = 2;
        setPressPosition((previous) =>
          previous === activeClassName ? previous : activeClassName
        );
        return;
      }

      const hadVisualPress =
        pressedRef.current !== 0 ||
        pressPosition === activeClassName ||
        pressPosition === releasingClassName;

      cancelPendingRelease();

      if (!hadVisualPress) {
        pressedRef.current = 0;
        setPressPosition(null);
        return;
      }

      const currentRunId = releaseRunRef.current;
      const contentElement = contentRef.current;

      pressedRef.current = 3;

      if (contentElement) {
        setCssEndEvent(contentElement, 'transition', {
          tolerance: 1,
        }).then(() => {
          finalizeRelease(currentRunId);
        });
      } else {
        finalizeRelease(currentRunId);
      }

      setPressPosition((previous) =>
        previous === releasingClassName ? previous : releasingClassName
      );
    },
    [
      active,
      activeClassName,
      cancelPendingRelease,
      cssModule,
      finalizeRelease,
      pressPosition,
      releasingClassName,
      rootElement,
    ]
  );

  React.useEffect(() => {
    if (active !== true) {
      return;
    }

    cancelPendingRelease();

    if (pressedRef.current === 0) {
      pressedRef.current = 2;
    }

    setPressPosition((previous) =>
      previous === activeClassName ? previous : activeClassName
    );
  }, [active, activeClassName, cancelPendingRelease]);

  // IMPORTANT:
  // Only clear when external controlled `active` mode is turned off.
  // Do not depend on `pressPosition` here, or normal press animation gets cleared immediately.
  React.useEffect(() => {
    if (active === false && pressedRef.current === 2) {
      clearPress({ force: true });
    }
  }, [active, clearPress]);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (rafRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (
        textTransitionRafRef.current !== null &&
        typeof window !== 'undefined'
      ) {
        window.cancelAnimationFrame(textTransitionRafRef.current);
        textTransitionRafRef.current = null;
      }
      contentRef.current?.clearCssEvent?.();
    };
  }, []);

  const clearAutoWidthRaf = React.useCallback(() => {
    if (rafRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const measureAutoWidth = React.useCallback(() => {
    if (!shouldSnapAutoWidth) {
      setAutoWidths((previous) =>
        previous.content === null && previous.label === null
          ? previous
          : DEFAULT_AUTO_WIDTHS
      );
      return;
    }

    const contentElement = contentRef.current;
    const labelElement = labelRef.current;

    if (!contentElement || !labelElement) {
      return;
    }

    const previousInlineValues = {
      contentWidth: contentElement.style.width,
      contentFlex: contentElement.style.flex,
      labelWidth: labelElement.style.width,
      labelFlexBasis: labelElement.style.flexBasis,
      labelFlex: labelElement.style.flex,
    };

    contentElement.style.width = 'auto';
    contentElement.style.flex = '0 1 auto';
    labelElement.style.width = 'auto';
    labelElement.style.flexBasis = 'auto';
    labelElement.style.flex = '0 1 auto';

    const nextWidths = {
      content: readSnappedWidth(contentElement),
      label: readSnappedWidth(labelElement),
    };

    contentElement.style.width = previousInlineValues.contentWidth;
    contentElement.style.flex = previousInlineValues.contentFlex;
    labelElement.style.width = previousInlineValues.labelWidth;
    labelElement.style.flexBasis = previousInlineValues.labelFlexBasis;
    labelElement.style.flex = previousInlineValues.labelFlex;

    setAutoWidths((previous) =>
      previous.content === nextWidths.content &&
      previous.label === nextWidths.label
        ? previous
        : nextWidths
    );
  }, [shouldSnapAutoWidth]);

  const scheduleAutoWidthMeasure = React.useCallback(() => {
    if (typeof window === 'undefined') {
      measureAutoWidth();
      return;
    }

    clearAutoWidthRaf();
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      if (mountedRef.current) {
        measureAutoWidth();
      }
    });
  }, [clearAutoWidthRaf, measureAutoWidth]);

  const clearTextTransitionRaf = React.useCallback(() => {
    if (
      textTransitionRafRef.current !== null &&
      typeof window !== 'undefined'
    ) {
      window.cancelAnimationFrame(textTransitionRafRef.current);
      textTransitionRafRef.current = null;
    }
  }, []);

  const updateDisplayedText = React.useCallback((value: string | null) => {
    displayedTextRef.current = value;
    setDisplayedText((previous) => (previous === value ? previous : value));
  }, []);

  React.useEffect(() => {
    if (textTransition !== true || stringChild == null) {
      clearTextTransitionRaf();
      targetTextRef.current = stringChild;
      updateDisplayedText(stringChild);
      return;
    }

    if (displayedTextRef.current == null) {
      targetTextRef.current = stringChild;
      updateDisplayedText(stringChild);
      return;
    }

    if (
      targetTextRef.current === stringChild &&
      (textTransitionRafRef.current !== null ||
        displayedTextRef.current === stringChild)
    ) {
      return;
    }

    if (typeof window === 'undefined') {
      targetTextRef.current = stringChild;
      updateDisplayedText(stringChild);
      return;
    }

    const transitionFrame: TextTransitionFrame = {
      from: displayedTextRef.current,
      to: stringChild,
      startedAt:
        typeof window.performance?.now === 'function'
          ? window.performance.now()
          : Date.now(),
    };

    targetTextRef.current = stringChild;
    clearTextTransitionRaf();

    const tick = (timestamp: number) => {
      const elapsed = Math.max(0, timestamp - transitionFrame.startedAt);
      const progress = Math.min(1, elapsed / TEXT_TRANSITION_DURATION);

      if (progress >= 1) {
        textTransitionRafRef.current = null;
        updateDisplayedText(transitionFrame.to);
        return;
      }

      updateDisplayedText(
        buildTextTransitionFrame(
          transitionFrame.from,
          transitionFrame.to,
          progress
        )
      );

      textTransitionRafRef.current = window.requestAnimationFrame(tick);
    };

    textTransitionRafRef.current = window.requestAnimationFrame(tick);
  }, [
    clearTextTransitionRaf,
    stringChild,
    textTransition,
    updateDisplayedText,
  ]);

  useIsomorphicLayoutEffect(() => {
    measureAutoWidth();
  }, [
    after,
    before,
    children,
    displayedText,
    measureAutoWidth,
    placeholder,
    size,
    visible,
  ]);

  React.useEffect(() => {
    if (!shouldSnapAutoWidth || typeof ResizeObserver === 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      return;
    }

    resizeObserverRef.current?.disconnect();
    const observer = new ResizeObserver(() => {
      scheduleAutoWidthMeasure();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    if (labelRef.current) {
      observer.observe(labelRef.current);
    }

    resizeObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (resizeObserverRef.current === observer) {
        resizeObserverRef.current = null;
      }
    };
  }, [scheduleAutoWidthMeasure, shouldSnapAutoWidth]);

  React.useEffect(() => {
    if (
      !shouldSnapAutoWidth ||
      typeof document === 'undefined' ||
      !('fonts' in document) ||
      !(document as Document & { fonts?: FontFaceSet }).fonts?.ready
    ) {
      return;
    }

    let cancelled = false;

    (document as Document & { fonts: FontFaceSet }).fonts.ready
      .then(() => {
        if (!cancelled) {
          scheduleAutoWidthMeasure();
        }
      })
      .catch(() => {
        // no-op
      });

    return () => {
      cancelled = true;
    };
  }, [scheduleAutoWidthMeasure, shouldSnapAutoWidth]);

  const contentInlineStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!shouldSnapAutoWidth || autoWidths.content == null) {
      return undefined;
    }

    return {
      width: `${autoWidths.content}px`,
      flex: `0 0 ${autoWidths.content}px`,
    };
  }, [autoWidths.content, shouldSnapAutoWidth]);

  const labelInlineStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!shouldSnapAutoWidth || autoWidths.label == null) {
      return undefined;
    }

    return {
      width: `${autoWidths.label}px`,
      flexBasis: `${autoWidths.label}px`,
    };
  }, [autoWidths.label, shouldSnapAutoWidth]);

  const dispatchPressEvent = React.useCallback(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return;
    const eventTrigger = new Event('btn-press');
    wrapperRef.current.dispatchEvent(eventTrigger);
  }, []);

  const createRipple = React.useCallback(
    (event: PointerLikeEvent) => {
      if (!wrapperRef.current || !contentRef.current) return;

      createRippleEffect({
        event,
        button: wrapperRef.current,
        content: contentRef.current,
        className: getClassName(`${rootElement}__bubble`, cssModule),
      });
    },
    [cssModule, rootElement]
  );

  const pressIn = React.useCallback(
    (event: PressLikeEvent) => {
      if (isDisabled || pressedRef.current === 2) {
        return;
      }

      cancelPendingRelease();
      pressedRef.current = 1;

      if (contentRef.current) {
        setCssEndEvent(contentRef.current, 'transition', {
          tolerance: 1,
        }).then(() => {
          onPressed?.(event);
        });
      } else {
        onPressed?.(event);
      }

      setPressPosition(activeClassName);
    },
    [activeClassName, cancelPendingRelease, isDisabled, onPressed]
  );

  const pressOut = React.useCallback(
    (event: PressLikeEvent, options: { allowRipple?: boolean } = {}) => {
      const { allowRipple = false } = options;

      if (isDisabled || pressedRef.current !== 1) {
        return;
      }

      if (allowRipple && ripple) {
        createRipple(event as PointerLikeEvent);
      }

      dispatchPressEvent();
      handleAction(event);

      if (active === true) {
        pressedRef.current = 2;
        return;
      }

      clearPress();
    },
    [
      active,
      clearPress,
      createRipple,
      dispatchPressEvent,
      handleAction,
      isDisabled,
      ripple,
    ]
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      onMouseDown?.(event);

      if (isDisabled) return;
      if (event.button !== 0) return;

      activePointerIdRef.current = event.pointerId;
      pointerStartYRef.current = event.clientY;

      // Preserve closer legacy desktop semantics:
      // mouse release outside should not trigger action.
      // Capture touch/pen only.
      if (event.pointerType !== 'mouse' && rootRef.current?.setPointerCapture) {
        try {
          rootRef.current.setPointerCapture(event.pointerId);
        } catch {
          // no-op
        }
      }

      pressIn(event);
    },
    [isDisabled, onMouseDown, pressIn]
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      onMouseUp?.(event);

      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      if (
        event.pointerType !== 'mouse' &&
        rootRef.current?.releasePointerCapture
      ) {
        try {
          rootRef.current.releasePointerCapture(event.pointerId);
        } catch {
          // no-op
        }
      }

      // Touch scroll protection (legacy behavior preserved)
      if (
        event.pointerType === 'touch' &&
        pointerStartYRef.current !== null &&
        wrapperRef.current
      ) {
        const diff = Math.abs(pointerStartYRef.current - event.clientY);
        if (diff > wrapperRef.current.offsetHeight) {
          activePointerIdRef.current = null;
          pointerStartYRef.current = null;
          clearPress({ force: true });
          return;
        }
      }

      activePointerIdRef.current = null;
      pointerStartYRef.current = null;

      if (isDisabled) {
        event.preventDefault();
        return;
      }

      pressOut(event, { allowRipple: true });
    },
    [clearPress, isDisabled, onMouseUp, pressOut]
  );

  const handlePointerCancel = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      activePointerIdRef.current = null;
      pointerStartYRef.current = null;
      clearPress({ force: true });
    },
    [clearPress]
  );

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      // Hover/leave skew behavior is a mouse concern; ignore touch/pen leaves.
      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }

      if (active === true && pressedRef.current !== 2) {
        clearPress({ force: true });
        return;
      }

      // soft clear
      clearPress({ leave: true });
    },
    [active, clearPress]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      if (moveEvents !== true || isDisabled === true) return;
      if (event.pointerType !== 'mouse') return;
      if (!wrapperRef.current) return;

      const state = getMoveState(event.clientX, wrapperRef.current);

      toggleMoveClasses({
        element: rootRef.current,
        root: rootElement,
        cssModule,
        state,
      });
    },
    [moveEvents, isDisabled, rootElement, cssModule]
  );

  const handleMouseEnterFallback = React.useCallback(() => {
    if (moveEvents === true || isDisabled === true) return;

    toggleMoveClasses({
      element: rootRef.current,
      root: rootElement,
      cssModule,
      state: 'middle',
    });
  }, [moveEvents, isDisabled, rootElement, cssModule]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<RootDomElement>) => {
      if (isDisabled === true) {
        if (href) {
          event.preventDefault();
        }
        return;
      }

      // Keyboard/AT activation fallback (avoid double fire on pointer clicks)
      if (isKeyboardClick(event)) {
        handleAction(event);
      }
    },
    [handleAction, href, isDisabled]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<RootDomElement>) => {
      if (!needsButtonRole || isDisabled) return;
      if (!isActivationKey(event)) return;
      if (event.repeat) return;

      // Prevent page scroll on Space for custom button-like elements
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
      }

      pressIn(event);
    },
    [isDisabled, needsButtonRole, pressIn]
  );

  const handleKeyUp = React.useCallback(
    (event: React.KeyboardEvent<RootDomElement>) => {
      if (!needsButtonRole || isDisabled) return;
      if (!isActivationKey(event)) return;

      event.preventDefault();
      pressOut(event, { allowRipple: false });
    },
    [isDisabled, needsButtonRole, pressOut]
  );

  const mergedContainerProps = containerProps ?? {};
  const containerTabIndex = (mergedContainerProps as { tabIndex?: number })
    .tabIndex;

  const rootExtraProps: Record<string, unknown> = {};
  if (href) {
    rootExtraProps.href = href;
  }
  if (isNativeButton) {
    // Avoid accidental form submission unless user explicitly provided a type
    if ((mergedContainerProps as { type?: string }).type == null) {
      rootExtraProps.type = 'button';
    }
    rootExtraProps.disabled = isDisabled;
  }

  const RenderComponentAny = RenderComponent as any;
  const renderedLabel = textTransition && stringChild != null
    ? displayedText ?? stringChild
    : children;

  return (
    <RenderComponentAny
      {...(mergedContainerProps as object)}
      {...rootExtraProps}
      style={style}
      className={rootClassName}
      role={interactiveRole}
      aria-disabled={isDisabled || undefined}
      tabIndex={
        needsButtonRole
          ? isDisabled
            ? -1
            : (containerTabIndex ?? 0)
          : containerTabIndex
      }
      ref={rootRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onMouseEnter={handleMouseEnterFallback}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}>
      <span
        ref={wrapperRef}
        className={getClassName(`${rootElement}__wrapper`, cssModule)}>
        <span
          ref={contentRef}
          style={contentInlineStyle}
          className={getClassName(`${rootElement}__content`, cssModule)}>
          {before}
          <span
            ref={labelRef}
            style={labelInlineStyle}
            className={getClassName(`${rootElement}__label`, cssModule)}>
            {renderedLabel}
          </span>
          {after}
        </span>
        {extra}
      </span>
    </RenderComponentAny>
  );
};

export default AwesomeButton;
