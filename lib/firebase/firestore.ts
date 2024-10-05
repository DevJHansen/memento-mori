import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './firebase';

export const firestoreDB = getFirestore(firebaseApp);
