// TablesCards.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import './TablesCards.css';
import TablesCards from './TablesCards';

const meta = {
  title: 'Components/TablesCards',
  component: TablesCards,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    avatar: { control: 'text' },
  },
} satisfies Meta<typeof TablesCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Fernando',
    age: 23,
    description: 'Ambiente agradável. Em busca de companhia e beber uma cerveja.',
    participants: 5,
    avatar: 'https://i.imgur.com/YcP0tik.jpeg',
  },
};
