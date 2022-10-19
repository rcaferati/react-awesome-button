// @ts-ignore
import { setCssEndEvent } from 'web-animation-club';

const POSITION_STATES = ['middle', 'left', 'right'];

export function serialize(obj: any, separator = '&') {
  return Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join(separator);
}

export function classToModules(className: any = [], cssModule: any) {
  if (!cssModule) {
    return className.join(' ').trim();
  }
  const ClassName = [];
  let i = className.length;
  // eslint-disable-next-line
  while (i--) {
    if (cssModule[className[i]]) {
      ClassName.push(cssModule[className[i]]);
    }
  }
  return ClassName.join(' ').trim();
}

export function getClassName(className = '', cssModule: any) {
  if (cssModule) {
    return cssModule[className] || className;
  }
  return className;
}

export function toggleMoveClasses({
  element,
  root,
  cssModule = null,
  state = null,
}: any) {
  if (!element) {
    return false;
  }
  if (!state) {
    element.classList.remove(
      classToModules([`${root}--${POSITION_STATES[0]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[1]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[2]}`], cssModule)
    );
    return false;
  }
  const options = POSITION_STATES.filter((item) => item !== state);
  let i = options.length;
  // eslint-disable-next-line
  while (i--) {
    element.classList.remove(
      classToModules([`${root}--${options[i]}`], cssModule)
    );
  }
  element.classList.add(classToModules([`${root}--${state}`], cssModule));
  return true;
}

export function createRippleEffect({ event, button, content, className }: any) {
  const bounds = button.getBoundingClientRect();
  const top = window.pageYOffset || document.documentElement.scrollTop || 0;
  const bubble = document.createElement('span');
  const size = bounds.width < 50 ? bounds.width * 3 : bounds.width * 2;
  bubble.className = className;
  bubble.style.top = `-${size / 2 - (event.pageY - bounds.top - top)}px`;
  bubble.style.left = `-${size / 2 - (event.pageX - bounds.left)}px`;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  setCssEndEvent(bubble, 'animation', () => {
    window.requestAnimationFrame(() => {
      content.removeChild(bubble);
    });
  });
  window.requestAnimationFrame(() => {
    content.appendChild(bubble);
  });
}
