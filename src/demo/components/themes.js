import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from '../../index';

export default function Themes({ theme }) {
  return (
    <div>
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
    </div>
  );
}

Themes.propTypes = {
  theme: PropTypes.string.isRequired,
};
