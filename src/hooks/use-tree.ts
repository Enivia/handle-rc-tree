import { useRef } from 'react';
import { TreeInstance } from '../interface';

export default function useTree() {
  const treeRef = useRef<TreeInstance>();
  return treeRef;
}
