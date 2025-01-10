import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const app = initializeApp({
  apiKey: `${import.meta.env.VITE_FIREBASE_WEB_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_DATABASE_URL}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_WEB_APP_ID}`,
});

export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseFirestore = getFirestore(app);
export const firebaseStorage = getStorage(app);
