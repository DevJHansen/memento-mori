'use client';

import { fetchImage } from '@/lib/firebase/storage';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  url: string;
  alt: string;
  scale: number;
}

export function DotImage({ url, alt, scale }: Props) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      const authUrl = await fetchImage(url);
      setImageUrl(authUrl ?? '');
    };
    loadImage();
  }, [url]);

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={alt}
      width={scale}
      height={scale}
      className="rounded-full"
    />
  ) : (
    <div
      className={`w-[${scale}px] h-[${scale}px] bg-primary rounded-full animate-ping`}
    />
  );
}
