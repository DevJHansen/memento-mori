import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebase';

export async function fetchImage(fileName: string) {
  try {
    const fileRef = ref(storage, fileName);

    const url = await getDownloadURL(fileRef);

    return url;
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}
