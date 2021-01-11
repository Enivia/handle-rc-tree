import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useCallback,
  useImperativeHandle,
} from 'react';
import { useImmer } from 'use-immer';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

import { NodeCallback, ROOT, TreeInstance, TreeProps } from './interface';
import Node from './node';
import Utils from './utils';
import useDataKeyMap from './hooks/use-data-key-map';
import useTree from './hooks/use-tree';

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
  const [root, setRoot] = useImmer<Node>(Utils.createRoot());

  const $update = useCallback((callback: (draft: Node) => void) => {
    try {
      setRoot(draft => callback(draft));
    } catch (e) {}
  }, []);

  const findNode = useCallback((root: Node, callback: NodeCallback) => {
    if (!callback) throw Error('callback is empty');

    const node = Utils.find(root, callback);
    if (!node) throw Error('cannot find node');
    return node;
  }, []);

  const data = useCallback((data: object[]) => {
    setRoot(draft => {
      draft.children = [];
      const children = Utils.from(data, dataKeyMap);
      children.forEach(child => draft.addChild(child));
    });
  }, []);

  const insert = useCallback((node: object, callback: NodeCallback) => {
    $update(draft => {
      if (!node) return;
      const parent = findNode(draft, callback);
      const treeNode = Utils.format(node, dataKeyMap);
      parent.addChild(treeNode);
    });
  }, []);

  const remove = useCallback((callback: NodeCallback) => {
    $update(draft => {
      const node = findNode(draft, callback);
      node.parent?.removeChild(node);
    });
  }, []);

  const update = useCallback((node: object, callback: NodeCallback) => {
    $update(draft => {
      const old = findNode(draft, callback);
      const nNode = Utils.format(node, dataKeyMap);
      old.update(nNode);
    });
  }, []);

  const move = useCallback(
    (nodeCallback: NodeCallback, parentCallback: NodeCallback) => {
      $update(draft => {
        const node = findNode(draft, nodeCallback);
        if (node.isRoot) {
          throw Error('tree root cannot be moved');
        }

        const parent = findNode(draft, parentCallback);
        node.parent?.removeChild(node);
        parent.addChild(node);
      });
    },
    []
  );

  useImperativeHandle(ref, () => ({
    data,
    insert,
    remove,
    update,
    move,
  }));

  return <RcTree {...rest} treeData={root.children} />;
}) as ITree;

Tree.useTree = useTree;
Tree.ROOT = ROOT;

export default Tree;
