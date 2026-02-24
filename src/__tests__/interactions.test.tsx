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

    // Flush timer-driven state updates inside act()
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
});
