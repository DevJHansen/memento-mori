/* eslint-disable @next/next/no-img-element */
'use client';

import { MdClose, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { mementosState, viewMementoState } from './recoil';
import { useEffect, useState } from 'react';
import { fetchImage } from '@/lib/firebase/storage';
import { getDateFromWeek } from '@/utils/lifeUtils';
import { accountState } from '@/components/ProtectedRoute';
import TipTapContent from './TipTapContent';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function FullMemento() {
  const [viewMemento, setViewMemento] = useRecoilState(viewMementoState);
  const [mementos] = useRecoilState(mementosState);
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [account] = useRecoilState(accountState);

  useEffect(() => {
    const getImage = async () => {
      if (image || !viewMemento.memento) {
        return;
      }

      const imageUrl = await fetchImage(
        viewMemento.memento.heroImage.url.replace(
          'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
          ''
        )
      );

      if (imageUrl) {
        setImage(imageUrl);
      }
    };

    getImage();
  }, [image, viewMemento.memento, viewMemento.memento?.heroImage.url]);

  if (!viewMemento.memento) {
    return;
  }

  const { title, week, body } = viewMemento.memento;

  return (
    <div className="w-screen min-h-screen fixed flex flex-col md:flex-row items-center justify-center inset-0 z-50">
      <div
        className="fixed text-accent cursor-pointer hover:text-accentSecondary right-4 md:left-8 top-4 sm:top-8 z-50"
        onClick={() => {
          setViewMemento({
            memento: null,
            index: 0,
          });
          setImage('');
        }}
      >
        <MdClose size={32} />
      </div>
      <div className="w-full h-full max-h-[50vh] md:max-h-full flex relative items-center justify-center bg-background">
        {viewMemento.index > 0 && (
          <div
            className="absolute left-4 top-1/2  text-foreground cursor-pointer opacity-50 hover:opacity-100 hover:text-accentSecondary "
            onClick={() => {
              if (!mementos.results?.hits.hits[viewMemento.index - 1]) {
                return;
              }

              setViewMemento({
                memento: mementos.results?.hits.hits[viewMemento.index - 1],
                index: viewMemento.index - 1,
              });
              setImage('');
            }}
          >
            <MdArrowBackIos size={32} />
          </div>
        )}
        {!image ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <img
            className={`object-contain h-auto transition-opacity duration-500 ${
              isLoading || !image ? 'opacity-0' : 'opacity-100'
            }`}
            src={image}
            alt={`${title}-hero-image`}
            onLoad={() => setIsLoading(false)}
          />
        )}
        {viewMemento.index + 1 < mementos.results!.hits.hits.length && (
          <div
            className="absolute right-4 top-1/2  text-foreground cursor-pointer opacity-50 hover:opacity-100 hover:text-accentSecondary "
            onClick={() => {
              if (!mementos.results?.hits.hits[viewMemento.index + 1]) {
                return;
              }

              setViewMemento({
                memento: mementos.results?.hits.hits[viewMemento.index + 1],
                index: viewMemento.index + 1,
              });
              setImage('');
            }}
          >
            <MdArrowForwardIos size={32} />
          </div>
        )}
      </div>

      <div className="w-full h-full md:w-[500px] p-2 sm:p-4 space-y-4 bg-backgroundSecondary overflow-y-auto">
        <div className="space-y-2 border-b-[1px] border-foreground pb-4">
          <h3 className="font-bold text-xl">{title}</h3>
          <p className="text-xs">
            {getDateFromWeek(account!.account!.dob.unix, week)}
          </p>
        </div>
        <TipTapContent content={body} />
      </div>
    </div>
  );
}
