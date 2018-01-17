import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from '../../index';
import Sharer from './sharer';
import getIcon from './icons';

const ICON_HEIGHT = 23;
const ICON_WIDTH = 30;

export default class AwesomeButtonShare extends React.Component {
  static propTypes = {
    bubbles: PropTypes.bool,
    children: PropTypes.node,
    cssModule: PropTypes.object,
    disabled: PropTypes.bool,
    element: PropTypes.func,
    height: PropTypes.string,
    icon: PropTypes.bool,
    iconHeight: PropTypes.number,
    iconWidth: PropTypes.number,
    image: PropTypes.string,
    message: PropTypes.string,
    target: PropTypes.string,
    moveEvents: PropTypes.bool,
    phone: PropTypes.string,
    href: PropTypes.string,
    style: PropTypes.object,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    user: PropTypes.string,
    visible: PropTypes.bool,
    width: PropTypes.string,
  };

  static defaultProps = {
    bubbles: false,
    children: null,
    cssModule: null,
    disabled: false,
    element: null,
    height: null,
    target: null,
    icon: true,
    iconHeight: ICON_HEIGHT,
    iconWidth: ICON_WIDTH,
    image: null,
    href: null,
    message: null,
    moveEvents: true,
    phone: null,
    style: {},
    url: null,
    user: null,
    visible: true,
    width: null,
  };

  constructor(props) {
    super(props);
    this.window = typeof window !== 'undefined';
  }

  getUrl() {
    if (this.props.url) {
      return this.props.url;
    }
    if (this.window) {
      return window.location.href;
    }
    return null;
  }

  getMessage() {
    if (this.props.message) {
      return this.props.message;
    }
    if (this.window !== 'undefined') {
      const message = document.querySelector('title');
      if (message) {
        return message.innerHTML;
      }
    }
    return null;
  }

  getImage() {
    if (this.props.image !== null) {
      return this.props.image;
    }
    if (this.window !== null) {
      const img = document.querySelector('meta[property="og:image"]');
      if (img) {
        return img.getAttribute('content');
      }
    }
    return null;
  }

  action = () => {
    if (this.props.href !== null) {
      return;
    }
    const sharer = Sharer({
      type: this.props.type,
      height: 600,
      width: 575,
      url: this.getUrl(),
      message: this.getMessage(),
      user: this.props.user,
      phone: this.props.phone,
    });
    if (this.window) {
      window.open(sharer.url, sharer.title, sharer.extra);
    }
  }

  render() {
    const {
      cssModule,
      children,
      type,
      icon,
      iconWidth,
      iconHeight,
      href,
      target,
    } = this.props;

    return (
      <AwesomeButton
        type={type}
        target={target}
        cssModule={cssModule}
        bubbles
        action={this.action}
        href={href}
      >
        {icon && getIcon({
          type,
          width: iconWidth,
          height: iconHeight,
        })} {children}
      </AwesomeButton>
    );
  }
}
