import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

// import ThemeList from './components/theme-list';
import ThemeTest from '../components/theme-test';
// import '../../../dist/styles.css';
import Styles from '../demo.scss';


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
        <ThemeTest styles={Styles} theme="theme-blue" />
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
