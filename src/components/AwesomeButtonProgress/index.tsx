import * as React from 'react';
import {
  beforeFutureCssLayout as frameThrower,
  // @ts-ignore
} from '@rcaferati/wac';
import AwesomeButton, { ButtonType } from '../AwesomeButton';
import { getClassName } from '../../helpers/components';

const ROOTELM = 'aws-btn';
const IS_WINDOW = typeof window !== 'undefined';
const BUTTON_TRANSITION_FALLBACK_MS = 220;
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

type ButtonPressEvent = Parameters<NonNullable<ButtonType['onPress']>>[0];
type ButtonMouseDownEvent = Parameters<
  NonNullable<ButtonType['onMouseDown']>
>[0];
type ButtonPressedEvent = Parameters<NonNullable<ButtonType['onPressed']>>[0];

type EndLoadingFn = (endState?: boolean, errorLabel?: string | null) => void;

type ButtonTypeModified = Omit<ButtonType, 'onPress' | 'active'>;

type ProgressState = {
  loadingEnd: boolean;
  loadingStart: boolean;
  loadingError: boolean;
  errorLabel: string | null;
  pressLockActive: boolean;
  progressActive: boolean;
};

type PendingProgressRun = {
  event: ButtonPressEvent;
  runId: number;
};

type PendingContentTransition = {
  cleanup: () => void;
};

function shouldWaitForContentTransition(event: ButtonPressEvent): boolean {
  return event.type !== 'click';
}

function isTransformTransition(event: Event): boolean {
  const { propertyName } = event as TransitionEvent;
  return propertyName === 'transform' || propertyName === '-webkit-transform';
}

export type ButtonProgressType = {
  onPress?: (event: ButtonPressEvent, next: EndLoadingFn) => void;
  loadingLabel?: string;
  resultLabel?: string;
  releaseDelay?: number;
  showProgressBar?: boolean;
  progressLoadingTime?: number;
};

function useSyncedObjectState<T extends Record<string, any>>(initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  const ref = React.useRef<T>(initial);

  const setSyncValue = React.useCallback((patch: Partial<T>) => {
    setValue((prev) => {
      const next = { ...prev, ...patch };
      ref.current = next;
      return next;
    });
  }, []);

  return { value, setSyncValue, ref };
}

const AwesomeButtonProgress = ({
  onPress = null,
  rootElement = ROOTELM,
  loadingLabel = 'Wait..',
  resultLabel = 'Success!',
  disabled = false,
  cssModule = null,
  children = null,
  size = null,
  type = null,
  releaseDelay = 500,
  showProgressBar = true,
  progressLoadingTime = 6000,
  className = null,
  extra: userExtra = null,
  onMouseDown: userOnMouseDown = null,
  onPressed: userOnPressed = null,
  onReleased: userOnReleased = null,
  style: userStyle = {},
  ...extra
}: ButtonProgressType & ButtonTypeModified) => {
  const root = rootElement || ROOTELM;
  const resolvedProgressLoadingTime = Math.max(
    0,
    Number(progressLoadingTime) || 0
  );

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = React.useRef<HTMLSpanElement | null>(null);
  const isMountedRef = React.useRef(true);
  const runIdRef = React.useRef(0);
  const busyRef = React.useRef(false);
  const disabledRef = React.useRef(disabled);
  const pendingContentTransitionRef =
    React.useRef<PendingContentTransition | null>(null);
  const releasePendingRunRef = React.useRef<number | null>(null);

  disabledRef.current = disabled;

  const {
    value: state,
    setSyncValue: setState,
    ref: stateRef,
  } = useSyncedObjectState<ProgressState>({
    loadingEnd: false,
    loadingStart: false,
    loadingError: false,
    errorLabel: null,
    pressLockActive: false,
    progressActive: false,
  });

  const isDisabledNow = React.useCallback(
    () => disabledRef.current === true,
    []
  );

  const clearTimeoutIfAny = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearContentTransitionWait = React.useCallback(() => {
    const pending = pendingContentTransitionRef.current;
    pendingContentTransitionRef.current = null;
    pending?.cleanup();
  }, []);

  const getContentElement = React.useCallback(() => {
    const wrapperElement = progressRef.current?.parentElement?.parentElement;

    return (
      wrapperElement?.querySelector(
        '[data-aws-btn-role="content"]'
      ) as HTMLElement | null
    );
  }, []);

  const waitForContentTransition = React.useCallback(
    (runId: number, fallbackMs: number) =>
      new Promise<void>((resolve) => {
        const contentElement = getContentElement();

        clearContentTransitionWait();

        if (!contentElement || !IS_WINDOW) {
          resolve();
          return;
        }

        let finished = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
          if (finished) return;

          finished = true;
          contentElement.removeEventListener('transitionend', handleTransitionEnd);

          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          if (pendingContentTransitionRef.current?.cleanup === cleanup) {
            pendingContentTransitionRef.current = null;
          }
        };

        const finalize = () => {
          if (finished) return;

          cleanup();
          resolve();
        };

        function handleTransitionEnd(event: Event) {
          if (event.target !== contentElement) return;
          if (!isTransformTransition(event)) return;

          finalize();
        }

        pendingContentTransitionRef.current = { cleanup };
        contentElement.addEventListener('transitionend', handleTransitionEnd);
        timeoutId = setTimeout(finalize, Math.max(0, fallbackMs));
      }).then(() => {
        if (!isMountedRef.current || runIdRef.current !== runId) return false;
        if (isDisabledNow()) return false;
        return true;
      }),
    [clearContentTransitionWait, getContentElement, isDisabledNow]
  );

  const resetProgressState = React.useCallback(() => {
    if (!isMountedRef.current) return;

    clearTimeoutIfAny();
    clearContentTransitionWait();
    runIdRef.current += 1;
    busyRef.current = false;
    releasePendingRunRef.current = null;
    (progressRef.current as any)?.clearCssEvent?.();

    setState({
      loadingStart: false,
      loadingEnd: false,
      loadingError: false,
      errorLabel: null,
      pressLockActive: false,
      progressActive: false,
    });
  }, [clearContentTransitionWait, clearTimeoutIfAny, setState]);

  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      runIdRef.current += 1; // invalidate pending async chains
      releasePendingRunRef.current = null;
      clearContentTransitionWait();
      clearTimeoutIfAny();
      (progressRef.current as any)?.clearCssEvent?.();
    };
  }, [clearContentTransitionWait, clearTimeoutIfAny]);

  useIsomorphicLayoutEffect(() => {
    if (disabled === true) {
      resetProgressState();
    }
  }, [disabled, resetProgressState]);

  const progressClassName = React.useMemo(() => {
    const { loadingStart, loadingEnd, loadingError, progressActive } = state;
    const parts = [
      `${root}--progress`,
      showProgressBar ? null : `${root}--progress-bar-hidden`,
      progressActive ? `${root}--progress-active` : null,
      loadingStart ? `${root}--start` : null,
      loadingEnd ? `${root}--end` : null,
      loadingError ? `${root}--errored` : null,
      className,
    ];

    return parts.filter(Boolean).join(' ').trim().replace(/\s+/g, ' ');
  }, [className, root, showProgressBar, state]);

  const progressStyle = React.useMemo(
    () =>
      ({
        ...(userStyle as React.CSSProperties),
        ['--loading-transition-speed' as '--loading-transition-speed']:
          `${resolvedProgressLoadingTime}ms`,
        ['--loading-transition-end-speed' as '--loading-transition-end-speed']:
          `${Math.max(1, Math.ceil(resolvedProgressLoadingTime / 20))}ms`,
      }) as React.CSSProperties,
    [resolvedProgressLoadingTime, userStyle]
  );

  const startLoading = React.useCallback(() => {
    frameThrower(4, () => {
      if (!isMountedRef.current) return;
      if (isDisabledNow()) return;
      setState({
        loadingStart: true,
      });
    });
  }, [isDisabledNow, setState]);

  const clearLoading = React.useCallback(
    (callback?: () => void) => {
      if (!isMountedRef.current) return;

      setState({
        loadingStart: false,
        loadingEnd: false,
        pressLockActive: false,
        progressActive: false,
      });

      frameThrower(2, () => {
        if (!isMountedRef.current) return;
        callback?.();
      });
    },
    [setState]
  );

  const scheduleWrapperReset = React.useCallback(
    (runIdAtSchedule: number) => {
      clearTimeoutIfAny();

      timeoutRef.current = setTimeout(() => {
        if (!IS_WINDOW || !isMountedRef.current) return;
        if (runIdRef.current !== runIdAtSchedule) return;

        frameThrower(2, () => {
          if (!isMountedRef.current) return;
          if (runIdRef.current !== runIdAtSchedule) return;
          if (isDisabledNow()) return;

          releasePendingRunRef.current = runIdAtSchedule;

          clearLoading(() => {
            if (!isMountedRef.current) return;
            if (runIdRef.current !== runIdAtSchedule) return;
            if (isDisabledNow()) return;

            setState({
              loadingError: false,
              errorLabel: null,
            });

            if (releasePendingRunRef.current == null) {
              busyRef.current = false;
            }
          });
        });
      }, Math.max(0, Number(releaseDelay) || 0));
    },
    [clearLoading, clearTimeoutIfAny, isDisabledNow, releaseDelay, setState]
  );

  const endLoading = React.useCallback(
    (runId: number, endState = true, errorLabel: string | null = null) => {
      if (!isMountedRef.current) return;
      if (busyRef.current !== true) return;
      if (runIdRef.current !== runId) return;
      if (isDisabledNow()) return;
      if (stateRef.current.loadingEnd === true) return;

      setState({
        loadingEnd: true,
        loadingError: !endState,
        errorLabel,
      });

      void waitForContentTransition(
        runId,
        Math.max(300, Math.ceil(resolvedProgressLoadingTime / 20) + 120)
      ).then((canContinue) => {
        if (!canContinue) return;
        scheduleWrapperReset(runId);
      });
    },
    [
      isDisabledNow,
      resolvedProgressLoadingTime,
      scheduleWrapperReset,
      setState,
      stateRef,
      waitForContentTransition,
    ]
  );

  const handleActivationMouseDown = React.useCallback(
    (event: ButtonMouseDownEvent) => {
      if (
        !isDisabledNow() &&
        busyRef.current !== true &&
        'button' in event &&
        event.button === 0
      ) {
        setState({
          pressLockActive: true,
        });
      }

      userOnMouseDown?.(event);
    },
    [isDisabledNow, setState, userOnMouseDown]
  );

  const handleActivationPressed = React.useCallback(
    (event: ButtonPressedEvent) => {
      if (!isDisabledNow()) {
        setState({
          pressLockActive: true,
        });
      }

      userOnPressed?.(event);
    },
    [isDisabledNow, setState, userOnPressed]
  );

  const runProgress = React.useCallback(
    async ({ event, runId }: PendingProgressRun) => {
      if (!isMountedRef.current || runIdRef.current !== runId) return;
      if (isDisabledNow()) return;

      setState({
        pressLockActive: true,
        progressActive: true,
      });

      startLoading();

      if (shouldWaitForContentTransition(event)) {
        const canContinue = await waitForContentTransition(
          runId,
          BUTTON_TRANSITION_FALLBACK_MS
        );

        if (!canContinue) {
          return;
        }
      }

      try {
        onPress?.(event, (endState = true, errorLabel = null) => {
          endLoading(runId, endState, errorLabel);
        });
      } catch {
        // Sync exception in user handler -> mark as errored and continue lifecycle.
        endLoading(runId, false);
      }
    },
    [
      endLoading,
      isDisabledNow,
      onPress,
      setState,
      startLoading,
      waitForContentTransition,
    ]
  );

  const handleAction = React.useCallback(
    (event: ButtonPressEvent) => {
      // Hard guard against double activation/races before loadingStart flips.
      if (
        isDisabledNow() ||
        busyRef.current === true ||
        stateRef.current.loadingStart === true ||
        stateRef.current.progressActive === true
      ) {
        return;
      }

      busyRef.current = true;
      runIdRef.current += 1;
      const runId = runIdRef.current;
      const run = { event, runId };

      void runProgress(run);
    },
    [isDisabledNow, runProgress, stateRef]
  );

  const handleReleased = React.useCallback(
    (element: HTMLElement) => {
      const releaseRunId = releasePendingRunRef.current;

      if (releaseRunId != null && runIdRef.current === releaseRunId) {
        releasePendingRunRef.current = null;
        busyRef.current = false;
        setState({
          loadingError: false,
          errorLabel: null,
        });
      } else if (
        busyRef.current !== true &&
        stateRef.current.pressLockActive === true &&
        stateRef.current.progressActive !== true
      ) {
        setState({
          pressLockActive: false,
        });
      }

      userOnReleased?.(element);
    },
    [setState, stateRef, userOnReleased]
  );

  const { errorLabel, pressLockActive } = stateRef.current;

  return (
    <AwesomeButton
      {...extra}
      rootElement={root}
      disabled={disabled}
      size={size}
      type={type}
      cssModule={cssModule}
      style={progressStyle}
      active={pressLockActive}
      className={progressClassName}
      onPress={handleAction}
      onMouseDown={handleActivationMouseDown}
      onPressed={handleActivationPressed}
      onReleased={handleReleased}
      extra={
        <>
          <span
            ref={progressRef}
            data-loading={loadingLabel ?? undefined}
            data-status={errorLabel ?? resultLabel ?? undefined}
            className={getClassName(`${root}__progress`, cssModule)}
          />
          {userExtra}
        </>
      }>
      <span>{children}</span>
    </AwesomeButton>
  );
};

export default AwesomeButtonProgress;
