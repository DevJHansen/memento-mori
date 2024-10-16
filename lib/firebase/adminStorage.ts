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

  return image.rotate().resize(resizeOptions).toFormat('webp').toBuffer();
}

export async function deleteFileFromGCS(fileName: string): Promise<void> {
  const bucket = adminStorage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const file = bucket.file(fileName);

  await file.delete().catch((error) => {
    console.error(`Failed to delete file ${fileName}:`, error);
    throw new Error(`Error deleting file: ${error.message}`);
  });
}

export async function deleteFolder(folderName: string): Promise<void> {
  const bucket = adminStorage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const [files] = await bucket.getFiles({ prefix: folderName });

  if (files.length === 0) {
    console.log(`No files found in folder ${folderName}`);
    return;
  }

  const deletePromises = files.map((file) => file.delete());
  await Promise.all(deletePromises);

  console.log(`All files in folder ${folderName} have been deleted.`);
}
