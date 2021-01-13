import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import produce from 'immer';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

import { NodeCallback, TreeInstance, TreeProps } from './interface';
import Node from './node';
import Utils from './utils';
import useTree from './hooks/use-tree';

const ROOT = 'EASY_RC_TREE_ROOT';
const DEFAULT_KEY_MAP = { key: 'key', title: 'title', children: 'children' };

export interface ITree
  extends ForwardRefExoticComponent<
    PropsWithoutRef<TreeProps> & RefAttributes<TreeInstance>
  > {
  useTree: typeof useTree;
  ROOT: typeof ROOT;
}

const Tree: ITree = forwardRef<TreeInstance, TreeProps>((props, ref) => {
  const { dataKeyMap: keymap, ...rest } = props;
  const [root, setRoot] = useState<Node>();

  const dataKeyMap = useMemo(() => {
    return { ...DEFAULT_KEY_MAP, ...keymap };
  }, [keymap]);

  const createRoot = useCallback(() => {
    const root = new Node();
    root.key = ROOT;
    root.isRoot = true;
    return root;
  }, []);

  const $update = useCallback((callback: (draft: Node) => void) => {
    try {
      setRoot(produce(draft => callback(draft)));
      // setRoot(draft => callback(draft));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const findNode = useCallback((root: Node, callback: NodeCallback) => {
    if (!callback) {
      throw Error('callback is empty');
    }
    const node = Utils.find(root, callback);
    if (!node) {
      throw Error('cannot find node');
    }
    return node;
  }, []);

  const data = useCallback(
    (data: object[]) => {
      $update(() => {
        const rootNode = createRoot();
        const children = Utils.from(data, dataKeyMap);
        children.forEach(child => rootNode.addChild(child));
        return rootNode;
      });
    },
    [dataKeyMap]
  );

  const insert = useCallback(
    (node: object, callback: NodeCallback) => {
      $update(draft => {
        if (!node) return;
        const parent = findNode(draft, callback);
        const treeNode = Utils.format(node, dataKeyMap);
        parent.addChild(treeNode);
      });
    },
    [dataKeyMap]
  );

  const remove = useCallback((callback: NodeCallback) => {
    $update(draft => {
      const node = findNode(draft, callback);
      node.parent?.removeChild(node);
    });
  }, []);

  const update = useCallback(
    (node: object, callback: NodeCallback) => {
      $update(draft => {
        const old = findNode(draft, callback);
        const nNode = Utils.format(node, dataKeyMap);
        old.update(nNode);
      });
    },
    [dataKeyMap]
  );

  const move = useCallback(
    (nodeCallback: NodeCallback, parentCallback: NodeCallback) => {
      $update(draft => {
        const node = findNode(draft, nodeCallback);
        if (node.isRoot) {
          throw Error('tree root cannot be moved');
        }
        const parent = findNode(draft, parentCallback);
        if (node === parent) {
          throw Error('cannot move node to itself');
        }

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

  return <RcTree {...rest} treeData={root?.children} />;
}) as ITree;

Tree.useTree = useTree;
Tree.ROOT = ROOT;

export default Tree;
