import * as React from 'react';
import {
  AUTO_WIDTH_TRANSITION_FALLBACK_MS,
  DEFAULT_AUTO_WIDTHS,
  TEXT_TRANSITION_DURATION,
  buildTextTransitionFrame,
  captureAutoWidthInlineStyleSnapshot,
  isAutoWidthTransitionEnd,
  readClonedAutoWidths,
  readMeasuredAutoWidths,
  readSnappedWidth,
  restoreAutoWidthInlineStyles,
  restoreAutoWidthTransitionStart,
} from './autoWidthUtils';
import type {
  AutoTextTransitionFlow,
  AutoTextTransitionState,
  AutoWidthValues,
  CssEventClearableElement,
} from './types';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

type UseAutoWidthBehaviorParams = {
  animateSize: boolean;
  children: React.ReactNode;
  hasAfter: boolean;
  hasBefore: boolean;
  hasDefaultContent: boolean;
  isIconOnly: boolean;
  isPlaceholder: boolean;
  shouldSnapAutoWidth: boolean;
  stringChild: string | null;
  textTransition: boolean;
};

type UseAutoWidthBehaviorResult = {
  autoWidthReady: boolean;
  autoWidthTransitioning: boolean;
  contentInlineStyle: React.CSSProperties | undefined;
  contentRef: React.MutableRefObject<CssEventClearableElement | null>;
  labelInlineStyle: React.CSSProperties | undefined;
  labelRef: React.MutableRefObject<HTMLSpanElement | null>;
  renderedLabel: React.ReactNode;
  shouldRenderLabel: boolean;
};

export default function useAutoWidthBehavior({
  animateSize,
  children,
  hasAfter,
  hasBefore,
  hasDefaultContent,
  isIconOnly,
  isPlaceholder,
  shouldSnapAutoWidth,
  stringChild,
  textTransition,
}: UseAutoWidthBehaviorParams): UseAutoWidthBehaviorResult {
  const [autoWidths, setAutoWidthsState] =
    React.useState<AutoWidthValues>(DEFAULT_AUTO_WIDTHS);
  const [autoWidthReady, setAutoWidthReadyState] = React.useState(false);
  const [autoWidthTransitioning, setAutoWidthTransitioningState] =
    React.useState(false);
  const [displayedText, setDisplayedText] = React.useState<string | null>(
    stringChild
  );

  const contentRef = React.useRef<CssEventClearableElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const autoWidthTargetRafRef = React.useRef<number | null>(null);
  const textTransitionRafRef = React.useRef<number | null>(null);
  const textTransitionDelayRafRef = React.useRef<number | null>(null);
  const mountedRef = React.useRef(true);
  const displayedTextRef = React.useRef<string | null>(stringChild);
  const targetTextRef = React.useRef<string | null>(stringChild);
  const autoWidthsRef = React.useRef<AutoWidthValues>(DEFAULT_AUTO_WIDTHS);
  const autoWidthReadyRef = React.useRef(false);
  const autoWidthTransitioningRef = React.useRef(false);
  const deferredAutoWidthMeasureRequestedRef = React.useRef(false);
  const autoWidthTransitionRunIdRef = React.useRef(0);
  const autoWidthTransitionCleanupRef = React.useRef<(() => void) | null>(
    null
  );
  const autoTextTransitionStateRef =
    React.useRef<AutoTextTransitionState | null>(null);
  const autoTextTransitionRunIdRef = React.useRef(0);
  const lastAutoWidthContentSignatureRef = React.useRef<string | null>(null);
  const shouldSuppressAutoWidthMeasureForTextTransitionRef =
    React.useRef<() => boolean>(() => false);
  const measureAutoWidthRef = React.useRef<() => void>(() => {});
  const scheduleAutoWidthMeasureRef = React.useRef<() => void>(() => {});

  const shouldRenderAnimatedText = textTransition === true && stringChild != null;
  const shouldRenderLabel = shouldRenderAnimatedText || hasDefaultContent;

  const autoWidthContentSignature = React.useMemo(() => {
    if (!shouldSnapAutoWidth) {
      return null;
    }

    return [
      `placeholder:${isPlaceholder}`,
      `iconOnly:${isIconOnly}`,
      `before:${hasBefore}`,
      `default:${hasDefaultContent}`,
      `after:${hasAfter}`,
      `text:${stringChild ?? ''}`,
    ].join('||');
  }, [
    hasAfter,
    hasBefore,
    hasDefaultContent,
    isIconOnly,
    isPlaceholder,
    shouldSnapAutoWidth,
    stringChild,
  ]);

  const setAutoWidths = (nextWidths: AutoWidthValues) => {
    autoWidthsRef.current = nextWidths;
    setAutoWidthsState((previous) =>
      previous.content === nextWidths.content &&
      previous.label === nextWidths.label
        ? previous
        : nextWidths
    );
  };

  const setAutoWidthReady = (nextValue: boolean) => {
    autoWidthReadyRef.current = nextValue;
    setAutoWidthReadyState((previous) =>
      previous === nextValue ? previous : nextValue
    );
  };

  const setAutoWidthTransitioning = (nextValue: boolean) => {
    autoWidthTransitioningRef.current = nextValue;
    setAutoWidthTransitioningState((previous) =>
      previous === nextValue ? previous : nextValue
    );
  };

  const clearAutoWidthRaf = () => {
    if (rafRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const clearAutoWidthTargetRaf = () => {
    if (
      autoWidthTargetRafRef.current !== null &&
      typeof window !== 'undefined'
    ) {
      window.cancelAnimationFrame(autoWidthTargetRafRef.current);
      autoWidthTargetRafRef.current = null;
    }
  };

  const clearTextTransitionRaf = () => {
    if (
      textTransitionRafRef.current !== null &&
      typeof window !== 'undefined'
    ) {
      window.cancelAnimationFrame(textTransitionRafRef.current);
      textTransitionRafRef.current = null;
    }
  };

  const clearTextTransitionDelayRaf = () => {
    if (
      textTransitionDelayRafRef.current !== null &&
      typeof window !== 'undefined'
    ) {
      window.cancelAnimationFrame(textTransitionDelayRafRef.current);
      textTransitionDelayRafRef.current = null;
    }
  };

  const clearAutoTextTransitionState = () => {
    autoTextTransitionRunIdRef.current += 1;
    autoTextTransitionStateRef.current = null;
    clearTextTransitionDelayRaf();
  };

  const deferAutoWidthMeasure = () => {
    deferredAutoWidthMeasureRequestedRef.current = true;
  };

  const shouldSuppressAutoWidthMeasureForTextTransition = () =>
    shouldSnapAutoWidth &&
    textTransition === true &&
    (autoTextTransitionStateRef.current != null ||
      textTransitionRafRef.current !== null);

  const updateDisplayedText = (value: string | null) => {
    displayedTextRef.current = value;
    setDisplayedText((previous) => (previous === value ? previous : value));
  };

  const replayDeferredAutoWidthMeasure = () => {
    if (!deferredAutoWidthMeasureRequestedRef.current) {
      return;
    }

    // Wait for React to commit the final label DOM before scheduling the RAF-
    // based remeasurement, otherwise we can read a stale intermediate frame.
    void Promise.resolve().then(() => {
      if (!deferredAutoWidthMeasureRequestedRef.current) {
        return;
      }

      deferredAutoWidthMeasureRequestedRef.current = false;
      scheduleAutoWidthMeasureRef.current();
    });
  };

  const cancelAutoWidthTransition = () => {
    autoWidthTransitionRunIdRef.current += 1;
    clearAutoWidthTargetRaf();

    if (autoWidthTransitionCleanupRef.current) {
      autoWidthTransitionCleanupRef.current();
      autoWidthTransitionCleanupRef.current = null;
    }

    setAutoWidthTransitioning(false);
    deferredAutoWidthMeasureRequestedRef.current = false;
  };

  const resetAutoWidthState = () => {
    cancelAutoWidthTransition();
    setAutoWidthReady(false);
  };

  const getAutoWidthMeasurementLabelText = () => {
    const state = autoTextTransitionStateRef.current;

    if (
      textTransition !== true ||
      !shouldSnapAutoWidth ||
      state?.phase !== 'grow-sizing' ||
      stringChild == null
    ) {
      return null;
    }

    return state.targetText;
  };

  const getMeasuredAutoWidthsForText = (text: string) => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return null;
    }

    return readClonedAutoWidths(contentElement, text);
  };

  const getAutoTextTransitionFlow = (
    targetWidths: AutoWidthValues | null
  ): AutoTextTransitionFlow | null => {
    const currentWidth = autoWidthsRef.current.content;
    const nextWidth = targetWidths?.content;

    if (currentWidth == null || nextWidth == null) {
      return null;
    }

    if (nextWidth > currentWidth) {
      return 'grow-first';
    }

    if (nextWidth < currentWidth) {
      return 'text-first';
    }

    return 'text-only';
  };

  const finishAutoTextChoreography = () => {
    autoTextTransitionStateRef.current = null;
    replayDeferredAutoWidthMeasure();
  };

  const completeGrowTextPhase = (runId: number) => {
    const state = autoTextTransitionStateRef.current;

    if (!state || state.runId !== runId || state.phase !== 'grow-text') {
      return;
    }

    finishAutoTextChoreography();
  };

  const startTextTransitionTo = (
    nextString: string,
    onComplete?: () => void
  ) => {
    const transitionFrame = {
      from: displayedTextRef.current ?? '',
      to: nextString,
      startedAt:
        typeof window.performance?.now === 'function'
          ? window.performance.now()
          : Date.now(),
    };

    targetTextRef.current = nextString;
    clearTextTransitionRaf();

    const tick = (timestamp: number) => {
      const elapsed = Math.max(0, timestamp - transitionFrame.startedAt);
      const progress = Math.min(1, elapsed / TEXT_TRANSITION_DURATION);

      if (progress >= 1) {
        textTransitionRafRef.current = null;
        updateDisplayedText(transitionFrame.to);
        onComplete?.();
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
  };

  const startGrowTextPhase = (runId: number) => {
    const execute = () => {
      const state = autoTextTransitionStateRef.current;

      if (!state || state.runId !== runId || state.phase !== 'grow-sizing') {
        return;
      }

      autoTextTransitionStateRef.current = {
        ...state,
        phase: 'grow-text',
      };

      startTextTransitionTo(state.targetText, () => completeGrowTextPhase(runId));
    };

    if (typeof window === 'undefined') {
      execute();
      return;
    }

    clearTextTransitionDelayRaf();
    textTransitionDelayRafRef.current = window.requestAnimationFrame(() => {
      textTransitionDelayRafRef.current = null;
      execute();
    });
  };

  const completeShrinkTextPhase = (runId: number) => {
    const state = autoTextTransitionStateRef.current;

    if (!state || state.runId !== runId || state.phase !== 'shrink-text') {
      return;
    }

    autoTextTransitionStateRef.current = {
      ...state,
      phase: 'shrink-sizing',
    };

    updateAutoWidths(state.targetWidths);
  };

  const advanceAutoTextChoreographyAfterSizeWrite = () => {
    const state = autoTextTransitionStateRef.current;

    if (state) {
      if (state.phase === 'grow-sizing') {
        startGrowTextPhase(state.runId);
        return;
      }

      if (state.phase === 'shrink-sizing') {
        finishAutoTextChoreography();
        return;
      }

      return;
    }

    replayDeferredAutoWidthMeasure();
  };

  const finalizeAutoWidthTransition = (runId: number) => {
    if (autoWidthTransitionRunIdRef.current !== runId) {
      return;
    }

    if (autoWidthTransitionCleanupRef.current) {
      autoWidthTransitionCleanupRef.current();
      autoWidthTransitionCleanupRef.current = null;
    }

    setAutoWidthTransitioning(false);
    advanceAutoTextChoreographyAfterSizeWrite();
  };

  const startAutoWidthTransition = (nextWidths: AutoWidthValues) => {
    if (
      animateSize !== true ||
      autoWidthReadyRef.current !== true ||
      !shouldSnapAutoWidth ||
      typeof window === 'undefined'
    ) {
      return;
    }

    autoWidthTransitionRunIdRef.current += 1;
    const runId = autoWidthTransitionRunIdRef.current;
    const contentElement = contentRef.current;

    autoWidthTransitionCleanupRef.current?.();
    autoWidthTransitionCleanupRef.current = null;
    clearAutoWidthTargetRaf();
    setAutoWidthTransitioning(true);

    const cleanup = () => {
      contentElement?.removeEventListener('transitionend', handleTransitionEnd);
      clearAutoWidthTargetRaf();
      window.clearTimeout(timeoutId);
      if (autoWidthTransitionCleanupRef.current === cleanup) {
        autoWidthTransitionCleanupRef.current = null;
      }
    };

    const finish = () => {
      cleanup();
      finalizeAutoWidthTransition(runId);
    };

    const handleTransitionEnd = (event: Event) => {
      if (event.target !== contentElement) {
        return;
      }

      if (!isAutoWidthTransitionEnd(event)) {
        return;
      }

      finish();
    };

    const timeoutId = window.setTimeout(
      finish,
      AUTO_WIDTH_TRANSITION_FALLBACK_MS
    );

    contentElement?.addEventListener('transitionend', handleTransitionEnd);
    autoWidthTransitionCleanupRef.current = cleanup;

    autoWidthTargetRafRef.current = window.requestAnimationFrame(() => {
      autoWidthTargetRafRef.current = null;

      if (autoWidthTransitionRunIdRef.current !== runId) {
        return;
      }

      setAutoWidths(nextWidths);
      setAutoWidthReady(nextWidths.content != null);
    });
  };

  function updateAutoWidths(nextWidths: AutoWidthValues) {
    const widthsChanged =
      autoWidthsRef.current.content !== nextWidths.content ||
      autoWidthsRef.current.label !== nextWidths.label;
    const shouldTransition =
      autoWidthReadyRef.current === true &&
      animateSize === true &&
      shouldSnapAutoWidth === true &&
      autoWidthsRef.current.content != null;

    if (!widthsChanged) {
      advanceAutoTextChoreographyAfterSizeWrite();
      return;
    }

    if (shouldTransition) {
      startAutoWidthTransition(nextWidths);
      return;
    }

    setAutoWidths(nextWidths);
    setAutoWidthReady(nextWidths.content != null);
    advanceAutoTextChoreographyAfterSizeWrite();
  }

  function measureAutoWidth() {
    if (!shouldSnapAutoWidth) {
      clearAutoTextTransitionState();
      resetAutoWidthState();

      if (
        autoWidthsRef.current.content !== DEFAULT_AUTO_WIDTHS.content ||
        autoWidthsRef.current.label !== DEFAULT_AUTO_WIDTHS.label
      ) {
        setAutoWidths({
          content: DEFAULT_AUTO_WIDTHS.content,
          label: DEFAULT_AUTO_WIDTHS.label,
        });
      }
      return;
    }

    const contentElement = contentRef.current;
    const labelElement = labelRef.current;

    if (!contentElement) {
      return;
    }

    if (!labelElement) {
      updateAutoWidths({
        content: readSnappedWidth(contentElement),
        label: null,
      });
      return;
    }

    const snapshot = captureAutoWidthInlineStyleSnapshot(
      contentElement,
      labelElement
    );
    const measurementLabelText = getAutoWidthMeasurementLabelText();
    const nextWidths = readMeasuredAutoWidths(
      contentElement,
      labelElement,
      measurementLabelText
    );
    const widthsChanged =
      autoWidthsRef.current.content !== nextWidths.content ||
      autoWidthsRef.current.label !== nextWidths.label;
    const shouldPreserveTransitionStart =
      autoWidthReadyRef.current === true &&
      animateSize === true &&
      shouldSnapAutoWidth === true &&
      widthsChanged &&
      autoWidthsRef.current.content != null;
    const transitionStartWidths: AutoWidthValues = {
      content: autoWidthsRef.current.content,
      label: autoWidthsRef.current.label,
    };

    if (shouldPreserveTransitionStart) {
      restoreAutoWidthTransitionStart(
        contentElement,
        labelElement,
        transitionStartWidths,
        snapshot
      );
    } else {
      restoreAutoWidthInlineStyles(contentElement, labelElement, snapshot);
    }

    updateAutoWidths(nextWidths);
  }

  function scheduleAutoWidthMeasure() {
    if (shouldSuppressAutoWidthMeasureForTextTransitionRef.current()) {
      clearAutoWidthRaf();
      deferAutoWidthMeasure();
      return;
    }

    if (autoWidthTransitioningRef.current) {
      deferAutoWidthMeasure();
      return;
    }

    if (typeof window === 'undefined') {
      measureAutoWidth();
      return;
    }

    clearAutoWidthRaf();
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;

      if (!mountedRef.current) {
        return;
      }

      if (shouldSuppressAutoWidthMeasureForTextTransitionRef.current()) {
        deferAutoWidthMeasure();
        return;
      }

      if (autoWidthTransitioningRef.current) {
        deferAutoWidthMeasure();
        return;
      }

      measureAutoWidthRef.current();
    });
  }

  shouldSuppressAutoWidthMeasureForTextTransitionRef.current =
    shouldSuppressAutoWidthMeasureForTextTransition;
  measureAutoWidthRef.current = measureAutoWidth;
  scheduleAutoWidthMeasureRef.current = scheduleAutoWidthMeasure;

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      clearAutoWidthRaf();
      clearAutoWidthTargetRaf();
      clearTextTransitionRaf();
      clearTextTransitionDelayRaf();
      cancelAutoWidthTransition();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!shouldSnapAutoWidth) {
      lastAutoWidthContentSignatureRef.current = autoWidthContentSignature;
      measureAutoWidth();
      return;
    }

    if (lastAutoWidthContentSignatureRef.current == null) {
      lastAutoWidthContentSignatureRef.current = autoWidthContentSignature;
      measureAutoWidth();
    }
  }, [autoWidthContentSignature, shouldSnapAutoWidth]);

  useIsomorphicLayoutEffect(() => {
    const nextString = stringChild;

    if (textTransition !== true || nextString == null) {
      clearTextTransitionRaf();
      clearAutoTextTransitionState();
      targetTextRef.current = nextString;
      updateDisplayedText(nextString);
      return;
    }

    if (displayedTextRef.current == null) {
      clearAutoTextTransitionState();
      targetTextRef.current = nextString;
      updateDisplayedText(nextString);
      return;
    }

    if (
      targetTextRef.current === nextString &&
      (autoTextTransitionStateRef.current?.targetText === nextString ||
        textTransitionRafRef.current !== null ||
        displayedTextRef.current === nextString)
    ) {
      return;
    }

    if (typeof window === 'undefined') {
      clearAutoTextTransitionState();
      targetTextRef.current = nextString;
      updateDisplayedText(nextString);
      return;
    }

    clearTextTransitionRaf();
    clearAutoTextTransitionState();

    if (shouldSnapAutoWidth) {
      targetTextRef.current = nextString;
      const targetWidths = getMeasuredAutoWidthsForText(nextString);
      const flow = getAutoTextTransitionFlow(targetWidths);

      if (targetWidths == null || flow == null) {
        startTextTransitionTo(nextString, () => scheduleAutoWidthMeasure());
        return;
      }

      if (flow === 'text-only') {
        startTextTransitionTo(nextString);
        return;
      }

      const runId = autoTextTransitionRunIdRef.current + 1;
      autoTextTransitionRunIdRef.current = runId;
      autoTextTransitionStateRef.current = {
        targetText: nextString,
        phase: flow === 'grow-first' ? 'grow-sizing' : 'shrink-text',
        runId,
        targetWidths,
      };

      if (flow === 'grow-first') {
        updateAutoWidths(targetWidths);
        return;
      }

      startTextTransitionTo(nextString, () => completeShrinkTextPhase(runId));
      return;
    }

    autoTextTransitionStateRef.current = null;
    startTextTransitionTo(nextString);
  }, [shouldSnapAutoWidth, stringChild, textTransition]);

  useIsomorphicLayoutEffect(() => {
    if (!shouldSnapAutoWidth) {
      lastAutoWidthContentSignatureRef.current = autoWidthContentSignature;
      return;
    }

    if (autoWidthContentSignature !== lastAutoWidthContentSignatureRef.current) {
      lastAutoWidthContentSignatureRef.current = autoWidthContentSignature;
      scheduleAutoWidthMeasure();
    }
  }, [autoWidthContentSignature, shouldSnapAutoWidth]);

  React.useEffect(() => {
    if (!shouldSnapAutoWidth || typeof ResizeObserver === 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      return;
    }

    resizeObserverRef.current?.disconnect();
    const observer = new ResizeObserver(() => {
      if (shouldSuppressAutoWidthMeasureForTextTransitionRef.current()) {
        deferAutoWidthMeasure();
        return;
      }

      if (autoWidthTransitioningRef.current) {
        deferAutoWidthMeasure();
        return;
      }

      scheduleAutoWidthMeasureRef.current();
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
  }, [shouldSnapAutoWidth]);

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
          scheduleAutoWidthMeasureRef.current();
        }
      })
      .catch(() => {
        // no-op
      });

    return () => {
      cancelled = true;
    };
  }, [shouldSnapAutoWidth]);

  const contentInlineStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!shouldSnapAutoWidth || autoWidths.content == null) {
      return undefined;
    }

    return {
      width: `${autoWidths.content}px`,
      flexBasis: `${autoWidths.content}px`,
      flexGrow: 0,
      flexShrink: 0,
    };
  }, [autoWidths.content, shouldSnapAutoWidth]);

  const labelInlineStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!shouldSnapAutoWidth || autoWidths.label == null) {
      return undefined;
    }

    return {
      width: `${autoWidths.label}px`,
      flexBasis: `${autoWidths.label}px`,
      flexGrow: 0,
      flexShrink: 0,
    };
  }, [autoWidths.label, shouldSnapAutoWidth]);

  const renderedLabel = shouldRenderAnimatedText
    ? displayedText ?? stringChild
    : children;

  return {
    autoWidthReady,
    autoWidthTransitioning,
    contentInlineStyle,
    contentRef,
    labelInlineStyle,
    labelRef,
    renderedLabel,
    shouldRenderLabel,
  };
}
