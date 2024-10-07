import { ACCOUNTS } from '@/lib/firebase/collections';
import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase/firebaseAdmin';
import { getUserFromToken } from '@/lib/firebase/adminAuth';
import { Account, NewAccountSchema } from '@/lib/schemas/account';

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const doc = await adminFirestore.collection(ACCOUNTS).doc(user.uid).get();

    if (!doc.exists) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(doc.data(), { status: 200 });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (user === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const doc = await adminFirestore.collection(ACCOUNTS).doc(user.uid).get();

    if (doc.exists) {
      return NextResponse.json(
        { message: 'Account already exists' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const validationResult = NewAccountSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    const newAccountData = validationResult.data;

    const now = new Date();

    const newAccount: Account = {
      firstName: newAccountData.firstName,
      surname: newAccountData.surname,
      dob: newAccountData.dob,
      plan: newAccountData.plan,
      createdAt: {
        unix: now.getTime(),
        timestamp: now.toISOString(),
        day: now.getUTCDate(),
        month: now.getUTCMonth() + 1,
        year: now.getUTCFullYear(),
      },
      uid: user.uid,
      storageUsage: {
        bytesUsed: 0,
        maxUsage: 5368709120, // 5GB in bytes
      },
    };

    await adminFirestore.collection(ACCOUNTS).doc(user.uid).create(newAccount);

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
