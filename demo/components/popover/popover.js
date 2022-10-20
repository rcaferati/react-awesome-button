import React, { useRef, useEffect } from 'react';
import styles from './popover.scss';
import { setCssEndEvent } from '../../helpers/examples';
import { AwesomeButton } from '../../../src/index.ts';
import { useDemoContext } from '../../context';

const Popover = () => {
  const {
    isPopoverOpened,
    popoverText,
    cssModule,
    closePopover,
  } = useDemoContext();
  const animating = useRef(false);
  const toggleTimer = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    toggleVisibility(isPopoverOpened);
  }, [isPopoverOpened]);

  useEffect(() => {
    return () => {
      clearTimeout(toggleTimer.current);
    };
  }, []);

  const toggleVisibility = (toggle, timed) => {
    if (animating.current) {
      if (timed) {
        return;
      }
      toggleTimer.current = setTimeout(() => {
        toggleVisibility(toggle, true);
      }, 175);
      return;
    }
    animating.current = true;
    const element = container.current;
    if (toggle === true) {
      element.classList.add(styles.show);
      setCssEndEvent(element, 'animation').then(() => {
        animating.current = false;
      });
      return;
    }
    element.classList.add(styles.hide);
    setCssEndEvent(element, 'animation').then(() => {
      element.classList.remove(styles.show);
      element.classList.remove(styles.hide);
      animating.current = false;
    });
  };

  return (
    <div
      ref={container}
      className={styles.container}
    >
      <div className={styles.window}>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{
            __html: popoverText,
          }}
        />
        <div className={styles.control}>
          <AwesomeButton
            size="medium"
            type="secondary"
            cssModule={cssModule}
            onPress={closePopover}
          >
            Close
          </AwesomeButton>
        </div>
      </div>
    </div>
  );
};

export default Popover;
