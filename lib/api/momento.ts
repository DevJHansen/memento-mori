import { MementoCache } from '@/schemas/memento';
import { getAuthToken } from '../firebase/auth';

export const getMementoCache = async (): Promise<MementoCache> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Unable to retrieve authentication token.');
    }

    const res = await fetch('/api/mementos/cache', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(
        `Error: ${res.status} - ${res.statusText}. ${errorDetails}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching cache:', error);
    throw error;
  }
};
