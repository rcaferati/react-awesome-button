import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-scss';
import Data from './data';
import Styles from './demo.scss';

require('prismjs/themes/prism-okaidia.css');

const renderFeatures = () => Data.features.map((feature, index) => (<li key={`feature-${index}`}>{feature}</li>));

const renderExamples = () => Data.examples.map((example, index) => (
  <li key={`example-${index}`}>
    <h3>{example.title}</h3>
    {example.description && <p>{example.description}</p>}
    {example.scss && (
      <pre>
        <code
          className="scss"
          dangerouslySetInnerHTML={{ __html:
            Prism.highlight(example.scss.trim(), Prism.languages.scss),
          }}
        />
      </pre>
    )}
    <pre>
      <code
        className="html"
        dangerouslySetInnerHTML={{ __html:
          Prism.highlight(example.text.trim(), Prism.languages.jsx),
        }}
      />
    </pre>
    <div>
      {example.button}
    </div>
  </li>
));

const Demo = () => (
  <section>
    <header>
      <h1>{Data.title}</h1>
      <h2>
        <strong>&lt;{Data.name}/&gt;</strong>
        <span>{Data.size}</span>
      </h2>
      <p>{Data.description}</p>
    </header>
    <div className={Styles.features}>
      <h3>Main Features</h3>
      <ul>
        {renderFeatures()}
      </ul>
    </div>
    <ul className={Styles.examples}>
      {renderExamples()}
    </ul>
    <footer>
      <div>
        <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
      </div>
      <small>Star and support this project on <a rel="noopener noreferrer" target="_blank" href={Data.repository}>github</a>.</small>
      <small>Read more and discuss at the <a rel="noopener noreferrer" target="_blank" href={Data.article}>article page</a>.</small>
    </footer>
  </section>
);

render((
  <Router>
    <Route path="/" component={Demo} />
  </Router>),
  document.getElementById('root'));
