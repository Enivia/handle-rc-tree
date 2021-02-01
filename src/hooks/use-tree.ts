import { useRef } from 'react';
import { TreeInstance } from '../interface';

export default function useTree<DataType extends object = any>() {
  const treeRef = useRef<TreeInstance<DataType>>(null);
  return treeRef;
}
