import * as React from 'react';
import { getClassName } from '../../helpers/components';
import {
  INTERNAL_CONTENT_ROLE,
  INTERNAL_LABEL_ROLE,
  extractStringChild,
} from './autoWidthUtils';
import type {
  ButtonType,
  CssModuleMap,
  ForwardableElementComponent,
  RootDomElement,
} from './types';
import useAutoWidthBehavior from './useAutoWidthBehavior';
import usePressLifecycle from './usePressLifecycle';

const ROOTELM = 'aws-btn';

const Anchor = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a ref={ref} {...props} />);
Anchor.displayName = 'AwesomeButtonAnchor';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => <button ref={ref} {...props} />);
Button.displayName = 'AwesomeButtonButton';

function getMappedClassName(
  classNames: string[],
  cssModule: CssModuleMap | null
) {
  return classNames
    .map((className) => getClassName(className, cssModule))
    .join(' ')
    .trim();
}

export type { ButtonType } from './types';

const AwesomeButton = ({
  active = false,
  after = null,
  animateSize = true,
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
  textTransition = false,
  type = 'primary',
  visible = true,
}: ButtonType) => {
  const stringChild = React.useMemo(() => extractStringChild(children), [children]);
  const hasBefore = before != null;
  const hasAfter = after != null;
  const hasDefaultContent = children != null && children !== false;

  const rootRef = React.useRef<RootDomElement | null>(null);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);

  const RenderComponent = (element || (href ? Anchor : Button)) as
    | ForwardableElementComponent
    | typeof Anchor
    | typeof Button;
  const isPlaceholder = placeholder === true && !children;
  const isDisabled = isPlaceholder || disabled;
  const isAutoSize = size == null;
  const shouldSnapAutoWidth = isAutoSize && !isPlaceholder;
  const sizeModeClass = isAutoSize
    ? `${rootElement}--auto`
    : `${rootElement}--fixed`;
  const isNativeButton = RenderComponent === Button;
  const isAnchorLike = Boolean(href);
  const needsButtonRole = !isNativeButton && !isAnchorLike;
  const interactiveRole = needsButtonRole ? 'button' : undefined;
  const isIconOnly = !hasDefaultContent && (hasBefore || hasAfter);

  const {
    autoWidthReady,
    autoWidthTransitioning,
    contentInlineStyle,
    contentRef,
    labelInlineStyle,
    labelRef,
    renderedLabel,
    shouldRenderLabel,
  } = useAutoWidthBehavior({
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
  });

  const { handlers, pressClassName } = usePressLifecycle({
    active,
    contentRef,
    cssModule,
    href,
    isDisabled,
    moveEvents,
    needsButtonRole,
    onMouseDown,
    onMouseUp,
    onPress,
    onPressed,
    onReleased,
    ripple,
    rootElement,
    rootRef,
    wrapperRef,
  });

  const rootClassName = React.useMemo(() => {
    const classList: string[] = [
      rootElement,
      sizeModeClass,
      ...(type ? [`${rootElement}--${type}`] : []),
      ...(size ? [`${rootElement}--${size}`] : []),
      ...(visible ? [`${rootElement}--visible`] : []),
      ...(animateSize ? [`${rootElement}--animate-size`] : []),
      ...(animateSize && shouldSnapAutoWidth && autoWidthReady
        ? [`${rootElement}--auto-size-ready`]
        : []),
      ...(autoWidthTransitioning
        ? [`${rootElement}--auto-size-transitioning`]
        : []),
      ...(between ? [`${rootElement}--between`] : []),
      ...(isPlaceholder ? [`${rootElement}--placeholder`] : []),
      ...(isDisabled ? [`${rootElement}--disabled`] : []),
      ...(isIconOnly ? [`${rootElement}--icon`] : []),
      ...(pressClassName ? [pressClassName] : []),
    ];

    if (className) {
      classList.push(...className.trim().split(/\s+/).filter(Boolean));
    }

    if (cssModule && cssModule[rootElement]) {
      return classList
        .map((item) => cssModule[item] || item)
        .join(' ')
        .trim()
        .replace(/\s+/g, ' ');
    }

    return classList.join(' ').trim().replace(/\s+/g, ' ');
  }, [
    animateSize,
    autoWidthReady,
    autoWidthTransitioning,
    between,
    className,
    cssModule,
    isDisabled,
    isIconOnly,
    isPlaceholder,
    pressClassName,
    rootElement,
    shouldSnapAutoWidth,
    size,
    sizeModeClass,
    type,
    visible,
  ]);

  const mergedContainerProps = containerProps ?? {};
  const containerTabIndex = (mergedContainerProps as { tabIndex?: number })
    .tabIndex;

  const rootExtraProps: Record<string, unknown> = {};
  if (href) {
    rootExtraProps.href = href;
  }
  if (isNativeButton) {
    if ((mergedContainerProps as { type?: string }).type == null) {
      rootExtraProps.type = 'button';
    }
    rootExtraProps.disabled = isDisabled;
  }

  const RenderComponentAny = RenderComponent as any;

  return (
    <RenderComponentAny
      {...(mergedContainerProps as object)}
      {...rootExtraProps}
      style={style}
      className={rootClassName}
      role={interactiveRole}
      aria-disabled={isDisabled || undefined}
      tabIndex={
        needsButtonRole
          ? isDisabled
            ? -1
            : (containerTabIndex ?? 0)
          : containerTabIndex
      }
      ref={rootRef}
      onClick={handlers.onClick}
      onPointerDown={handlers.onPointerDown}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onPointerLeave={handlers.onPointerLeave}
      onPointerMove={handlers.onPointerMove}
      onMouseEnter={handlers.onMouseEnter}
      onKeyDown={handlers.onKeyDown}
      onKeyUp={handlers.onKeyUp}>
      <span
        ref={wrapperRef}
        className={getClassName(`${rootElement}__wrapper`, cssModule)}>
        <span
          ref={contentRef}
          data-aws-btn-role={INTERNAL_CONTENT_ROLE}
          style={contentInlineStyle}
          className={getClassName(`${rootElement}__content`, cssModule)}>
          {hasBefore ? (
            <span
              className={getMappedClassName(
                [`${rootElement}__slot`, `${rootElement}__slot--before`],
                cssModule
              )}>
              {before}
            </span>
          ) : null}
          {shouldRenderLabel ? (
            <span
              ref={labelRef}
              data-aws-btn-role={INTERNAL_LABEL_ROLE}
              style={labelInlineStyle}
              className={getClassName(`${rootElement}__label`, cssModule)}>
              {renderedLabel}
            </span>
          ) : null}
          {hasAfter ? (
            <span
              className={getMappedClassName(
                [`${rootElement}__slot`, `${rootElement}__slot--after`],
                cssModule
              )}>
              {after}
            </span>
          ) : null}
        </span>
        {extra != null ? (
          <span className={getClassName(`${rootElement}__extra`, cssModule)}>
            {extra}
          </span>
        ) : null}
      </span>
    </RenderComponentAny>
  );
};

export default AwesomeButton;
