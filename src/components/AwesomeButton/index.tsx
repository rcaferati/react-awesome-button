import * as React from 'react';
// @ts-ignore
import { setCssEndEvent } from 'web-animation-club';
import {
  classToModules,
  getClassName,
  createRippleEffect,
  toggleMoveClasses,
} from '../../helpers/components';

const ROOTELM = 'aws-btn';
const ANIMATION_DELAY = 100;
const IS_WINDOW = typeof window !== 'undefined';

const Anchor: React.FunctionComponent = (props: any) => <a {...props} />;
const Button: React.FunctionComponent = (props: any) => <button {...props} />;

export type ButtonType = {
  active?: Boolean;
  after?: React.ReactNode;
  before?: React.ReactNode;
  between?: boolean;
  children?: React.ReactNode;
  className?: string;
  containerProps?: any;
  cssModule?: any;
  disabled?: Boolean;
  element?: React.FunctionComponent;
  extra?: React.ReactNode;
  href?: string;
  moveEvents?: Boolean;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onPress?: (event: React.MouseEvent) => void;
  onPressed?: (event: React.MouseEvent) => void;
  onReleased?: (event: React.MouseEvent) => void;
  placeholder?: Boolean;
  ripple?: Boolean;
  rootElement?: string;
  size?: string;
  style?: any;
  type?: string;
  visible?: Boolean;
};

const AwesomeButton = ({
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
  type = 'primary',
  visible = true,
}: ButtonType) => {
  const [isDisabled, setDisabled] = React.useState(
    disabled || (placeholder && !children)
  );
  const [pressPosition, setPressPosition] = React.useState(null);
  const button = React.useRef(null);
  const content = React.useRef(null);
  const container = React.useRef(null);
  const child = React.useRef(null);
  const over = React.useRef(false);
  const pressed = React.useRef(null);
  const timer = React.useRef(null);
  const RenderComponent: React.FunctionComponent =
    element || (href ? Anchor : Button);

  const extraProps = {
    href,
  };

  React.useEffect(() => {
    if (button?.current) {
      container.current = button.current.parentNode;
    }

    return () => {
      if (timer?.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const getRootClassName = () =>
    React.useMemo(() => {
      const classList = [
        rootElement,
        type && `${rootElement}--${type}`,
        size && `${rootElement}--${size}`,
        visible && `${rootElement}--visible`,
        between && `${rootElement}--between`,
        (placeholder && !children && `${rootElement}--placeholder`) || null,
      ];

      if (isDisabled === true) {
        classList.push(`${rootElement}--disabled`);
      }
      if (pressPosition) {
        classList.push(pressPosition);
      }
      if (className) {
        classList.push(...className.split(' '));
      }
      if (cssModule && cssModule['aws-btn']) {
        return classToModules(classList, cssModule);
      }

      return classList
        .join(' ')
        .trim()
        .replace(/[\s]+/gi, ' ');
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
      cssModule,
    ]);

  const checkActive = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (active === true) {
      setPressPosition(`${rootElement}--active`);
      return;
    }

    if (pressPosition !== null) {
      clearPress({ force: true });
    }
  };

  React.useEffect(checkActive, [active]);

  const checkDisabled = () => {
    if (placeholder === true && !children) {
      setDisabled(true);
      return;
    }
    if (isDisabled !== disabled) {
      setDisabled(disabled);
    }
  };

  React.useEffect(checkDisabled, [placeholder, children, disabled]);

  const clearPressCallback = () => {
    // leave false e force false não é release;
    // mas teria que evitar;
    onReleased && onReleased(container.current);
  };

  const clearPress = ({ force = false, leave = false }: any = {}) => {
    // remove supperficial mouse-move
    toggleMoveClasses({
      element: container.current,
      root: rootElement,
      cssModule,
    });

    let nextPressPosition = active && !force ? `${rootElement}--active` : null;

    // não tem active;
    // leave === true é só no mouse leave;
    // leave === false, em todos os outros;
    // if (pressPosition === null && leave === false) {
    // configura o evento;

    // E SE TIVER PRESSIONANDO?
    if (content?.current?.clearCssEvent) {
      content.current.clearCssEvent();
    }

    if (nextPressPosition === null && pressPosition?.match(/active/gim)) {
      setCssEndEvent(content.current, 'transition', {
        tolerance: 1,
      }).then(clearPressCallback);
    }

    // if (nextPressPosition === null && over.current === true) {
    //   nextPressPosition = `${rootElement}--middle`;
    // }

    setPressPosition(nextPressPosition);
    // setPressPosition(null);
  };

  const createRipple = (event: any) => {
    createRippleEffect({
      event,
      button: button.current,
      content: content.current,
      className: getClassName(`${rootElement}__bubble`, cssModule),
    });
  };

  const pressIn = (event: React.MouseEvent) => {
    if (isDisabled === true || active === true) {
      return;
    }
    pressed.current = new Date().getTime();
    setCssEndEvent(content.current, 'transition', {
      tolerance: 1,
    }).then(() => {
      // Full press-in
      onPressed && onPressed(event);
    });
    setPressPosition(`${rootElement}--active`);
  };

  const pressOut = (event: React.MouseEvent) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const diff = new Date().getTime() - pressed.current;
    if (ripple === true) {
      createRipple(event);
    }

    if (IS_WINDOW && button.current) {
      const eventTrigger = new Event('btn-press');
      button.current.dispatchEvent(eventTrigger);
    }

    handleAction(event);

    const time = ANIMATION_DELAY - diff;

    // if (time > 0) {
    //   timer.current = setTimeout(clearPress, time);
    //   return;
    // }
    clearPress();
  };

  const handleAction = (event: React.MouseEvent) => {
    const element = container.current;
    if (!element) {
      return;
    }

    onPress && onPress(event);
  };

  const getMoveEvents: any = () => {
    const events: any = {
      onClick: (event: React.MouseEvent) => {
        if (href && isDisabled) {
          event.preventDefault();
        }
      },
      onMouseLeave: () => {
        over.current = false;
        clearPress({ leave: true });
      },
      onMouseDown: (event: React.MouseEvent) => {
        onMouseDown && onMouseDown(event);
        if (event?.nativeEvent?.button !== 0) {
          return;
        }
        pressIn(event);
      },
      onMouseUp: (event: React.MouseEvent) => {
        onMouseUp && onMouseUp(event);
        if (isDisabled === true || active === true) {
          event.preventDefault();
          return;
        }

        pressOut(event);
      },
    };

    if (moveEvents === true) {
      events.onMouseMove = (event: React.MouseEvent) => {
        if (isDisabled === true) {
          return;
        }
        over.current = true;
        const buttonElement = button.current;
        const { left } = buttonElement.getBoundingClientRect();
        const width = buttonElement.offsetWidth;
        const state =
          event.pageX < left + width * 0.3
            ? 'left'
            : event.pageX > left + width * 0.65
            ? 'right'
            : 'middle';

        toggleMoveClasses({
          element: container.current,
          root: rootElement,
          cssModule,
          state,
        });
      };
    } else {
      events.onMouseEnter = () => {
        over.current = true;
        toggleMoveClasses({
          element: container.current,
          root: rootElement,
          cssModule,
          state: 'middle',
        });
      };
    }

    return events;
  };

  return (
    <RenderComponent
      style={style}
      className={getRootClassName()}
      role="button"
      ref={container}
      {...containerProps}
      {...extraProps}
      {...getMoveEvents()}>
      <span
        ref={button}
        className={getClassName(`${rootElement}__wrapper`, cssModule)}>
        <span
          ref={content}
          className={getClassName(`${rootElement}__content`, cssModule)}>
          {before}
          <span ref={child}>{children}</span>
          {after}
        </span>
        {extra}
      </span>
    </RenderComponent>
  );
};

export default AwesomeButton;
