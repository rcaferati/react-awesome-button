import React from 'react';
import renderer from 'react-test-renderer';
import '../helpers/tests';
import { AwesomeButton, AwesomeButtonProgress } from '../index';

test('Should render a simple primary button', () => {
  const component = renderer.create(<AwesomeButton>Button</AwesomeButton>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should render a simple secondary button', () => {
  const component = renderer.create(<AwesomeButton type="secondary">Button</AwesomeButton>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should render a button without moveEvents', () => {
  const component = renderer.create(<AwesomeButton moveEvents={false}>Button</AwesomeButton>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Button changes on mouse down -> up -> leave', () => {
  const component = renderer.create(<AwesomeButton>Button</AwesomeButton>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.onMouseDown();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.onMouseUp();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.onMouseLeave();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
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
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.onMouseDown();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
