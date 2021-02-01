import { DataNode } from 'rc-tree/lib/interface';
import { Node, DataKeyMap } from './interface';

const nodePropKeys: Array<keyof DataNode> = [
  'key',
  'title',
  'isLeaf',
  'icon',
  'checkable',
  'disabled',
  'selectable',
  'disableCheckbox',
  'switcherIcon',
  'className',
  'style',
];

export interface UtilsInterface {
  dataKeyMap: DataKeyMap;
  from(data: object[]): Node[];
  format(item: any): Node;
  forEach(root: Node, callback: (node: Node) => void): void;
  find(root: Node, callback: (node: Node) => boolean): Node | undefined;
  addChild(parent: Node, child: Node): void;
  removeChild(parent: Node, child: Node): void;
  updateNode(node: Node, newNode: Node): void;
  updateChildren(parent: Node, children: Node[]): void;
}

const Utils: UtilsInterface = {
  dataKeyMap: {},
  from(data) {
    return (data || []).map(item => this.format(item));
  },
  format(item) {
    const node = nodePropKeys.reduce((res, key) => {
      Object.assign(res, { [key]: item[this.dataKeyMap[key] || key] });
      return res;
    }, {} as Node);
    node.data = item;
    node.children = this.from(item[this.dataKeyMap.children || 'children']);
    return node;
  },
  forEach(root, callback) {
    if (!root) return;
    let open = [root];
    let node: Node;
    while (((node = open.pop() as Node), node)) {
      callback(node);
      if (node.children) {
        open = node.children.concat(open);
      }
    }
  },
  find(root, callback) {
    if (!root) return;
    let open = [root];
    let node: Node;
    while (((node = open.pop() as Node), node)) {
      if (callback(node) === true) {
        return node;
      }
      if (node.children) {
        open = node.children.concat(open);
      }
    }
    return;
  },
  addChild(parent, child) {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child);
  },
  removeChild(parent, child) {
    parent.children = parent.children?.filter(item => item !== child);
  },
  updateNode(node, newNode) {
    for (let prop in newNode) {
      node[prop as keyof Node] = newNode[prop as keyof Node];
    }
  },
  updateChildren(parent, children) {
    parent.children = children;
  },
};

export default Utils;
