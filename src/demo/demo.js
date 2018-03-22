import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './demo.scss';
import { Header, Customiser, Body, Composer, Page } from './components/index';
import Data from './data.json';
import data from './examples';

const DEFAULT_THEME = 'blue-theme';

const DemoComponent = ({ match }) => {
  const theme = match.params.theme || DEFAULT_THEME;
  return (
    <Page theme={data[theme]} data={Data} />
  );
};

const ComposerComponent = ({ match }) => {
  const theme = match.params.theme || DEFAULT_THEME;
  console.log(Data);
  return (
    <Customiser
      theme={theme}
      repository={Data.repository}
      module={data[theme].module}
      componentClass={data[theme].example.componentClass}
      properties={data[theme].properties}
    />
  );
};

const HeaderComponent = ({ match }) => {
  const theme = match.params.theme || DEFAULT_THEME;
  return (
    <Header
      title={Data.title}
      framework={Data.framework}
      name={Data.name}
      repository={Data.repository}
      module={data[theme].module}
      size={Data.size}
      description={Data.description}
      themes={Data.themes}
      theme={theme}
    />
  );
};

render(
  (
    <Router>
      <div>
        <Body>
          <Route path="/:theme?" component={HeaderComponent} />
          <Route path="/:theme?" component={DemoComponent} />
        </Body>
        <Composer>
          <Route path="/:theme?" component={ComposerComponent} />
        </Composer>
      </div>
    </Router>
  ),
  document.getElementById('root'),
);
