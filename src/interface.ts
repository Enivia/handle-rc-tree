import { TreeProps as RcTreeProps } from 'rc-tree';
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import useTree from './hooks/use-tree';

export type NodeDataKey = 'key' | 'title' | 'children';

export type DataKeyMap = { [key in NodeDataKey]: string };

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
  data: (data: object[]) => void;
}
