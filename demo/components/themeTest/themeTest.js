import React from 'react';
import PropTypes from 'prop-types';
import {
  AwesomeButton,
  AwesomeButtonSocial,
  AwesomeButtonProgress,
} from '../../../src/index';
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
          <AwesomeButton ripple cssModule={Module}>
            Primary
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
          <AwesomeButton
            bubbles
            cssModule={Module}
            placeholder
            type="secondary"
          >
            {this.state.placeholderButtonText}
          </AwesomeButton>
          <span
            tabIndex="0"
            role="button"
            className={styles.action}
            onClick={() => {
              this.setState({
                placeholderButtonText: this.state.placeholderButtonText
                  ? ''
                  : 'Placeholder',
              });
            }}
          >
            ← Set Data
          </span>
        </div>
        <div className={`${styles.loadData} ${styles.section}`}>
          <AwesomeButton
            cssModule={Module}
            bubbles
            disabled={this.state.isDisabled}
          >
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
        <div className={[styles.section, styles.share].join(' ').trim()}>
          <h4>Social ready buttons with bundled icons and share actions</h4>
          <div className={styles.shareContent}>
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
            <AwesomeButtonSocial
              iconHeight={24}
              iconWidth={26}
              type="github"
              target="_blank"
              href="https://github.com/rcaferati"
              cssModule={Module}
            >
              Fork me
            </AwesomeButtonSocial>
            <AwesomeButtonSocial
              iconHeight={24}
              iconWidth={26}
              type="linkedin"
              target="_blank"
              href="https://linkedin.com/in/rcaferati"
              cssModule={Module}
            >
              Connect
            </AwesomeButtonSocial>
            <AwesomeButtonSocial
              iconHeight={24}
              iconWidth={26}
              type="messenger"
              target="_blank"
              user="caferati.me"
              cssModule={Module}
            >
              Message
            </AwesomeButtonSocial>
            <AwesomeButtonSocial
              iconHeight={24}
              iconWidth={26}
              type="whatsapp"
              phone="+5551995300000"
              message="Heloo Whatsapp!"
              cssModule={Module}
            >
              Whatsapp
            </AwesomeButtonSocial>
          </div>
        </div>
      </section>
    );
  }
}

export default Test;
