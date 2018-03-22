import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Styles from './navigation.scss';

export default class Navigation extends React.Component {
  static propTypes = {
    themes: PropTypes.array.isRequired,
    theme: PropTypes.string.isRequired,
  };

  renderButtons() {
    return this.props.themes.map((theme, index) => (
      <Link
        key={`${theme.name}-${index}`}
        to={`/${theme.slug}`}
        onClick={this.onClick}
        className={theme.slug === this.props.theme ? Styles.selected : null}
      >
        {theme.name}
      </Link>
    ));
  }

  render() {
    return (
      <div className={Styles.container}>
        <span>Select a theme:</span>
        <nav className={Styles.nav}>
          {this.renderButtons()}
        </nav>
      </div>
    );
  }
}
