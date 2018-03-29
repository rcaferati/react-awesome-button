import React from 'react';
import { ThemeTest } from '../../components';
import Modules from '../../helpers/modules';
import { features, properties, examples } from '../common';

const THEME = 'theme-rickiest';

const items = examples(THEME);

const component = (
  <ThemeTest theme={THEME} />
);

const module = Modules.Modules[THEME];

const example = {
  title: 'Pass the butter.',
  items,
  component,
  componentClass: Modules.Modules['theme-rickiest']['aws-btn'],
};

export default {
  features,
  example,
  module,
  properties,
};
