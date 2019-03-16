import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from '../../index';
import { getClassName, setCssEndEvent } from '../../helpers/components';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 4;

export default class AwesomeProgress extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    onPress: PropTypes.func,
    loadingLabel: PropTypes.string,
    resultLabel: PropTypes.string,
    rootElement: PropTypes.node,
    cssModule: PropTypes.object,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
    fakePress: PropTypes.bool,
    releaseDelay: PropTypes.number,
  };

  static defaultProps = {
    action: null,
    onPress: null,
    rootElement: null,
    loadingLabel: 'Wait..',
    resultLabel: 'Success!',
    disabled: false,
    cssModule: null,
    fakePress: false,
    children: null,
    size: null,
    type: null,
    releaseDelay: 500,
  };

  constructor(props) {
    super(props);
    this.rootElement = props.rootElement || ROOTELM;
    this.animationStage = 0;
    this.loading = false;
    this.state = {
      loadingEnd: false,
      loadingStart: false,
      loadingError: false,
      errorLabel: null,
      blocked: false,
      active: false,
    };
  }

  componentDidMount() {
    setCssEndEvent(this.content, 'transition', this.clearStagedWrapperAnimation.bind(this));
  }

  componentWillReceiveProps(newProps) {
    this.checkFakePress(newProps);
  }

  getRootClassName() {
    const { rootElement } = this;
    const { loadingStart, loadingEnd, loadingError } = this.state;
    const className = [
      (loadingStart && `${rootElement}--start`) || null,
      (loadingEnd && `${rootElement}--end`) || null,
      (loadingError && `${rootElement}--errored`) || null,
      `${rootElement}--progress`,
    ];
    return className
      .join(' ')
      .trim()
      .replace(/[\s]+/gi, ' ');
  }

  checkFakePress(newProps) {
    if (newProps.fakePress !== this.props.fakePress) {
      if (newProps.fakePress === true) {
        this.action();
      }
    }
  }

  endLoading(state = true, errorLabel = null) {
    this.setState({
      loadingEnd: true,
      loadingError: !state,
      errorLabel,
    });
    this.animationStage = 1;
  }

  startLoading() {
    this.loading = true;
    this.setState(
      {
        blocked: true,
        active: true,
      },
      () => {
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
      }
    );
  }

  clearLoading(callback) {
    this.loading = false;
    this.setState(
      {
        loadingStart: false,
        loadingEnd: false,
        active: false,
      },
      callback
    );
  }

  clearStagedWrapperAnimation() {
    if (this.animationStage !== 0) {
      if (this.animationStage === LOADING_ANIMATION_STEPS) {
        this.animationStage = 0;
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
              this.clearLoading(() => {
                setTimeout(() => {
                  this.setState({
                    blocked: false,
                    loadingError: false,
                    errorLabel: null,
                  });
                }, 500);
              });
            });
          }
        }, this.props.releaseDelay);
        return;
      }
      this.animationStage += 1;
    }
  }

  action = () => {
    this.startLoading();
    const action = this.props.action || this.props.onPress;
    if (action) {
      setTimeout(() => {
        action(this.container, this.endLoading.bind(this));
      }, 250);
    }
  };

  moveEvents() {
    const events = {
      onMouseDown: (event) => {
        if (
          this.props.disabled === true ||
          this.loading === true ||
          this.state.blocked === true ||
          (event && event.nativeEvent.which !== 1)
        ) {
          return;
        }
        this.loading = true;
      },
      onMouseUp: (event) => {
        if (this.props.disabled === true || this.loading === true || this.state.blocked === true) {
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
      action,
      type,
      ...extra
    } = this.props;

    const { active, blocked, errorLabel } = this.state;

    return (
      <AwesomeButton
        size={size}
        type={type}
        className={this.getRootClassName()}
        action={this.action}
        cssModule={cssModule}
        active={active}
        blocked={blocked}
        {...this.moveEvents()}
        {...extra}
      >
        <span
          ref={(content) => {
            this.content = content;
          }}
          data-loading={loadingLabel || null}
          data-status={errorLabel || resultLabel || null}
          className={getClassName(`${this.rootElement}__progress`, cssModule)}
        >
          <span>{children}</span>
        </span>
      </AwesomeButton>
    );
  }
}
