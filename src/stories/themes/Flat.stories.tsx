import type { Meta, StoryObj } from '@storybook/react-webpack5';

import AwesomeButton from '../../components/AwesomeButton';
import themeFlat from '../../styles/themes/theme-flat';
import ThemeAwesomeButtonShowcase, {
  resolveThemeModule,
} from './ThemeAwesomeButtonShowcase';

const meta: Meta<typeof AwesomeButton> = {
  title: 'Themes/Flat',
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
      themeLabel="Flat"
      cssModule={resolveThemeModule(themeFlat)}
    />
  ),
};
