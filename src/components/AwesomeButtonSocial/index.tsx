import * as React from 'react';
import AwesomeButton, { ButtonType } from '../AwesomeButton/index';
import Sharer, { isMobile } from './sharer';
import getIcon from './icons';

const ICON_SIZE = 24;

type SharerType = {
  image?: string;
  message?: string;
  phone?: string;
  url?: string;
  user?: string;
};

type DimensionsType = {
  width: number;
  height: number;
};

type SocialButtonType = {
  sharer?: SharerType;
  icon?: boolean | DimensionsType;
  dimensions?: DimensionsType;
};

const AwesomeButtonSocial = ({
  onPress = null,
  children = null,
  icon = true,
  sharer = {},
  dimensions = {
    width: 640,
    height: 480,
  },
  type,
  ...extra
}: SocialButtonType & ButtonType) => {
  const isWindow = typeof window !== 'undefined';
  const mobile = React.useRef(isMobile()).current;

  const getUrl = () => {
    if (sharer?.url) {
      return sharer.url;
    }
    if (isWindow) {
      return window.location.href;
    }
    return null;
  };

  const getMessage = () => {
    if (sharer?.message) {
      return sharer.message;
    }
    if (isWindow) {
      const message = document.querySelector('title');
      if (message?.innerHTML) {
        return message.innerHTML;
      }
    }
    return null;
  };

  const getImage = () => {
    if (sharer?.image) {
      return sharer.image;
    }
    if (isWindow !== null) {
      const img = document.querySelector('meta[property="og:image"]');
      if (img) {
        return img.getAttribute('content');
      }
    }
    return null;
  };

  const handlePress = (event: React.MouseEvent) => {
    if (onPress) {
      onPress(event);
      return;
    }

    if (extra.href) {
      return;
    }

    // @ts-ignore
    const sharerData = Sharer({
      height: dimensions?.height,
      width: dimensions?.width,
      url: getUrl(),
      message: getMessage(),
      image: getImage(),
      type,
      user: sharer.user,
      phone: sharer.phone,
    });

    if (!sharerData?.url) {
      return;
    }

    if (navigator?.share && mobile) {
      navigator.share({
        url: sharerData.url,
        text: sharerData.text,
        title: sharerData.title,
      });
      return;
    }

    if (isWindow) {
      window.open(sharerData.url, sharerData.title, sharerData.extra);
    }
  };

  const renderIcon = () => {
    if (!icon) {
      return null;
    }
    return getIcon({
      type,
      width: icon === true ? ICON_SIZE : icon.width || ICON_SIZE,
      height: icon === true ? ICON_SIZE : icon.height || ICON_SIZE,
      color: extra.disabled ? 'rgba(255,255,255,0.35)' : '#FFF',
    });
  };

  return (
    <AwesomeButton
      type={type}
      onPress={handlePress}
      {...extra}
      before={renderIcon()}>
      {children}
    </AwesomeButton>
  );
};

export default AwesomeButtonSocial;
