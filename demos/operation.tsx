import React, { useEffect, useState } from 'react';
import Tree from '../src';

type CustomData = { id: string; name: string; children?: CustomData[] };
const treeData: CustomData[] = [
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
  const treeRef = Tree.useTree<CustomData>();

  const [target, setTarget] = useState<string>();
  const [parent, setParent] = useState<string>();

  const setData = () => {
    treeRef.current.setData(treeData);
  };

  const getNodeData = () => {
    const id = Math.random()
      .toString()
      .slice(-9);
    const data = { id, name: `node-${id}` };
    return data;
  };

  const insert = () => {
    const data = getNodeData();
    treeRef.current.insert(data, n => n.data.id === parent);
    setParent('');
  };

  const remove = () => {
    treeRef.current.remove(n => n.data.id === target);
    setTarget('');
  };

  const update = () => {
    const data = getNodeData();
    treeRef.current.update(data, n => n.data.id === target);
    setTarget('');
  };

  const move = () => {
    treeRef.current.move(
      n => n.data.id === target,
      n => n.data.id === parent
    );
    setTarget('');
    setParent('');
  };

  const insertToRoot = () => {
    const data = getNodeData();
    treeRef.current.insert(data, n => n.key === Tree.ROOT);
  };

  return (
    <div>
      <button onClick={setData}>reset tree data</button>
      <button onClick={insertToRoot}>insert at first floor</button>
      <div>
        <input
          placeholder="node id"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <button onClick={remove}>remove</button>
        <button onClick={update}>update</button>
      </div>
      <div>
        <input
          placeholder="parent id"
          value={parent}
          onChange={e => setParent(e.target.value)}
        />
        <button onClick={insert}>insert</button>
      </div>
      <div>
        <input
          placeholder="node id"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <input
          placeholder="parent id"
          value={parent}
          onChange={e => setParent(e.target.value)}
        />
        <button onClick={move}>move</button>
      </div>
      <Tree
        ref={treeRef}
        dataKeyMap={{ key: 'id', title: 'name' }}
        treeData={treeData}
      />
    </div>
  );
};

export default Operation;
