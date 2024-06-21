// src/components/Tabs.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabs = [
  { label: 'Bares', content: <div>Conteúdo dos Bares</div> },
  { label: 'Baladas', content: <div>Conteúdo das Baladas</div> },
  { label: 'Eventos', content: <div>Conteúdo dos Eventos</div> },
  { label: 'Raves', content: <div>Conteúdo das Raves</div> },
];

export const Default: Story = {
  args: {
    tabs: tabs,
  },
};
