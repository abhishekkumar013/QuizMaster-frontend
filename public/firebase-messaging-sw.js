importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_API_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_API_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_API_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_API_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_API_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_API_MEASUREMENT_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
