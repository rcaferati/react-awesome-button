import React from 'react';
import PropTypes from 'prop-types';
import Styles from './popover.scss';
import { setCssEndEvent } from '../../helpers/examples';
import { AwesomeButton } from '../../../src/index';

class Popover extends React.Component {
  static propTypes = {
    opened: PropTypes.bool.isRequired,
    module: PropTypes.object.isRequired,
    handlePopover: PropTypes.func.isRequired,
    text: PropTypes.string,
  };
  static defaultProps = {
    text: '',
  };

  constructor(props) {
    super(props);
    this.animating = false;
    this.toggleTimer = null;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.opened !== newProps.opened) {
      this.toggleVisibility(newProps.opened);
    }
  }

  componentWillUnmount() {
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
    }
  }

  toggleVisibility(toggle, timed) {
    if (this.animating) {
      if (timed) {
        return;
      }
      this.toggleTimer = setTimeout(() => {
        this.toggleVisibility(toggle, true);
      }, 175);
      return;
    }
    this.animating = true;
    if (toggle === true) {
      this.container.classList.add(Styles.show);
      setCssEndEvent(this.container, 'animation').then(() => {
        this.animating = false;
      });
      return;
    }
    this.container.classList.add(Styles.hide);
    setCssEndEvent(this.container, 'animation').then(() => {
      this.container.classList.remove(Styles.show);
      this.container.classList.remove(Styles.hide);
      this.animating = false;
    });
  }

  render() {
    const {
      text,
      module,
    } = this.props;
    return (
      <div
        ref={(container) => { this.container = container; }}
        className={Styles.container}
      >
        <div className={Styles.window}>
          <div
            className={Styles.body}
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
          <div className={Styles.control}>
            <AwesomeButton
              size="medium"
              type="secondary"
              cssModule={module}
              action={() => {
                this.props.handlePopover({
                  popoverOpened: false,
                });
              }}
            >
              Close
            </AwesomeButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Popover;
