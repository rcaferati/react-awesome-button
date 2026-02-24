'use strict';

var React = require('react');
var wac = require('@rcaferati/wac');
var jsxRuntime = require('react/jsx-runtime');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

// src/components/AwesomeButton/index.tsx
var POSITION_STATES = ["middle", "left", "right"];
function classToModules(className = [], cssModule) {
  if (!cssModule) {
    return className.join(" ").trim();
  }
  const ClassName = [];
  let i = className.length;
  while (i--) {
    if (cssModule[className[i]]) {
      ClassName.push(cssModule[className[i]]);
    }
  }
  return ClassName.join(" ").trim();
}
function getClassName(className = "", cssModule) {
  if (cssModule) {
    return cssModule[className] || className;
  }
  return className;
}
function toggleMoveClasses({
  element,
  root,
  cssModule = null,
  state = null
}) {
  var _a;
  if (!((_a = element == null ? void 0 : element.classList) == null ? void 0 : _a.remove)) {
    return false;
  }
  if (!state) {
    const states = [
      classToModules([`${root}--${POSITION_STATES[0]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[1]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[2]}`], cssModule)
    ];
    states.forEach((state2) => {
      if (state2) {
        element.classList.remove(state2);
      }
    });
    return false;
  }
  const options = POSITION_STATES.filter((item) => item !== state);
  let i = options.length;
  while (i--) {
    const cls2 = classToModules([`${root}--${options[i]}`], cssModule);
    if (cls2) {
      element.classList.remove(cls2);
    }
  }
  const cls = classToModules([`${root}--${state}`], cssModule);
  if (cls) {
    element.classList.add(cls);
  }
  return true;
}
function createRippleEffect({ event, button, content, className }) {
  const bounds = button.getBoundingClientRect();
  const top = window.pageYOffset || document.documentElement.scrollTop || 0;
  const bubble = document.createElement("span");
  const size = bounds.width < 50 ? bounds.width * 3 : bounds.width * 2;
  let pageX, pageY;
  if (event.nativeEvent instanceof TouchEvent) {
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
  } else {
    pageX = event.pageX;
    pageY = event.pageY;
  }
  bubble.className = className;
  bubble.style.top = `-${size / 2 - (pageY - bounds.top - top)}px`;
  bubble.style.left = `-${size / 2 - (pageX - bounds.left)}px`;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  wac.setCssEndEvent(bubble, "animation").then(() => {
    window.requestAnimationFrame(() => {
      content.removeChild(bubble);
    });
  });
  window.requestAnimationFrame(() => {
    content.appendChild(bubble);
  });
}
var ROOTELM = "aws-btn";
var Anchor = React__namespace.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntime.jsx("a", { ref, ...props }));
Anchor.displayName = "AwesomeButtonAnchor";
var Button = React__namespace.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntime.jsx("button", { ref, ...props }));
Button.displayName = "AwesomeButtonButton";
function isActivationKey(event) {
  return event.key === "Enter" || event.key === " " || event.key === "Spacebar";
}
function getMoveState(clientX, element) {
  const { left } = element.getBoundingClientRect();
  const width = element.offsetWidth;
  if (clientX < left + width * 0.3) return "left";
  if (clientX > left + width * 0.65) return "right";
  return "middle";
}
function isKeyboardClick(event) {
  return event.detail === 0;
}
var AwesomeButton = ({
  active = false,
  after = null,
  before = null,
  between = false,
  children = null,
  className = null,
  containerProps = {},
  cssModule = null,
  disabled = false,
  element = null,
  extra = null,
  href = null,
  moveEvents = true,
  onMouseDown = null,
  onMouseUp = null,
  onPress = null,
  onPressed = null,
  onReleased = null,
  placeholder = true,
  ripple = false,
  rootElement = ROOTELM,
  size = null,
  style = {},
  type = "primary",
  visible = true
}) => {
  const [pressPosition, setPressPosition] = React__namespace.useState(null);
  const rootRef = React__namespace.useRef(null);
  const wrapperRef = React__namespace.useRef(null);
  const contentRef = React__namespace.useRef(null);
  const pressedRef = React__namespace.useRef(0);
  const activePointerIdRef = React__namespace.useRef(null);
  const pointerStartYRef = React__namespace.useRef(null);
  const RenderComponent = element || (href ? Anchor : Button);
  const isDisabled = React__namespace.useMemo(() => {
    if (placeholder === true && !children) {
      return true;
    }
    return disabled;
  }, [placeholder, children, disabled]);
  const isNativeButton = RenderComponent === Button;
  const isAnchorLike = Boolean(href);
  const needsButtonRole = !isNativeButton && !isAnchorLike;
  const interactiveRole = needsButtonRole ? "button" : void 0;
  const rootClassName = React__namespace.useMemo(() => {
    const classList = [
      rootElement,
      ...type ? [`${rootElement}--${type}`] : [],
      ...size ? [`${rootElement}--${size}`] : [],
      ...visible ? [`${rootElement}--visible`] : [],
      ...between ? [`${rootElement}--between`] : [],
      ...placeholder && !children ? [`${rootElement}--placeholder`] : [],
      ...isDisabled ? [`${rootElement}--disabled`] : [],
      ...pressPosition ? [pressPosition] : []
    ];
    if (className) {
      classList.push(...className.trim().split(/\s+/).filter(Boolean));
    }
    if (cssModule && cssModule[rootElement]) {
      return classToModules(classList, cssModule);
    }
    return classList.join(" ").trim().replace(/\s+/g, " ");
  }, [
    rootElement,
    type,
    size,
    visible,
    between,
    placeholder,
    children,
    isDisabled,
    pressPosition,
    className,
    cssModule
  ]);
  const handleAction = React__namespace.useCallback(
    (event) => {
      if (!rootRef.current || isDisabled) return;
      onPress == null ? void 0 : onPress(event);
    },
    [isDisabled, onPress]
  );
  const clearPressCallback = React__namespace.useCallback(() => {
    pressedRef.current = 0;
    if (rootRef.current) {
      onReleased == null ? void 0 : onReleased(rootRef.current);
    }
  }, [onReleased]);
  const clearPress = React__namespace.useCallback(
    ({
      force = false,
      leave = false
    } = {}) => {
      var _a, _b;
      toggleMoveClasses({
        element: rootRef.current,
        root: rootElement,
        cssModule
      });
      if (leave === true && pressedRef.current === 0) {
        return;
      }
      const nextPressPosition = active && !force ? `${rootElement}--active` : null;
      (_b = (_a = contentRef.current) == null ? void 0 : _a.clearCssEvent) == null ? void 0 : _b.call(_a);
      if (nextPressPosition === null && pressPosition === `${rootElement}--active` && contentRef.current) {
        wac.setCssEndEvent(contentRef.current, "transition", {
          tolerance: 1
        }).then(clearPressCallback);
      }
      setPressPosition(nextPressPosition);
    },
    [active, clearPressCallback, cssModule, pressPosition, rootElement]
  );
  React__namespace.useEffect(() => {
    if (active === false && pressedRef.current === 2) {
      clearPress({ force: true });
    }
  }, [active, clearPress]);
  React__namespace.useEffect(() => {
    return () => {
      var _a, _b;
      (_b = (_a = contentRef.current) == null ? void 0 : _a.clearCssEvent) == null ? void 0 : _b.call(_a);
    };
  }, []);
  const dispatchPressEvent = React__namespace.useCallback(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    const eventTrigger = new Event("btn-press");
    wrapperRef.current.dispatchEvent(eventTrigger);
  }, []);
  const createRipple = React__namespace.useCallback(
    (event) => {
      if (!wrapperRef.current || !contentRef.current) return;
      createRippleEffect({
        event,
        button: wrapperRef.current,
        content: contentRef.current,
        className: getClassName(`${rootElement}__bubble`, cssModule)
      });
    },
    [cssModule, rootElement]
  );
  const pressIn = React__namespace.useCallback(
    (event) => {
      if (isDisabled || pressedRef.current === 2) {
        return;
      }
      pressedRef.current = 1;
      if (contentRef.current) {
        wac.setCssEndEvent(contentRef.current, "transition", {
          tolerance: 1
        }).then(() => {
          onPressed == null ? void 0 : onPressed(event);
        });
      } else {
        onPressed == null ? void 0 : onPressed(event);
      }
      setPressPosition(`${rootElement}--active`);
    },
    [isDisabled, onPressed, rootElement]
  );
  const pressOut = React__namespace.useCallback(
    (event, options = {}) => {
      const { allowRipple = false } = options;
      if (isDisabled || pressedRef.current !== 1) {
        return;
      }
      if (allowRipple && ripple) {
        createRipple(event);
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
      ripple
    ]
  );
  const handlePointerDown = React__namespace.useCallback(
    (event) => {
      var _a;
      onMouseDown == null ? void 0 : onMouseDown(event);
      if (isDisabled) return;
      if (event.button !== 0) return;
      activePointerIdRef.current = event.pointerId;
      pointerStartYRef.current = event.clientY;
      if (event.pointerType !== "mouse" && ((_a = rootRef.current) == null ? void 0 : _a.setPointerCapture)) {
        try {
          rootRef.current.setPointerCapture(event.pointerId);
        } catch (e) {
        }
      }
      pressIn(event);
    },
    [isDisabled, onMouseDown, pressIn]
  );
  const handlePointerUp = React__namespace.useCallback(
    (event) => {
      var _a;
      onMouseUp == null ? void 0 : onMouseUp(event);
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) {
        return;
      }
      if (event.pointerType !== "mouse" && ((_a = rootRef.current) == null ? void 0 : _a.releasePointerCapture)) {
        try {
          rootRef.current.releasePointerCapture(event.pointerId);
        } catch (e) {
        }
      }
      if (event.pointerType === "touch" && pointerStartYRef.current !== null && wrapperRef.current) {
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
    [clearPress, isDisabled, onMouseUp, pressOut]
  );
  const handlePointerCancel = React__namespace.useCallback(
    (event) => {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) {
        return;
      }
      activePointerIdRef.current = null;
      pointerStartYRef.current = null;
      clearPress({ force: true });
    },
    [clearPress]
  );
  const handlePointerLeave = React__namespace.useCallback(
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse") {
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
  const handlePointerMove = React__namespace.useCallback(
    (event) => {
      if (moveEvents !== true || isDisabled === true) return;
      if (event.pointerType !== "mouse") return;
      if (!wrapperRef.current) return;
      const state = getMoveState(event.clientX, wrapperRef.current);
      toggleMoveClasses({
        element: rootRef.current,
        root: rootElement,
        cssModule,
        state
      });
    },
    [moveEvents, isDisabled, rootElement, cssModule]
  );
  const handleMouseEnterFallback = React__namespace.useCallback(() => {
    if (moveEvents === true || isDisabled === true) return;
    toggleMoveClasses({
      element: rootRef.current,
      root: rootElement,
      cssModule,
      state: "middle"
    });
  }, [moveEvents, isDisabled, rootElement, cssModule]);
  const handleClick = React__namespace.useCallback(
    (event) => {
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
  const handleKeyDown = React__namespace.useCallback(
    (event) => {
      if (!needsButtonRole || isDisabled) return;
      if (!isActivationKey(event)) return;
      if (event.repeat) return;
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
      }
      pressIn(event);
    },
    [isDisabled, needsButtonRole, pressIn]
  );
  const handleKeyUp = React__namespace.useCallback(
    (event) => {
      if (!needsButtonRole || isDisabled) return;
      if (!isActivationKey(event)) return;
      event.preventDefault();
      pressOut(event, { allowRipple: false });
    },
    [isDisabled, needsButtonRole, pressOut]
  );
  const mergedContainerProps = containerProps != null ? containerProps : {};
  const containerTabIndex = mergedContainerProps.tabIndex;
  const rootExtraProps = {};
  if (href) {
    rootExtraProps.href = href;
  }
  if (isNativeButton) {
    if (mergedContainerProps.type == null) {
      rootExtraProps.type = "button";
    }
    rootExtraProps.disabled = isDisabled;
  }
  const RenderComponentAny = RenderComponent;
  return /* @__PURE__ */ jsxRuntime.jsx(
    RenderComponentAny,
    {
      ...mergedContainerProps,
      ...rootExtraProps,
      style,
      className: rootClassName,
      role: interactiveRole,
      "aria-disabled": isDisabled || void 0,
      tabIndex: needsButtonRole ? isDisabled ? -1 : containerTabIndex != null ? containerTabIndex : 0 : containerTabIndex,
      ref: rootRef,
      onClick: handleClick,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onPointerLeave: handlePointerLeave,
      onPointerMove: handlePointerMove,
      onMouseEnter: handleMouseEnterFallback,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "span",
        {
          ref: wrapperRef,
          className: getClassName(`${rootElement}__wrapper`, cssModule),
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              "span",
              {
                ref: contentRef,
                className: getClassName(`${rootElement}__content`, cssModule),
                children: [
                  before,
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children }),
                  after
                ]
              }
            ),
            extra
          ]
        }
      )
    }
  );
};
var AwesomeButton_default = AwesomeButton;

// src/components/AwesomeButtonSocial/sharer.tsx
var DEFAULT_POPUP_WIDTH = 640;
var DEFAULT_POPUP_HEIGHT = 480;
var MIN_POPUP_WIDTH = 320;
var MIN_POPUP_HEIGHT = 240;
var MIN_COORDINATE = 0;
var TWITTER_POPUP_HEIGHT = 250;
var WIDE_POPUP_WIDTH = 850;
var EMPTY_STRING = "";
var MAILTO_SELF_TARGET = "_self";
var DEFAULT_SHARE_TITLE = "Share";
var MOBILE_USER_AGENT_REGEX = /iPhone|iPad|iPod|Android/i;
var URL_FACEBOOK_SHARER = "https://www.facebook.com/sharer/sharer.php";
var URL_TWITTER_INTENT_TWEET = "https://twitter.com/intent/tweet";
var URL_PINTEREST_CREATE_PIN = "https://pinterest.com/pin/create/button/";
var URL_LINKEDIN_SHARE_OFFSITE = "https://www.linkedin.com/sharing/share-offsite/";
var URL_REDDIT_SUBMIT = "https://www.reddit.com/submit";
var URL_WHATSAPP_SEND = "https://api.whatsapp.com/send";
var URL_MESSENGER_BASE = "https://m.me";
var URL_MAILTO_PROTOCOL = "mailto:";
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function toQuery(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    const stringValue = String(value).trim();
    if (!stringValue) return;
    searchParams.set(key, stringValue);
  });
  return searchParams.toString();
}
function withQuery(baseUrl, params) {
  const query = toQuery(params);
  return query ? `${baseUrl}?${query}` : baseUrl;
}
function toWindowFeatures(params) {
  return Object.entries(params).filter(
    ([, value]) => value != null && String(value).trim() !== EMPTY_STRING
  ).map(([key, value]) => `${key}=${String(value)}`).join(",");
}
function clampNumber(value, fallback = MIN_COORDINATE, options) {
  const safe = Number.isFinite(value) ? value : fallback;
  const min = options == null ? void 0 : options.min;
  const max = options == null ? void 0 : options.max;
  if (typeof min === "number" && safe < min) return min;
  if (typeof max === "number" && safe > max) return max;
  return safe;
}
function normalizePopupDimensions(width, height) {
  return {
    width: clampNumber(width, DEFAULT_POPUP_WIDTH, { min: MIN_POPUP_WIDTH }),
    height: clampNumber(height, DEFAULT_POPUP_HEIGHT, {
      min: MIN_POPUP_HEIGHT
    })
  };
}
function isMobile() {
  var _a;
  if (typeof navigator === "undefined") {
    return false;
  }
  const nav = navigator;
  if (typeof ((_a = nav.userAgentData) == null ? void 0 : _a.mobile) === "boolean") {
    return nav.userAgentData.mobile;
  }
  const userAgent = navigator.userAgent || EMPTY_STRING;
  return MOBILE_USER_AGENT_REGEX.test(userAgent);
}
function centerWindow(width, height) {
  var _a, _b;
  if (typeof window === "undefined") {
    return { top: MIN_COORDINATE, left: MIN_COORDINATE };
  }
  const safeWidth = clampNumber(width, DEFAULT_POPUP_WIDTH, {
    min: MIN_COORDINATE
  });
  const safeHeight = clampNumber(height, DEFAULT_POPUP_HEIGHT, {
    min: MIN_COORDINATE
  });
  const screenLeft = typeof window.screenLeft === "number" ? window.screenLeft : typeof window.screenX === "number" ? window.screenX : MIN_COORDINATE;
  const screenTop = typeof window.screenTop === "number" ? window.screenTop : typeof window.screenY === "number" ? window.screenY : MIN_COORDINATE;
  const viewportWidth = window.innerWidth || (typeof document !== "undefined" ? ((_a = document.documentElement) == null ? void 0 : _a.clientWidth) || MIN_COORDINATE : MIN_COORDINATE);
  const viewportHeight = window.innerHeight || (typeof document !== "undefined" ? ((_b = document.documentElement) == null ? void 0 : _b.clientHeight) || MIN_COORDINATE : MIN_COORDINATE);
  return {
    top: Math.max(
      MIN_COORDINATE,
      Math.round(viewportHeight / 2 - safeHeight / 2 + screenTop)
    ),
    left: Math.max(
      MIN_COORDINATE,
      Math.round(viewportWidth / 2 - safeWidth / 2 + screenLeft)
    )
  };
}
function sanitizePhone(phone) {
  if (!isNonEmptyString(phone)) return void 0;
  const digits = phone.replace(/[^\d]/g, "");
  return digits || void 0;
}
function getShareText(message, title) {
  if (isNonEmptyString(message)) return message.trim();
  if (isNonEmptyString(title)) return title.trim();
  return void 0;
}
function getShareTitle(title, message) {
  if (isNonEmptyString(title)) return title.trim();
  if (isNonEmptyString(message)) return message.trim();
  return void 0;
}
function buildPopupExtra(width, height) {
  const dims = normalizePopupDimensions(width, height);
  const { top, left } = centerWindow(dims.width, dims.height);
  return toWindowFeatures({
    width: dims.width,
    height: dims.height,
    top,
    left,
    resizable: "yes",
    scrollbars: "yes",
    toolbar: "no",
    menubar: "no",
    status: "no",
    noopener: "yes",
    noreferrer: "yes"
  });
}
function withPopup(payload, dims) {
  const normalized = normalizePopupDimensions(dims.width, dims.height);
  return {
    ...payload,
    extra: buildPopupExtra(normalized.width, normalized.height)
  };
}
function normalizeType(type) {
  return String(type || EMPTY_STRING).trim().toLowerCase();
}
function Sharer({
  url,
  message,
  title,
  image,
  user,
  type,
  phone,
  width,
  height
}) {
  const shareUrl = isNonEmptyString(url) ? url.trim() : EMPTY_STRING;
  const shareText = getShareText(message, title);
  const shareTitle = getShareTitle(title, message);
  const shareType = normalizeType(type);
  const dims = normalizePopupDimensions(width, height);
  switch (shareType) {
    case "facebook": {
      if (!shareUrl) return {};
      return withPopup(
        {
          url: withQuery(URL_FACEBOOK_SHARER, {
            u: shareUrl
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        dims
      );
    }
    case "twitter": {
      if (!shareUrl && !shareText) return {};
      return withPopup(
        {
          url: withQuery(URL_TWITTER_INTENT_TWEET, {
            text: shareText,
            url: shareUrl || void 0
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        {
          width: dims.width,
          height: TWITTER_POPUP_HEIGHT
        }
      );
    }
    case "pinterest": {
      if (!shareUrl) return {};
      return withPopup(
        {
          url: withQuery(URL_PINTEREST_CREATE_PIN, {
            url: shareUrl,
            media: isNonEmptyString(image) ? image.trim() : void 0,
            description: shareText
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        dims
      );
    }
    case "linkedin": {
      if (!shareUrl) return {};
      return withPopup(
        {
          url: withQuery(URL_LINKEDIN_SHARE_OFFSITE, {
            url: shareUrl
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        dims
      );
    }
    case "reddit": {
      if (!shareUrl) return {};
      return withPopup(
        {
          url: withQuery(URL_REDDIT_SUBMIT, {
            url: shareUrl,
            title: shareText || shareTitle
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height
        }
      );
    }
    case "whatsapp": {
      const cleanPhone = sanitizePhone(phone);
      const textForWhatsApp = [shareText, shareUrl].filter(Boolean).join(" ").trim() || void 0;
      if (!cleanPhone && !textForWhatsApp) return {};
      return withPopup(
        {
          url: withQuery(URL_WHATSAPP_SEND, {
            phone: cleanPhone,
            text: textForWhatsApp
          }),
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: textForWhatsApp
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height
        }
      );
    }
    case "messenger": {
      if (!isNonEmptyString(user)) return {};
      return withPopup(
        {
          url: `${URL_MESSENGER_BASE}/${encodeURIComponent(user.trim())}`,
          title: shareTitle || DEFAULT_SHARE_TITLE,
          text: shareText
        },
        {
          width: WIDE_POPUP_WIDTH,
          height: dims.height
        }
      );
    }
    case "mail": {
      const subject = shareTitle || shareText || EMPTY_STRING;
      const body = [shareText, shareUrl].filter(Boolean).join("\n\n").trim();
      const query = toQuery({
        subject: subject || void 0,
        body: body || void 0
      });
      return {
        url: `${URL_MAILTO_PROTOCOL}${query ? `?${query}` : EMPTY_STRING}`,
        title: MAILTO_SELF_TARGET,
        text: shareText
      };
    }
    case "instagram": {
      if (!shareUrl) return {};
      return {
        url: shareUrl,
        title: MAILTO_SELF_TARGET,
        text: shareText
      };
    }
    default:
      return {};
  }
}
var DEFAULT_DIMENSIONS = {
  width: 640,
  height: 480
};
var DEFAULT_WINDOW_TITLE = "Share";
var IS_BROWSER = typeof window !== "undefined" && typeof document !== "undefined";
var AwesomeButtonSocial = ({
  onPress = null,
  children = null,
  sharer = {},
  dimensions = DEFAULT_DIMENSIONS,
  type,
  href = null,
  ...extra
}) => {
  const mobileRef = React__namespace.useRef(IS_BROWSER ? isMobile() : false);
  const popupDimensions = React__namespace.useMemo(
    () => {
      var _a, _b;
      return {
        width: (_a = dimensions == null ? void 0 : dimensions.width) != null ? _a : DEFAULT_DIMENSIONS.width,
        height: (_b = dimensions == null ? void 0 : dimensions.height) != null ? _b : DEFAULT_DIMENSIONS.height
      };
    },
    [dimensions]
  );
  const getUrl = React__namespace.useCallback(() => {
    const raw = sharer == null ? void 0 : sharer.url;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }
    if (IS_BROWSER) {
      return window.location.href || null;
    }
    return null;
  }, [sharer == null ? void 0 : sharer.url]);
  const getMessage = React__namespace.useCallback(() => {
    var _a;
    const raw = sharer == null ? void 0 : sharer.message;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }
    if (IS_BROWSER) {
      const titleEl = document.querySelector("title");
      const title = (_a = titleEl == null ? void 0 : titleEl.textContent) == null ? void 0 : _a.trim();
      return title || null;
    }
    return null;
  }, [sharer == null ? void 0 : sharer.message]);
  const getImage = React__namespace.useCallback(() => {
    var _a;
    const raw = sharer == null ? void 0 : sharer.image;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) return trimmed;
    }
    if (IS_BROWSER) {
      const meta = document.querySelector(
        'meta[property="og:image"]'
      );
      const content = (_a = meta == null ? void 0 : meta.getAttribute("content")) == null ? void 0 : _a.trim();
      return content || null;
    }
    return null;
  }, [sharer == null ? void 0 : sharer.image]);
  const buildSharePayload = React__namespace.useCallback(() => {
    var _a, _b;
    const payload = Sharer({
      width: popupDimensions.width,
      height: popupDimensions.height,
      url: getUrl(),
      message: getMessage(),
      image: getImage(),
      type: type != null ? type : "",
      user: (_a = sharer == null ? void 0 : sharer.user) != null ? _a : null,
      phone: (_b = sharer == null ? void 0 : sharer.phone) != null ? _b : null
    });
    if (!(payload == null ? void 0 : payload.url)) {
      return null;
    }
    return payload;
  }, [
    getImage,
    getMessage,
    getUrl,
    popupDimensions.height,
    popupDimensions.width,
    sharer == null ? void 0 : sharer.phone,
    sharer == null ? void 0 : sharer.user,
    type
  ]);
  const openNativeShare = React__namespace.useCallback(
    async (payload) => {
      var _a, _b, _c;
      if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
        return false;
      }
      try {
        await navigator.share({
          url: (_a = payload.url) != null ? _a : void 0,
          text: (_b = payload.text) != null ? _b : void 0,
          title: (_c = payload.title) != null ? _c : void 0
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    []
  );
  const openWindowShare = React__namespace.useCallback((payload) => {
    if (!IS_BROWSER || !payload.url) {
      return;
    }
    const targetOrTitle = payload.title || DEFAULT_WINDOW_TITLE;
    const features = payload.extra || void 0;
    window.open(payload.url, targetOrTitle, features);
  }, []);
  const handlePress = React__namespace.useCallback(
    async (event) => {
      if (onPress) {
        onPress(event);
        return;
      }
      if (href) {
        return;
      }
      const payload = buildSharePayload();
      if (!(payload == null ? void 0 : payload.url)) {
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
  return /* @__PURE__ */ jsxRuntime.jsx(AwesomeButton_default, { type, href, onPress: handlePress, ...extra, children });
};
var AwesomeButtonSocial_default = AwesomeButtonSocial;
var ROOTELM2 = "aws-btn";
var LOADING_ANIMATION_STEPS = 3;
var IS_WINDOW = typeof window !== "undefined";
function useSyncedObjectState(initial) {
  const [value, setValue] = React__namespace.useState(initial);
  const ref = React__namespace.useRef(initial);
  const setSyncValue = React__namespace.useCallback((patch) => {
    setValue((prev) => {
      const next = { ...prev, ...patch };
      ref.current = next;
      return next;
    });
  }, []);
  return { value, setSyncValue, ref };
}
var AwesomeButtonProgress = ({
  onPress = null,
  rootElement = ROOTELM2,
  loadingLabel = "Wait..",
  resultLabel = "Success!",
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
}) => {
  var _a;
  const root = rootElement || ROOTELM2;
  const timeoutRef = React__namespace.useRef(null);
  const contentRef = React__namespace.useRef(null);
  const isMountedRef = React__namespace.useRef(true);
  const runIdRef = React__namespace.useRef(0);
  const busyRef = React__namespace.useRef(false);
  const {
    value: state,
    setSyncValue: setState,
    ref: stateRef
  } = useSyncedObjectState({
    loadingEnd: false,
    loadingStart: false,
    loadingError: false,
    errorLabel: null,
    active: false
  });
  const clearTimeoutIfAny = React__namespace.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  React__namespace.useEffect(() => {
    return () => {
      var _a2, _b;
      isMountedRef.current = false;
      runIdRef.current += 1;
      clearTimeoutIfAny();
      (_b = (_a2 = contentRef.current) == null ? void 0 : _a2.clearCssEvent) == null ? void 0 : _b.call(_a2);
    };
  }, [clearTimeoutIfAny]);
  const progressClassName = React__namespace.useMemo(() => {
    const { loadingStart, loadingEnd, loadingError } = state;
    const parts = [
      `${root}--progress`,
      loadingStart ? `${root}--start` : null,
      loadingEnd ? `${root}--end` : null,
      loadingError ? `${root}--errored` : null,
      className
    ];
    return parts.filter(Boolean).join(" ").trim().replace(/\s+/g, " ");
  }, [state, root, className]);
  const endLoading = React__namespace.useCallback(
    (endState = true, errorLabel2 = null) => {
      if (!isMountedRef.current) return;
      if (busyRef.current !== true) return;
      setState({
        loadingEnd: true,
        loadingError: !endState,
        errorLabel: errorLabel2
      });
    },
    [setState]
  );
  const startLoading = React__namespace.useCallback(() => {
    wac.beforeFutureCssLayout(4, () => {
      if (!isMountedRef.current) return;
      setState({
        loadingStart: true
      });
    });
  }, [setState]);
  const clearLoading = React__namespace.useCallback(
    (callback) => {
      if (!isMountedRef.current) return;
      setState({
        loadingStart: false,
        loadingEnd: false,
        active: false
      });
      wac.beforeFutureCssLayout(2, () => {
        if (!isMountedRef.current) return;
        callback == null ? void 0 : callback();
      });
    },
    [setState]
  );
  const scheduleWrapperReset = React__namespace.useCallback(
    (runIdAtSchedule) => {
      clearTimeoutIfAny();
      timeoutRef.current = setTimeout(() => {
        if (!IS_WINDOW || !isMountedRef.current) return;
        if (runIdRef.current !== runIdAtSchedule) return;
        wac.beforeFutureCssLayout(2, () => {
          if (!isMountedRef.current) return;
          if (runIdRef.current !== runIdAtSchedule) return;
          clearLoading(() => {
            if (!isMountedRef.current) return;
            if (runIdRef.current !== runIdAtSchedule) return;
            setState({
              loadingError: false,
              errorLabel: null
            });
            busyRef.current = false;
          });
        });
      }, Math.max(0, Number(releaseDelay) || 0));
    },
    [clearLoading, clearTimeoutIfAny, releaseDelay, setState]
  );
  const activateProgress = React__namespace.useCallback(() => {
    setState({
      active: true
    });
  }, [setState]);
  const handleActivationMouseDown = React__namespace.useCallback(
    (event) => {
      activateProgress();
      userOnMouseDown == null ? void 0 : userOnMouseDown(event);
    },
    [activateProgress, userOnMouseDown]
  );
  const handleActivationPressed = React__namespace.useCallback(
    (event) => {
      activateProgress();
      userOnPressed == null ? void 0 : userOnPressed(event);
    },
    [activateProgress, userOnPressed]
  );
  const handleAction = React__namespace.useCallback(
    async (event) => {
      var _a2;
      if (busyRef.current === true || stateRef.current.loadingStart === true) {
        return;
      }
      busyRef.current = true;
      runIdRef.current += 1;
      const runId = runIdRef.current;
      startLoading();
      const contentEl = contentRef.current;
      if (!contentEl) {
        try {
          onPress == null ? void 0 : onPress(event, endLoading);
        } catch (e) {
          endLoading(false);
        }
        return;
      }
      try {
        await wac.onceTransitionEnd(contentEl);
        if (!isMountedRef.current || runIdRef.current !== runId) {
          return;
        }
        try {
          onPress == null ? void 0 : onPress(event, endLoading);
        } catch (e) {
          endLoading(false);
        }
        (_a2 = contentEl == null ? void 0 : contentEl.clearCssEvent) == null ? void 0 : _a2.call(contentEl);
        wac.setCssEndEvent(contentEl, "transition", {
          tolerance: LOADING_ANIMATION_STEPS
        }).then(() => {
          if (!isMountedRef.current || runIdRef.current !== runId) return;
          scheduleWrapperReset(runId);
        });
      } catch (e) {
        if (!isMountedRef.current || runIdRef.current !== runId) return;
        endLoading(false);
        scheduleWrapperReset(runId);
      }
    },
    [endLoading, onPress, scheduleWrapperReset, startLoading, stateRef]
  );
  const { active, errorLabel } = stateRef.current;
  return /* @__PURE__ */ jsxRuntime.jsx(
    AwesomeButton_default,
    {
      ...extra,
      rootElement: root,
      disabled,
      size,
      type,
      cssModule,
      active,
      className: progressClassName,
      onPress: handleAction,
      onMouseDown: handleActivationMouseDown,
      onPressed: handleActivationPressed,
      extra: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            ref: contentRef,
            "data-loading": loadingLabel != null ? loadingLabel : void 0,
            "data-status": (_a = errorLabel != null ? errorLabel : resultLabel) != null ? _a : void 0,
            className: getClassName(`${root}__progress`, cssModule)
          }
        ) }),
        userExtra
      ] }),
      children: /* @__PURE__ */ jsxRuntime.jsx("span", { children })
    }
  );
};
var AwesomeButtonProgress_default = AwesomeButtonProgress;

exports.AwesomeButton = AwesomeButton_default;
exports.AwesomeButtonProgress = AwesomeButtonProgress_default;
exports.AwesomeButtonSocial = AwesomeButtonSocial_default;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map