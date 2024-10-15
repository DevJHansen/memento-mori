import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

interface Props {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  src,
  alt = 'User Avatar',
  size = 32,
  className = '',
}: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-backgroundSecondary rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="rounded-full object-cover"
          width={size}
          height={size}
          priority
        />
      ) : (
        <FaUserCircle size={size} className="text-accent" />
      )}
    </div>
  );
}
