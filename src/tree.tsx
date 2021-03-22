import React, {
  forwardRef,
  ForwardedRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import produce from 'immer';
import RcTree from 'rc-tree';
import { EventDataNode } from 'rc-tree/lib/interface';
import 'rc-tree/assets/index.css';

import {
  Node,
  NodeCallback,
  NodeCondition,
  TreeInstance,
  TreeProps,
  TreeRoot,
} from './interface';
import Utils from './utils';

export const ROOT: TreeRoot = 'HANDLE_RC_TREE_ROOT';
const DEFAULT_ROOT: Node = { key: ROOT, data: {} };

const InternalTree = forwardRef((props: TreeProps, ref: ForwardedRef<TreeInstance>) => {
  const { dataKeyMap, treeData, onLoadData, ...rest } = props;
  const [root, setRoot] = useState<Node>(DEFAULT_ROOT);

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

  const $find = useCallback(
    (root: Node, condition: NodeCondition, returnParent?: boolean) => {
      if (!condition) {
        throw Error('condition is empty');
      }
      const callback: NodeCallback = condition === ROOT ? n => n.key === ROOT : condition;
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

  const $move = useCallback(
    (root: Node, child: Node, parent: Node) => {
      if (child === parent) {
        console.warn('move faild: cannot move node to itself');
        return;
      }
      const oldParent = $find(root, n => (n.children || []).some(item => item === child));
      if (oldParent === parent) {
        console.warn('move faild: same parent');
        return;
      }
      Utils.removeChild(oldParent, child);
      Utils.addChild(parent, child);
    },
    [$find]
  );

  const setData = useCallback((data: any[]) => {
    $update(node => {
      const children = Utils.from(data);
      node.children = children;
    });
  }, []);

  useEffect(() => {
    Utils.dataKeyMap = dataKeyMap || {};
    if (treeData) setData(treeData);
  }, [treeData, dataKeyMap]);

  const insert = useCallback((node: any, callback: NodeCallback) => {
    $update(draft => {
      if (!node) return;
      const parent = $find(draft, callback);
      const child = Utils.format(node);
      Utils.addChild(parent, child);
    });
  }, []);

  const remove = useCallback((callback: NodeCallback) => {
    $update(draft => {
      const parent = $find(draft, callback, true);
      const child = $find(draft, callback);
      Utils.removeChild(parent, child);
    });
  }, []);

  const update = useCallback(
    (data: any, callback: NodeCallback, parentCondition?: NodeCondition) => {
      $update(draft => {
        const node = $find(draft, callback);
        const nNode = Utils.format(data);
        Utils.updateNode(node, nNode);

        if (parentCondition) {
          const parent = $find(draft, parentCondition);
          $move(root, node, parent);
        }
      });
    },
    []
  );

  const move = useCallback((nodeCallback: NodeCallback, parentCallback: NodeCallback) => {
    $update(draft => {
      const child = $find(draft, nodeCallback, true);
      const parent = $find(draft, parentCallback);
      $move(draft, child, parent);
    });
  }, []);

  const handleLoadData = useCallback(
    async (node: EventDataNode) => {
      if (node.children?.length || !onLoadData) return;
      const data = await onLoadData(node);
      const children = Utils.from(data);
      if (children.length === 0) return;

      $update(draft => {
        const parent = $find(draft, n => n.key === node.key);
        Utils.updateChildren(parent, children);
      });
    },
    [onLoadData]
  );

  useImperativeHandle(ref, () => ({
    data: root.children || [],
    setData,
    insert,
    remove,
    update,
    move,
  }));

  return <RcTree {...rest} treeData={root?.children} loadData={handleLoadData} />;
});

export default InternalTree;
