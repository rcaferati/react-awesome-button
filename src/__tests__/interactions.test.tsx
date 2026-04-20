import React from 'react';
import { act } from '@testing-library/react';
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from '../index';

const mockOnceTransitionEnd = jest.fn();
const mockSetCssEndEvent = jest.fn();
const mockBeforeFutureCssLayout = jest.fn();

// Make transition-driven flows deterministic in jsdom/Jest
jest.mock('@rcaferati/wac', () => {
  const actual = jest.requireActual('@rcaferati/wac');
  return {
    ...actual,
    onceTransitionEnd: (...args: unknown[]) => mockOnceTransitionEnd(...args),
    setCssEndEvent: (...args: unknown[]) => mockSetCssEndEvent(...args),
    beforeFutureCssLayout: (...args: unknown[]) =>
      mockBeforeFutureCssLayout(...args),
  };
});

function createDeferredPromise() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

function dispatchPointerEvent(
  element: Element,
  type: 'pointerDown' | 'pointerUp' | 'pointerLeave' | 'pointerCancel',
  init: Record<string, unknown>
) {
  const event = createEvent[type](element, init);

  Object.entries(init).forEach(([key, value]) => {
    Object.defineProperty(event, key, {
      configurable: true,
      value,
    });
  });

  fireEvent(element, event);
}

function dispatchTransitionEnd(
  element: Element,
  propertyName: 'width' | 'flex-basis' = 'width'
) {
  const event = new Event('transitionend', {
    bubbles: true,
  });

  Object.defineProperty(event, 'propertyName', {
    configurable: true,
    value: propertyName,
  });

  fireEvent(element, event);
}

const originalPointerEvent = window.PointerEvent;

function mockAutoWidthScrollMetrics({
  labelWidths,
  contentWidths,
}: {
  labelWidths: Record<string, number>;
  contentWidths: Record<string, number>;
}) {
  const resolveWidth = (
    text: string,
    widths: Record<string, number>
  ): number => {
    if (widths[text] != null) {
      return widths[text];
    }

    const matchedEntry = Object.entries(widths).find(([candidate]) => {
      const normalizedCandidate = candidate.replace(/\s+/g, ' ').trim();
      const compactText = text.replace(/\s+/g, '');
      const compactCandidate = normalizedCandidate.replace(/\s+/g, '');
      return (
        text.includes(normalizedCandidate) ||
        normalizedCandidate.includes(text) ||
        compactText.includes(compactCandidate) ||
        compactCandidate.includes(compactText)
      );
    });

    return matchedEntry?.[1] ?? 0;
  };

  return jest
    .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
    .mockImplementation(function mockScrollWidth(this: HTMLElement) {
      const text = this.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      const role = this.getAttribute('data-aws-btn-role');

      if (role === 'label' || this.classList.contains('aws-btn__label')) {
        return resolveWidth(text, labelWidths);
      }

      if (role === 'content' || this.classList.contains('aws-btn__content')) {
        return resolveWidth(text, contentWidths);
      }

      return 0;
    });
}

function installRafMock() {
  let elapsed = 0;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  const requestAnimationFrameMock = jest.fn((callback: FrameRequestCallback) => {
    return window.setTimeout(() => {
      elapsed += 16;
      callback(elapsed);
    }, 16) as unknown as number;
  });

  const cancelAnimationFrameMock = jest.fn((id: number) => {
    window.clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
  });

  window.requestAnimationFrame =
    requestAnimationFrameMock as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame =
    cancelAnimationFrameMock as typeof window.cancelAnimationFrame;

  return {
    requestAnimationFrameMock,
    cancelAnimationFrameMock,
    restore() {
      window.requestAnimationFrame = originalRequestAnimationFrame;
      window.cancelAnimationFrame = originalCancelAnimationFrame;
    },
  };
}

async function flushAnimationFrame(duration = 16) {
  await act(async () => {
    jest.advanceTimersByTime(duration);
  });
}

describe('v8 interaction smoke tests', () => {
  beforeAll(() => {
    if (typeof window.PointerEvent === 'undefined') {
      Object.defineProperty(window, 'PointerEvent', {
        configurable: true,
        writable: true,
        value: MouseEvent,
      });
    }
  });

  afterAll(() => {
    Object.defineProperty(window, 'PointerEvent', {
      configurable: true,
      writable: true,
      value: originalPointerEvent,
    });
  });

  beforeEach(() => {
    mockOnceTransitionEnd.mockReset().mockResolvedValue(undefined);
    mockSetCssEndEvent.mockReset().mockResolvedValue(undefined);
    mockBeforeFutureCssLayout
      .mockReset()
      .mockImplementation((_frames: number, cb: () => void) => cb());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('AwesomeButton calls onPress on click/release interaction', async () => {
    const onPress = jest.fn();

    render(<AwesomeButton onPress={onPress}>Press me</AwesomeButton>);

    fireEvent.click(screen.getByText('Press me'));

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('AwesomeButton does not call onPress when disabled', async () => {
    const onPress = jest.fn();

    render(
      <AwesomeButton onPress={onPress} disabled>
        Disabled
      </AwesomeButton>
    );

    fireEvent.click(screen.getByText('Disabled'));

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(0);
    });
  });

  it('AwesomeButton renders anchor mode when href is provided', () => {
    render(
      <AwesomeButton
        href="https://github.com/rcaferati"
        containerProps={{ target: '_blank', rel: 'noreferrer noopener' }}>
        Open website
      </AwesomeButton>
    );

    const link = screen.getByText('Open website').closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://github.com/rcaferati');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('AwesomeButton applies and clears controlled active state from props', async () => {
    const { rerender } = render(
      <AwesomeButton active>Controlled</AwesomeButton>
    );

    let root = screen.getByText('Controlled').closest('button');
    expect(root).toBeTruthy();
    expect(root?.className).toContain('aws-btn--active');

    rerender(<AwesomeButton active={false}>Controlled</AwesomeButton>);

    await waitFor(() => {
      root = screen.getByText('Controlled').closest('button');
      expect(root?.className).not.toContain('aws-btn--active');
    });

    rerender(<AwesomeButton active>Controlled</AwesomeButton>);

    await waitFor(() => {
      root = screen.getByText('Controlled').closest('button');
      expect(root?.className).toContain('aws-btn--active');
    });
  });

  it('AwesomeButton routes partial pointer leave releases through the releasing state', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();
    const onPress = jest.fn();

    mockSetCssEndEvent
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(deferredRelease.promise);

    render(
      <AwesomeButton onReleased={onReleased} onPress={onPress}>
        Partial leave
      </AwesomeButton>
    );

    const root = screen.getByText('Partial leave').closest('button');
    expect(root).toBeTruthy();

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });

    expect(root?.className).toContain('aws-btn--active');

    fireEvent.pointerLeave(root!, {
      pointerId: 1,
      pointerType: 'mouse',
    });

    expect(root?.className).toContain('aws-btn--releasing');
    expect(root?.className).not.toContain('aws-btn--active');
    expect(onPress).not.toHaveBeenCalled();
    expect(onReleased).not.toHaveBeenCalled();

    await act(async () => {
      deferredRelease.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(root?.className).not.toContain('aws-btn--releasing');
      expect(root?.className).not.toContain('aws-btn--active');
    });

    expect(onReleased).toHaveBeenCalledTimes(1);
  });

  it('AwesomeButton routes pointer cancel releases through the releasing state', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();
    const onPress = jest.fn();

    mockSetCssEndEvent
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(deferredRelease.promise);

    render(
      <AwesomeButton onReleased={onReleased} onPress={onPress}>
        Partial cancel
      </AwesomeButton>
    );

    const root = screen.getByText('Partial cancel').closest('button');
    expect(root).toBeTruthy();

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 1,
      pointerType: 'touch',
      clientY: 10,
    });

    expect(root?.className).toContain('aws-btn--active');

    fireEvent.pointerCancel(root!, {
      pointerId: 1,
      pointerType: 'touch',
    });

    expect(root?.className).toContain('aws-btn--releasing');
    expect(root?.className).not.toContain('aws-btn--active');
    expect(onPress).not.toHaveBeenCalled();

    await act(async () => {
      deferredRelease.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(root?.className).not.toContain('aws-btn--releasing');
    });

    expect(onReleased).toHaveBeenCalledTimes(1);
  });

  it('AwesomeButton uses the same release path when touch interaction turns into scroll', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();
    const onPress = jest.fn();
    const offsetHeightMock = jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(10);

    mockSetCssEndEvent
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(deferredRelease.promise);

    try {
      render(
        <AwesomeButton onReleased={onReleased} onPress={onPress}>
          Touch scroll
        </AwesomeButton>
      );

      const root = screen.getByText('Touch scroll').closest('button');
      expect(root).toBeTruthy();

      dispatchPointerEvent(root!, 'pointerDown', {
        button: 0,
        pointerId: 1,
        pointerType: 'touch',
        clientY: 10,
      });

      expect(root?.className).toContain('aws-btn--active');

      dispatchPointerEvent(root!, 'pointerUp', {
        pointerId: 1,
        pointerType: 'touch',
        clientY: 30,
      });

      expect(root?.className).toContain('aws-btn--releasing');
      expect(onPress).not.toHaveBeenCalled();

      await act(async () => {
        deferredRelease.resolve();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(root?.className).not.toContain('aws-btn--releasing');
      });

      expect(onReleased).toHaveBeenCalledTimes(1);
    } finally {
      offsetHeightMock.mockRestore();
    }
  });

  it('AwesomeButton keeps normal releases explicit and dispatches once', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();
    const onPress = jest.fn();

    mockSetCssEndEvent
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(deferredRelease.promise);

    render(
      <AwesomeButton onReleased={onReleased} onPress={onPress}>
        Normal release
      </AwesomeButton>
    );

    const root = screen.getByText('Normal release').closest('button');
    expect(root).toBeTruthy();

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });
    fireEvent.pointerUp(root!, {
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(root?.className).toContain('aws-btn--releasing');

    await act(async () => {
      deferredRelease.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(root?.className).not.toContain('aws-btn--releasing');
    });

    expect(onReleased).toHaveBeenCalledTimes(1);
  });

  it('AwesomeButton filters pressed and released timing to transform transitions', async () => {
    render(<AwesomeButton>Transform only</AwesomeButton>);

    const root = screen.getByText('Transform only').closest('button');
    expect(root).toBeTruthy();

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });

    fireEvent.pointerUp(root!, {
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSetCssEndEvent).toHaveBeenCalledTimes(2);
    expect(mockSetCssEndEvent.mock.calls[0]?.[2]).toEqual(
      expect.objectContaining({
        propertyName: 'transform',
        tolerance: 1,
      })
    );
    expect(mockSetCssEndEvent.mock.calls[1]?.[2]).toEqual(
      expect.objectContaining({
        propertyName: 'transform',
        tolerance: 1,
      })
    );
  });

  it('AwesomeButton ignores stale release completion when a new press starts mid-release', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();

    mockSetCssEndEvent
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(deferredRelease.promise)
      .mockResolvedValue(undefined);

    render(<AwesomeButton onReleased={onReleased}>Repress</AwesomeButton>);

    const root = screen.getByText('Repress').closest('button');
    expect(root).toBeTruthy();

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientY: 10,
    });

    fireEvent.pointerLeave(root!, {
      pointerId: 1,
      pointerType: 'mouse',
    });

    expect(root?.className).toContain('aws-btn--releasing');

    fireEvent.pointerDown(root!, {
      button: 0,
      pointerId: 2,
      pointerType: 'mouse',
      clientY: 10,
    });

    expect(root?.className).toContain('aws-btn--active');
    expect(root?.className).not.toContain('aws-btn--releasing');

    await act(async () => {
      deferredRelease.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(root?.className).toContain('aws-btn--active');
    expect(root?.className).not.toContain('aws-btn--releasing');
    expect(onReleased).toHaveBeenCalledTimes(0);
  });

  it('AwesomeButton clears controlled active state through the releasing phase', async () => {
    const deferredRelease = createDeferredPromise();
    const onReleased = jest.fn();

    mockSetCssEndEvent.mockReturnValueOnce(deferredRelease.promise);

    const { rerender } = render(
      <AwesomeButton active onReleased={onReleased}>
        Controlled release
      </AwesomeButton>
    );

    const root = screen.getByText('Controlled release').closest('button');
    expect(root).toBeTruthy();
    expect(root?.className).toContain('aws-btn--active');

    rerender(
      <AwesomeButton active={false} onReleased={onReleased}>
        Controlled release
      </AwesomeButton>
    );

    expect(root?.className).toContain('aws-btn--releasing');
    expect(root?.className).not.toContain('aws-btn--active');

    await act(async () => {
      deferredRelease.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(root?.className).not.toContain('aws-btn--releasing');
      expect(root?.className).not.toContain('aws-btn--active');
    });

    expect(onReleased).toHaveBeenCalledTimes(1);
  });

  it('AwesomeButton preserves custom className when cssModule is provided', () => {
    render(
      <AwesomeButton
        className="custom-class"
        cssModule={{
          'aws-btn': 'mapped-root',
          'aws-btn--auto': 'mapped-auto',
          'aws-btn--primary': 'mapped-primary',
          'aws-btn--visible': 'mapped-visible',
        }}>
        Custom
      </AwesomeButton>
    );

    const root = screen.getByText('Custom').closest('button');
    expect(root).toBeTruthy();
    expect(root?.className).toContain('custom-class');
    expect(root?.className).toContain('mapped-root');
  });

  it('AwesomeButton snaps integer widths for auto-size content and label', () => {
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        'Open Dashboard': 121,
      },
      contentWidths: {
        'Open Dashboard': 153,
      },
    });

    try {
      render(<AwesomeButton size={null}>Open Dashboard</AwesomeButton>);

      const label = screen.getByText('Open Dashboard');
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content).toBeTruthy();
      expect(content?.style.width).toBe('153px');
      expect(content?.style.flexBasis).toBe('153px');
      expect(content?.style.flexGrow).toBe('0');
      expect(content?.style.flexShrink).toBe('0');
      expect(label.style.width).toBe('121px');
      expect(label.style.flexBasis).toBe('121px');
      expect(label.style.flexGrow).toBe('0');
      expect(label.style.flexShrink).toBe('0');
    } finally {
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton updates snapped auto width when content changes', async () => {
    jest.useFakeTimers();
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Go: 20,
        'Open Dashboard': 121,
      },
      contentWidths: {
        Go: 52,
        'Open Dashboard': 153,
      },
    });
    const rafMock = installRafMock();

    try {
      const { rerender } = render(<AwesomeButton size={null}>Go</AwesomeButton>);

      let label = screen.getByText('Go');
      let content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('52px');
      expect(label.style.width).toBe('20px');

      rerender(<AwesomeButton size={null}>Open Dashboard</AwesomeButton>);

      label = screen.getByText('Open Dashboard');
      content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('52px');
      expect(content?.style.flexBasis).toBe('52px');
      expect(label.style.width).toBe('20px');
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalled();

      await flushAnimationFrame();
      await flushAnimationFrame();

      label = screen.getByText('Open Dashboard');
      content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('153px');
      expect(content?.style.flexBasis).toBe('153px');
      expect(content?.style.flexGrow).toBe('0');
      expect(content?.style.flexShrink).toBe('0');
      expect(label.style.width).toBe('121px');
      expect(label.style.flexBasis).toBe('121px');
      expect(label.style.flexGrow).toBe('0');
      expect(label.style.flexShrink).toBe('0');
    } finally {
      rafMock.restore();
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton uses the latest animateSize behavior in ResizeObserver remeasurement callbacks', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const labelWidths = {
      Go: 20,
    };
    const contentWidths = {
      Go: 52,
    };
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths,
      contentWidths,
    });
    const originalResizeObserver = window.ResizeObserver;
    let resizeCallback: ResizeObserverCallback | null = null;

    class ResizeObserverMock {
      observe = jest.fn();
      disconnect = jest.fn();

      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }
    }

    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: ResizeObserverMock,
    });
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: ResizeObserverMock,
    });

    try {
      const { rerender } = render(
        <AwesomeButton size={null} animateSize={false}>
          Go
        </AwesomeButton>
      );

      const label = screen.getByText('Go');
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('52px');

      rerender(
        <AwesomeButton size={null} animateSize>
          Go
        </AwesomeButton>
      );

      labelWidths.Go = 28;
      contentWidths.Go = 60;

      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
      });

      expect(content?.style.width).toBe('52px');

      await flushAnimationFrame();
      expect(content?.style.width).toBe('52px');

      await flushAnimationFrame();
      expect(content?.style.width).toBe('60px');
      expect(label.style.width).toBe('28px');
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, 'ResizeObserver', {
        configurable: true,
        writable: true,
        value: originalResizeObserver,
      });
      Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        writable: true,
        value: originalResizeObserver,
      });
      scrollWidthMock.mockRestore();
      rafMock.restore();
    }
  });

  it('AwesomeButton adds animateSize by default and allows opting out', () => {
    const { rerender } = render(
      <AwesomeButton size="small">Animated</AwesomeButton>
    );

    let root = screen.getByText('Animated').closest('button');
    expect(root?.className).toContain('aws-btn--animate-size');

    rerender(
      <AwesomeButton size="small" animateSize={false}>
        Animated
      </AwesomeButton>
    );

    root = screen.getByText('Animated').closest('button');
    expect(root?.className).not.toContain('aws-btn--animate-size');
  });

  it('AwesomeButton preserves animateSize while fixed sizes change', () => {
    const { rerender } = render(
      <AwesomeButton size="small">Resize me</AwesomeButton>
    );

    let root = screen.getByText('Resize me').closest('button');
    expect(root?.className).toContain('aws-btn--small');
    expect(root?.className).toContain('aws-btn--animate-size');

    rerender(<AwesomeButton size="large">Resize me</AwesomeButton>);

    root = screen.getByText('Resize me').closest('button');
    expect(root?.className).toContain('aws-btn--large');
    expect(root?.className).toContain('aws-btn--animate-size');
  });

  it('AwesomeButton uses Vue-parity slot and label structure', () => {
    const { container, rerender } = render(
      <AwesomeButton
        before={<span aria-hidden="true">←</span>}
        after={<span aria-hidden="true">→</span>}>
        Continue
      </AwesomeButton>
    );

    const content = container.querySelector('.aws-btn__content') as HTMLElement | null;
    expect(content).toBeTruthy();
    expect(content?.querySelector('.aws-btn__slot--before')?.textContent).toContain('←');
    expect(content?.querySelector('.aws-btn__label')?.textContent).toBe('Continue');
    expect(content?.querySelector('.aws-btn__slot--after')?.textContent).toContain('→');

    rerender(<AwesomeButton before={<span aria-hidden="true">★</span>} size={null} />);

    const iconOnlyContent = container.querySelector('.aws-btn__content') as HTMLElement | null;
    expect(iconOnlyContent?.querySelector('.aws-btn__slot--before')?.textContent).toContain('★');
    expect(iconOnlyContent?.querySelector('.aws-btn__label')).toBeNull();
  });

  it('AwesomeButton does not apply snapped widths to fixed-size buttons', () => {
    render(<AwesomeButton size="medium">Medium</AwesomeButton>);

    const label = screen.getByText('Medium');
    const content = label.closest('.aws-btn__content') as HTMLElement | null;

    expect(content).toBeTruthy();
    expect(content?.style.width).toBe('');
    expect(content?.style.flexBasis).toBe('');
    expect(content?.style.flexGrow).toBe('');
    expect(content?.style.flexShrink).toBe('');
    expect(label.style.width).toBe('');
    expect(label.style.flexBasis).toBe('');
    expect(label.style.flexGrow).toBe('');
    expect(label.style.flexShrink).toBe('');
  });

  it('AwesomeButton snaps total auto width cleanly with before/after content', () => {
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Continue: 72,
      },
      contentWidths: {
        '← Continue →': 116,
      },
    });

    try {
      render(
        <AwesomeButton
          size={null}
          before={<span aria-hidden="true">←</span>}
          after={<span aria-hidden="true">→</span>}>
          Continue
        </AwesomeButton>
      );

      const label = screen.getByText('Continue');
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content).toBeTruthy();
      expect(content?.style.width).toBe('116px');
      expect(label.style.width).toBe('72px');
    } finally {
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton does not animate text transition on initial mount', () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();

    try {
      render(<AwesomeButton textTransition>Launch</AwesomeButton>);

      expect(screen.getByText('Launch')).toBeTruthy();
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalledTimes(0);
    } finally {
      rafMock.restore();
    }
  });

  it('AwesomeButton animates string label changes when textTransition is enabled', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    try {
      const { container, rerender } = render(
        <AwesomeButton textTransition>Go</AwesomeButton>
      );

      rerender(<AwesomeButton textTransition>Launch</AwesomeButton>);

      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalledTimes(1);

      await act(async () => {
        jest.advanceTimersByTime(16);
      });

      const label = container.querySelector('.aws-btn__label') as HTMLElement;
      expect(label.textContent).not.toBe('Go');
      expect(label.textContent).not.toBe('Launch');

      await act(async () => {
        jest.advanceTimersByTime(400);
      });

      expect(label.textContent).toBe('Launch');
    } finally {
      randomSpy.mockRestore();
      rafMock.restore();
    }
  });

  it('AwesomeButton ignores unchanged textTransition labels', () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();

    try {
      const { rerender } = render(<AwesomeButton textTransition>Launch</AwesomeButton>);

      rerender(<AwesomeButton textTransition>Launch</AwesomeButton>);

      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalledTimes(0);
    } finally {
      rafMock.restore();
    }
  });

  it('AwesomeButton bypasses textTransition for non-string children', () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();

    try {
      const { rerender } = render(<AwesomeButton textTransition>Launch</AwesomeButton>);

      rerender(
        <AwesomeButton textTransition>
          <span>Done</span>
        </AwesomeButton>
      );

      expect(screen.getByText('Done')).toBeTruthy();
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    } finally {
      rafMock.restore();
    }
  });

  it('AwesomeButton grows auto width before starting textTransition on external rerender', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Go: 20,
        Launch: 62,
      },
      contentWidths: {
        Go: 52,
        Launch: 94,
      },
    });

    try {
      const { container, rerender } = render(
        <AwesomeButton size={null} textTransition>
          Go
        </AwesomeButton>
      );

      const initialLabel = screen.getByText('Go');
      const initialContent = initialLabel.closest('.aws-btn__content') as
        | HTMLElement
        | null;

      expect(initialContent?.style.width).toBe('52px');

      rerender(
        <AwesomeButton size={null} textTransition>
          Launch
        </AwesomeButton>
      );

      const label = container.querySelector('.aws-btn__label') as HTMLElement;
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('52px');
      expect(label.textContent).toBe('Go');

      await flushAnimationFrame();

      expect(content?.style.width).toBe('94px');
      expect(label.textContent).toBe('Go');

      await act(async () => {
        jest.advanceTimersByTime(200);
      });
      await flushAnimationFrame();

      expect(label.textContent).not.toBe('Go');

      await act(async () => {
        jest.advanceTimersByTime(520);
      });
      await flushAnimationFrame();

      expect(label.textContent).toBe('Launch');
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
      rafMock.restore();
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton waits for content width transition before starting grow textTransition', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Open: 38,
        'Open analytics dashboard': 163,
      },
      contentWidths: {
        Open: 70,
        'Open analytics dashboard': 203,
      },
    });

    try {
      const { container, rerender } = render(
        <AwesomeButton size={null} textTransition>
          Open
        </AwesomeButton>
      );

      rerender(
        <AwesomeButton size={null} textTransition>
          Open analytics dashboard
        </AwesomeButton>
      );

      const label = container.querySelector('.aws-btn__label') as HTMLElement;
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      await flushAnimationFrame();

      expect(content?.style.width).toBe('203px');
      expect(label.textContent).toBe('Open');

      await act(async () => {
        dispatchTransitionEnd(label, 'width');
      });

      await flushAnimationFrame();

      expect(label.textContent).toBe('Open');

      await act(async () => {
        dispatchTransitionEnd(content as HTMLElement, 'width');
      });

      await flushAnimationFrame();
      await flushAnimationFrame();

      expect(label.textContent).not.toBe('Open');

      await act(async () => {
        jest.advanceTimersByTime(520);
      });
      await flushAnimationFrame();

      expect(label.textContent).toBe('Open analytics dashboard');
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
      rafMock.restore();
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton measures grow target widths correctly with cssModule-mapped label classes', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Open: 38,
        'Open analytics dashboard': 163,
      },
      contentWidths: {
        Open: 70,
        'Open analytics dashboard': 203,
      },
    });

    const cssModule = {
      'aws-btn': 'root_hash',
      'aws-btn--auto': 'auto_hash',
      'aws-btn--primary': 'primary_hash',
      'aws-btn--visible': 'visible_hash',
      'aws-btn--animate-size': 'animate_hash',
      'aws-btn--auto-size-ready': 'ready_hash',
      'aws-btn__wrapper': 'wrapper_hash',
      'aws-btn__content': 'content_hash',
      'aws-btn__label': 'label_hash',
    };

    try {
      const { container, rerender } = render(
        <AwesomeButton size={null} textTransition cssModule={cssModule}>
          Open
        </AwesomeButton>
      );

      rerender(
        <AwesomeButton size={null} textTransition cssModule={cssModule}>
          Open analytics dashboard
        </AwesomeButton>
      );

      const label = container.querySelector('.label_hash') as HTMLElement;
      const content = container.querySelector('.content_hash') as HTMLElement;

      await flushAnimationFrame();

      expect(content.style.width).toBe('203px');
      expect(label.textContent).toBe('Open');
    } finally {
      randomSpy.mockRestore();
      rafMock.restore();
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton shrinks auto width only after textTransition settles on external rerender', async () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const scrollWidthMock = mockAutoWidthScrollMetrics({
      labelWidths: {
        Go: 20,
        Launch: 62,
      },
      contentWidths: {
        Go: 52,
        Launch: 94,
      },
    });

    try {
      const { container, rerender } = render(
        <AwesomeButton size={null} textTransition>
          Launch
        </AwesomeButton>
      );

      rerender(
        <AwesomeButton size={null} textTransition>
          Go
        </AwesomeButton>
      );

      const label = container.querySelector('.aws-btn__label') as HTMLElement;
      const content = label.closest('.aws-btn__content') as HTMLElement | null;

      expect(content?.style.width).toBe('94px');

      await flushAnimationFrame();

      expect(content?.style.width).toBe('94px');
      expect(label.textContent).not.toBe('Launch');

      await act(async () => {
        jest.advanceTimersByTime(240);
      });

      expect(content?.style.width).toBe('94px');

      await act(async () => {
        jest.advanceTimersByTime(220);
      });
      await flushAnimationFrame();

      expect(label.textContent).toBe('Go');
      expect(content?.style.width).toBe('52px');
      expect(rafMock.requestAnimationFrameMock).toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
      rafMock.restore();
      scrollWidthMock.mockRestore();
    }
  });

  it('AwesomeButton cancels pending text transitions on unmount', () => {
    jest.useFakeTimers();
    const rafMock = installRafMock();

    try {
      const { rerender, unmount } = render(
        <AwesomeButton textTransition>Go</AwesomeButton>
      );

      rerender(<AwesomeButton textTransition>Launch</AwesomeButton>);
      unmount();

      expect(rafMock.cancelAnimationFrameMock).toHaveBeenCalledTimes(1);
    } finally {
      rafMock.restore();
    }
  });

  it('AwesomeButtonProgress runs async success flow and completes', async () => {
    jest.useFakeTimers();

    const onPress = jest.fn((_event, next) => {
      setTimeout(() => next(true), 50);
    });

    render(
      <AwesomeButtonProgress onPress={onPress}>Submit</AwesomeButtonProgress>
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      jest.advanceTimersByTime(60);
    });

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('AwesomeButtonProgress applies default runtime progress loading CSS vars', () => {
    render(
      <AwesomeButtonProgress onPress={(_event, next) => next(true)}>
        Submit
      </AwesomeButtonProgress>
    );

    const root = screen.getByText('Submit').closest('button');
    expect(root).toBeTruthy();
    expect(root?.style.getPropertyValue('--loading-transition-speed')).toBe(
      '6000ms'
    );
    expect(root?.style.getPropertyValue('--loading-transition-end-speed')).toBe(
      '300ms'
    );
  });

  it('AwesomeButtonProgress supports spinner-only mode and custom progress loading times', async () => {
    const onPress = jest.fn((_event, next) => next(true));

    render(
      <AwesomeButtonProgress
        onPress={onPress}
        showProgressBar={false}
        progressLoadingTime={1250}>
        Sync
      </AwesomeButtonProgress>
    );

    const root = screen.getByText('Sync').closest('button');
    expect(root).toBeTruthy();
    expect(root?.className).toContain('aws-btn--progress-bar-hidden');
    expect(root?.style.getPropertyValue('--loading-transition-speed')).toBe(
      '1250ms'
    );
    expect(root?.style.getPropertyValue('--loading-transition-end-speed')).toBe(
      '63ms'
    );

    fireEvent.click(screen.getByText('Sync'));

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('AwesomeButtonProgress runs async error flow and completes', async () => {
    jest.useFakeTimers();

    const onPress = jest.fn((_event, next) => {
      setTimeout(() => next(false, 'Failed'), 50);
    });

    render(
      <AwesomeButtonProgress onPress={onPress}>Publish</AwesomeButtonProgress>
    );

    fireEvent.click(screen.getByText('Publish'));

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      jest.advanceTimersByTime(60);
    });

    await waitFor(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('AwesomeButtonSocial falls back to window.open when sharer is used', async () => {
    const originalOpen = window.open;
    const openSpy = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).open = openSpy;

    try {
      render(
        <AwesomeButtonSocial
          type="linkedin"
          sharer={{
            url: 'https://example.com',
            message: 'Check this out',
          }}>
          Share
        </AwesomeButtonSocial>
      );

      fireEvent.click(screen.getByText('Share'));

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalled();
      });

      const firstCallArgs = openSpy.mock.calls[0] ?? [];
      expect(String(firstCallArgs[0] ?? '')).toContain('linkedin.com');
    } finally {
      window.open = originalOpen;
    }
  });

  it('AwesomeButtonSocial uses custom onPress override instead of sharer logic', async () => {
    const originalOpen = window.open;
    const openSpy = jest.fn();
    const onPress = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).open = openSpy;

    try {
      render(
        <AwesomeButtonSocial
          type="linkedin"
          sharer={{
            url: 'https://example.com',
            message: 'Check this out',
          }}
          onPress={onPress}>
          Share custom
        </AwesomeButtonSocial>
      );

      fireEvent.click(screen.getByText('Share custom'));

      await waitFor(() => {
        expect(onPress).toHaveBeenCalledTimes(1);
      });

      expect(openSpy).not.toHaveBeenCalled();
    } finally {
      window.open = originalOpen;
    }
  });

  it('AwesomeButtonSocial href mode bypasses sharer/window.open', () => {
    const originalOpen = window.open;
    const openSpy = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).open = openSpy;

    try {
      render(
        <AwesomeButtonSocial
          type="github"
          href="https://github.com/rcaferati"
          containerProps={{ target: '_blank', rel: 'noreferrer noopener' }}>
          Open GitHub
        </AwesomeButtonSocial>
      );

      const link = screen.getByText('Open GitHub').closest('a');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('https://github.com/rcaferati');
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noreferrer noopener');

      fireEvent.click(screen.getByText('Open GitHub'));

      expect(openSpy).not.toHaveBeenCalled();
    } finally {
      window.open = originalOpen;
    }
  });
});
