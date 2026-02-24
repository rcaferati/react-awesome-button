import * as React from 'react';
import {
  onceTransitionEnd,
  beforeFutureCssLayout as frameThrower,
  setCssEndEvent,
  // @ts-ignore
} from '@rcaferati/wac';
import AwesomeButton, { ButtonType } from '../AwesomeButton';
import { getClassName } from '../../helpers/components';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 3;
const IS_WINDOW = typeof window !== 'undefined';

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
  active: boolean;
};

export type ButtonProgressType = {
  onPress?: (event: ButtonPressEvent, next: EndLoadingFn) => void;
  loadingLabel?: string;
  resultLabel?: string;
  releaseDelay?: number;
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
  className = null,
  extra: userExtra = null,
  onMouseDown: userOnMouseDown = null,
  onPressed: userOnPressed = null,
  ...extra
}: ButtonProgressType & ButtonTypeModified) => {
  const root = rootElement || ROOTELM;

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = React.useRef<HTMLSpanElement | null>(null);
  const isMountedRef = React.useRef(true);
  const runIdRef = React.useRef(0);
  const busyRef = React.useRef(false);

  const {
    value: state,
    setSyncValue: setState,
    ref: stateRef,
  } = useSyncedObjectState<ProgressState>({
    loadingEnd: false,
    loadingStart: false,
    loadingError: false,
    errorLabel: null,
    active: false,
  });

  const clearTimeoutIfAny = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
      runIdRef.current += 1; // invalidate pending async chains
      clearTimeoutIfAny();
      (contentRef.current as any)?.clearCssEvent?.();
    };
  }, [clearTimeoutIfAny]);

  const progressClassName = React.useMemo(() => {
    const { loadingStart, loadingEnd, loadingError } = state;
    const parts = [
      `${root}--progress`,
      loadingStart ? `${root}--start` : null,
      loadingEnd ? `${root}--end` : null,
      loadingError ? `${root}--errored` : null,
      className,
    ];

    return parts.filter(Boolean).join(' ').trim().replace(/\s+/g, ' ');
  }, [state, root, className]);

  const endLoading = React.useCallback(
    (endState = true, errorLabel: string | null = null) => {
      if (!isMountedRef.current) return;
      if (busyRef.current !== true) return;

      setState({
        loadingEnd: true,
        loadingError: !endState,
        errorLabel,
      });
    },
    [setState]
  );

  const startLoading = React.useCallback(() => {
    frameThrower(4, () => {
      if (!isMountedRef.current) return;
      setState({
        loadingStart: true,
      });
    });
  }, [setState]);

  const clearLoading = React.useCallback(
    (callback?: () => void) => {
      if (!isMountedRef.current) return;

      setState({
        loadingStart: false,
        loadingEnd: false,
        active: false,
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

          clearLoading(() => {
            if (!isMountedRef.current) return;
            if (runIdRef.current !== runIdAtSchedule) return;

            setState({
              loadingError: false,
              errorLabel: null,
            });

            busyRef.current = false;
          });
        });
      }, Math.max(0, Number(releaseDelay) || 0));
    },
    [clearLoading, clearTimeoutIfAny, releaseDelay, setState]
  );

  const activateProgress = React.useCallback(() => {
    // Lock AwesomeButton active state before it performs release logic.
    setState({
      active: true,
    });
  }, [setState]);

  const handleActivationMouseDown = React.useCallback(
    (event: ButtonMouseDownEvent) => {
      activateProgress();
      userOnMouseDown?.(event);
    },
    [activateProgress, userOnMouseDown]
  );

  const handleActivationPressed = React.useCallback(
    (event: ButtonPressedEvent) => {
      // Keyboard activation path fallback (AwesomeButton calls onPressed for keyboard too).
      activateProgress();
      userOnPressed?.(event);
    },
    [activateProgress, userOnPressed]
  );

  const handleAction = React.useCallback(
    async (event: ButtonPressEvent) => {
      // Hard guard against double activation/races before loadingStart flips.
      if (busyRef.current === true || stateRef.current.loadingStart === true) {
        return;
      }

      busyRef.current = true;
      runIdRef.current += 1;
      const runId = runIdRef.current;

      startLoading();

      const contentEl = contentRef.current;
      if (!contentEl) {
        // Failsafe: invoke callback anyway, but don't crash. Leave busy state if never resolved.
        try {
          onPress?.(event, endLoading);
        } catch {
          endLoading(false);
        }
        return;
      }

      try {
        // Wait the press transition in the inner button content before kicking progress flow.
        await onceTransitionEnd(contentEl);

        if (!isMountedRef.current || runIdRef.current !== runId) {
          return;
        }

        try {
          onPress?.(event, endLoading);
        } catch {
          // Sync exception in user handler -> mark as errored and continue lifecycle.
          endLoading(false);
        }

        (contentEl as any)?.clearCssEvent?.();

        setCssEndEvent(contentEl as any, 'transition', {
          tolerance: LOADING_ANIMATION_STEPS,
        }).then(() => {
          if (!isMountedRef.current || runIdRef.current !== runId) return;
          scheduleWrapperReset(runId);
        });
      } catch {
        // Transition promise failed/interrupted: fail safe reset state.
        if (!isMountedRef.current || runIdRef.current !== runId) return;

        endLoading(false);
        scheduleWrapperReset(runId);
      }
    },
    [endLoading, onPress, scheduleWrapperReset, startLoading, stateRef]
  );

  const { active, errorLabel } = stateRef.current;

  return (
    <AwesomeButton
      {...extra}
      rootElement={root}
      disabled={disabled}
      size={size}
      type={type}
      cssModule={cssModule}
      active={active}
      className={progressClassName}
      onPress={handleAction}
      onMouseDown={handleActivationMouseDown}
      onPressed={handleActivationPressed}
      extra={
        <>
          <span>
            <span
              ref={contentRef}
              data-loading={loadingLabel ?? undefined}
              data-status={errorLabel ?? resultLabel ?? undefined}
              className={getClassName(`${root}__progress`, cssModule)}
            />
          </span>
          {userExtra}
        </>
      }>
      <span>{children}</span>
    </AwesomeButton>
  );
};

export default AwesomeButtonProgress;
