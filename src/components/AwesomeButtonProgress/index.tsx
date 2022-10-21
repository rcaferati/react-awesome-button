import * as React from 'react';
import {
  onceTransitionEnd,
  beforeFutureCssLayout as frameThrower,
  setCssEndEvent,
  // @ts-ignore
} from 'web-animation-club';
import AwesomeButton, { ButtonType } from '../AwesomeButton';
import { getClassName } from '../../helpers/components';

const ROOTELM = 'aws-btn';
const LOADING_ANIMATION_STEPS = 3;
const IS_WINDOW = typeof window !== 'undefined';

const useStateSync = (initial: any) => {
  const [value, setValue] = React.useState(initial);
  const ref = React.useRef(initial);

  const setSyncValue = (newValue: any) => {
    const newState = {
      ...ref.current,
      ...newValue,
    };

    ref.current = newState;
    setValue(newState);
  };

  return [value, setSyncValue, ref.current];
};

type ButtonTypeModified = Omit<ButtonType, 'onPress'>;

export type ButtonProgressType = {
  onPress: (event: React.MouseEvent, next: () => void) => void;
  loadingLabel?: string;
  resultLabel?: string;
  releaseDelay?: number;
};

const AwesomeButtonProgress = ({
  onPress = null,
  rootElement = null,
  loadingLabel = 'Wait..',
  resultLabel = 'Success!',
  disabled = false,
  cssModule = null,
  children = null,
  size = null,
  type = null,
  releaseDelay = 500,
  ...extra
}: ButtonProgressType & ButtonTypeModified) => {
  const root = rootElement || ROOTELM;
  const timeout = React.useRef(null);
  const content = React.useRef(null);
  const [state, setState, stateRef] = useStateSync({
    loadingEnd: false,
    loadingStart: false,
    loadingError: false,
    errorLabel: null,
    active: false,
  });

  React.useEffect(() => {
    return () => {
      if (timeout?.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const getRootClassName = () => {
    const { loadingStart, loadingEnd, loadingError } = stateRef;
    const className = [
      (loadingStart && `${root}--start`) || null,
      (loadingEnd && `${root}--end`) || null,
      (loadingError && `${root}--errored`) || null,
      `${root}--progress`,
    ];

    return className.join(' ').trim().replace(/[\s]+/gi, ' ');
  };

  const endLoading = (endState = true, errorLabel: any = null) => {
    setState({
      loadingEnd: true,
      loadingError: !endState,
      errorLabel,
    });
  };

  const startLoading = () => {
    frameThrower(4, () => {
      setState({
        loadingStart: true,
      });
    });
  };

  const clearLoading = (callback: any) => {
    setState({
      loadingStart: false,
      loadingEnd: false,
      active: false,
    });
    frameThrower(2, callback);
  };

  const clearStagedWrapperAnimation = () => {
    timeout.current = setTimeout(() => {
      if (!IS_WINDOW) {
        return;
      }
      frameThrower(2, () => {
        clearLoading(() => {
          setState({
            loadingError: false,
            errorLabel: null,
          });
        });
      });
    }, releaseDelay);
  };

  const handleActivation = React.useCallback(() => {
    setState({
      active: true,
    });
  }, [setState]);

  const handleAction = async (event: React.MouseEvent) => {
    if (stateRef?.loadingStart === true) {
      return;
    }

    startLoading();
    await onceTransitionEnd(content.current);
    onPress && onPress(event, endLoading);
    setCssEndEvent(content.current, 'transition', {
      tolerance: LOADING_ANIMATION_STEPS,
    }).then(clearStagedWrapperAnimation);
  };

  const { active, errorLabel } = stateRef;

  return (
    <AwesomeButton
      size={size}
      type={type}
      className={getRootClassName()}
      onPress={handleAction}
      onMouseDown={handleActivation}
      cssModule={cssModule}
      active={active}
      extra={
        <span>
          <span
            ref={content}
            data-loading={loadingLabel || null}
            data-status={errorLabel || resultLabel || null}
            className={getClassName(`${root}__progress`, cssModule)}></span>
        </span>
      }
      {...extra}>
      <span>{children}</span>
    </AwesomeButton>
  );
};

export default AwesomeButtonProgress;
