export default class Node {
  key: string = '';
  title: string = '';
  isLeaf?: boolean;
  data?: any;
  parent?: Node;
  children?: Node[];
  isRoot?: boolean;

  get root(): Node {
    let node: Node = this;
    while (node.parent && !node.parent.isRoot) {
      node = node.parent;
    }
    return node;
  }

  get depth(): number {
    let depth = 0;
    let node: Node = this;
    while (node.parent) {
      node = node.parent;
      depth++;
    }
    return depth;
  }

  addChild(child: Node) {
    if (child.parent === this) {
      return;
    }
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (!this.children) {
      this.children = [child];
    } else {
      this.children.push(child);
    }
    child.parent = this;
  }

  removeChild(child: Node) {
    this.children = (this.children || []).filter(node => node !== child);
    child.parent = undefined;
  }

  contain(child: Node) {
    let node = child;
    while (node !== null && node !== undefined) {
      if (node === this) {
        return true;
      }
      node = node.parent as Node;
    }
    return false;
  }
}
