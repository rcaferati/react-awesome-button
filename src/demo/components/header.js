import React from 'react';
import PropTypes from 'prop-types';
import Styles from './header.scss';
import { Navigation } from './index';
import { AwesomeButtonSocial } from '../../index';

const Header = ({
  title,
  name,
  module,
  size,
  description,
  themes,
  repository,
  framework,
  theme,
}) => (
  <header className={Styles.container}>
    <div className={Styles.wrapper}>
      <h1>
        <span>{framework}</span>
        <span>{title}</span>
      </h1>
      <h2>
        <strong>&lt;{name}/&gt;</strong>
        <span>{size}</span>
      </h2>
      <p>{description}</p>
      <div className={Styles.support}>
        <AwesomeButtonSocial
          cssModule={module}
          target="_blank"
          href={repository}
          type="github"
        >
          Support it on Github
        </AwesomeButtonSocial>
      </div>
      <Navigation
        theme={theme}
        themes={themes}
      />
    </div>
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  themes: PropTypes.array.isRequired,
  module: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  framework: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Header;
