import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

interface Props {
  src?: string | null;
  alt?: string;
  size?: number;
}

export default function Avatar({ src, alt = 'User Avatar', size = 32 }: Props) {
  return (
    <div
      className="flex items-center justify-center bg-gray-200 rounded-full"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="rounded-full object-cover"
          width={size}
          height={size}
        />
      ) : (
        <FaUserCircle size={size} className="text-accent" />
      )}
    </div>
  );
}
