import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import axio from "./axios";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_API_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_API_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_API_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_API_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_API_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_API_MEASUREMENT_ID,
};

let messaging: Messaging | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { messaging };

export const generateToken = async () => {
  if (!messaging) return;

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    // Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_API_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    await axio.put("/auth/user/save-token", { token });
  } else {
    console.warn("Notification permission not granted.");
  }
};

export const listenToMessages = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    const { title, body } = payload.notification || {};

    if (Notification.permission === "granted") {
      new Notification(title ?? "New Quiz", {
        body: body ?? "You've got something new!",
      });
    }
  });
};
