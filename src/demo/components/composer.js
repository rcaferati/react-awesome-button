import React from 'react';
import PropTypes from 'prop-types';
import Styles from './section.scss';

const Composer = ({ children }) => (
  <section className={Styles.container}>
    {children}
  </section>
);

Composer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Composer;
