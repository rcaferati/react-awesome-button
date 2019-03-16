import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton, AwesomeButtonSocial, AwesomeButtonProgress } from '../../../src/index';
import Modules from '../../helpers/modules';
import styles from './themeTest.scss';

class Test extends React.Component {
  static propTypes = {
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
    const { theme } = this.props;

    const Module = Modules.Modules[theme];

    return (
      <section className={styles.container}>
        <div className={styles.section}>
          <AwesomeButton cssModule={Module}>
            <i className="fa fa-codepen" aria-hidden /> Primary
          </AwesomeButton>
          <AwesomeButton cssModule={Module} type="secondary">
            Secondary
          </AwesomeButton>
          <AwesomeButton cssModule={Module} type="link">
            Anchor
          </AwesomeButton>
        </div>
        <div className={styles.section}>
          <AwesomeButtonProgress
            cssModule={Module}
            type="primary"
            onPress={(element, next) => {
              setTimeout(() => {
                // debugger;
                next();
              }, 750);
            }}
          >
            Primary Progress
          </AwesomeButtonProgress>
        </div>
        <div className={`${styles.loadData} ${styles.section}`}>
          <AwesomeButton bubbles cssModule={Module} placeholder type="secondary">
            {this.state.placeholderButtonText}
          </AwesomeButton>
          <span
            tabIndex="0"
            role="button"
            className={styles.action}
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
          <AwesomeButton cssModule={Module} bubbles disabled={this.state.isDisabled}>
            Disabled
          </AwesomeButton>
          <span
            tabIndex="0"
            role="button"
            className={styles.action}
            onClick={() => {
              this.setState({
                isDisabled: !this.state.isDisabled,
              });
            }}
          >
            ← Toggle
          </span>
        </div>
        <div className={styles.section}>
          <AwesomeButtonSocial
            iconHeight={24}
            iconWidth={26}
            url="https://caferati.me"
            type="facebook"
            cssModule={Module}
          >
            Share
          </AwesomeButtonSocial>
          <AwesomeButtonSocial
            iconHeight={24}
            iconWidth={26}
            type="twitter"
            message="Checkout my full portfolio @ "
            url="https://caferati.me"
            cssModule={Module}
          >
            Share
          </AwesomeButtonSocial>
          <AwesomeButtonSocial
            iconHeight={24}
            iconWidth={26}
            type="instagram"
            target="_blank"
            href="https://instagram.com/rcaferati"
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
