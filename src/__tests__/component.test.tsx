import React from 'react';
import { create } from 'react-test-renderer';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from '../index';

describe('Examining the syntax of Jest tests', () => {
  it('renders AB without crashing', () => {
    const tree = create(<AwesomeButton />);
    expect(tree).toMatchSnapshot();
  });

  it('renders ABP without crashing', () => {
    const tree = create(<AwesomeButtonProgress onPress={() => null} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders ABS without crashing', () => {
    const tree = create(<AwesomeButtonSocial />);
    expect(tree).toMatchSnapshot();
  });

  it('Should render a primary button', () => {
    const tree = create(<AwesomeButton>Button</AwesomeButton>);
    expect(tree).toMatchSnapshot();
  });

  it('Should render a secondary button', () => {
    const tree = create(<AwesomeButton type="secondary">Button</AwesomeButton>);
    expect(tree).toMatchSnapshot();
  });

  it('Should render a button without moveEvents', () => {
    const tree = create(
      <AwesomeButton moveEvents={false}>Button</AwesomeButton>
    );
    expect(tree).toMatchSnapshot();
  });

  it('Should render a button with a progress bar', () => {
    const tree = create(
      <AwesomeButtonProgress
        onPress={(e, next) => {
          next();
        }}>
        Button
      </AwesomeButtonProgress>
    );
    expect(tree).toMatchSnapshot();
  });
});
