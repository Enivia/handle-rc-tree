import { TreeProps as RcTreeProps } from 'rc-tree';
import { DataNode, EventDataNode } from 'rc-tree/lib/interface';

export type TreeRoot = 'HANDLE_RC_TREE_ROOT';
export type NodeDataKey = keyof DataNode;
export type DataKeyMap = { [key in NodeDataKey]?: string };

export interface Node<DataType extends object = any> extends DataNode {
  data: DataType;
  children?: Node<DataType>[];
}

export type NodeCallback<DataType extends object = any> = (n: Node<DataType>) => boolean;
export type NodeCondition<DataType extends object = any> =
  | TreeRoot
  | NodeCallback<DataType>;

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
  /** tree data */
  data: DataType[];
  /**
   * set tree data
   * @param data
   */
  setData(data: DataType[]): void;
  /**
   * insert node
   * @param node
   * @param condition parent node condition
   */
  insert(node: DataType, condition: NodeCondition<DataType>): void;
  /**
   * remove node
   * @param callback
   */
  remove(callback: NodeCallback<DataType>): void;
  /**
   * update node
   * @param node new node data
   * @param callback
   * @param parentCondition condition to find parent node
   */
  update(
    node: Partial<DataType>,
    callback: NodeCallback<DataType>,
    parentCondition?: NodeCondition<DataType>
  ): void;
  /**
   * move node
   * @param nodeCallback callback to find node
   * @param parentCondition condition to find parent node
   */
  move(
    nodeCallback: NodeCallback<DataType>,
    parentCondition: NodeCondition<DataType>
  ): void;
  /**
   * update children
   * @param data
   * @param nodeCondition condition to find parent node
   */
  updateChildren(data: DataType[], nodeCondition: NodeCondition<DataType>): void;
}
