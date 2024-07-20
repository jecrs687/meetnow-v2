// src/components/PlaceCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import PlaceCard from './PlaceCard';

const meta: Meta<typeof PlaceCard> = {
  title: 'Components/PlaceCard',
  component: PlaceCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    image: { control: 'text' },
    title: { control: 'text' },
    rating: { control: 'number' },
    showFavorite: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: 'https://via.placeholder.com/200',
    title: 'Coco Bambu',
    rating: 4.1,
    showFavorite: true,
  },
};
