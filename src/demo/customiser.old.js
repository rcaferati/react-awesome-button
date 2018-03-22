import React from 'react';
import PropTypes from 'prop-types';

const PROPERTIES = [
  {
    name: 'button-color-primary',
    type: 'color',
  },
  {
    name: 'button-color-primary-dark',
    type: 'color',
  },
  {
    name: 'button-color-primary-light',
    type: 'color',
  },
  {
    name: 'button-color-primary-border',
    type: 'color',
  },
  {
    name: 'button-color-secondary',
    type: 'color',
  },
  {
    name: 'button-color-secondary-dark',
    type: 'color',
  },
  {
    name: 'button-color-secondary-light',
    type: 'color',
  },
  {
    name: 'button-color-secondary-border',
    type: 'color',
  },
  {
    name: 'button-default-height',
    type: 'range',
    max: 100,
    min: 30,
    suffix: 'px',
  },
  {
    name: 'button-default-font-size',
    type: 'range',
    max: 25,
    min: 10,
    suffix: 'px',
  },
  {
    name: 'button-default-border-radius',
    type: 'range',
    max: 25,
    suffix: 'px',
  },
  {
    name: 'button-horizontal-padding',
    type: 'range',
    max: 50,
    suffix: 'px',
  },
  {
    name: 'button-raise-level',
    type: 'range',
    max: 10,
    suffix: 'px',
  },
  {
    name: 'button-hover-pressure',
    type: 'range',
    max: 4,
    step: 0.5,
  },
];

function applyStyles(buttons, { property, value }) {
  buttons.forEach((button) => {
    button.style.setProperty(property, value);
  });
}

class Customiser extends React.Component {
  static propTypes = {
    styles: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      buttonSample: null,
      '--button-color-primary': null,
    };
  }

  componentDidMount() {
    this.setState({
      buttonSample: document.querySelector('button'),
      allButtons: document.querySelectorAll('button'),
    });
  }

  renderInputs() {
    return PROPERTIES.map((cssProperty) => {
      const { name, type } = cssProperty;
      const buttonName = `--${name}`;

      if (!this.state[buttonName] && this.state.buttonSample) {
        const state = {};
        let style = getComputedStyle(this.state.buttonSample).getPropertyValue(buttonName);
        if (style.match(/(#)([a-z0-9]{3})($)/)) {
          style = style.replace(/(#)([a-z0-9]{3})/, '$1$2$2');
        }
        if (style.match(/px|em/)) {
          style = style.replace(/px|em/ig, '')
        }
        state[buttonName] = style;
        this.setState(state);
      }

      const extraProps = {};
      extraProps.type = type;

      if (type === 'range') {
        extraProps.type = type;
        extraProps.min = cssProperty.min || 0;
        extraProps.max = cssProperty.max || 10;
        extraProps.step = cssProperty.step || 1;
      }

      return (
        <li>
          <label>
            <code>{buttonName}</code>
          </label>
          <input
            id="button-primary-color"
            value={this.state[buttonName] || ''}
            onChange={(event) => {
              const state = {};
              let { value } = event.target;
              state[buttonName] = value;
              this.setState(state);
              if (cssProperty.suffix) {
                value = `${value}${cssProperty.suffix}`;
              }
              applyStyles(this.state.allButtons, {
                property: buttonName,
                value,
              });
            }}
            {... extraProps}
          />
        </li>
      );
    });
  }

  render() {
    const {
      styles,
    } = this.props;

    return (
      <section className={styles.customiser}>
        <ul>
          { this.renderInputs() }
        </ul>
      </section>
    );
  }
}

export default Customiser;
