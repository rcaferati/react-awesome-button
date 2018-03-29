import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import styles from './demo.scss';
import { Header, Customiser, Body, Composer, Page, PageRibbon } from './components';
import Data from './data.json';
import data from './examples';

const DEFAULT_THEME = 'blue-theme';

const DemoComponent = ({ match, handlePopover, popoverOpened, popoverText }) => {
  const theme = match.params.theme || DEFAULT_THEME;
  return (
    <Page
      theme={data[theme]}
      data={Data}
      handlePopover={handlePopover}
      popoverOpened={popoverOpened}
      popoverText={popoverText}
    />
  );
};

const ComposerComponent = ({ match, handlePopover }) => {
  const theme = match.params.theme || DEFAULT_THEME;
  return (
    <Customiser
      theme={theme}
      handlePopover={handlePopover}
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

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpened: false,
      popoverText: '',
    };
  }

  handlePopover = (popover) => {
    this.setState(popover);
  }

  render() {
    return (
      <Router>
        <div>
          <PageRibbon
            href={Data.repository}
            title="Github Repository"
            target="_blank"
            className={styles.ribbon}
            delay={300}
          >
            <span>Support it on Github</span><span role="img" aria-label="hi?">🙌🏻</span>
          </PageRibbon>
          <Body>
            <Route path="/:theme?" component={HeaderComponent} />
            <Route
              path="/:theme?"
              render={({ match }) => (
                <DemoComponent
                  match={match}
                  popoverOpened={this.state.popoverOpened}
                  popoverText={this.state.popoverText}
                  handlePopover={this.handlePopover}
                />
              )}
            />
          </Body>
          <Composer>
            <Route
              path="/:theme?"
              render={({ match }) => (
                <ComposerComponent
                  match={match}
                  handlePopover={this.handlePopover}
                />
              )}
            />
          </Composer>
        </div>
      </Router>
    );
  }
}


export default Demo;
