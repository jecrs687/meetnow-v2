// src/components/Header.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import "./Header.css";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: "Teresina",
    location: "Teresina",
    locationDetails: "PI",
  },
};
