'use client';

import { fetchImage } from '@/lib/firebase/storage';
import { Memento } from '@/schemas/memento';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Props {
  memento: Memento;
}

export default function MementoCard({ memento }: Props) {
  const [image, setImage] = useState('');

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
  }, []);

  return (
    <div
      key={memento.uid}
      className="mb-4 p-4 bg-background shadow-md rounded-lg"
    >
      {!image ? (
        <div className="animate-pulse h-48 bg-gray-300 rounded-t-lg"></div>
      ) : (
        memento.heroImage && (
          <img
            src={image}
            alt={``}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )
      )}
      <h2 className="text-xl font-semibold mt-2">{memento.title}</h2>
      <p className="text-gray-700">{memento.body}</p>
      <p className="text-gray-500 text-sm mt-1">
        Created at: {format(memento.createdAt.unix * 1000, 'MMM dd, yyyy')}
      </p>
    </div>
  );
}
