import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBLqSy3SaVPWSs84MVT-ldasRlYJE3Eb3E",
  authDomain: "dcop-3f43c.firebaseapp.com",
  projectId: "dcop-3f43c",
  storageBucket: "dcop-3f43c.firebasestorage.app",
  messagingSenderId: "388817083561",
  appId: "1:388817083561:web:4705f8127d61ecb987ddb8",
  measurementId: "G-E3WP2S7YPC"
};

export const VAPID_KEY = "BPS27JlgizRWTq7s3czhUxShCwankwF-eBiL7qVn2A0dtR4BbUdCHlcxFPTQBvbl2NClmCkMAzXpua7uikfYoE4";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      return token;
    }
    return null;
  } catch (err) {
    console.error('Notification permission error:', err);
    return null;
  }
}

export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}

export default app;
