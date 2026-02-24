import React from 'react';
import { create } from 'react-test-renderer';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from '../index';

describe('Public API smoke tests', () => {
  it('renders AwesomeButton without crashing', () => {
    const tree = create(<AwesomeButton />);
    expect(tree).toMatchSnapshot();
  });

  it('renders AwesomeButtonProgress without crashing', () => {
    const tree = create(
      <AwesomeButtonProgress onPress={(_event, next) => next(true)} />
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders AwesomeButtonSocial without crashing', () => {
    const tree = create(<AwesomeButtonSocial />);
    expect(tree).toMatchSnapshot();
  });

  it('renders a primary button', () => {
    const tree = create(<AwesomeButton>Button</AwesomeButton>);
    expect(tree).toMatchSnapshot();
  });

  it('renders a secondary button', () => {
    const tree = create(<AwesomeButton type="secondary">Button</AwesomeButton>);
    expect(tree).toMatchSnapshot();
  });

  it('renders a button without moveEvents', () => {
    const tree = create(
      <AwesomeButton moveEvents={false}>Button</AwesomeButton>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a progress button with explicit success completion', () => {
    const tree = create(
      <AwesomeButtonProgress
        onPress={(_event, next) => {
          next(true);
        }}>
        Button
      </AwesomeButtonProgress>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders AwesomeButton with before/after slots', () => {
    const tree = create(
      <AwesomeButton
        before={<span aria-hidden="true">←</span>}
        after={<span aria-hidden="true">→</span>}>
        Continue
      </AwesomeButton>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders AwesomeButtonSocial with sharer props', () => {
    const tree = create(
      <AwesomeButtonSocial
        type="github"
        sharer={{
          url: 'https://example.com',
          message: 'Check this out',
        }}>
        GitHub
      </AwesomeButtonSocial>
    );
    expect(tree).toMatchSnapshot();
  });
});
