import React, { useContext, createContext, useState, useRef } from 'react';

const INITIAL = {
  handlePopover: null,
  popoverOpened: null,
  popoverText: '',
};

export const DemoContext = createContext({ ...INITIAL });

export const useDemoContext = () => {
  return useContext(DemoContext);
};

export const DemoProvider = ({ children }) => {
  const [state, setStateValue] = useState({ ...INITIAL });
  const stateRef = useRef({ ...INITIAL });

  const setPopoverText = value => {
    setState({ popoverText: value });
  };

  const getPopoverText = () => {
    return stateRef.current.popoverText;
  };

  const getPopoverState = () => {
    return stateRef.current.popoverOpened;
  };

  const setPopoverOpened = value => {
    setState({ popoverOpened: value });
  };

  const openPopover = ({ text }) => {
    setState({ popoverOpened: true, popoverText: text });
  };

  const closePopover = () => {
    setState({ popoverOpened: false });
  };

  const setState = newState => {
    stateRef.current = {
      ...stateRef.current,
      ...newState,
    };
    setStateValue(stateRef.current);
  };

  return (
    <DemoContext.Provider
      value={{
        getPopoverText,
        setPopoverText,
        getPopoverState,
        setPopoverOpened,
        openPopover,
        closePopover,
        isPopoverOpened: state.popoverOpened,
        popoverText: state.popoverText,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};
