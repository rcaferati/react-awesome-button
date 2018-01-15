import React from 'react';
import PropTypes from 'prop-types';
import Theme from '../../demo/themes';
import Modules from '../modules';

class List extends React.Component {
  static propTypes = {
    styles: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.themes = Modules.Themes;
    this.modules = Modules.Modules;
  }
  renderThemes() {
    return this.themes.map(theme => <Theme key={theme} theme={this.modules[theme]} />);
  }
  render() {
    return (
      <div className={this.props.styles.themeList}>
        {this.renderThemes()}
      </div>
    );
  }
}

export default List;
