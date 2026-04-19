import type { Meta, StoryObj } from '@storybook/react-webpack5';

import AwesomeButton from '../../components/AwesomeButton';
import themeRed from '../../styles/themes/theme-red';
import ThemeAwesomeButtonShowcase, {
  resolveThemeModule,
} from './ThemeAwesomeButtonShowcase';

const meta: Meta<typeof AwesomeButton> = {
  title: 'Themes/Red',
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
      themeLabel="Red"
      cssModule={resolveThemeModule(themeRed)}
    />
  ),
};
