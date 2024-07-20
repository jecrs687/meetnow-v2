// src/components/SearchInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SearchInput  from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Find places',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Find places',
    value: 'Sample text',
  },
};
