import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import AwesomeButton from '../react-awesome-button';

require('prismjs/themes/prism-okaidia.css');
require('../react-awesome-button.scss');
require('./demo.scss');

const DATA = {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The AwesomeButton is a performant, extendable, highly customisable, production ready react component that renders an animated basic set of UI buttons.',
  size: '~3KB compressed ( js + css )',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  examples: [
    {
      title: 'Primary button',
      text: `
<AwesomeButton>Primary Button</AwesomeButton>`,
      button: (<AwesomeButton>Primary Button</AwesomeButton>),
    },
    {
      title: 'Secondary button',
      text: `
<AwesomeButton type="secondary">Secondary Button</AwesomeButton>`,
      button: (<AwesomeButton type="secondary">Secondary Button</AwesomeButton>),
    },
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
        <div>
          <AwesomeButton
            progress
            action={(element, next) => {
              setTimeout(() => {
                next();
              }, 600);
            }}
          >Progress Button</AwesomeButton>
          <AwesomeButton
            progress
            type="secondary"
            action={(element, next) => {
              setTimeout(() => {
                next();
              }, 500);
            }}
          >Progress Button</AwesomeButton>
        </div>),
    },
    {
      title: 'Hover and Bubble Animations',
      text: `
    <AwesomeButton>Primary Button</AwesomeButton>`,
      button: (
        <div>
          <AwesomeButton>With Move Events</AwesomeButton>
          <AwesomeButton
            moveEvents={false}
          >Without Move Events</AwesomeButton>
          <AwesomeButton
            bubbles
            moveEvents={false}
          >Bubble Animation</AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Icon font button — Using children',
      description: `This example use font-awesome to render the icons but you can
      use almost anything as the component's child. i.e. <img> or <svg> tags.`,
      text: `
<AwesomeButton
  type="facebook"
  size="icon"
><i className="fa fa-facebook" /></AwesomeButton>
...`,
      button: (
        <div>
          <AwesomeButton
            type="facebook"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-facebook" />
          </AwesomeButton>
          <AwesomeButton
            type="twitter"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-twitter" />
          </AwesomeButton>
          <AwesomeButton
            type="github"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-github" />
          </AwesomeButton>
          <AwesomeButton
            type="linkedin"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-linkedin" />
          </AwesomeButton>
          <AwesomeButton
            type="whatsapp"
            size="icon"
            bubbles
            moveEvents={false}
          >
            <i className="fa fa-whatsapp" />
          </AwesomeButton>
        </div>
      ),
    },
    {
      title: 'Disabled button',
      text: `
<AwesomeButton disabled>Disabled Button</AwesomeButton>`,
      button: (<AwesomeButton
        disabled
      >Disabled Button</AwesomeButton>),
    },
  ],
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.codeBlocks = [];
  }
  componentDidMount() {
  }
  renderExamples() {
    return DATA.examples.map((example, index) => (
      <li key={`example-${index}`}>
        <h3>{example.title}</h3>
        {example.description && <p>{example.description}</p>}
        <pre>
          <code
            className="html"
            ref={(code) => {
              this.codeBlocks.push(code);
            }}
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
  }
  render() {
    return (
      <section>
        <header>
          <h1>{DATA.title}</h1>
          <h2>
            <strong>&lt;{DATA.name}/&gt;</strong>
            <span>{DATA.size}</span>
          </h2>
          <p>{DATA.description}</p>
        </header>
        <div className="features">
          <h3>Main Features</h3>
          <ul>
            <li>Styles customisable and extendable via sass variables.</li>
            <li>Render any tag as the component's child (text, icon, img, svg)</li>
            <li>No inline-styles</li>
            <li>Animated progress button</li>
            <li>Button types/colors can be extended via sass list variables</li>
          </ul>
        </div>
        <ul className="examples">
          {this.renderExamples()}
        </ul>
        <footer>
          <div>
            <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
          </div>
          <small>Star and support this project on <a rel="noopener noreferrer" target="_blank" href={DATA.repository}>github</a>.</small>
          <small>Read more and discuss at the <a rel="noopener noreferrer" target="_blank" href={DATA.article}>article page</a>.</small>
        </footer>
      </section>);
  }
}

render((
  <Router>
    <Route path="/" component={Demo} />
  </Router>),
  document.getElementById('root'));
