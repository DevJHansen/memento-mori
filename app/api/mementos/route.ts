import { getUserFromToken } from '@/lib/firebase/adminAuth';
import { ACCOUNTS, MEMENTOS, MEMENTOS_CACHE } from '@/lib/firebase/collections';
import { adminFirestore } from '@/lib/firebase/firebaseAdmin';
import { resizeImage, uploadImageToGCS } from '@/lib/firebase/adminStorage';
import { Memento, MementoCache } from '@/schemas/memento';
import { firestore } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import {
  DEFAULT_MAX_IMAGE_SIZE,
  DEFAULT_MAX_IMAGE_SIZE_TEXT,
} from '@/constants/maxFileSize';

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

    if (heroImageFile.size > DEFAULT_MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          message: `File size exceeds the ${DEFAULT_MAX_IMAGE_SIZE_TEXT} limit. Please upload a smaller file.`,
        },
        { status: 413 }
      );
    }

    const fileBuffer = await heroImageFile
      .arrayBuffer()
      .then((buffer) => Buffer.from(buffer));

    const [heroBuffer, thumbnailBuffer, dotBuffer] = await Promise.all([
      resizeImage(fileBuffer, 1920, 1080),
      resizeImage(fileBuffer, 150, 150),
      resizeImage(fileBuffer, 50, 50),
    ]);

    const now = new Date();

    const [heroImageUrl, thumbnailUrl, dotUrl] = await Promise.all([
      uploadImageToGCS(
        heroBuffer,
        `${user.uid}/mementos/${week}/hero/${uid}_${now}_hero.webp`
      ),
      uploadImageToGCS(
        thumbnailBuffer,
        `${user.uid}/mementos/${week}/hero/${uid}_${now}_thumbnail.webp`
      ),
      uploadImageToGCS(
        dotBuffer,
        `${user.uid}/mementos/${week}/hero/${uid}_${now}_dot.webp`
      ),
    ]);

    const totalSize =
      heroImageFile.size + thumbnailBuffer.length + dotBuffer.length;

    const createdAt = {
      unix: Math.floor(now.getTime() / 1000),
      timestamp: now.toISOString(),
      day: now.getUTCDate(),
      month: now.getUTCMonth() + 1,
      year: now.getUTCFullYear(),
    };

    const newMemento: Memento = {
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

    const newMementoCache: MementoCache = {
      [week]: {
        title,
        heroImage: `${user.uid}/mementos/${week}/hero/${uid}_${now}_dot.webp`,
        mementoId: uid,
      },
    };

    const accountRef = adminFirestore.collection(ACCOUNTS).doc(user.uid);
    const mementoRef = adminFirestore.collection(MEMENTOS).doc(uid);
    const mementoCacheRef = adminFirestore
      .collection(MEMENTOS_CACHE)
      .doc(user.uid);

    await Promise.all([
      mementoRef.create(newMemento),
      mementoCacheRef.set(newMementoCache, { merge: true }),
      accountRef.update({
        'storageUsage.bytesUsed': firestore.FieldValue.increment(totalSize),
      }),
    ]);

    return NextResponse.json(newMemento, { status: 201 });
  } catch (error) {
    console.error('Error creating memento:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
