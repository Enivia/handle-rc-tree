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
  from(data: object[], keymap?: DataKeyMap): Node[];
  format(item: any, keymap?: DataKeyMap): Node;
  forEach(root: Node, callback: (node: Node) => void): void;
  find(root: Node, callback: (node: Node) => boolean): Node | void;
  addChild(parent: Node, child: Node): void;
  removeChild(parent: Node, child: Node): void;
  updateNode(node: Node, newNode: Node): void;
  updateChildren(parent: Node, children: Node[]): void;
}

const Utils: UtilsInterface = {
  from(data, keymap = {}) {
    return (data || []).map(item => this.format(item, keymap));
  },
  format(item, keymap = {}) {
    const node = { data: item } as Node;
    nodePropKeys.forEach(key => {
      const value = item[keymap[key] || key];
      if (value !== undefined && value !== null) {
        (node[key] as any) = value;
      }
    });
    const children = item[keymap.children || 'children'];
    if (children && children.length) {
      node.children = this.from(children, keymap);
    }
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
