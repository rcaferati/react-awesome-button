import React from 'react';
import { act } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from '../index';

// Make transition-driven flows deterministic in jsdom/Jest
jest.mock('@rcaferati/wac', () => {
  const actual = jest.requireActual('@rcaferati/wac');
  return {
    ...actual,
    onceTransitionEnd: () => Promise.resolve(),
    setCssEndEvent: () => Promise.resolve(),
    beforeFutureCssLayout: (_frames: number, cb: () => void) => cb(),
  };
});

describe('v8 interaction smoke tests', () => {
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
      <AwesomeButton href="https://example.com">Open website</AwesomeButton>
    );

    const link = screen.getByText('Open website').closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://example.com');
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
          href="https://github.com/rcaferati/react-awesome-button">
          Open GitHub
        </AwesomeButtonSocial>
      );

      const link = screen.getByText('Open GitHub').closest('a');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe(
        'https://github.com/rcaferati/react-awesome-button'
      );

      fireEvent.click(screen.getByText('Open GitHub'));

      expect(openSpy).not.toHaveBeenCalled();
    } finally {
      window.open = originalOpen;
    }
  });
});
