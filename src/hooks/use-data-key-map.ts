import { useEffect, useState } from 'react';
import { DataKeyMap } from '../interface';

const DEFAULT_KEY_MAP = { key: 'key', title: 'title', children: 'children' };

export default function useDataKeyMap(keyMap?: DataKeyMap) {
  const [dataKeyMap, setDataKeyMap] = useState<DataKeyMap>(DEFAULT_KEY_MAP);
  useEffect(() => setDataKeyMap({ ...DEFAULT_KEY_MAP, ...keyMap }), [keyMap]);
  return dataKeyMap;
}
