import sharp from 'sharp';
import { adminStorage } from './firebaseAdmin';

export async function uploadImageToGCS(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const bucket = adminStorage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const file = bucket.file(fileName);
  await file.save(fileBuffer, {
    resumable: false,
    contentType: 'image/jpeg',
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export async function resizeImage(
  buffer: Buffer,
  maxWidth: number,
  maxHeight: number
): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const resizeOptions = {
    width: Math.min(metadata.width || maxWidth, maxWidth),
    height: Math.min(metadata.height || maxHeight, maxHeight),
    withoutEnlargement: true,
  };

  return image.resize(resizeOptions).toFormat('jpeg').toBuffer();
}
