/* eslint-disable @next/next/no-img-element */
'use client';

import { fetchImage } from '@/lib/firebase/storage';
import { Memento } from '@/schemas/memento';
import { useEffect, useState } from 'react';
import { Account } from '@/schemas/account';
import { getDateFromWeek } from '@/utils/lifeUtils';

interface Props {
  memento: Memento;
  account: Account;
}

export default function MementoCard({ memento, account }: Props) {
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getImage = async () => {
      if (image) {
        return;
      }

      const imageUrl = await fetchImage(
        memento.heroImage.url.replace(
          'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
          ''
        )
      );

      if (imageUrl) {
        setImage(imageUrl);
      }
    };

    getImage();
  }, [image, memento.heroImage.url]);

  return (
    <div className="relative max-w-sm w-full h-64 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
      <div className="w-full h-full bg-backgroundSecondary absolute inset-0">
        <img
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoading || !image ? 'opacity-0' : 'opacity-100'
          }`}
          src={image}
          alt={`${memento.title}-hero-image`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-30 p-4 cursor-pointer">
        <h2 className="text-textOnDark font-bold text-lg mb-2">
          {memento.title}
        </h2>
        <p className="text-textOnDark text-sm">
          {getDateFromWeek(account.dob.unix, memento.week)}
        </p>
      </div>
    </div>
  );
}
