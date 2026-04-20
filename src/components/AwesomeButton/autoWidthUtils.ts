import type * as React from 'react';
import type {
  AutoWidthInlineStyleSnapshot,
  AutoWidthValues,
} from './types';

export const DEFAULT_AUTO_WIDTHS = Object.freeze({
  content: null as number | null,
  label: null as number | null,
});

export const INTERNAL_CONTENT_ROLE = 'content';
export const INTERNAL_LABEL_ROLE = 'label';
export const INTERNAL_LABEL_SELECTOR = `[data-aws-btn-role="${INTERNAL_LABEL_ROLE}"]`;
export const AUTO_WIDTH_TRANSITION_FALLBACK_MS = 175;
export const TEXT_TRANSITION_DURATION = 320;
export const TEXT_TRANSITION_SETTLE_START = 0.45;

const UPPERCASE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_POOL = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT_POOL = '0123456789';
const SYMBOL_POOL = '#%&^+=-';

export function extractStringChild(children: React.ReactNode): string | null {
  return typeof children === 'string' ? children : null;
}

export function readSnappedWidth(element: HTMLElement | null): number | null {
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

export function readClonedAutoWidths(
  contentElement: HTMLElement,
  measurementLabelText: string
): AutoWidthValues | null {
  const parentElement = contentElement.parentElement;

  if (!parentElement) {
    return null;
  }

  const clone = contentElement.cloneNode(true) as HTMLElement;
  const cloneLabel = clone.querySelector(INTERNAL_LABEL_SELECTOR) as
    | HTMLElement
    | null;

  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.pointerEvents = 'none';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = 'auto';
  clone.style.flexBasis = 'auto';
  clone.style.flexGrow = '0';
  clone.style.flexShrink = '1';
  clone.style.transition = 'none';

  if (cloneLabel) {
    cloneLabel.textContent = measurementLabelText;
    cloneLabel.style.width = 'auto';
    cloneLabel.style.flexBasis = 'auto';
    cloneLabel.style.flexGrow = '0';
    cloneLabel.style.flexShrink = '1';
    cloneLabel.style.transition = 'none';
  }

  parentElement.appendChild(clone);

  const widths = {
    content: readSnappedWidth(clone),
    label: readSnappedWidth(cloneLabel),
  };

  clone.remove();

  if (widths.content == null && widths.label == null) {
    return null;
  }

  return widths;
}

export function readLiveAutoWidths(
  contentElement: HTMLElement,
  labelElement: HTMLElement
): AutoWidthValues {
  contentElement.style.width = 'auto';
  contentElement.style.flexBasis = 'auto';
  contentElement.style.flexGrow = '0';
  contentElement.style.flexShrink = '1';
  labelElement.style.width = 'auto';
  labelElement.style.flexBasis = 'auto';
  labelElement.style.flexGrow = '0';
  labelElement.style.flexShrink = '1';

  return {
    content: readSnappedWidth(contentElement),
    label: readSnappedWidth(labelElement),
  };
}

export function readMeasuredAutoWidths(
  contentElement: HTMLElement,
  labelElement: HTMLElement,
  measurementLabelText: string | null
): AutoWidthValues {
  return (
    (measurementLabelText != null
      ? readClonedAutoWidths(contentElement, measurementLabelText)
      : null) ?? readLiveAutoWidths(contentElement, labelElement)
  );
}

export function captureAutoWidthInlineStyleSnapshot(
  contentElement: HTMLElement,
  labelElement: HTMLElement
): AutoWidthInlineStyleSnapshot {
  return {
    contentWidth: contentElement.style.width,
    contentFlexBasis: contentElement.style.flexBasis,
    contentFlexGrow: contentElement.style.flexGrow,
    contentFlexShrink: contentElement.style.flexShrink,
    contentTransition: contentElement.style.transition,
    labelWidth: labelElement.style.width,
    labelFlexBasis: labelElement.style.flexBasis,
    labelFlexGrow: labelElement.style.flexGrow,
    labelFlexShrink: labelElement.style.flexShrink,
    labelTransition: labelElement.style.transition,
  };
}

export function restoreAutoWidthInlineStyles(
  contentElement: HTMLElement,
  labelElement: HTMLElement,
  snapshot: AutoWidthInlineStyleSnapshot
) {
  contentElement.style.width = snapshot.contentWidth;
  contentElement.style.flexBasis = snapshot.contentFlexBasis;
  contentElement.style.flexGrow = snapshot.contentFlexGrow;
  contentElement.style.flexShrink = snapshot.contentFlexShrink;
  contentElement.style.transition = snapshot.contentTransition;
  labelElement.style.width = snapshot.labelWidth;
  labelElement.style.flexBasis = snapshot.labelFlexBasis;
  labelElement.style.flexGrow = snapshot.labelFlexGrow;
  labelElement.style.flexShrink = snapshot.labelFlexShrink;
  labelElement.style.transition = snapshot.labelTransition;
}

export function restoreAutoWidthTransitionStart(
  contentElement: HTMLElement,
  labelElement: HTMLElement,
  startWidths: AutoWidthValues,
  snapshot: AutoWidthInlineStyleSnapshot
) {
  contentElement.style.transition = 'none';
  labelElement.style.transition = 'none';
  contentElement.style.width = `${startWidths.content}px`;
  contentElement.style.flexBasis = `${startWidths.content}px`;
  contentElement.style.flexGrow = '0';
  contentElement.style.flexShrink = '0';

  if (startWidths.label != null) {
    labelElement.style.width = `${startWidths.label}px`;
    labelElement.style.flexBasis = `${startWidths.label}px`;
    labelElement.style.flexGrow = '0';
    labelElement.style.flexShrink = '0';
  } else {
    labelElement.style.width = snapshot.labelWidth;
    labelElement.style.flexBasis = snapshot.labelFlexBasis;
    labelElement.style.flexGrow = snapshot.labelFlexGrow;
    labelElement.style.flexShrink = snapshot.labelFlexShrink;
  }

  void contentElement.offsetWidth;
  void labelElement.offsetWidth;

  contentElement.style.transition = snapshot.contentTransition;
  labelElement.style.transition = snapshot.labelTransition;
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

export function buildTextTransitionFrame(
  from: string,
  to: string,
  progress: number
) {
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

export function isAutoWidthTransitionEnd(event: Event) {
  const propertyName = (event as TransitionEvent).propertyName;
  return propertyName === 'width' || propertyName === 'flex-basis';
}
