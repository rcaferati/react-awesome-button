import React from 'react';
import PropTypes from 'prop-types';
import AwesomeButton from '../component';

export default class Themes extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };
  renderTheme() {
    const { theme } = this.props;
    return (
      <div>
        <AwesomeButton
          bubbles
          size="medium"
          cssModule={theme}
        >
          Primary
        </AwesomeButton>
        <AwesomeButton
          bubbles
          size="medium"
          cssModule={theme}
          type="secondary"
        >
          Secondary
        </AwesomeButton>
        <AwesomeButton
          bubbles
          size="medium"
          cssModule={theme}
          disabled
        >
          Disabled
        </AwesomeButton>
        <AwesomeButton
          bubbles
          placeholder
          size="medium"
          cssModule={theme}
          disabled
        />
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderTheme()}
      </div>
    );
  }
}
