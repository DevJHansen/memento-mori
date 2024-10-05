import { getAuth } from 'firebase/auth';

export const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    return token;
  }

  return null;
};
