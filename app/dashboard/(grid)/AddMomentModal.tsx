'use client';

import Modal from '@/components/Modal';
import { atom, useRecoilState } from 'recoil';

export const addMomentState = atom<boolean>({
  key: 'addMomentState',
  default: false,
});

export default function AddMomentModal() {
  const [isOpen, setOpen] = useRecoilState(addMomentState);

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <h1>Hello</h1>
    </Modal>
  );
}
