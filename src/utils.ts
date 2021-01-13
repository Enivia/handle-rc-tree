import { DataKeyMap } from './interface';
import Node from './node';

const Utils = {
  from(data: object[], dataKeyMap: DataKeyMap, parent?: Node): Node[] {
    return (data || []).map(item => Utils.format(item, dataKeyMap, parent));
  },

  format(item: object, dataKeyMap: DataKeyMap, parent?: Node): Node {
    const node = new Node();
    node.key = (item as any)[dataKeyMap.key || 'key'] + '';
    node.title = (item as any)[dataKeyMap.title || 'title'];
    node.isLeaf = (item as any)['isLeaf'];
    node.data = item;
    node.parent = parent;
    node.children = Utils.from(
      (item as any)[dataKeyMap.children || 'children'],
      dataKeyMap,
      node
    );
    return node;
  },

  forEach(root: Node, callback: (node: Node) => void) {
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

  // @ts-ignore
  find(root: Node, callback: (node: Node) => boolean) {
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
  },
};

export default Utils;
