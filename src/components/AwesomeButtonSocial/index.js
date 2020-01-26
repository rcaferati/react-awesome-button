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
    onPress: PropTypes.func,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    icon: PropTypes.bool,
    iconHeight: PropTypes.number,
    iconWidth: PropTypes.number,
    image: PropTypes.string,
    message: PropTypes.string,
    phone: PropTypes.string,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    user: PropTypes.string,
  };

  static defaultProps = {
    action: null,
    onPress: null,
    children: null,
    disabled: false,
    href: null,
    icon: true,
    iconHeight: ICON_HEIGHT,
    iconWidth: ICON_WIDTH,
    image: null,
    message: null,
    phone: null,
    url: null,
    user: null,
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

  action = container => {
    const { action, onPress, href, type, user, phone } = this.props;

    if (action) {
      action(container);
      return;
    }
    if (onPress) {
      onPress(container);
      return;
    }
    if (href !== null) {
      return;
    }

    const sharer = Sharer({
      height: 600,
      width: 575,
      url: this.getUrl(),
      message: this.getMessage(),
      type,
      user,
      phone,
    });

    if (this.window) {
      window.open(sharer.url, sharer.title, sharer.extra);
    }
  };

  render() {
    const {
      children,
      icon,
      type,
      action,
      onPress,
      iconWidth,
      iconHeight,
      href,
      ...extra
    } = this.props;

    return (
      <AwesomeButton type={type} action={this.action} href={href} {...extra}>
        {icon &&
          getIcon({
            type,
            width: iconWidth,
            height: iconHeight,
            color: this.props.disabled ? 'rgba(255,255,255,0.35)' : '#FFF',
          })}{' '}
        {children}
      </AwesomeButton>
    );
  }
}
