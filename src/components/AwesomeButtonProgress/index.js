import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from '../../index';
import {
  getClassName,
  setCssEndEvent,
} from '../../helpers/components';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 4;

export default class AwesomeProgress extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    loadingLabel: PropTypes.string,
    resultLabel: PropTypes.string,
    rootElement: PropTypes.node,
    cssModule: PropTypes.object,
    children: PropTypes.node,
    size: PropTypes.string,
    type: PropTypes.string,
  };
  static defaultProps = {
    action: null,
    rootElement: null,
    loadingLabel: 'Wait..',
    resultLabel: 'Success!',
    cssModule: null,
    children: null,
    size: null,
    type: null,
  };
  constructor(props) {
    super(props);
    this.rootElement = props.rootElement || ROOTELM;
    this.animationStage = 0;
    this.loading = false;
    this.state = {
      loadingEnd: false,
      loadingStart: false,
      blocked: false,
      active: false,
    };
  }
  componentDidMount() {
    setCssEndEvent(this.content, 'transition', this.clearStagedWrapperAnimation.bind(this));
  }
  getRootClassName() {
    const {
      rootElement,
    } = this;
    const {
      loadingStart,
      loadingEnd,
    } = this.state;
    const className = [
      (loadingStart && `${rootElement}--start`) || null,
      (loadingEnd && `${rootElement}--end`) || null,
      `${rootElement}--progress`,
    ];
    return className.join(' ').trim().replace(/[\s]+/ig, ' ');
  }
  endLoading() {
    this.setState({
      loadingEnd: true,
    });
    this.animationStage = 1;
  }
  startLoading() {
    this.loading = true;
    this.setState({
      blocked: true,
      active: true,
    }, () => {
      /*
        To avoid the button eventual flickering I've changed the display strategy
        for that to work in a controlled way we need to set the loadingStart
        at least one painting cycle ahead
      */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.setState({
            loadingStart: true,
          });
        });
      });
    });
  }
  clearLoading(callback) {
    this.loading = false;
    this.setState({
      loadingStart: false,
      loadingEnd: false,
      active: false,
    }, callback);
  }
  clearStagedWrapperAnimation() {
    if (this.animationStage !== 0) {
      if (this.animationStage === LOADING_ANIMATION_STEPS) {
        this.animationStage = 0;
        // hold life for 500ms before releasing the button;
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
              this.clearLoading(() => {
                setTimeout(() => {
                  this.setState({
                    blocked: false,
                  });
                }, 500);
              });
            });
          }
        }, 500);
        return;
      }
      this.animationStage += 1;
    }
  }
  action = () => {
    this.startLoading();
    if (this.props.action) {
      this.props.action(
        this.container,
        this.endLoading.bind(this),
      );
    }
  }
  moveEvents() {
    const events = {
      onMouseDown: (event) => {
        if (this.state.disabled === true ||
          this.loading === true ||
          this.state.blocked === true ||
          (event && event.nativeEvent.which !== 1)
        ) {
          return;
        }
        this.loading = true;
      },
      onMouseUp: (event) => {
        if (this.state.disabled === true ||
          this.loading === true ||
          this.state.blocked === true) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        this.action();
      },
    };
    return events;
  }
  render() {
    const {
      children,
      size,
      cssModule,
      loadingLabel,
      resultLabel,
      type,
    } = this.props;
    console.log(size);
    console.log(children);
    return (
      <AwesomeButton
        size={size}
        type={type}
        className={this.getRootClassName()}
        action={this.action}
        cssModule={cssModule}
        active={this.state.active}
        blocked={this.state.blocked}
        {... this.moveEvents()}
      >
        <span
          ref={(content) => { this.content = content; }}
          data-loading={(loadingLabel) || null}
          data-status={(resultLabel) || null}
          className={getClassName(`${this.rootElement}__progress`, cssModule)}
        >
          <span>{children}</span>
        </span>
      </AwesomeButton>
    );
  }
}
