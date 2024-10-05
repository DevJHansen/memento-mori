import { auth } from './firebase';

export const getNewAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting auth token', error);
    return null;
  }
};
