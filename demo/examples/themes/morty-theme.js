import React from 'react';
import { ThemeTest } from '../../components';
import Modules from '../../helpers/modules';
import { features, properties, examples } from '../common';

const THEME = 'theme-c137';

const items = examples(THEME);

const component = (
  <ThemeTest theme={THEME} />
);

const module = Modules.Modules[THEME];

const example = {
  title: 'Get your shit together.',
  description: 'AwesomeButton Generic Example',
  items,
  component,
  componentClass: Modules.Modules['theme-c137']['aws-btn'],
};

export default {
  features,
  example,
  module,
  properties,
};
