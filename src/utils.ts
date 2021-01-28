import { Node, DataKeyMap } from './interface';

const Utils = {
  from(data: any[], dataKeyMap: DataKeyMap): Node[] {
    return (data || []).map(item => Utils.format(item, dataKeyMap));
  },
  format(item: any, dataKeyMap: DataKeyMap): Node {
    const node: Node = {
      key: item[dataKeyMap.key || 'key'] + '',
      title: item[dataKeyMap.title || 'title'],
      isLeaf: item['isLeaf'],
      data: item,
    };
    node.children = Utils.from(
      item[dataKeyMap.children || 'children'],
      dataKeyMap
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
    return;
  },
  addChild(parent: Node, child: Node) {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child);
  },
  removeChild(parent: Node, child: Node) {
    parent.children = parent.children?.filter(item => item !== child);
  },
  updateNode(node: Node, newNode: Node) {
    node = { ...node, ...newNode, children: node.children };
  },
};

export default Utils;
