import { Memento, MementoCache } from '@/schemas/memento';
import { getAuthToken } from '../firebase/auth';

export interface GetMementosResult {
  nbHits: number;
  nbPages: number;
  page: number;
  hits: {
    hits: Memento[];
  };
}

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

export const getMementos = async (
  page: number,
  search?: string
): Promise<GetMementosResult> => {
  let queryParams = `?page=${page}`;

  if (search) {
    queryParams += `&search=${search}`;
  }

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Unable to retrieve authentication token.');
    }

    const res = await fetch(`/api/mementos${queryParams}`, {
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
