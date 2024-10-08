'use client';

import Modal from '@/components/Modal';
import { atom, useRecoilState } from 'recoil';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { FormFieldLabel } from '@/components/FormFieldLabel';
import { getAuthToken } from '@/lib/firebase/auth';
import { momentCacheState } from './Grid';
import { Moment } from '@/schemas/moment';

export const addMomentState = atom<{
  isOpen: boolean;
  week: string;
}>({
  key: 'addMomentState',
  default: {
    isOpen: false,
    week: '',
  },
});

export default function AddMomentModal() {
  const [modalState, setModalState] = useRecoilState(addMomentState);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [cache, setCache] = useRecoilState(momentCacheState);

  const [totalSize, setTotalSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      setTotalSize((prevSize) => prevSize + file.size);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('week', modalState.week);
    if (heroImage) formData.append('heroImage', heroImage);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Failed to fetch token');
      }

      const response = await fetch('/api/moments', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newMoment = (await response.json()) as Moment;

        setCache({
          ...cache,
          cache: {
            ...cache.cache,
            [modalState.week]: {
              title,
              heroImage: newMoment.heroImage.dotUrl,
              momentId: newMoment.uid,
            },
          },
        });

        setModalState({
          isOpen: false,
          week: '',
        });
      } else {
        console.error('Error creating moment');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={() =>
        setModalState({
          isOpen: false,
          week: '',
        })
      }
    >
      <h3 className="text-center font-bold">Add a Moment</h3>
      <form className="p-4 space-y-4" onSubmit={handleSubmit}>
        <FormInput
          type="text"
          value={title}
          onChange={(v) => setTitle(v)}
          required={true}
          id="title"
          label="Title"
        />

        <div>
          <FormInput
            type="text"
            value={body}
            onChange={(v) => setBody(v)}
            required={true}
            id="body"
            label="Body"
          />
        </div>

        <div>
          <FormFieldLabel label="Hero Image" id="heroImage" />
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={handleFileChange}
          />
        </div>
        <div className="text-sm text-gray-500">
          Total File Size: {(totalSize / (1024 * 1024)).toFixed(2)} MB
        </div>

        <Button text="Submit" type="submit" className="w-full" />
      </form>
    </Modal>
  );
}
