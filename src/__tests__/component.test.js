import React from 'react';
import { shallow } from 'enzyme';
import { AwesomeButton, AwesomeButtonProgress } from '../index';

describe('Examining the syntax of Jest tests', () => {
  it('renders without crashing', () => {
    shallow(<AwesomeButton />);
  });

  it('renders without crashing', () => {
    shallow(<AwesomeButtonProgress />);
  });

  it('Should render a simple primary button', () => {
    const component = shallow(<AwesomeButton>Button</AwesomeButton>);
    expect(component).toMatchSnapshot();
  });

  it('Should render a simple secondary button', () => {
    const component = shallow(<AwesomeButton type="secondary">Button</AwesomeButton>);
    expect(component).toMatchSnapshot();
  });

  it('Should render a button without moveEvents', () => {
    const component = shallow(<AwesomeButton moveEvents={false}>Button</AwesomeButton>);
    expect(component).toMatchSnapshot();
  });

  it('Should render a button with a progress bar', () => {
    const component = shallow(
      <AwesomeButtonProgress
        action={(element, next) => {
          next();
        }}
      >
        Button
      </AwesomeButtonProgress>);
    expect(component).toMatchSnapshot();
  });
});


