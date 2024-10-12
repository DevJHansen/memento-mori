'use client';

import { fetchImage } from '@/lib/firebase/storage';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  url: string;
  alt: string;
  scale: number;
}
const sizes: Record<number, string> = {
  1: 'w-[1px] h-[1px]',
  2: 'w-[2px] h-[2px]',
  3: 'w-[3px] h-[3px]',
  4: 'w-[4px] h-[4px]',
  5: 'w-[5px] h-[5px]',
  6: 'w-[6px] h-[6px]',
  7: 'w-[7px] h-[7px]',
  8: 'w-[8px] h-[8px]',
  9: 'w-[9px] h-[9px]',
  10: 'w-[10px] h-[10px]',
  11: 'w-[11px] h-[11px]',
  12: 'w-[12px] h-[12px]',
  13: 'w-[13px] h-[13px]',
  14: 'w-[14px] h-[14px]',
  15: 'w-[15px] h-[15px]',
  16: 'w-[16px] h-[16px]',
  17: 'w-[17px] h-[17px]',
  18: 'w-[18px] h-[18px]',
  19: 'w-[19px] h-[19px]',
  20: 'w-[20px] h-[20px]',
  21: 'w-[21px] h-[21px]',
  22: 'w-[22px] h-[22px]',
  23: 'w-[23px] h-[23px]',
  24: 'w-[24px] h-[24px]',
  25: 'w-[25px] h-[25px]',
  26: 'w-[26px] h-[26px]',
  27: 'w-[27px] h-[27px]',
  28: 'w-[28px] h-[28px]',
  29: 'w-[29px] h-[29px]',
  30: 'w-[30px] h-[30px]',
  31: 'w-[31px] h-[31px]',
  32: 'w-[32px] h-[32px]',
  33: 'w-[33px] h-[33px]',
  34: 'w-[34px] h-[34px]',
  35: 'w-[35px] h-[35px]',
  36: 'w-[36px] h-[36px]',
  37: 'w-[37px] h-[37px]',
  38: 'w-[38px] h-[38px]',
  39: 'w-[39px] h-[39px]',
  40: 'w-[40px] h-[40px]',
  41: 'w-[41px] h-[41px]',
  42: 'w-[42px] h-[42px]',
  43: 'w-[43px] h-[43px]',
  44: 'w-[44px] h-[44px]',
  45: 'w-[45px] h-[45px]',
  46: 'w-[46px] h-[46px]',
  47: 'w-[47px] h-[47px]',
  48: 'w-[48px] h-[48px]',
};

const getLoadingClass = (scale: number) => {
  return `${sizes[scale] || sizes[1]} bg-primary rounded-full animate-ping`;
};

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
    <div className={getLoadingClass(scale)} />
  );
}
