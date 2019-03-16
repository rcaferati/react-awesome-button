import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { List } from './ui';
import { THEMES, MODULES } from '../demo/helpers/modules';
import { AwesomeButton } from '../src/index';

const themes = storiesOf('Themes', module);

const renderTheme = (module) => (
  <List>
    <AwesomeButton size="medium" type="primary" cssModule={module}>
      Primary
    </AwesomeButton>
    <AwesomeButton size="medium" type="secondary" cssModule={module}>
      Secondary
    </AwesomeButton>
    <AwesomeButton size="medium" type="link" cssModule={module}>
      Link
    </AwesomeButton>
    <AwesomeButton size="medium" disabled cssModule={module}>
      Disabled
    </AwesomeButton>
    <AwesomeButton size="medium" disabled placeholder cssModule={module} />
  </List>
);

themes.addDecorator(centered);

THEMES.forEach((theme) => {
  themes.add(theme, () => renderTheme(MODULES[theme]));
});
