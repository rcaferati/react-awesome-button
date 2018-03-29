import React from 'react';
import { ThemeTest } from '../../components';
import Modules from '../../helpers/modules';
import { features, properties, examples } from '../common';

const THEME = 'theme-blue';

const items = examples(THEME);

const component = (
  <ThemeTest theme={THEME} />
);

const module = Modules.Modules[THEME];

const example = {
  title: 'Blue Theme',
  items,
  component,
  componentClass: Modules.Modules['theme-blue']['aws-btn'],
};

export default {
  features,
  module,
  example,
  properties,
};
