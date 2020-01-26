// Type definitions for react-awesome-button
// Project: https://github.com/rcaferati/react-awesome-button
// Definitions by: Rafael Caferati <https://github.com/rcaferati>
// TypeScript Version: 3.0.0

declare module 'react-awesome-button' {
  import React, { Component } from 'react';

  export interface AwesomeButtonProps {
    action?(): void;
    active: boolean;
    blocked: boolean;
    children: React.ReactNode;
    className: string;
    cssModule: object;
    disabled: boolean;
    element?(): void;
    href: string;
    moveEvents: boolean;
    onPress?(): void;
    onReleased?(): void;
    placeholder: boolean;
    ripple: boolean;
    rootElement: string;
    size: string;
    style: object;
    target: string;
    title: string;
    to: string;
    type: string;
    visible: boolean;
  }

  export default class AwesomeButton extends Component<
    AwesomeButtonProps,
    {}
  > {}

  export interface AwesomeButtonProgressProps {
    action?(): void;
    children: React.ReactNode;
    cssModule: object;
    disabled: boolean;
    fakePress: boolean;
    loadingLabel: string;
    onPress?(): void;
    releaseDelay: number;
    resultLabel: string;
    rootElement: React.ReactNode;
    size: string;
    type: string;
  }

  export default class AwesomeButtonProgress extends Component<
    AwesomeButtonProgressProps,
    {}
  > {}

  export interface AwesomeButtonSocialProps {
    action?(): void;
    children: React.ReactNode;
    disabled: boolean;
    href: string;
    icon: boolean;
    iconHeight: number;
    iconWidth: number;
    image: string;
    message: string;
    onPress?(): void;
    phone: string;
    type: string;
    url: string;
    user: string;
  }

  export default class AwesomeButtonSocial extends Component<
    AwesomeButtonSocialProps,
    {}
  > {}
}
