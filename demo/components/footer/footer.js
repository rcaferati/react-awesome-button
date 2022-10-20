import React from 'react';
import PropTypes from 'prop-types';
import Styles from './footer.scss';

const Footer = ({ repository, article }) => (
  <footer className={Styles.container}>
    <div>
      <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
    </div>
    <small>
      Support this project on <a href={repository}>github</a>
    </small>
    <small>Built by <a href="https://caferati.me"><b>@rcaferati</b></a></small>
  </footer>
);

Footer.propTypes = {
  repository: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,
};

export default Footer;
