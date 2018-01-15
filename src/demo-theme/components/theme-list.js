import React from 'react';
import PropTypes from 'prop-types';
import Theme from '../../demo/themes';
import Modules from '../modules';

export default function List({ styles }) {
  return (
    <div className={styles.themeList}>
      {Modules.Themes.map(theme => <Theme key={theme} theme={Modules.modules[theme]} />)}
    </div>
  );
}

List.propTypes = {
  styles: PropTypes.string.isRequired,
};
