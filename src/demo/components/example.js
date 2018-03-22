import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-scss';
import 'prismjs/themes/prism-okaidia.css';
import Styles from './example.scss';

class Example extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    examples: PropTypes.array,
  };
  static defaultProps = {
    examples: [],
  };

  renderExamples(examples) {
    return examples.map((example, index) => {
      const {
        js,
        jsx,
        scss,
        component,
      } = example;
      return (
        <div
          key={`example-${index}`}
          className={Styles.example}
        >
          {js && (
            <pre>
              <h4>.js</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(js.trim(), Prism.languages.jsx),
                }}
              />
            </pre>
          )}
          {jsx && (
            <pre>
              <h4>.jsx</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(jsx.trim(), Prism.languages.jsx),
                }}
              />
            </pre>
          )}
          {scss && (
            <pre>
              <h4>.scss</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(scss.trim(), Prism.languages.scss),
                }}
              />
            </pre>
          )}
          {component && (
            <div>
              {component}
            </div>
          )}
        </div>
      );
    });
  }

  render() {
    const {
      title,
      component,
      examples,
    } = this.props;

    return (
      <div className={Styles.container}>
        <div className={Styles.header}>
          {title && <p>{title}</p>}
        </div>
        <div data-role="customizable" className={Styles.component}>
          {component}
        </div>
        {this.renderExamples(examples)}
      </div>
    );
  }
}

export default Example;
