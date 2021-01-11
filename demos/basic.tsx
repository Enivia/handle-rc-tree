import React, { useEffect } from 'react';
import Tree from '../src';

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

const Basic = () => {
  const treeRef = Tree.useTree();

  useEffect(() => {
    treeRef.current.data(treeData);
  }, []);

  return <Tree ref={treeRef} />;
};

export default Basic;
