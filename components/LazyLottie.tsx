'use client';

import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import type { Data } from '@lottiefiles/dotlottie-react';

const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  {
    ssr: false,
  }
);

interface LottiePlayerProps {
  data: Data;
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
}

export const LottiePlayer: FC<LottiePlayerProps> = ({
  data,
  style = {},
  className = '',
  ...rest
}) => {
  return (
    <DotLottieReact
      autoplay
      loop
      className={className}
      data={data}
      style={style}
      {...rest}
    />
  );
};
