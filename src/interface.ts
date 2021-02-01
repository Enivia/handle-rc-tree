import { TreeProps as RcTreeProps } from 'rc-tree';
import { DataNode, EventDataNode } from 'rc-tree/lib/interface';

export type NodeDataKey = keyof DataNode;

export type DataKeyMap = { [key in NodeDataKey]?: string };

export interface Node<DataType extends object = any> extends DataNode {
  data: DataType;
  children?: Node<DataType>[];
}

export type NodeCallback<DataType extends object = any> = (
  n: Node<DataType>
) => boolean;

export interface DefaultTreeProps extends Omit<RcTreeProps, 'prefixCls' | 'loadData'> {
  dataKeyMap?: DataKeyMap;
  prefixCls?: string;
  onLoadData?: (node: EventDataNode) => Promise<object[]>;
}

export interface MappedKeysTreeProps extends Omit<DefaultTreeProps, 'treeData'> {
  dataKeyMap: DataKeyMap;
  treeData?: object[];
}

export type TreeProps = DefaultTreeProps | MappedKeysTreeProps;

export interface TreeInstance<DataType extends object = any> {
  /**
   * set tree data
   * @param data
   */
  data(data: DataType[]): void;
  /**
   * insert node
   * @param node
   * @param callback parent node callback
   */
  insert(node: DataType, callback: NodeCallback<DataType>): void;
  /**
   * remove node
   * @param callback
   */
  remove(callback: NodeCallback<DataType>): void;
  /**
   * update node
   * @param node new node data
   * @param callback
   */
  update(node: Partial<DataType>, callback: NodeCallback<DataType>): void;
  /**
   * move node
   * @param nodeCallback callback to find node
   * @param parentCallback callback to find parent node
   */
  move(
    nodeCallback: NodeCallback<DataType>,
    parentCallback: NodeCallback<DataType>
  ): void;
}
