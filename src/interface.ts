import { TreeProps as RcTreeProps } from 'rc-tree';
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import useTree from './hooks/use-tree';
import Node from './node';

export type NodeDataKey = 'key' | 'title' | 'children';

export type DataKeyMap = { [key in NodeDataKey]?: string };

export type NodeCallback = (n: Node) => boolean;

export interface TreeProps extends Omit<RcTreeProps, 'prefixCls' | 'treeData'> {
  prefixCls?: string;
  dataKeyMap?: DataKeyMap;
}

export interface ITree
  extends ForwardRefExoticComponent<
    PropsWithoutRef<TreeProps> & RefAttributes<TreeInstance>
  > {
  useTree: typeof useTree;
}

export interface TreeInstance {
  /**
   * set tree data
   * @param data
   */
  data(data: object[]): void;
  /**
   * insert node
   * @param node
   * @param callback parent node callback
   */
  insert(node: object, callback: NodeCallback): void;
  /**
   * remove node
   * @param callback
   */
  remove(callback: NodeCallback): void;
  /**
   * update node
   * @param node new node data
   * @param callback
   */
  update(node: object, callback: NodeCallback): void;
  /**
   * move node
   * @param nodeCallback callback to find node
   * @param parentCallback callback to find parent node
   */
  move(nodeCallback: NodeCallback, parentCallback: NodeCallback): void;
}
