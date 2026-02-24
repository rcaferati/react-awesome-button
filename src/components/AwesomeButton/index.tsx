import * as React from 'react';
import { setCssEndEvent } from '@rcaferati/wac';
import {
  classToModules,
  getClassName,
  createRippleEffect,
  toggleMoveClasses,
} from '../../helpers/components';

const ROOTELM = 'aws-btn';

type RootDomElement = HTMLAnchorElement | HTMLButtonElement | HTMLDivElement;
type CssModuleMap = Record<string, string>;
type CssEventClearableElement = HTMLSpanElement & {
  clearCssEvent?: () => void;
};

type PointerMoveState = 'left' | 'middle' | 'right';
type PressPhase = 0 | 1 | 2; // 0 idle, 1 pressed, 2 locked(active external)

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
  type = 'primary',
  visible = true,
}: ButtonType) => {
  const [pressPosition, setPressPosition] = React.useState<string | null>(null);

  const rootRef = React.useRef<RootDomElement | null>(null);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);
  const contentRef = React.useRef<CssEventClearableElement | null>(null);

  const pressedRef = React.useRef<PressPhase>(0);
  const activePointerIdRef = React.useRef<number | null>(null);
  const pointerStartYRef = React.useRef<number | null>(null);

  const RenderComponent = (element || (href ? Anchor : Button)) as
    | typeof Anchor
    | typeof Button
    | ForwardableElementComponent;

  const isDisabled = React.useMemo(() => {
    if (placeholder === true && !children) {
      return true;
    }
    return disabled;
  }, [placeholder, children, disabled]);

  const isAutoSize = size == null;
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
      return classToModules(classList, cssModule);
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

  const clearPressCallback = React.useCallback(() => {
    pressedRef.current = 0;
    if (rootRef.current) {
      onReleased?.(rootRef.current);
    }
  }, [onReleased]);

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

      const nextPressPosition =
        active && !force ? `${rootElement}--active` : null;

      contentRef.current?.clearCssEvent?.();

      if (
        nextPressPosition === null &&
        pressPosition === `${rootElement}--active` &&
        contentRef.current
      ) {
        setCssEndEvent(contentRef.current, 'transition', {
          tolerance: 1,
        }).then(clearPressCallback);
      }

      setPressPosition(nextPressPosition);
    },
    [active, clearPressCallback, cssModule, pressPosition, rootElement]
  );

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
      contentRef.current?.clearCssEvent?.();
    };
  }, []);

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

      setPressPosition(`${rootElement}--active`);
    },
    [isDisabled, onPressed, rootElement]
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
          className={getClassName(`${rootElement}__content`, cssModule)}>
          {before}
          <span className={getClassName(`${rootElement}__label`, cssModule)}>
            {children}
          </span>
          {after}
        </span>
        {extra}
      </span>
    </RenderComponentAny>
  );
};

export default AwesomeButton;
