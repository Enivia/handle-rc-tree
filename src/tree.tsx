import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

import { TreeInstance, TreeProps } from './interface';
import Node from './node';
import Utils from './utils';
import useDataKeyMap from './hooks/use-data-key-map';
import useTree from './hooks/use-tree';

const ROOT = 'EASY_RC_TREE_ROOT';

export interface ITree
  extends ForwardRefExoticComponent<
    PropsWithoutRef<TreeProps> & RefAttributes<TreeInstance>
  > {
  useTree: typeof useTree;
  ROOT: typeof ROOT;
}

const Tree: ITree = forwardRef<TreeInstance, TreeProps>((props, ref) => {
  const { dataKeyMap: keymap, ...rest } = props;
  const dataKeyMap = useDataKeyMap(keymap);
  const [root, setRoot] = useState<Node>();

  const data = useCallback((data: object[]) => {
    const rootNode = new Node();
    rootNode.key = ROOT;
    rootNode.isRoot = true;
    const children = Utils.from(data, dataKeyMap);
    children.forEach(child => rootNode.addChild(child));
    setRoot(rootNode);
  }, []);

  useImperativeHandle(ref, () => ({
    data,
  }));

  return <RcTree {...rest} treeData={root?.children} />;
}) as ITree;

Tree.useTree = useTree;
Tree.ROOT = ROOT;

export default Tree;
