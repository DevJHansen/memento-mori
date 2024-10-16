'use client';

import Modal from '@/components/Modal';
import { atom, useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { FormFieldLabel } from '@/components/FormFieldLabel';
import { getAuthToken } from '@/lib/firebase/auth';
import { Memento } from '@/schemas/memento';
import { LoadingState } from '@/schemas/loading';
import ImageUploader from '@/components/ImageUploader';
import TipTap from '@/components/TipTap';
import { fetchImage } from '@/lib/firebase/storage';
import AlertBox from '@/components/AlertBox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  DEFAULT_MAX_IMAGE_SIZE,
  DEFAULT_MAX_IMAGE_SIZE_TEXT,
} from '@/constants/maxFileSize';
import { mementoCacheState } from './recoil';

export const addMementoState = atom<{
  isOpen: boolean;
  week: string;
  title: string;
  mementoId: string;
  mementoDate: string;
}>({
  key: 'addMementoState',
  default: {
    isOpen: false,
    week: '',
    title: '',
    mementoId: '',
    mementoDate: '',
  },
});

export default function AddMementoModal() {
  const [modalState, setModalState] = useRecoilState(addMementoState);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [cache, setCache] = useRecoilState(mementoCacheState);
  const [totalSize, setTotalSize] = useState(0);
  const [submittingState, setSubmittingState] =
    useState<LoadingState>('initial');
  const [mementoLoadingState, setMementoLoadingState] =
    useState<LoadingState>('initial');
  const [mementoId, setMementoId] = useState('');

  useEffect(() => {
    const getMemento = async () => {
      if (mementoLoadingState === 'loading') {
        return;
      }

      setMementoLoadingState('loading');

      const token = await getAuthToken();

      if (!token) {
        setMementoLoadingState('error');
        return;
      }

      const res = await fetch(`/api/mementos/${modalState.mementoId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const memento = (await res.json()) as Memento;
        const imageUrl = await fetchImage(memento.heroImage.url);

        setMementoLoadingState('success');
        setBody(memento.body);
        setHeroImageUrl(imageUrl ?? '');
        setMementoId(memento.uid);
        setTotalSize(memento.heroImage.size);
        return;
      } else {
        setMementoLoadingState('error');
      }
    };

    if (modalState.isOpen) {
      if (!title && modalState.title) {
        setTitle(modalState.title);
      }

      if (mementoLoadingState === 'initial' && modalState.mementoId) {
        getMemento();
      }
    }
  }, [modalState, mementoLoadingState, title]);

  const handleClose = () => {
    setModalState({
      isOpen: false,
      week: '',
      title: '',
      mementoId: '',
      mementoDate: '',
    });

    setTitle('');
    setBody('');
    setHeroImageFile(null);
    setTotalSize(0);
    setMementoLoadingState('initial');
    setSubmittingState('initial');
    setHeroImageUrl('');
    setMementoId('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      setTotalSize(file.size);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingState === 'loading' || totalSize > DEFAULT_MAX_IMAGE_SIZE) {
      return;
    }

    if (!heroImageFile && !heroImageUrl) {
      return;
    }

    setSubmittingState('loading');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('week', modalState.week);
    if (heroImageFile) formData.append('heroImage', heroImageFile);

    try {
      const token = await getAuthToken();

      if (!token) {
        setSubmittingState('error');
        return;
      }

      const response = !mementoId
        ? await fetch('/api/mementos', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await fetch(`/api/mementos/${mementoId}`, {
            method: 'PUT',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

      if (response.ok) {
        const mementoRes = (await response.json()) as Memento;

        setCache({
          ...cache,
          cache: {
            ...cache.cache,
            [modalState.week]: {
              title,
              heroImage: mementoRes.heroImage.dotUrl,
              mementoId: mementoRes.uid,
            },
          },
        });

        setModalState({
          isOpen: false,
          week: '',
          title: '',
          mementoId: '',
          mementoDate: '',
        });

        handleClose();
      } else {
        setSubmittingState('error');
        console.error('Error creating memento');
      }
    } catch (error) {
      setSubmittingState('error');
      console.error('Request failed:', error);
    }
  };

  const isFormValid =
    title &&
    body &&
    body !== '<p></p>' &&
    (heroImageFile !== null || heroImageUrl);

  return (
    <Modal isOpen={modalState.isOpen} onClose={handleClose}>
      <form
        className="space-y-4 pb-4 max-h-[90vh] flex flex-col"
        onSubmit={handleSubmit}
      >
        <h3 className="text-center font-bold mb-4">{modalState.mementoDate}</h3>
        {mementoLoadingState === 'loading' && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {mementoLoadingState !== 'error' &&
          mementoLoadingState !== 'loading' && (
            <>
              <div className="h-max overflow-y-auto">
                <ImageUploader
                  imageUrl={heroImageUrl}
                  selectedImage={heroImageFile}
                  handleFileChange={handleFileChange}
                />
                <div className="mt-4">
                  {submittingState === 'error' && (
                    <AlertBox
                      severity="error"
                      message={`Error ${
                        mementoId ? 'updating' : 'creating'
                      } memento`}
                    />
                  )}
                  <FormInput
                    type="text"
                    value={title}
                    onChange={(v) => setTitle(v)}
                    required={true}
                    id="title"
                    label="Title"
                  />
                  <FormFieldLabel required={true} id="body" label="Body" />
                  <TipTap state={body} setState={setBody} />
                  {totalSize > DEFAULT_MAX_IMAGE_SIZE ? (
                    <div className="text-sm mt-2 text-red-500">
                      <i>
                        Total File Size:{' '}
                        {(totalSize / (1024 * 1024)).toFixed(2)} MB
                      </i>
                      <p className="mt-1">
                        The total file size exceeds the{' '}
                        {DEFAULT_MAX_IMAGE_SIZE_TEXT} limit. Please choose a
                        smaller one.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm mb-2 mt-4 text-foreground">
                      Total File Size: {(totalSize / (1024 * 1024)).toFixed(2)}{' '}
                      MB
                    </div>
                  )}
                </div>
                <Button
                  text={mementoId ? 'Update' : 'Create'}
                  type="submit"
                  className="w-full"
                  loading={submittingState === 'loading'}
                  disabled={!isFormValid}
                />
              </div>
            </>
          )}
        {mementoLoadingState === 'error' && (
          <div className="flex items-center justify-center">
            <AlertBox
              severity="error"
              message="Error loading memento. Please try again."
            />
          </div>
        )}
      </form>
    </Modal>
  );
}
