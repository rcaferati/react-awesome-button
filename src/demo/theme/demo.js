import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
// import ThemeList from './components/theme-list';
// import ThemeTest from './components/theme-test';
// import '../../../dist/styles.css';
import AwsBtnThemeMorty from '../../styles/themes/theme-c137/styles.scss';
import Styles from './demo.scss';
import { AwesomeProgress, AwesomeButton } from '../../index';


class Demo extends React.Component {
  componentWillMount() {
    window.performance.mark('Demo');
  }
  componentDidMount() {
    console.log(window.performance.now('App'));
  }
  render() {
    return (
      <div className={Styles.section}>
        <AwesomeButton
          size="large"
          cssModule={AwsBtnThemeMorty}
        >
          Primary
        </AwesomeButton>
        <AwesomeProgress
          size="large"
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 1000);
          }}
          cssModule={AwsBtnThemeMorty}
        >
          Progress
        </AwesomeProgress>
      </div>
    );
  }
}

render(
  (
    <Router>
      <Route path="/" component={Demo} />
    </Router>
  ),
  document.getElementById('root'),
);
