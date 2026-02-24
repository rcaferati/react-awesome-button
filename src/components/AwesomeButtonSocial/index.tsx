import * as React from 'react';
import AwesomeButton, { ButtonType } from '../AwesomeButton/index';
import Sharer, { isMobile } from './sharer';
import type { SharePayload } from './sharer';

export type SharerType = {
  image?: string;
  message?: string;
  phone?: string;
  url?: string;
  user?: string;
};

export type DimensionsType = {
  width: number;
  height: number;
};

export type SocialButtonType = {
  sharer?: SharerType;
  dimensions?: DimensionsType;
};

export type AwesomeButtonSocialProps = SocialButtonType & ButtonType;

const DEFAULT_DIMENSIONS: DimensionsType = {
  width: 640,
  height: 480,
};

const DEFAULT_WINDOW_TITLE = 'Share';

const IS_BROWSER =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const AwesomeButtonSocial = ({
  onPress = null,
  children = null,
  sharer = {},
  dimensions = DEFAULT_DIMENSIONS,
  type,
  href = null,
  ...extra
}: AwesomeButtonSocialProps) => {
  // Evaluate once per mounted instance (sufficient for UA-based behavior)
  const mobileRef = React.useRef<boolean>(IS_BROWSER ? isMobile() : false);

  const popupDimensions = React.useMemo<DimensionsType>(
    () => ({
      width: dimensions?.width ?? DEFAULT_DIMENSIONS.width,
      height: dimensions?.height ?? DEFAULT_DIMENSIONS.height,
    }),
    [dimensions]
  );

  const getUrl = React.useCallback((): string | null => {
    const raw = sharer?.url;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }

    if (IS_BROWSER) {
      return window.location.href || null;
    }

    return null;
  }, [sharer?.url]);

  const getMessage = React.useCallback((): string | null => {
    const raw = sharer?.message;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }

    if (IS_BROWSER) {
      const titleEl = document.querySelector('title');
      const title = titleEl?.textContent?.trim();
      return title || null;
    }

    return null;
  }, [sharer?.message]);

  const getImage = React.useCallback((): string | null => {
    const raw = sharer?.image;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }

    if (IS_BROWSER) {
      const meta = document.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement | null;
      const content = meta?.getAttribute('content')?.trim();
      return content || null;
    }

    return null;
  }, [sharer?.image]);

  const buildSharePayload = React.useCallback((): SharePayload | null => {
    const payload = Sharer({
      width: popupDimensions.width,
      height: popupDimensions.height,
      url: getUrl(),
      message: getMessage(),
      image: getImage(),
      type: type ?? '',
      user: sharer?.user ?? null,
      phone: sharer?.phone ?? null,
    });

    if (!payload?.url) {
      return null;
    }

    return payload;
  }, [
    getImage,
    getMessage,
    getUrl,
    popupDimensions.height,
    popupDimensions.width,
    sharer?.phone,
    sharer?.user,
    type,
  ]);

  const openNativeShare = React.useCallback(
    async (payload: SharePayload): Promise<boolean> => {
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.share !== 'function'
      ) {
        return false;
      }

      try {
        await navigator.share({
          url: payload.url ?? undefined,
          text: payload.text ?? undefined,
          title: payload.title ?? undefined,
        });
        return true;
      } catch {
        // User cancellation / unsupported data / platform error -> fallback
        return false;
      }
    },
    []
  );

  const openWindowShare = React.useCallback((payload: SharePayload): void => {
    if (!IS_BROWSER || !payload.url) {
      return;
    }

    const targetOrTitle = payload.title || DEFAULT_WINDOW_TITLE;
    const features = payload.extra || undefined;

    window.open(payload.url, targetOrTitle, features);
  }, []);

  const handlePress = React.useCallback(
    async (event: Parameters<NonNullable<ButtonType['onPress']>>[0]) => {
      // Consumer override keeps full control
      if (onPress) {
        onPress(event);
        return;
      }

      // Let native anchor navigation handle href mode
      if (href) {
        return;
      }

      const payload = buildSharePayload();
      if (!payload?.url) {
        return;
      }

      if (IS_BROWSER && mobileRef.current) {
        const shared = await openNativeShare(payload);
        if (shared) {
          return;
        }
      }

      openWindowShare(payload);
    },
    [buildSharePayload, href, onPress, openNativeShare, openWindowShare]
  );

  return (
    <AwesomeButton type={type} href={href} onPress={handlePress} {...extra}>
      {children}
    </AwesomeButton>
  );
};

export default AwesomeButtonSocial;
