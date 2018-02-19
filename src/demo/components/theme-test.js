import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton, AwesomeButtonSocial, AwesomeButtonProgress } from '../../index';
import Modules from '../../helpers/modules';

class Test extends React.Component {
  static propTypes = {
    styles: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      placeholderButtonText: '',
      isDisabled: true,
    };
  }
  render() {
    const {
      styles,
      theme,
    } = this.props;

    const Module = Modules.Modules[theme];

    return (
      <section className={styles.container}>
        <div className={styles.section}>
          <AwesomeButton
            cssModule={Module}
          >
            <i className="fa fa-codepen" aria-hidden /> Primary
          </AwesomeButton>
        </div>
        <div className={styles.section}>
          <AwesomeButton
            cssModule={Module}
            type="secondary"
          >
            Secondary
          </AwesomeButton>
        </div>
        <div className={styles.section}>
          <AwesomeButtonProgress
            cssModule={Module}
            type="primary"
            action={(element, next) => {
              setTimeout(() => {
                // debugger;
                next();
              }, 750);
            }}
          >
            Progress
          </AwesomeButtonProgress>
        </div>
        <div className={`${styles.loadData} ${styles.section}`}>
          <AwesomeButton
            bubbles
            size="medium"
            cssModule={Module}
            placeholder
            type="secondary"
          >
            {this.state.placeholderButtonText}
          </AwesomeButton>
          <span
            tabIndex="0"
            role="button"
            onClick={() => {
              this.setState({
                placeholderButtonText: this.state.placeholderButtonText ? '' : 'Placeholder',
              });
            }}
          >
            ← Set Data
          </span>
        </div>
        <div className={`${styles.loadData} ${styles.section}`}>
          <AwesomeButton
            cssModule={Module}
            size="medium"
            bubbles
            disabled={this.state.isDisabled}
          >
            Disabled
          </AwesomeButton>
          <span
            tabIndex="0"
            role="button"
            onClick={() => {
              this.setState({
                isDisabled: !this.state.isDisabled,
              }, () => {
                console.log(this.state.isDisabled);
              });
            }}
          >
            ← Toggle
          </span>
        </div>
        <div className={styles.section}>
          <AwesomeButtonSocial
            iconHeight="24px"
            iconWidth="24px"
            url="https://caferati.me"
            type="facebook"
            cssModule={Module}
          >
            Share
          </AwesomeButtonSocial>
        </div>
        <div className={styles.section}>
          <AwesomeButtonSocial
            iconHeight="24px"
            iconWidth="26px"
            type="twitter"
            message="Checkout my full portfolio @ "
            url="https://caferati.me"
            cssModule={Module}
          >
            Share
          </AwesomeButtonSocial>
        </div>
        <div className={styles.section}>
          <AwesomeButtonSocial
            iconHeight="24px"
            iconWidth="26px"
            type="instagram"
            url="https://instagram.com"
            cssModule={Module}
          >
            Follow
          </AwesomeButtonSocial>
        </div>
      </section>
    );
  }
}

export default Test;
