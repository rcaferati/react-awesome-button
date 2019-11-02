import React from 'react';
import PropTypes from 'prop-types';
import { setCssEndEvent } from 'web-animation-club';
import {
  classToModules,
  getClassName,
  createBubbleEffect,
  toggleMoveClasses,
} from '../../helpers/components';

const ROOTELM = 'aws-btn';
const ANIMATION_DELAY = 100;

/**
TODO: Extend the setup with CSS custom properties;
export const AwesomeButtonSetup = (setup = {}) => {
};
*/

const Anchor = props => <a {...props} />;
const Button = props => <button {...props} />;

export default class AwesomeButton extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    onPress: PropTypes.func,
    onReleased: PropTypes.func,
    ripple: PropTypes.bool,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    element: PropTypes.func,
    href: PropTypes.string,
    placeholder: PropTypes.bool,
    title: PropTypes.string,
    rootElement: PropTypes.string,
    moveEvents: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.object,
    cssModule: PropTypes.object,
    className: PropTypes.string,
    target: PropTypes.string,
    to: PropTypes.string,
    type: PropTypes.string,
    visible: PropTypes.bool,
    active: PropTypes.bool,
    blocked: PropTypes.bool,
  };

  static defaultProps = {
    action: null,
    onPress: null,
    onReleased: null,
    ripple: false,
    blocked: false,
    cssModule: null,
    children: null,
    disabled: false,
    title: null,
    element: null,
    href: null,
    className: null,
    moveEvents: true,
    placeholder: false,
    rootElement: ROOTELM,
    size: null,
    style: {},
    target: null,
    to: null,
    type: 'primary',
    visible: true,
    active: false,
  };

  constructor(props) {
    super(props);
    this.rootElement = props.rootElement || ROOTELM;
    this.animationStage = 0;
    this.extraProps = {};
    this.state = {
      disabled: props.disabled || (props.placeholder && !props.children),
    };
    this.checkProps(props);
  }

  componentDidMount() {
    this.container = this.button && this.button.parentNode;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.checkPlaceholder(newProps);
    this.checkProps(newProps);
    this.checkActive(newProps);
  }

  componentWillUnmount() {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
  }

  getRootClassName() {
    const { rootElement } = this;
    const {
      type,
      size,
      placeholder,
      children,
      visible,
      cssModule,
    } = this.props;
    const { disabled, pressPosition } = this.state;
    const className = [
      this.rootElement,
      type && `${rootElement}--${type}`,
      size && `${rootElement}--${size}`,
      visible && `${rootElement}--visible`,
      (placeholder && !children && `${rootElement}--placeholder`) || null,
    ];
    if (disabled === true) {
      className.push(`${rootElement}--disabled`);
    }
    if (pressPosition) {
      className.push(pressPosition);
    }
    if (this.props.className) {
      className.push(...this.props.className.split(' '));
    }
    if (cssModule && cssModule['aws-btn']) {
      return classToModules(className, cssModule);
    }
    return className
      .join(' ')
      .trim()
      .replace(/[\s]+/gi, ' ');
  }

  checkActive(newProps) {
    if (newProps.active !== this.props.active) {
      if (newProps.active === true) {
        this.setState({
          pressPosition: `${this.rootElement}--active`,
        });
        return;
      }
      this.clearPress({ force: true });
    }
  }

  checkProps(newProps) {
    const { to, href, target, element } = newProps;
    this.extraProps.to = to || null;
    this.extraProps.href = href || null;
    this.extraProps.target = target || null;
    this.renderComponent = element || (this.props.href ? Anchor : Button);
  }

  checkPlaceholder(newProps) {
    const { disabled, placeholder, children } = newProps;
    if (placeholder === true) {
      if (!children) {
        this.setState({
          disabled: true,
        });
      } else {
        this.setState({
          disabled: false,
        });
      }
    } else {
      this.setState({
        disabled,
      });
    }
  }

  clearPress({ force = false, leave = false } = {}) {
    // clear class movement (no-state)
    toggleMoveClasses({
      element: this.container,
      root: this.rootElement,
      cssModule: this.props.cssModule,
    });

    const pressPosition =
      this.props.active && !force ? `${this.rootElement}--active` : null;

    if (pressPosition === null && leave === false) {
      setCssEndEvent(this.content, 'transition', {
        tolerance: 1,
      }).then(() => {
        if (this.props.onReleased) {
          this.props.onReleased(this.container);
        }
      });
    }
    this.setState({
      pressPosition,
    });
  }

  pressIn() {
    if (this.state.disabled === true || this.props.blocked === true) {
      return;
    }
    this.pressed = new Date().getTime();
    this.setState({
      pressPosition: `${this.rootElement}--active`,
    });
  }

  pressOut(event) {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
    const diff = new Date().getTime() - this.pressed;
    if (this.props.ripple === true) {
      this.createBubble(event);
    }
    if (typeof window !== 'undefined' && this.button) {
      const eventTrigger = new Event('action');
      this.button.dispatchEvent(eventTrigger);
    }
    this.action();
    this.clearTimer = setTimeout(() => {
      this.clearPress();
    }, ANIMATION_DELAY - diff);
  }

  action() {
    const { action, onPress } = this.props;

    if (this.button) {
      if (action) {
        action(this.container);
        return;
      }
      if (onPress) {
        onPress(this.container);
      }
    }
  }

  createBubble(event) {
    createBubbleEffect({
      event,
      button: this.button,
      content: this.content,
      className: getClassName(
        `${this.rootElement}__bubble`,
        this.props.cssModule
      ),
    });
  }

  moveEvents() {
    const events = {
      onClick: event => {
        if (this.props.href && this.state.disabled) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      onMouseLeave: () => {
        this.clearPress({ leave: true });
      },
      onMouseDown: event => {
        if (event && event.nativeEvent.which !== 1) {
          return;
        }
        this.pressIn();
      },
      onMouseUp: event => {
        if (this.state.disabled === true || this.props.blocked === true) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        this.pressOut(event);
      },
    };
    if (this.props.moveEvents === true) {
      events.onMouseMove = event => {
        if (this.state.disabled === true) {
          return;
        }
        const { button } = this;
        const { left } = button.getBoundingClientRect();
        const width = button.offsetWidth;
        const state =
          event.pageX < left + width * 0.3
            ? 'left'
            : event.pageX > left + width * 0.65
            ? 'right'
            : 'middle';

        toggleMoveClasses({
          element: this.container,
          root: this.rootElement,
          cssModule: this.props.cssModule,
          state,
        });
      };
    } else {
      events.onMouseEnter = () => {
        toggleMoveClasses({
          element: this.container,
          root: this.rootElement,
          cssModule: this.props.cssModule,
          state: 'middle',
        });
      };
    }
    return events;
  }

  render() {
    const RenderComponent = this.renderComponent;
    const { title, style, cssModule, children } = this.props;
    return (
      <RenderComponent
        style={style}
        className={this.getRootClassName()}
        role="button"
        title={title}
        {...this.extraProps}
        {...this.moveEvents()}
      >
        <span
          ref={button => {
            this.button = button;
          }}
          className={getClassName(`${this.rootElement}__wrapper`, cssModule)}
        >
          <span
            ref={content => {
              this.content = content;
            }}
            className={getClassName(`${this.rootElement}__content`, cssModule)}
          >
            <span
              ref={child => {
                this.child = child;
              }}
            >
              {children}
            </span>
          </span>
        </span>
      </RenderComponent>
    );
  }
}
