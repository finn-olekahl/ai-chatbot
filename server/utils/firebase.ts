import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore'; 
import { getStorage } from 'firebase-admin/storage';
const config = useRuntimeConfig();

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: (config.firebaseadmin as any).projectId as string,
        clientEmail: (config.firebaseadmin as any).clientEmail as string,
        privateKey: (config.firebaseadmin as any).privateKey  as string,
      }),
    });

export const authAdmin = getAuth(app);
export const firestoreAdmin = getFirestore(app);
export const storage = getStorage(app);