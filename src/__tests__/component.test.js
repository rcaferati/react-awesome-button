import React from 'react';
import renderer from 'react-test-renderer';
import '../helpers/tests';
import { AwesomeButton, AwesomeButtonProgress } from '../index';

test('Should render a simple primary button', () => {
  const component = renderer.create(<AwesomeButton>Button</AwesomeButton>);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Should render a simple secondary button', () => {
  const component = renderer.create(<AwesomeButton type="secondary">Button</AwesomeButton>);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Should render a button without moveEvents', () => {
  const component = renderer.create(<AwesomeButton moveEvents={false}>Button</AwesomeButton>);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Button changes on mouse down -> up -> leave', () => {
  const component = renderer.create(<AwesomeButton>Button</AwesomeButton>);
  expect(component.toJSON()).toMatchSnapshot();

  const span = component.root.findByType('button');

  span.props.onMouseDown();
  expect(component.toJSON()).toMatchSnapshot();

  span.props.onMouseUp();
  expect(component.toJSON()).toMatchSnapshot();

  span.props.onMouseLeave();
  expect(component.toJSON()).toMatchSnapshot();
});

test('Should render a button with a progress bar', () => {
  const component = renderer.create(
    <AwesomeButtonProgress
      action={(element, next) => {
        next();
      }}
    >
      Button
    </AwesomeButtonProgress>);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Should activate a progress bar button onMouseDown', () => {
  const component = renderer.create(
    <AwesomeButtonProgress
      action={(element, next) => {
        next();
      }}
    >
      Button
    </AwesomeButtonProgress>);
  component.root.findByType('button').props.onMouseDown();
  expect(component.toJSON()).toMatchSnapshot();
});
