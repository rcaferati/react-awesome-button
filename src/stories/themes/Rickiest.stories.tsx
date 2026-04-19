import type { Meta, StoryObj } from '@storybook/react-webpack5';

import AwesomeButton from '../../components/AwesomeButton';
import themeRickiest from '../../styles/themes/theme-rickiest';
import ThemeAwesomeButtonShowcase, {
  resolveThemeModule,
} from './ThemeAwesomeButtonShowcase';

const meta: Meta<typeof AwesomeButton> = {
  title: 'Themes/Rickiest',
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
      themeLabel="Rickiest"
      cssModule={resolveThemeModule(themeRickiest)}
    />
  ),
};
