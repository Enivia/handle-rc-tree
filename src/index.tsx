import useTree from './hooks/use-tree';
import InternalTree, { ROOT } from './tree';

type InternalTreeType = typeof InternalTree;
interface TreeInterface extends InternalTreeType {
  useTree: typeof useTree;
  ROOT: typeof ROOT;
}

const Tree = InternalTree as TreeInterface;
Tree.useTree = useTree;
Tree.ROOT = ROOT;

export default Tree;
