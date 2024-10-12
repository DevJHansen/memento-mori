import {
  DEFAULT_MAX_IMAGE_SIZE,
  DEFAULT_MAX_IMAGE_SIZE_TEXT,
} from '@/constants/maxFileSize';
import { getUserFromToken } from '@/lib/firebase/adminAuth';
import {
  deleteFileFromGCS,
  resizeImage,
  uploadImageToGCS,
} from '@/lib/firebase/adminStorage';
import { ACCOUNTS, MEMENTOS, MEMENTOS_CACHE } from '@/lib/firebase/collections';
import { adminFirestore } from '@/lib/firebase/firebaseAdmin';
import { Account } from '@/schemas/account';
import { Image, Memento, MementoCache } from '@/schemas/memento';
import { firestore } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.pathname.split('/').pop();

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
  }

  const mementoRef = adminFirestore.collection(MEMENTOS).doc(id);
  const mementoDoc = await mementoRef.get();

  if (!mementoDoc.exists) {
    return NextResponse.json({ message: 'Memento not found' }, { status: 404 });
  }

  const memento = mementoDoc.data() as Memento;

  if (memento.userId !== user.uid) {
    return NextResponse.json({ message: 'Memento not found' }, { status: 404 });
  }

  return NextResponse.json(memento, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.pathname.split('/').pop();

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
  }

  const mementoRef = adminFirestore.collection(MEMENTOS).doc(id);
  const mementoDoc = await mementoRef.get();

  if (!mementoDoc.exists) {
    return NextResponse.json({ message: 'Memento not found' }, { status: 404 });
  }

  const memento = mementoDoc.data() as Memento;

  if (memento.userId !== user.uid) {
    return NextResponse.json({ message: 'Memento not found' }, { status: 404 });
  }

  try {
    const formSchema = z.object({
      title: z.string().min(1, 'Title is required'),
      bodyContent: z.string().min(1, 'Body content is required'),
      heroImageFile: z.instanceof(File).optional(),
    });

    const body = await req.formData();

    const parsedData = {
      title: body.get('title')?.toString() || '',
      bodyContent: body.get('body')?.toString() || '',
      heroImageFile: (body.get('heroImage') as File) || undefined,
    };

    const validationResult = formSchema.safeParse(parsedData);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, heroImageFile, bodyContent } = validationResult.data;

    const now = new Date();
    const updatedAt = {
      unix: Math.floor(now.getTime() / 1000),
      timestamp: now.toISOString(),
      day: now.getUTCDate(),
      month: now.getUTCMonth() + 1,
      year: now.getUTCFullYear(),
    };

    let newMemento: Memento = {
      ...memento,
      title,
      body: bodyContent,
      updatedAt,
    };

    if (heroImageFile !== undefined) {
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

      const newImagesTotalSize =
        heroImageFile.size + thumbnailBuffer.length + dotBuffer.length;

      const accountRef = adminFirestore.collection(ACCOUNTS).doc(user.uid);
      const account = (await accountRef.get()).data() as Account;

      if (
        newImagesTotalSize > memento.heroImage.size &&
        newImagesTotalSize + account.storageUsage.bytesUsed >
          account.storageUsage.maxUsage
      ) {
        return NextResponse.json(
          { message: 'Storage limit reached' },
          { status: 400 }
        );
      }

      await Promise.all([
        deleteFileFromGCS(
          memento.heroImage.dotUrl.replace(
            'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
            ''
          )
        ),
        deleteFileFromGCS(
          memento.heroImage.thumbnailUrl.replace(
            'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
            ''
          )
        ),
        deleteFileFromGCS(
          memento.heroImage.url.replace(
            'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
            ''
          )
        ),
      ]);

      const [heroImageUrl, thumbnailUrl, dotUrl] = await Promise.all([
        uploadImageToGCS(
          heroBuffer,
          `${user.uid}/mementos/${memento.week}/hero/${memento.uid}_${now}_hero.webp`
        ),
        uploadImageToGCS(
          thumbnailBuffer,
          `${user.uid}/mementos/${memento.week}/hero/${memento.uid}_${now}_thumbnail.webp`
        ),
        uploadImageToGCS(
          dotBuffer,
          `${user.uid}/mementos/${memento.week}/hero/${memento.uid}_${now}_dot.webp`
        ),
      ]);

      const newMementoCache: MementoCache = {
        [memento.week]: {
          title,
          heroImage: `${user.uid}/mementos/${memento.week}/hero/${memento.uid}_${now}_dot.webp`,
          mementoId: memento.uid,
        },
      };

      const newHero: Image = {
        dotUrl,
        thumbnailUrl,
        url: heroImageUrl,
        size: newImagesTotalSize,
      };

      newMemento = {
        ...newMemento,
        heroImage: newHero,
      };

      const mementoCacheRef = adminFirestore
        .collection(MEMENTOS_CACHE)
        .doc(user.uid);

      await Promise.all([
        mementoCacheRef.set(newMementoCache, { merge: true }),
        accountRef.update({
          'storageUsage.bytesUsed': firestore.FieldValue.increment(
            newImagesTotalSize - memento.heroImage.size
          ),
        }),
      ]);
    }

    await mementoRef.update(newMemento);

    return NextResponse.json(newMemento, { status: 201 });
  } catch (error) {
    console.error('Error creating memento:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
