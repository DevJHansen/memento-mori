import { LoadingState } from '@/schemas/loading';
import { MementoCache } from '@/schemas/memento';
import { atom } from 'recoil';

interface MementoCacheState {
  status: LoadingState;
  cache: null | MementoCache;
}

export const mementoCacheState = atom<MementoCacheState>({
  key: 'mementoCacheState',
  default: {
    status: 'initial',
    cache: null,
  },
});
