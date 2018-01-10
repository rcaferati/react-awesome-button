import React from 'react';
import PropTypes from 'prop-types';
import {
  classToModules,
  getClassName,
  setCssEndEvent,
  createBubbleEffect,
  toggleMoveClasses,
} from './helpers/component';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 5;
const ANIMATION_DELAY = 100;

/**
TODO: Extend the setup with CSS custom properties;
export const AwesomeButtonSetup = (setup = {}) => {
};
*/

const Anchor = props => (<a {... props} />);
const Button = props => (<button {... props} />);

export default class AwesomeButton extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    bubbles: PropTypes.bool,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    element: PropTypes.func,
    href: PropTypes.string,
    loadingLabel: PropTypes.string,
    placeholder: PropTypes.bool,
    progress: PropTypes.bool,
    title: PropTypes.string,
    resultLabel: PropTypes.string,
    rootElement: PropTypes.string,
    moveEvents: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.object,
    cssModule: PropTypes.object,
    target: PropTypes.string,
    to: PropTypes.string,
    type: PropTypes.string,
    visible: PropTypes.bool,
  };
  static defaultProps = {
    action: null,
    bubbles: false,
    cssModule: null,
    disabled: false,
    title: null,
    element: null,
    href: null,
    loadingLabel: 'Wait ..',
    moveEvents: true,
    progress: false,
    placeholder: false,
    resultLabel: 'Success!',
    rootElement: ROOTELM,
    size: null,
    style: {},
    target: null,
    to: null,
    type: 'primary',
    visible: true,
  };
  constructor(props) {
    super(props);
    this.rootElement = props.rootElement || ROOTELM;
    this.animationStage = 0;
    this.extraProps = {};
    this.state = {
      disabled: props.disabled || (props.placeholder && !props.children),
      loading: false,
      loadingEnd: false,
      loadingStart: false,
      blocked: false,
    };
    this.checkProps(props);
  }
  componentDidMount() {
    this.container = this.button && this.button.parentNode;
    setCssEndEvent(this.wrapper, 'transition', this.clearStagedWrapperAnimation.bind(this));
  }
  componentWillReceiveProps(newProps) {
    this.checkPlaceholder(newProps);
    this.checkProps(newProps);
  }
  getRootClassName() {
    const { rootElement } = this;
    const {
      type,
      size,
      placeholder,
      children,
      visible,
      progress,
      cssModule,
    } = this.props;
    const {
      loadingStart,
      loadingEnd,
      disabled,
      pressPosition,
    } = this.state;
    const className = [
      this.rootElement,
      type && `${rootElement}--${type}`,
      size && `${rootElement}--${size}`,
      visible && `${rootElement}--visible`,
      (placeholder && !children && `${rootElement}--placeholder`) || null,
      (loadingStart && `${rootElement}--start`) || null,
      (loadingEnd && `${rootElement}--end`) || null,
      (progress && `${rootElement}--progress`) || null,
    ];
    if (disabled === true) {
      className.push(`${rootElement}--disabled`);
    }
    if (pressPosition) {
      className.push(pressPosition);
    }
    if (cssModule && cssModule['aws-btn']) {
      return classToModules(className, cssModule);
    }
    return className.join(' ').trim().replace(/[\s]+/ig, ' ');
  }
  checkProps(newProps) {
    const {
      to,
      href,
      target,
      element,
    } = newProps;
    this.extraProps.to = to || null;
    this.extraProps.href = href || null;
    this.extraProps.target = target || null;
    this.renderComponent = element || (this.props.href ? Anchor : Button);
  }
  checkPlaceholder(newProps) {
    const { placeholder, children } = newProps;
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
    }
  }
  endLoading() {
    this.setState({ loadingEnd: true });
    this.animationStage = 1;
  }
  startLoading() {
    this.setState({
      loading: true,
      loadingStart: true,
      blocked: true,
    });
  }
  clearPress() {
    toggleMoveClasses({
      element: this.container,
      root: this.rootElement,
      cssModule: this.props.cssModule,
    });
    const pressPosition = this.state.loading ? this.state.pressPosition : null;
    this.setState({
      pressPosition,
    });
  }
  clearLoading() {
    this.setState({
      loading: false,
      loadingStart: false,
      loadingEnd: false,
    });
  }
  clearStagedWrapperAnimation() {
    if (this.animationStage !== 0) {
      if (this.animationStage === LOADING_ANIMATION_STEPS) {
        this.animationStage = 0;
        // hold life for 350ms before releasing the button;
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
              this.clearLoading();
              this.clearPress();
              setTimeout(() => {
                this.setState({
                  blocked: false,
                });
              }, 500);
            });
          }
        }, 350);
        return;
      }
      this.animationStage += 1;
    }
  }
  action() {
    if (this.props.progress) {
      this.startLoading();
    }
    if (this.props.action && this.button) {
      this.props.action(
        this.container,
        this.props.progress ? this.endLoading.bind(this) : null,
      );
    }
  }
  createBubble(event) {
    createBubbleEffect({
      event,
      button: this.button,
      content: this.content,
      className: getClassName(`${this.rootElement}__bubble`, this.props.cssModule),
    });
  }
  moveEvents() {
    const events = {
      onMouseLeave: () => {
        this.clearPress();
      },
      onMouseDown: (event) => {
        if (this.state.disabled === true ||
          this.state.loading === true ||
          this.state.blocked === true ||
          (event && event.nativeEvent.which !== 1)
        ) {
          return;
        }
        this.pressed = new Date().getTime();
        this.setState({
          pressPosition: `${this.rootElement}--active`,
          loading: this.props.progress,
        });
      },
      onMouseUp: (event) => {
        if (this.state.disabled === true ||
          this.state.blocked === true) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (this.clearTimer) {
          clearTimeout(this.clearTimer);
        }
        const diff = new Date().getTime() - this.pressed;
        if (this.props.progress === false && this.props.bubbles === true) {
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
      },
    };
    if (this.props.moveEvents === true) {
      events.onMouseMove = (event) => {
        if (this.state.disabled === true ||
          this.state.loading === true ||
          this.state.blocked === true) {
          return;
        }
        const { button } = this;
        const { left } = button.getBoundingClientRect();
        const width = button.offsetWidth;
        const state = event.pageX < (left + (width * 0.3))
          ? 'left'
          : event.pageX > (left + (width * 0.65))
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
        this.container.classList.add(classToModules([`${this.rootElement}--middle`], this.props.cssModule));
      };
    }
    return events;
  }
  render() {
    const RenderComponent = this.renderComponent;
    const {
      title,
      style,
      cssModule,
      progress,
      loadingLabel,
      resultLabel,
      children,
    } = this.props;
    return (
      <RenderComponent
        style={style}
        className={this.getRootClassName()}
        role="button"
        title={title}
        {... this.extraProps}
        {... this.moveEvents()}
      >
        <span
          ref={(button) => { this.button = button; }}
          className={getClassName(`${this.rootElement}__container`, cssModule)}
        >
          <span
            ref={(wrapper) => { this.wrapper = wrapper; }}
            className={getClassName(`${this.rootElement}__wrapper`, cssModule)}
          >
            <span
              ref={(content) => { this.content = content; }}
              data-loading={(progress && loadingLabel) || null}
              data-status={(progress && resultLabel) || null}
              className={getClassName(`${this.rootElement}__content`, cssModule)}
            >
              <span>{children}</span>
            </span>
          </span>
        </span>
      </RenderComponent>
    );
  }
}
