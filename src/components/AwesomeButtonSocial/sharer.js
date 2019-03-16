import { serialize } from '../../helpers/components';

function centerWindow(width, height) {
  if (typeof window === 'undefined') {
    return {
      top: 0,
      left: 0,
    };
  }
  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const screenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
  const windowWidth = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const windowHeight = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;
  return {
    top: windowHeight / 2 - height / 2 + screenTop,
    left: windowWidth / 2 - width / 2 + screenLeft,
  };
}

export default function Sharer({ url, message, title, image, user, type, phone, width, height }) {
  const args = {};
  const params = {};
  switch (type) {
    case 'facebook':
      params.s = 100;
      params['p[url]'] = url;
      args.url = `https://www.facebook.com/sharer.php?${serialize(params, '&')}`;
      args.title = 'Facebook Sharer';
      break;
    case 'twitter':
      params.text = message;
      params.url = url;
      args.height = 250;
      args.url = `https://twitter.com/share?${serialize(params, '&')}`;
      args.title = 'Twitter Sharer';
      break;
    case 'pinterest':
      params.url = url;
      if (image) {
        params.media = image;
      }
      args.url = `https://pinterest.com/pin/create/button/?${serialize(params, '&')}`;
      args.title = 'Pinterest Sharer';
      break;
    case 'google':
    case 'gplus':
      params.url = url;
      args.url = `https://plus.google.com/share?${serialize(params, '&')}`;
      args.title = 'Google+ Sharer';
      args.width = 400;
      break;
    case 'linkedin':
      params.mini = true;
      params.url = url;
      params.title = message || title;
      args.url = `https://www.linkedin.com/shareArticle?${serialize(params, '&')}`;
      args.title = 'Linkedin Sharer';
      break;
    case 'reddit':
      params.url = url;
      params.title = message || title;
      args.url = `https://www.reddit.com/submit?${serialize(params, '&')}`;
      args.title = '';
      args.width = 850;
      break;
    case 'whatsapp':
      params.phone = phone.replace(/\+|(|)/gim, '');
      params.title = message || title;
      args.url = `https://api.whatsapp.com/send?${serialize(params, '&')}`;
      args.title = 'Whatsapp Message';
      args.width = 850;
      break;
    case 'messenger':
      args.url = `https://m.me/${user}`;
      args.title = 'Messenger Message';
      args.width = 850;
      break;
    case 'mail':
      args.url = `mailto:${url}`;
      args.title = '_self';
      break;
    case 'instagram':
      args.url = url;
      args.title = '_self';
      break;
    default:
      return args;
  }

  args.extra = serialize(
    {
      width: `${args.width || width}px`,
      height: `${args.height || height}px`,
      ...centerWindow(args.width || width, args.height || height),
    },
    ','
  );

  return args;
}
