import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import highlight from 'highlight.js';
import xml from 'highlight.js/lib/languages/xml';
import AwesomeButton from './index';

require('../stylesheet/react-awesome-button.scss');
require('../stylesheet/demo-styles.scss');
require('highlight.js/styles/github.css');

const DATA = {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The <strong>Awesome Button Vanilla JS Custom Element</strong> is a cool option to quickly add<br/> share buttons (or any kind of buttons) to your projects.',
  sise: '~1KB compressed',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  examples: [
    {
      title: 'Animated progress button',
      text: `
<AwesomeButton
  progress
  action={(next) => {
    ... doSomething
    next();
  }}
>Progress Button</AwesomeButton>`,
      button: (
        <AwesomeButton
          progress
          action={(element, next) => {
            setTimeout(() => {
              next();
            }, 750);
          }}
        >Progress Button</AwesomeButton>),
    },
    {
      title: 'Icon font button',
      text: `
<AwesomeButton
  type="facebook"
  size="icon"
><i className="fa fa-facebook" /></AwesomeButton>
<AwesomeButton
  type="twitter"
  size="icon"
><i className="fa fa-twitter" /></AwesomeButton>
<AwesomeButton
  type="github"
  size="icon"
><i className="fa fa-github" /></AwesomeButton>`,
      button: (
        <div>
          <AwesomeButton
            type="facebook"
            size="icon"
          >
            <i className="fa fa-facebook" />
          </AwesomeButton>
          <AwesomeButton
            type="twitter"
            size="icon"
          >
            <i className="fa fa-twitter" />
          </AwesomeButton>
          <AwesomeButton
            type="github"
            size="icon"
          >
            <i className="fa fa-github" />
          </AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Secondary button',
      text: `
<AwesomeButton type="secondary">Secondary Button</AwesomeButton>`,
      button: (<AwesomeButton
        type="secondary"
      >Secondary Button</AwesomeButton>),
    },
    {
      title: 'Disabled button',
      text: `
<AwesomeButton disabled>Primary Button</AwesomeButton>`,
      button: (<AwesomeButton
        disabled
      >Disabled Button</AwesomeButton>),
    },
  ],
};

const htmlEntities = str => str
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.codeBlocks = [];
  }
  componentDidMount() {
    this.codeBlocks.map((code) => {
      highlight.highlightBlock(code);
      return true;
    });
  }
  renderExamples() {
    return DATA.examples.map((example, index) => (
      <li key={`example-${index}`}>
        <h3>{example.title}</h3>
        <div>
          {example.button}
        </div>
        <pre>
          <code
            className="html"
            ref={(code) => {
              this.codeBlocks.push(code);
            }}
            dangerouslySetInnerHTML={{ __html: htmlEntities(example.text.trim()) }}
          />
        </pre>
      </li>
    ));
  }
  render() {
    return (
      <section>
        <header>
          <h1>{DATA.title}</h1>
          <p>{DATA.description}</p>
          <h2>
            <strong>&lt;{DATA.name}/&gt;</strong>
            <span>{DATA.size}</span>
          </h2>
          <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
        </header>
        <ul className="examples">
          {this.renderExamples()}
        </ul>
        <footer>
          <small>Star and support this project on
            <a rel="noopener noreferrer" target="_blank" href={DATA.repository}>github</a>
          .</small>
          <small>Read more and discuss at the
            <a rel="noopener noreferrer" target="_blank" href={DATA.article}>article page</a>
          .</small>
        </footer>
      </section>);
  }
}

render((
  <Router>
    <Route path="/" component={Demo} />
  </Router>),
  document.getElementById('root'));
