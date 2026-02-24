type ShareType =
  | 'facebook'
  | 'twitter'
  | 'pinterest'
  | 'linkedin'
  | 'reddit'
  | 'whatsapp'
  | 'messenger'
  | 'mail'
  | 'instagram'
  | string;

type SharePopupDimensions = {
  width: number;
  height: number;
};

type SharerType = {
  url?: string | null;
  message?: string | null;
  title?: string | null;
  image?: string | null;
  user?: string | null;
  type: ShareType;
  phone?: string | null;
  width: number;
  height: number;
};

export type SharePayload = {
  url?: string;
  text?: string;
  title?: string;
  extra?: string;
};

type PopupPosition = {
  top: number;
  left: number;
};

const DEFAULT_POPUP_WIDTH = 640;
const DEFAULT_POPUP_HEIGHT = 480;
const MIN_POPUP_WIDTH = 320;
const MIN_POPUP_HEIGHT = 240;
const MIN_COORDINATE = 0;
const TWITTER_POPUP_HEIGHT = 250;
const WIDE_POPUP_WIDTH = 850;

const EMPTY_STRING = '';
const MAILTO_SELF_TARGET = '_self';
const DEFAULT_SHARE_TITLE = 'Share';

const MOBILE_USER_AGENT_REGEX = /iPhone|iPad|iPod|Android/i;

// URL constants
const URL_FACEBOOK_SHARER = 'https://www.facebook.com/sharer/sharer.php';
const URL_TWITTER_INTENT_TWEET = 'https://twitter.com/intent/tweet';
const URL_PINTEREST_CREATE_PIN = 'https://pinterest.com/pin/create/button/';
const URL_LINKEDIN_SHARE_OFFSITE =
  'https://www.linkedin.com/sharing/share-offsite/';
const URL_REDDIT_SUBMIT = 'https://www.reddit.com/submit';
const URL_WHATSAPP_SEND = 'https://api.whatsapp.com/send';
const URL_MESSENGER_BASE = 'https://m.me';
const URL_MAILTO_PROTOCOL = 'mailto:';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function toQuery(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    const stringValue = String(value).trim();
    if (!stringValue) return;
    searchParams.set(key, stringValue);
  });

  return searchParams.toString();
}

function withQuery(
  baseUrl: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const query = toQuery(params);
  return query ? `${baseUrl}?${query}` : baseUrl;
}

function toWindowFeatures(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  return Object.entries(params)
    .filter(
      ([, value]) => value != null && String(value).trim() !== EMPTY_STRING
    )
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(',');
}

function clampNumber(
  value: number,
  fallback = MIN_COORDINATE,
  options?: { min?: number; max?: number }
): number {
  const safe = Number.isFinite(value) ? value : fallback;
  const min = options?.min;
  const max = options?.max;

  if (typeof min === 'number' && safe < min) return min;
  if (typeof max === 'number' && safe > max) return max;
  return safe;
}

function normalizePopupDimensions(
  width: number,
  height: number
): SharePopupDimensions {
  return {
    width: clampNumber(width, DEFAULT_POPUP_WIDTH, { min: MIN_POPUP_WIDTH }),
    height: clampNumber(height, DEFAULT_POPUP_HEIGHT, {
      min: MIN_POPUP_HEIGHT,
    }),
  };
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const nav = navigator as Navigator & {
    userAgentData?: { mobile?: boolean };
  };

  if (typeof nav.userAgentData?.mobile === 'boolean') {
    return nav.userAgentData.mobile;
  }

  const userAgent = navigator.userAgent || EMPTY_STRING;
  return MOBILE_USER_AGENT_REGEX.test(userAgent);
}

function centerWindow(width: number, height: number): PopupPosition {
  if (typeof window === 'undefined') {
    return { top: MIN_COORDINATE, left: MIN_COORDINATE };
  }

  const safeWidth = clampNumber(width, DEFAULT_POPUP_WIDTH, {
    min: MIN_COORDINATE,
  });
  const safeHeight = clampNumber(height, DEFAULT_POPUP_HEIGHT, {
    min: MIN_COORDINATE,
  });

  const screenLeft =
    typeof window.screenLeft === 'number'
      ? window.screenLeft
      : typeof window.screenX === 'number'
      ? window.screenX
      : MIN_COORDINATE;

  const screenTop =
    typeof window.screenTop === 'number'
      ? window.screenTop
      : typeof window.screenY === 'number'
      ? window.screenY
      : MIN_COORDINATE;

  const viewportWidth =
    window.innerWidth ||
    (typeof document !== 'undefined'
      ? document.documentElement?.clientWidth || MIN_COORDINATE
      : MIN_COORDINATE);

  const viewportHeight =
    window.innerHeight ||
    (typeof document !== 'undefined'
      ? document.documentElement?.clientHeight || MIN_COORDINATE
      : MIN_COORDINATE);

  return {
    top: Math.max(
      MIN_COORDINATE,
      Math.round(viewportHeight / 2 - safeHeight / 2 + screenTop)
    ),
    left: Math.max(
      MIN_COORDINATE,
      Math.round(viewportWidth / 2 - safeWidth / 2 + screenLeft)
    ),
  };
}

function sanitizePhone(phone?: string | null): string | undefined {
  if (!isNonEmptyString(phone)) return undefined;
  const digits = phone.replace(/[^\d]/g, '');
  return digits || undefined;
}

function getShareText(
  message?: string | null,
  title?: string | null
): string | undefined {
  if (isNonEmptyString(message)) return message.trim();
  if (isNonEmptyString(title)) return title.trim();
  return undefined;
}

function getShareTitle(
  title?: string | null,
  message?: string | null
): string | undefined {
  if (isNonEmptyString(title)) return title.trim();
  if (isNonEmptyString(message)) return message.trim();
  return undefined;
}

function buildPopupExtra(width: number, height: number): string {
  const dims = normalizePopupDimensions(width, height);
  const { top, left } = centerWindow(dims.width, dims.height);

  return toWindowFeatures({
    width: dims.width,
    height: dims.height,
    top,
    left,
    resizable: 'yes',
    scrollbars: 'yes',
    toolbar: 'no',
    menubar: 'no',
    status: 'no',
    noopener: 'yes',
    noreferrer: 'yes',
  });
}

function withPopup(
  payload: Omit<SharePayload, 'extra'>,
  dims: SharePopupDimensions
): SharePayload {
  const normalized = normalizePopupDimensions(dims.width, dims.height);
  return {
    ...payload,
    extra: buildPopupExtra(normalized.width, normalized.height),
  };
}

function normalizeType(type: ShareType): string {
  return String(type || EMPTY_STRING)
    .trim()
    .toLowerCase();
}

export default function Sharer({
  url,
  message,
  title,
  image,
  user,
  type,
  phone,
  width,
  height,
}: SharerType): SharePayload {
  const shareUrl = isNonEmptyString(url) ? url.trim() : EMPTY_STRING;
  const shareText = getShareText(message, title);
  const shareTitle = getShareTitle(title, message);
  const shareType = normalizeType(type);

  const dims: SharePopupDimensions = normalizePopupDimensions(width, height);

  switch (shareType) {
    case 'facebook': {
      if (!shareUrl) return {};

      return withPopup(
        {
          url: withQuery(URL_FACEBOOK_SHARER, {
            u: shareUrl,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        dims
      );
    }

    case 'twitter': {
      if (!shareUrl && !shareText) return {};

      return withPopup(
        {
          url: withQuery(URL_TWITTER_INTENT_TWEET, {
            text: shareText,
            url: shareUrl || undefined,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        {
          width: dims.width,
          height: TWITTER_POPUP_HEIGHT,
        }
      );
    }

    case 'pinterest': {
      if (!shareUrl) return {};

      return withPopup(
        {
          url: withQuery(URL_PINTEREST_CREATE_PIN, {
            url: shareUrl,
            media: isNonEmptyString(image) ? image.trim() : undefined,
            description: shareText,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        dims
      );
    }

    case 'linkedin': {
      if (!shareUrl) return {};

      return withPopup(
        {
          url: withQuery(URL_LINKEDIN_SHARE_OFFSITE, {
            url: shareUrl,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        dims
      );
    }

    case 'reddit': {
      if (!shareUrl) return {};

      return withPopup(
        {
          url: withQuery(URL_REDDIT_SUBMIT, {
            url: shareUrl,
            title: shareText || shareTitle,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height,
        }
      );
    }

    case 'whatsapp': {
      const cleanPhone = sanitizePhone(phone);
      const textForWhatsApp =
        [shareText, shareUrl].filter(Boolean).join(' ').trim() || undefined;

      if (!cleanPhone && !textForWhatsApp) return {};

      return withPopup(
        {
          url: withQuery(URL_WHATSAPP_SEND, {
            phone: cleanPhone,
            text: textForWhatsApp,
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: textForWhatsApp,
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height,
        }
      );
    }

    case 'messenger': {
      if (!isNonEmptyString(user)) return {};

      return withPopup(
        {
          url: `${URL_MESSENGER_BASE}/${encodeURIComponent(user.trim())}`,
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText,
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height,
        }
      );
    }

    case 'mail': {
      const subject = shareTitle || shareText || EMPTY_STRING;
      const body = [shareText, shareUrl].filter(Boolean).join('\n\n').trim();

      const query = toQuery({
        subject: subject || undefined,
        body: body || undefined,
      });

      return {
        url: `${URL_MAILTO_PROTOCOL}${query ? `?${query}` : EMPTY_STRING}`,
        title: MAILTO_SELF_TARGET,
        text: shareText,
      };
    }

    case 'instagram': {
      if (!shareUrl) return {};

      return {
        url: shareUrl,
        title: MAILTO_SELF_TARGET,
        text: shareText,
      };
    }

    default:
      return {};
  }
}
