import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton } from '../../index';
import Sharer from './sharer';
import getIcon from './icons';

const ICON_HEIGHT = 23;
const ICON_WIDTH = 30;

export default class AwesomeButtonSocial extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    bubbles: PropTypes.bool,
    children: PropTypes.node,
    cssModule: PropTypes.object,
    disabled: PropTypes.bool,
    element: PropTypes.func,
    height: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.bool,
    iconHeight: PropTypes.number,
    iconWidth: PropTypes.number,
    image: PropTypes.string,
    message: PropTypes.string,
    moveEvents: PropTypes.bool,
    phone: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    target: PropTypes.string,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    user: PropTypes.string,
    visible: PropTypes.bool,
    width: PropTypes.string,
  };

  static defaultProps = {
    action: null,
    bubbles: false,
    children: null,
    cssModule: null,
    disabled: false,
    element: null,
    height: null,
    href: null,
    icon: true,
    iconHeight: ICON_HEIGHT,
    iconWidth: ICON_WIDTH,
    image: null,
    message: null,
    moveEvents: true,
    phone: null,
    size: null,
    style: {},
    target: null,
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
      children,
      icon,
      type,
      action,
      iconWidth,
      iconHeight,
      href,
      ...extra
    } = this.props;

    return (
      <AwesomeButton
        type={type}
        action={this.action}
        href={href}
        {...extra}
      >
        {icon && getIcon({
          type,
          width: iconWidth,
          height: iconHeight,
          color: this.props.disabled ? 'rgba(255,255,255,0.35)' : '#FFF'
        })} {children}
      </AwesomeButton>
    );
  }
}
