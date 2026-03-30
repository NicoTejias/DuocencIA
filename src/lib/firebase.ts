import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase is properly configured
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId;

// Initialize Firebase only if config is present to avoid crashing the app
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
      messaging = getMessaging(app);
    }
  } catch (error) {
    if (import.meta.env.DEV) console.error("❌ Failed to initialize Firebase:", error);
  }
} else {
  if (import.meta.env.DEV) console.warn("⚠️ Firebase is not configured. Push notifications and analytics will be disabled. Check your environment variables (VITE_FIREBASE_...).");
}

export { app, analytics, messaging };

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, {
        vapidKey: vapidKey || undefined
      });
      return token;
    }
  } catch {
    // Error silenciado — fallo al obtener token push no debe interrumpir la app
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
