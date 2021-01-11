import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tree from '../src';
import BasicDemo from '../demos/basic';
import OperationDemo from '../demos/operation';

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const Basic: Story = () => <BasicDemo />;
export const Operation: Story = () => <OperationDemo />;
