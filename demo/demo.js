import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import styles from './demo.scss';
import {
  Header,
  Customiser,
  Body,
  Composer,
  Page,
  PageRibbon,
} from './components';
import Data from './data.json';
import data from './examples';
import { DemoProvider, useDemoContext } from './context';

const DEFAULT_THEME = 'blue-theme';

const getRouteTheme = params => {
  if (!params?.['*']) {
    return DEFAULT_THEME;
  }
  const split = params['*'].replace(/(.*)(\/(.*))?/gim, '$1');
  return split;
};

const DemoComponent = () => {
  const params = useParams();
  const theme = getRouteTheme(params);

  return <Page theme={data[theme]} data={Data} />;
};

DemoComponent.propTypes = {
  match: PropTypes.object.isRequired,
  handlePopover: PropTypes.func.isRequired,
  popoverOpened: PropTypes.bool.isRequired,
  popoverText: PropTypes.string.isRequired,
};

const ComposerComponent = () => {
  const params = useParams();
  const theme = getRouteTheme(params);
  const { openPopover, isPopoverOpened } = useDemoContext();

  return (
    <Customiser
      theme={theme}
      openPopover={openPopover}
      isPopoverOpened={isPopoverOpened}
      repository={Data.repository}
      module={data[theme].module}
      componentClass={data[theme].example.componentClass}
      properties={data[theme].properties}
    />
  );
};

const HeaderComponent = () => {
  const params = useParams();
  const theme = getRouteTheme(params);

  return (
    <Header
      title={Data.title}
      framework={Data.framework}
      name={Data.name}
      repository={Data.repository}
      module={data[theme].module}
      size={Data.size}
      domain={Data.domain}
      description={Data.description}
      themes={Data.themes}
      theme={theme}
    />
  );
};

class Demo extends React.Component {
  static propTypes = {
    server: PropTypes.bool,
    location: PropTypes.string,
  };
  static defaultProps = {
    server: false,
    location: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      popoverOpened: false,
      popoverText: '',
    };
  }

  handlePopover = popover => {
    this.setState(popover);
  };

  render() {
    const { server, location } = this.props;
    const Router = server === true ? StaticRouter : BrowserRouter;

    return (
      <Router location={location}>
        <DemoProvider>
          <div>
            <PageRibbon
              href={Data.repository}
              title="Github Repository"
              target="_blank"
              className={styles.ribbon}
              delay={1223}
            >
              <span>Support it on Github</span>
              <span role="img" aria-label="hi?">
                🙌🏻
              </span>
            </PageRibbon>
            <Body>
              <Routes>
                <Route
                  path={`${Data.domain}/*`}
                  element={
                    <>
                      <HeaderComponent />
                      <DemoComponent />
                    </>
                  }
                />
              </Routes>
            </Body>
            <Composer>
              <Routes>
                <Route
                  path={`${Data.domain}/*`}
                  element={<ComposerComponent />}
                />
              </Routes>
            </Composer>
          </div>
        </DemoProvider>
      </Router>
    );
  }
}

export default Demo;
