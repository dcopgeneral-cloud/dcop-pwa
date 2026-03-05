/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBLqSy3SaVPWSs84MVT-ldasRlYJE3Eb3E",
  authDomain: "dcop-3f43c.firebaseapp.com",
  projectId: "dcop-3f43c",
  storageBucket: "dcop-3f43c.firebasestorage.app",
  messagingSenderId: "388817083561",
  appId: "1:388817083561:web:4705f8127d61ecb987ddb8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'DCoP', {
    body: body || '',
    icon: icon || '/logo192.png',
    badge: '/logo192.png',
    tag: payload.data?.type || 'dcop',
    data: payload.data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
