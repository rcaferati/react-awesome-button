import React from 'react';
import PropTypes from 'prop-types';
import {
  classToModules,
  getClassName,
  setCssEndEvent,
  createBubbleEffect,
} from './helpers';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 5;

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
    progress: PropTypes.bool,
    resultLabel: PropTypes.string,
    rootElement: PropTypes.string,
    moveEvents: PropTypes.bool,
    // rounded: PropTypes.bool,
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
    disabled: false,
    element: null,
    href: null,
    loadingLabel: 'Wait ..',
    moveEvents: true,
    progress: false,
    resultLabel: 'Success!',
    rootElement: ROOTELM,
    rounded: true,
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
      disabled: props.disabled,
      loading: false,
      loadingEnd: false,
      loadingStart: false,
      blocked: false,
      clicked: false,
    };
    this.checkProps(props);
  }
  componentDidMount() {
    setCssEndEvent(this.wrapper, 'transition', this.clearStagedWrapperAnimation.bind(this));
  }
  componentWillReceiveProps(newProps) {
    this.checkProps(newProps);
  }
  getClassName() {
    const className = [
      this.rootElement,
      this.props.type && `${this.rootElement}--${this.props.type}`,
      this.props.size && `${this.rootElement}--${this.props.size}`,
      this.props.visible && `${this.rootElement}--visible`,
      (this.state.loadingStart && `${this.rootElement}--start`) || null,
      (this.state.loadingEnd && `${this.rootElement}--end`) || null,
      (this.props.progress && `${this.rootElement}--progress`) || null,
    ];
    if (this.state.disabled === true) {
      className.push(`${this.rootElement}--disabled`);
    }
    if (this.state.pressPosition) {
      className.push(this.state.pressPosition);
    }

    if (this.props.cssModule && this.props.cssModule['aws-btn']) {
      console.log(className);
      console.log(this.props.cssModule);
      console.log(classToModules(className, this.props.cssModule));
      return classToModules(className, this.props.cssModule);
    }

    return className.join(' ').trim();
  }
  checkProps(props) {
    this.extraProps.to = props.to || null;
    this.extraProps.href = props.href || null;
    this.extraProps.target = props.target || null;
    this.renderComponent = props.element || (this.props.href ? Anchor : Button);
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
          window.requestAnimationFrame(() => {
            this.clearLoading();
            this.clearPress();
            setTimeout(() => {
              this.setState({
                blocked: false,
              });
            }, 500);
          });
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
    if (this.props.action) {
      this.props.action(
        this.button.parentNode,
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
      onClick: () => {
        if (this.state.disabled === true ||
          this.state.blocked === true ||
          (this.props.progress && !this.state.loading)
        ) {
          return;
        }
        const eventTrigger = new Event('action');
        this.button.dispatchEvent(eventTrigger);
        this.action();
      },
      onMouseLeave: () => {
        this.clearPress();
      },
      onMouseDown: (event) => {
        if (this.state.disabled === true ||
          this.state.loading === true ||
          this.state.blocked === true) {
          return;
        }
        if (this.props.progress === false && this.props.bubbles === true) {
          this.createBubble(event);
        }
        this.setState({
          loading: this.props.progress,
          pressPosition: `${this.rootElement}--active`,
        });
      },
      onMouseUp: (event) => {
        if (this.state.disabled === true ||
          this.state.loading === true ||
          this.state.blocked === true) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        this.clearPress();
      },
    };

    if (this.props.moveEvents === true) {
      events.onMouseMove = (event) => {
        if (this.state.disabled === true ||
          this.state.loading === true ||
          this.state.blocked === true) {
          return;
        }
        const button = this.button;
        const left = button.getBoundingClientRect().left;
        const width = button.offsetWidth;
        this.setState({
          pressPosition: event.pageX < (left + (width * 0.3))
            ? `${this.rootElement}--left`
            : event.pageX > (left + (width * 0.65))
              ? `${this.rootElement}--right`
              : `${this.rootElement}--middle`,
        });
      };
    } else {
      events.onMouseEnter = () => {
        this.setState({
          pressPosition: `${this.rootElement}--middle`,
        });
      };
    }
    return events;
  }
  render() {
    const RenderComponent = this.renderComponent;
    return (
      <RenderComponent
        style={this.props.style}
        className={this.getClassName()}
        {... this.extraProps}
        {... this.moveEvents()}
      >
        <span
          ref={(button) => { this.button = button; }}
          className={getClassName(`${this.rootElement}__container`, this.props.cssModule)}
        >
          <span
            ref={(wrapper) => { this.wrapper = wrapper; }}
            className={getClassName(`${this.rootElement}__wrapper`, this.props.cssModule)}
          >
            <span
              ref={(content) => { this.content = content; }}
              data-loading={(this.props.progress && this.props.loadingLabel) || null}
              data-status={(this.props.progress && this.props.resultLabel) || null}
              className={getClassName(`${this.rootElement}__content`, this.props.cssModule)}
            >
              <span>{this.props.children}</span>
            </span>
          </span>
        </span>
      </RenderComponent>
    );
  }
}
