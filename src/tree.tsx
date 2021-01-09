import React from 'react';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css'

const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      {
        key: '0-0-0',
        title: 'parent 1-1',
        children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }],
      },
    ],
  },
];

const Tree = () => {
  return <RcTree treeData={treeData} />;
};

export default Tree;
