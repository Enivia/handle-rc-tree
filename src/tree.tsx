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

import { Node, NodeCallback, TreeInstance, TreeProps } from './interface';
import Utils from './utils';

export const ROOT = 'HANDLE_RC_TREE_ROOT';
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
      const parent = findNode(draft, callback);
      const child = Utils.format(node);
      Utils.addChild(parent, child);
    });
  }, []);

  const remove = useCallback((callback: NodeCallback) => {
    $update(draft => {
      const parent = findNode(draft, callback, true);
      const child = findNode(draft, callback);
      Utils.removeChild(parent, child);
    });
  }, []);

  const update = useCallback((node: any, callback: NodeCallback) => {
    $update(draft => {
      const old = findNode(draft, callback);
      const nNode = Utils.format(node);
      Utils.updateNode(old, nNode);
    });
  }, []);

  const move = useCallback(
    (nodeCallback: NodeCallback, parentCallback: NodeCallback) => {
      $update(draft => {
        const oldParent = findNode(draft, nodeCallback, true);
        const newParent = findNode(draft, parentCallback);
        if (oldParent === newParent) {
          throw Error('move faild: same parent');
        }
        const child = oldParent.children?.find(nodeCallback) as Node;
        if (child === newParent) {
          throw Error('move faild: cannot move node to itself');
        }
        Utils.removeChild(oldParent, child);
        Utils.addChild(newParent, child);
      });
    },
    []
  );

  const handleLoadData = useCallback(
    async (node: EventDataNode) => {
      if (node.children?.length || !onLoadData) return;
      const data = await onLoadData(node);
      const children = Utils.from(data);
      if (children.length === 0) return;

      $update(draft => {
        const parent = findNode(draft, n => n.key === node.key);
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
