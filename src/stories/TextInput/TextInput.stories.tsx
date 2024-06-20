// src/components/TextInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import TextInput from './TextInput';
import { FaRegUser, FaRegEnvelope, FaRegClock, FaPhone } from 'react-icons/fa';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
    type: { control: 'text' },
    icon: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithUserIcon: Story = {
  args: {
    label: 'Nome Completo',
    placeholder: 'Digite seu nome',
    value: 'Elephant',
    icon: <FaRegUser />,
  },
};

export const WithEmailIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Digite seu email',
    value: 'elephant@thepycs.com',
    type: 'email',
    icon: <FaRegEnvelope />,
  },
};

export const WithPhoneIcon: Story = {
  args: {
    label: 'Telefone',
    placeholder: 'Digite seu telefone',
    value: '+233 55 706 7955',
    type: 'tel',
    icon: <FaPhone />,
  },
};

export const WithPasswordIcon: Story = {
  args: {
    label: 'Senha',
    placeholder: 'Digite sua senha',
    value: '************',
    type: 'password',
    icon: <FaRegClock />,
  },
};

export const WithoutIcon: Story = {
  args: {
    label: 'Sem Ícone',
    placeholder: 'Digite algo',
    value: '',
  },
};
