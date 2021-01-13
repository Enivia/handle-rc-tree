import React, { useEffect, useState } from 'react';
import Tree from '../src';

const treeData = [
  {
    id: '1',
    name: 'node 1',
    children: [
      {
        id: '1-1',
        name: 'node 1-1',
        children: [{ id: '1-1-1', name: 'node 1-1-1' }],
      },
      {
        id: '1-2',
        name: 'node 1-2',
      },
    ],
  },
  { id: '2', name: 'node 2', children: [] },
];

const Operation = () => {
  const treeRef = Tree.useTree();

  const [target, setTarget] = useState<string>();
  const [parent, setParent] = useState<string>();

  useEffect(() => {
    treeRef.current.data(treeData);
  }, []);

  const remove = () => {
    treeRef.current.remove(node => node.key === target);
  };

  const move = () => {
    treeRef.current.move(
      node => node.key === target,
      node => node.key === parent
    );
  };

  return (
    <div>
      <div>
        <input
          placeholder="node id"
          onChange={e => setTarget(e.target.value)}
        />
        <input
          placeholder="parent id"
          onChange={e => setParent(e.target.value)}
        />
      </div>
      <button>insert</button>
      <button onClick={remove}>remove</button>
      <button>update</button>
      <button onClick={move}>move</button>

      <Tree ref={treeRef} dataKeyMap={{ key: 'id', title: 'name' }} />
    </div>
  );
};

export default Operation;
