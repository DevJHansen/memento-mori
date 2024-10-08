import { getUserFromToken } from '@/lib/firebase/adminAuth';
import { MOMENTS_CACHE } from '@/lib/firebase/collections';
import { adminFirestore } from '@/lib/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const momentCacheRef = adminFirestore.collection(MOMENTS_CACHE).doc(user.uid);

  const cache = await momentCacheRef.get();

  if (!cache.exists) {
    return NextResponse.json({ message: 'Cache not found' }, { status: 404 });
  }

  return NextResponse.json(cache.data(), { status: 200 });
}
