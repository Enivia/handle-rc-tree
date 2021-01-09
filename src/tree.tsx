import React, { FC } from 'react';
import { TreeProps } from './interface';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

const Tree: FC<TreeProps> = props => {
  return <RcTree {...props} />;
};

export default Tree;
