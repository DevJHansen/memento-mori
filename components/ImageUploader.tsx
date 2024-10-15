/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { MdOutlineImage } from 'react-icons/md';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  imageUrl?: string;
  selectedImage: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploader({
  imageUrl,
  handleFileChange,
  selectedImage,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedImage) {
      setLoading(true);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
        setLoading(false);
      };

      reader.readAsDataURL(selectedImage);
    } else if (imageUrl) {
      setLoading(true);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setLoading(false);
    } else {
      setPreview(null);
    }
  }, [selectedImage, imageUrl]);

  return (
    <div
      className={`flex flex-col items-center rounded justify-center p-6 ${
        !loading && (preview || imageUrl)
          ? 'bg-background'
          : 'bg-backgroundSecondary'
      }`}
    >
      {loading && <LoadingSpinner />}

      {/* Show preview or imageUrl */}
      {!loading && (preview || imageUrl) && (
        <>
          <img
            src={preview || imageUrl}
            alt="Uploaded Image"
            className="w-full max-h-[20vh] object-cover rounded-lg shadow-md"
          />
          <label
            htmlFor="file-upload"
            className="mt-2 cursor-pointer text-center text-foreground text-xs underline"
          >
            Change Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}

      {/* Show placeholder when no image is present */}
      {!selectedImage && !imageUrl && !loading && (
        <div className="flex flex-col items-center">
          <MdOutlineImage size={48} className="text-background mb-2" />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-center text-foreground text-xs"
          >
            <u>Select an Image</u>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
