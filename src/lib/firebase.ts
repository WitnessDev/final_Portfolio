import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_p4nWGRQTBHjIEgxiraQDWuHrVz-THFA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "honesty-visuals-cms.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "honesty-visuals-cms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "honesty-visuals-cms.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "663907920113",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:663907920113:web:60a169a70ab00ef9972150",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;