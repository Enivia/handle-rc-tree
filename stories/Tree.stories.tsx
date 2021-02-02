import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tree from '../src';
import Basic from '../demos/basic';
import Operation from '../demos/operation';
import AsyncData from '../demos/async-data';

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  // parameters: {
  //   controls: { expanded: true },
  //   docs: {
  //     source: {
  //       code: 'Some custom string here',
  //     },
  //   },
  // },
};

export default meta;

export const basic: Story = () => <Basic />;
export const operation: Story = () => <Operation />;
export const asyncData: Story = () => <AsyncData />;
