import { adminAuth } from './firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export const getUserFromToken = async (
  request: NextRequest
): Promise<DecodedIdToken | null> => {
  const authorizationHeader = request?.headers?.get('Authorization');

  const token = authorizationHeader?.split('Bearer ')[1];

  if (!token) {
    return null;
  }

  const user = await adminAuth.verifyIdToken(token);

  if (!user.email) {
    return null;
  }

  return user;
};
