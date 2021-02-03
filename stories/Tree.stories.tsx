import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tree from '../src';
import BasicDemo from '../demos/basic';
import OperationDemo from '../demos/operation';
import AsyncDataDemo from '../demos/async-data';

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  // parameters: {
  //   docs: {
  //     source: {
  //       type: 'code'
  //     }
  //   }
  // }
};

export default meta;

export const Basic: Story = args => <BasicDemo {...args} />;
export const Operation: Story = args => <OperationDemo {...args} />;
export const AsyncData: Story = args => <AsyncDataDemo {...args} />;
