import React from 'react';
import Tree from '../src';

const treeData = [
  {
    key: '1',
    title: 'parent 1',
  },
];

const AsyncData = () => {
  function onLoadData({ key }: any) {
    return new Promise<object[]>(resolve => {
      setTimeout(() => {
        resolve([{ title: `child-${key}-1`, key: `${key}-1` }]);
      }, 1000);
    });
  }

  return <Tree treeData={treeData} onLoadData={onLoadData} />;
};

export default AsyncData;
