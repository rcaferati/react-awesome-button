import React from 'react';
import PropTypes from 'prop-types';
import styles from './list.scss';

const List = ({ children }) => {
  console.log(children);
  return (
    <ul className={styles.container}>
      {
        (children.length && children.map(child => <li>{child}</li>)) ||
        (<li>{children}</li>)
      }
    </ul>
  );
};

List.propTypes = {
  children: PropTypes.node.isRequired,
};

export default List;
