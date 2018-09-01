import React from 'react';
import PropTypes from 'prop-types';
import styles from './container.scss';

const Container = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.wrapper}>{children}</div>
  </div>);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
