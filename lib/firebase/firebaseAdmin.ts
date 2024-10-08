import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '')
    ),
  });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
