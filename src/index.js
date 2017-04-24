'use strict';

import React, { PropTypes } from 'react';

const ROOTELM = "aws-btn";
const LOADING_ANIMATION_STEPS = 5;

export const AwesomeButtonSetup = (setup) => {
  /**
    TODO: Extend the setup with CSS custom properties;
  */
};

export default class AwesomeButton extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    rounded: PropTypes.bool,
    action: PropTypes.func,
    progress: PropTypes.bool,
  };
  static defaultProps = {
    type: "primary",
    disabled: false,
    visible: true,
    progress: false,
    rounded: true
  };
  constructor(props) {
    super(props);
    this.animationStage = 0;
    this.rootElement = props.rootElement || ROOTELM;
    this.state = {
      disabled: props.disabled,
      loading: false,
      loadingStart: false,
      loadingEnd: false,
    };
  }
  getClassName() {
    const className = [
      this.rootElement,
      this.props.type && this.rootElement + "--" + this.props.type,
      this.props.size && this.rootElement + "--" + this.props.size,
      this.props.visible && this.rootElement + "--visible",
      this.state.loadingStart && this.rootElement + "--start",
      this.state.loadingEnd && this.rootElement + "--end",
      this.props.progress && this.rootElement + "--progress",
    ];
    if (this.state.disabled === true) {
      className.push(this.rootElement + "--disabled");
    }
    if (this.state.pressPosition) {
      className.push(this.state.pressPosition);
    }
    return className.join(" ");
  }
  endLoading() {
    this.setState({ loadingEnd: true });
    this.animationStage = 1;
  }
  startLoading() {
    this.setState({ loadingStart: true });
  }
  action () {
    if (this.props.href) {
      window.open(this.props.href, this.props.target || "");
      return;
    }
    if (this.props.progress) {
      this.startLoading();
    }
    this.props.action && this.props.action(this.endLoading.bind(this));
  }
  clearPress() {
    const pressPosition = this.state.loading ? this.state.pressPosition : null;
    this.setState({
      pressPosition,
    });
  }
  clearStagedWrapperAnimation () {
    if (this.animationStage !== 0) {
      // console.log("---");
      // console.log(this.animationStage);
      // this.animationStage++;
      // console.log("+++");
      // return;
      if(this.animationStage === LOADING_ANIMATION_STEPS) {
        this.animationStage = 0;
        // hold for 250ms before releasing the button;
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            this.setState({
              loading: false,
              loadingStart: false,
              loadingEnd: false,
            });
            this.clearPress();
          });
        }, 250);
        return;
      }
      this.animationStage++;
    }
  }
  componentDidMount () {
    this.refs.wrapper.addEventListener('webkitTransitionEnd', () => this.clearStagedWrapperAnimation());
    this.refs.wrapper.addEventListener('transitionEnd', () => this.clearStagedWrapperAnimation());
    this.refs.wrapper.addEventListener('otransitionEnd', () => this.clearStagedWrapperAnimation());
  }
  events = {
    onClick: (event) => {
      if (this.state.disabled === true) {
        return;
      }
      var eventTrigger = new Event('action');
      this.refs.button.dispatchEvent(eventTrigger);
      this.action();
    },
    onMouseMove: (event) => {
      if (this.state.disabled == true) {
        return;
      }
      if (this.state.loading == true) {
        return;
      }
      const button = this.refs.button,
        left = button.getBoundingClientRect().left,
        width = button.offsetWidth;
      this.setState({
        pressPosition: event.pageX < (left + (width * .3))
          ? this.rootElement + "--left"
          : event.pageX > (left + (width * .65))
            ? this.rootElement + "--right"
            : this.rootElement + "--middle"
      });
    },
    onMouseLeave: (event) => {
      this.clearPress();
    },
    onMouseDown: (event) => {
      if (this.state.disabled == true) {
        return;
      }
      if (this.props.progress === true) {
        this.setState({ loading: true });
      }
      this.setState({ pressPosition: this.rootElement + "--active" });
    },
    onMouseUp: (event) => {
      if (this.state.disabled === true) {
        return;
      }
      this.clearPress();
    },
  };
  render() {
    return (
      <button
        ref="button"
        style={this.props.style}
        className={this.getClassName()}
        {... this.events}>
        <span
          ref="wrapper"
          className={this.rootElement + "__wrapper"}>
          <span
            ref="content"
            data-loading={this.props.loadingLabel || "Wait .."}
            data-status={this.props.resultLabel || "Success!"}
            className={this.rootElement + "__content"}>
              <span>{this.props.value || this.props.children}</span>
          </span>
        </span>
      </button>
    );
  }
}
