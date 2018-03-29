import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../index';
import Modules from '../../helpers/modules';

export default function List({ styles }) {
  return (
    <div className={styles.themeList}>
      {List.renderItems()}
    </div>
  );
}

List.renderItems = () => (
  Modules.Themes.map(theme => <Theme key={theme} theme={Modules.Modules[theme]} />)
);

List.propTypes = {
  styles: PropTypes.object.isRequired,
};
