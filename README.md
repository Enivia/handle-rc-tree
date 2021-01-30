# handle-rc-tree

> use [rc-tree](https://github.com/react-component/tree) more simply

## Feature

There is no need to maintain a complex tree data structure externally, and you can easily use the API to update the tree.

## Example

run `yarn` & `yarn storybook`: http://localhost:6006/

## Install

## Usage

```tsx
import Tree from 'handle-rc-tree';

const App = () => {
  const treeRef = Tree.useTree();
  return <Tree ref={treeRef} />;
};
```

## API

| name   | description   | type                                           |
| ------ | ------------- | ---------------------------------------------- |
| data   | set tree data | `function(data): void`                         |
| insert | insert node   | `function(node, callback): void`               |
| remove | remove node   | `function(callback): void`                     |
| update | update node   | `function(node, callback): void`               |
| move   | move node     | `function(nodeCallback, parentCallback): void` |
