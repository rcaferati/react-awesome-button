import type { Meta, StoryObj } from '@storybook/react-webpack5';

import AwesomeButton from '../../components/AwesomeButton';
import themeIndigo from '../../styles/themes/theme-indigo';
import ThemeAwesomeButtonShowcase, {
  resolveThemeModule,
} from './ThemeAwesomeButtonShowcase';

const meta: Meta<typeof AwesomeButton> = {
  title: 'Themes/Indigo',
  component: AwesomeButton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <ThemeAwesomeButtonShowcase
      themeLabel="Indigo"
      cssModule={resolveThemeModule(themeIndigo)}
    />
  ),
};
