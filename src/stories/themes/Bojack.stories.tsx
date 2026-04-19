import type { Meta, StoryObj } from '@storybook/react-webpack5';

import AwesomeButton from '../../components/AwesomeButton';
import themeBojack from '../../styles/themes/theme-bojack';
import ThemeAwesomeButtonShowcase, {
  resolveThemeModule,
} from './ThemeAwesomeButtonShowcase';

const meta: Meta<typeof AwesomeButton> = {
  title: 'Themes/Bojack',
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
      themeLabel="Bojack"
      cssModule={resolveThemeModule(themeBojack)}
    />
  ),
};
