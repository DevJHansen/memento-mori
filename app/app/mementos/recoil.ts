import { GetMementosResult } from '@/lib/api/momento';
import type { LoadingState } from '@/schemas/loading';
import { Memento } from '@/schemas/memento';
import { atom } from 'recoil';

export interface MementoState {
  status: LoadingState;
  results: GetMementosResult | null;
}

export interface ViewMementoState {
  memento: Memento | null;
  index: number;
}

export const mementosState = atom<MementoState>({
  key: 'mementosState',
  default: {
    status: 'initial',
    results: null,
  },
});

export const viewMementoState = atom<ViewMementoState>({
  key: 'viewMementoState',
  default: {
    memento: null,
    index: 0,
  },
});
