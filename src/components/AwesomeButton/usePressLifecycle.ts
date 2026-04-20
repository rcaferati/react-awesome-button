import * as React from 'react';
import { setCssEndEvent } from '@rcaferati/wac';
import {
  createRippleEffect,
  getClassName,
  toggleMoveClasses,
} from '../../helpers/components';
import type {
  ButtonType,
  CssEventClearableElement,
  CssModuleMap,
  PointerLikeEvent,
  PointerMoveState,
  PressLikeEvent,
  PressPhase,
  RootDomElement,
} from './types';

function isActivationKey(event: React.KeyboardEvent<RootDomElement>): boolean {
  return event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
}

function isKeyboardClick(event: React.MouseEvent<RootDomElement>): boolean {
  return event.detail === 0;
}

function getMoveState(clientX: number, element: HTMLElement): PointerMoveState {
  const { left } = element.getBoundingClientRect();
  const width = element.offsetWidth;

  if (clientX < left + width * 0.3) {
    return 'left';
  }
  if (clientX > left + width * 0.65) {
    return 'right';
  }
  return 'middle';
}

type UsePressLifecycleParams = {
  active: boolean;
  cssModule: CssModuleMap | null;
  isDisabled: boolean;
  moveEvents: boolean;
  needsButtonRole: boolean;
  href: string | null;
  onMouseDown: ButtonType['onMouseDown'];
  onMouseUp: ButtonType['onMouseUp'];
  onPress: ButtonType['onPress'];
  onPressed: ButtonType['onPressed'];
  onReleased: ButtonType['onReleased'];
  ripple: boolean;
  rootElement: string;
  rootRef: React.MutableRefObject<RootDomElement | null>;
  wrapperRef: React.MutableRefObject<HTMLSpanElement | null>;
  contentRef: React.MutableRefObject<CssEventClearableElement | null>;
};

type UsePressLifecycleResult = {
  handlers: {
    onClick: (event: React.MouseEvent<RootDomElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<RootDomElement>) => void;
    onKeyUp: (event: React.KeyboardEvent<RootDomElement>) => void;
    onMouseEnter: () => void;
    onPointerCancel: (event: React.PointerEvent<RootDomElement>) => void;
    onPointerDown: (event: React.PointerEvent<RootDomElement>) => void;
    onPointerLeave: (event: React.PointerEvent<RootDomElement>) => void;
    onPointerMove: (event: React.PointerEvent<RootDomElement>) => void;
    onPointerUp: (event: React.PointerEvent<RootDomElement>) => void;
  };
  pressClassName: string | null;
};

export default function usePressLifecycle({
  active,
  cssModule,
  isDisabled,
  moveEvents,
  needsButtonRole,
  href,
  onMouseDown = null,
  onMouseUp = null,
  onPress = null,
  onPressed = null,
  onReleased = null,
  ripple,
  rootElement,
  rootRef,
  wrapperRef,
  contentRef,
}: UsePressLifecycleParams): UsePressLifecycleResult {
  const activeClassName = `${rootElement}--active`;
  const releasingClassName = `${rootElement}--releasing`;

  const [pressPosition, setPressPosition] = React.useState<string | null>(
    active ? activeClassName : null
  );

  const pressedRef = React.useRef<PressPhase>(0);
  const activePointerIdRef = React.useRef<number | null>(null);
  const pointerStartYRef = React.useRef<number | null>(null);
  const mountedRef = React.useRef(true);
  const releaseRunRef = React.useRef(0);

  const createRipple = React.useCallback(
    (event: PointerLikeEvent) => {
      if (!wrapperRef.current || !contentRef.current) {
        return;
      }

      createRippleEffect({
        event,
        button: wrapperRef.current,
        content: contentRef.current,
        className: getClassName(`${rootElement}__bubble`, cssModule),
      });
    },
    [contentRef, cssModule, rootElement, wrapperRef]
  );

  const dispatchPressEvent = React.useCallback(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) {
      return;
    }

    const eventTrigger = new Event('btn-press');
    wrapperRef.current.dispatchEvent(eventTrigger);
  }, [wrapperRef]);

  const handleAction = React.useCallback(
    (event: PressLikeEvent) => {
      if (!rootRef.current || isDisabled) {
        return;
      }

      onPress?.(event);
    },
    [isDisabled, onPress, rootRef]
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
    [onReleased, releasingClassName, rootRef]
  );

  const cancelPendingRelease = React.useCallback(() => {
    releaseRunRef.current += 1;
    contentRef.current?.clearCssEvent?.();
  }, [contentRef]);

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
          propertyName: 'transform',
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
      contentRef,
      cssModule,
      finalizeRelease,
      pressPosition,
      releasingClassName,
      rootElement,
      rootRef,
    ]
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
          propertyName: 'transform',
          tolerance: 1,
        }).then(() => {
          onPressed?.(event);
        });
      } else {
        onPressed?.(event);
      }

      setPressPosition(activeClassName);
    },
    [activeClassName, cancelPendingRelease, contentRef, isDisabled, onPressed]
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

  React.useEffect(() => {
    if (active === false && pressedRef.current === 2) {
      clearPress({ force: true });
    }
  }, [active, clearPress]);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      contentRef.current?.clearCssEvent?.();
    };
  }, [contentRef]);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<RootDomElement>) => {
      onMouseDown?.(event);

      if (isDisabled) return;
      if (event.button !== 0) return;

      activePointerIdRef.current = event.pointerId;
      pointerStartYRef.current = event.clientY;

      if (event.pointerType !== 'mouse' && rootRef.current?.setPointerCapture) {
        try {
          rootRef.current.setPointerCapture(event.pointerId);
        } catch {
          // no-op
        }
      }

      pressIn(event);
    },
    [isDisabled, onMouseDown, pressIn, rootRef]
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
    [clearPress, isDisabled, onMouseUp, pressOut, rootRef, wrapperRef]
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
      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }

      if (active === true && pressedRef.current !== 2) {
        clearPress({ force: true });
        return;
      }

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
    [cssModule, isDisabled, moveEvents, rootElement, rootRef, wrapperRef]
  );

  const handleMouseEnterFallback = React.useCallback(() => {
    if (moveEvents === true || isDisabled === true) return;

    toggleMoveClasses({
      element: rootRef.current,
      root: rootElement,
      cssModule,
      state: 'middle',
    });
  }, [cssModule, isDisabled, moveEvents, rootElement, rootRef]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<RootDomElement>) => {
      if (isDisabled === true) {
        if (href) {
          event.preventDefault();
        }
        return;
      }

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

  return {
    handlers: {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onMouseEnter: handleMouseEnterFallback,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerLeave: handlePointerLeave,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    pressClassName: pressPosition,
  };
}
