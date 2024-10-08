import { getUserFromToken } from '@/lib/firebase/adminAuth';
import { ACCOUNTS, MOMENTS, MOMENTS_CACHE } from '@/lib/firebase/collections';
import { adminFirestore } from '@/lib/firebase/firebaseAdmin';
import { resizeImage, uploadImageToGCS } from '@/lib/firebase/adminStorage';
import { Moment, MomentCache } from '@/schemas/moment';
import { firestore } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  const uid = uuidv4();

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formSchema = z.object({
      title: z.string().min(1, 'Title is required'),
      bodyContent: z.string().min(1, 'Body content is required'),
      week: z.string(),
      heroImageFile: z.instanceof(File).refine((file) => file.size > 0, {
        message: 'Hero image is required',
      }),
    });

    const body = await req.formData();
    const parsedData = {
      title: body.get('title')?.toString() || '',
      bodyContent: body.get('body')?.toString() || '',
      week: body.get('week')?.toString() || '',
      heroImageFile: body.get('heroImage') as File,
    };

    const validationResult = formSchema.safeParse(parsedData);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, heroImageFile, week, bodyContent } = validationResult.data;

    const fileBuffer = await heroImageFile
      .arrayBuffer()
      .then((buffer) => Buffer.from(buffer));

    const [heroBuffer, thumbnailBuffer, dotBuffer] = await Promise.all([
      resizeImage(fileBuffer, 1920, 1080),
      resizeImage(fileBuffer, 150, 150),
      resizeImage(fileBuffer, 50, 50),
    ]);

    const [heroImageUrl, thumbnailUrl, dotUrl] = await Promise.all([
      uploadImageToGCS(
        heroBuffer,
        `${user.uid}/moments/${week}/hero/${uid}_hero.jpg`
      ),
      uploadImageToGCS(
        thumbnailBuffer,
        `${user.uid}/moments/${week}/hero/${uid}_thumbnail.jpg`
      ),
      uploadImageToGCS(
        dotBuffer,
        `${user.uid}/moments/${week}/hero/${uid}_dot.jpg`
      ),
    ]);

    const totalSize =
      heroImageFile.size + thumbnailBuffer.length + dotBuffer.length;

    const now = new Date();
    const createdAt = {
      unix: Math.floor(now.getTime() / 1000),
      timestamp: now.toISOString(),
      day: now.getUTCDate(),
      month: now.getUTCMonth() + 1,
      year: now.getUTCFullYear(),
    };

    const newMoment: Moment = {
      title,
      body: bodyContent,
      createdAt,
      heroImage: {
        dotUrl,
        thumbnailUrl,
        url: heroImageUrl,
        size: totalSize,
      },
      uid,
      week,
      userId: user.uid,
    };

    const newMomentCache: MomentCache = {
      [week]: {
        title,
        heroImage: dotUrl,
        momentId: uid,
      },
    };

    const accountRef = adminFirestore.collection(ACCOUNTS).doc(user.uid);
    const momentRef = adminFirestore.collection(MOMENTS).doc(uid);
    const momentCacheRef = adminFirestore
      .collection(MOMENTS_CACHE)
      .doc(user.uid);

    await Promise.all([
      momentRef.create(newMoment),
      momentCacheRef.set(newMomentCache, { merge: true }),
      accountRef.update({
        'storageUsage.bytesUsed': firestore.FieldValue.increment(totalSize),
      }),
    ]);

    return NextResponse.json(newMoment, { status: 201 });
  } catch (error) {
    console.error('Error creating moment:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
