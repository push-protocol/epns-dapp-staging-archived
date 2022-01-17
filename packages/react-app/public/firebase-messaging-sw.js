importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyC6kALB86VSsvf7MpPi_4XzsM3t0ZaXP88",
  authDomain: "fir-javascript-adb1e.firebaseapp.com",
  projectId: "fir-javascript-adb1e",
  storageBucket: "fir-javascript-adb1e.appspot.com",
  messagingSenderId: "315772483213",
  appId: "1:315772483213:web:b22a0ecd2dbe41f69394c4",
  measurementId: "G-FR9Y1PKG8N"
};
firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/logo192.png",
  };
return window.self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});