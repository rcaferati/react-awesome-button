import React from 'react';
import PropTypes from 'prop-types';
import Styles from './customiser.scss';
import { AwesomeButton, AwesomeButtonSocial } from '../../index';
import { rgba2hex } from '../helpers/examples';
import { ColorPicker } from './index';

function applyStyles(elements, { property, value }) {
  elements.forEach((element) => {
    element.style.setProperty(property, value);
  });
}

class Customiser extends React.Component {
  static propTypes = {
    repository: PropTypes.string.isRequired,
    module: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    componentClass: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.values = {};
    this.state = {
      customized: false,
    };
  }

  state = {
    element: null,
  };

  componentWillMount() {
    this.updateProperties(this.props);
  }

  componentDidMount() {
    this.updateElement(this.props.componentClass);
    this.updateAllValues(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.values = {};
    if (this.props.theme !== newProps.theme) {
      this.updateValues = true;
    }
  }

  componentDidUpdate() {
    if (this.updateValues === true) {
      this.updateValues = false;
      this.updateAllValues(this.props);
    }
  }

  updateAllValues(newProps) {
    const state = {
      customized: false,
    };
    if (!this.element) {
      return false;
    }
    newProps.properties.forEach((section) => {
      section.props.forEach((prop) => {
        const name = `--${prop.name}`;
        let style = getComputedStyle(this.element).getPropertyValue(name);
        if (style.match(/(#)([a-z0-9]{3})($)/)) {
          style = style.replace(/(#)([a-z0-9]{3})/, '$1$2$2');
        }
        if (style.match(/px|em|s/)) {
          style = style.replace(/px|em|s/ig, '');
        }
        if (style.match(/rgb/)) {
          style = rgba2hex(style);
        }
        state[name] = style;
        applyStyles(document.querySelectorAll(`[data-role="customizable"] .${this.props.componentClass}`), {
          property: name,
          value: style + (prop.suffix || ''),
        });
      });
    });
    this.setState(state);
    return true;
  }

  updateProperties(newProps) {
    if (newProps.properties) {
      const state = {};
      newProps.properties.forEach((section) => {
        section.props.forEach((prop) => {
          state[`--${prop.name}`] = null;
        });
      });
      this.setState(state);
    }
  }

  updateElement(className) {
    if (this.control) {
      this.element = this.control.querySelector(`.${className}`);
    }
  }

  resetStyles = () => {
    this.setState({
      customized: false,
    });
    this.updateAllValues(this.props);
  }

  renderInputs(props) {
    return props.map((cssProperty) => {
      const { name, type } = cssProperty;
      const buttonName = `--${name}`;
      const extraProps = {};
      extraProps.type = type;
      if (type === 'range') {
        extraProps.type = type;
        extraProps.min = cssProperty.min || 0;
        extraProps.max = cssProperty.max || 10;
        extraProps.step = cssProperty.step || 1;
      }
      const onChange = (event) => {
        if (this.state.customized === false) {
          this.setState({ customized: true });
        }
        const state = {};
        let { value } = event.target;
        state[buttonName] = value;
        this.setState(state);
        if (cssProperty.suffix) {
          value = `${value}${cssProperty.suffix}`;
        }
        applyStyles(document.querySelectorAll(`[data-role="customizable"] .${this.props.componentClass}`), {
          property: buttonName,
          value,
        });
      };

      const input = type === 'color' ? (
        <ColorPicker
          value={this.state[buttonName] || this.values[buttonName] || ''}
          setTransparency={() => {
            const state = {};
            state[buttonName] = 'transparent';
            this.setState(state);
            applyStyles(document.querySelectorAll(`[data-role="customizable"] .${this.props.componentClass}`), {
              property: buttonName,
              value: 'transparent',
            });
          }}
          onChange={onChange}
          {... extraProps}
        />
      ) : (
        <input
          value={this.state[buttonName] || this.values[buttonName] || ''}
          onChange={onChange}
          {... extraProps}
        />
      );

      return (
        <li key={buttonName}>
          <label>
            <code>{name}</code>
          </label>
          <div>
            {input}
          </div>
          <div>
            <span>{`${this.state[buttonName] || this.values[buttonName]}${cssProperty.suffix || ''}`}</span>
          </div>
        </li>
      );
    });
  }

  renderSection(section) {
    return (
      <section key={section.name}>
        <h3>{section.name}</h3>
        <ul>
          {this.renderInputs(section.props)}
        </ul>
      </section>
    );
  }

  renderSections(sections) {
    return sections.map(section => this.renderSection(section));
  }

  render() {
    return (
      <section className={Styles.container}>
        <header>
          <h2>Custom Properties</h2>
          <p>Apply basic customization through CSS custom-properties.</p>
          <div
            ref={(control) => { this.control = control; }}
            className={Styles.control}
          >
            <AwesomeButton
              size="medium"
              disabled={!this.state.customized}
              action={this.resetStyles}
              cssModule={this.props.module}
            >
              Reset Styles
            </AwesomeButton>
            <AwesomeButtonSocial
              size="medium"
              href={this.props.repository}
              target="_blank"
              type="github"
              cssModule={this.props.module}
            >
              Source
            </AwesomeButtonSocial>
          </div>
        </header>
        <ul>
          { this.renderSections(this.props.properties) }
        </ul>
        <footer>
          <p>Access the source on <a target="_blank" href={this.props.repository}>github</a> to check all customisable optios</p>
        </footer>
      </section>
    );
  }
}

export default Customiser;
