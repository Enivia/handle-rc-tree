import React, {
  forwardRef,
  ForwardedRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
} from 'react';
import produce from 'immer';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

import { Node, NodeCallback, TreeInstance, TreeProps } from './interface';
import Utils from './utils';

export const ROOT = 'HANDLE_RC_TREE_ROOT';
const DEFAULT_KEY_MAP = { key: 'key', title: 'title', children: 'children' };
const DEFAULT_ROOT: Node = { key: 'ROOT_KEY', data: {} };

const InternalTree = forwardRef((props: TreeProps, ref: ForwardedRef<TreeInstance>) => {
  const { dataKeyMap: keymap, treeData, ...rest } = props;
  const [root, setRoot] = useState<Node>(DEFAULT_ROOT);

  const dataKeyMap = useMemo(() => {
    return { ...DEFAULT_KEY_MAP, ...keymap };
  }, []);

  const $update = useCallback((callback: (draft: Node) => void) => {
    setRoot(
      produce(draft => {
        try {
          callback(draft);
        } catch (e) {
          console.error(e);
        }
      })
    );
  }, []);

  const findNode = useCallback(
    (root: Node, callback: NodeCallback, returnParent?: boolean) => {
      if (!callback) {
        throw Error('callback is empty');
      }
      const node = Utils.find(
        root,
        returnParent ? n => (n.children || []).some(callback) : callback
      );
      if (!node) {
        throw Error('node is not found');
      }
      return node;
    },
    []
  );

  const data = useCallback(
    (data: any[]) => {
      $update(node => {
        const children = Utils.from(data, dataKeyMap);
        node.children = children;
      });
    },
    [dataKeyMap]
  );

  useEffect(() => {
    if (treeData) data(treeData);
  }, [treeData]);

  const insert = useCallback(
    (node: any, callback: NodeCallback) => {
      $update(draft => {
        if (!node) return;
        const parent = findNode(draft, callback);
        const child = Utils.format(node, dataKeyMap);
        Utils.addChild(parent, child);
      });
    },
    [dataKeyMap]
  );

  const remove = useCallback((callback: NodeCallback) => {
    $update(draft => {
      const parent = findNode(draft, callback, true);
      const child = findNode(draft, callback);
      Utils.removeChild(parent, child);
    });
  }, []);

  const update = useCallback(
    (node: any, callback: NodeCallback) => {
      $update(draft => {
        const old = findNode(draft, callback);
        const nNode = Utils.format(node, dataKeyMap);
        Utils.updateNode(old, nNode);
      });
    },
    [dataKeyMap]
  );

  const move = useCallback(
    (nodeCallback: NodeCallback, parentCallback: NodeCallback) => {
      $update(draft => {
        const child = findNode(draft, nodeCallback);
        const oldParent = findNode(draft, nodeCallback, true);
        const newParent = findNode(draft, parentCallback);
        if (oldParent === newParent) {
          throw Error('move faild: same parent');
        }
        if (child === newParent) {
          throw Error('move faild: cannot move node to itself');
        }
        Utils.removeChild(oldParent, child);
        Utils.addChild(newParent, child);
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
});

export default InternalTree;
