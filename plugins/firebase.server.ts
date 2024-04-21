import { initializeApp, cert, getApp } from "firebase-admin/app";

/**
 * Make sure that we initialize the firebase app only once
 */
const createFirebaseApp = () => {
  const config = useRuntimeConfig();
  try {
    return getApp();
  } catch {
    const firebaseConfig = {
      credential: cert({
        projectId: (config.firebaseadmin as any).projectId as string,
        clientEmail: (config.firebaseadmin as any).clientEmail as string,
        privateKey: (config.firebaseadmin as any).privateKey  as string,
      }),
    };
    return initializeApp(firebaseConfig);
  }
};

export default defineNuxtPlugin(() => {
  createFirebaseApp();
});