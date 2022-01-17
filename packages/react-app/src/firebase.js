import firebase from 'firebase/app'

// import * as dotenv from "dotenv";
import 'firebase/messaging'
// dotenv.config();



const firebaseConfig = {
    apiKey: "AIzaSyC6kALB86VSsvf7MpPi_4XzsM3t0ZaXP88",
    authDomain: "fir-javascript-adb1e.firebaseapp.com",
    projectId: "fir-javascript-adb1e",
    storageBucket: "fir-javascript-adb1e.appspot.com",
    messagingSenderId: "315772483213",
    appId: "1:315772483213:web:b22a0ecd2dbe41f69394c4",
    measurementId: "G-FR9Y1PKG8N"
  };


  export const initializeFirebase = () => {

    const firebaseConfig = {
        apiKey: "AIzaSyC6kALB86VSsvf7MpPi_4XzsM3t0ZaXP88",
        authDomain: "fir-javascript-adb1e.firebaseapp.com",
        projectId: "fir-javascript-adb1e",
        storageBucket: "fir-javascript-adb1e.appspot.com",
        messagingSenderId: "315772483213",
        appId: "1:315772483213:web:b22a0ecd2dbe41f69394c4",
        measurementId: "G-FR9Y1PKG8N"
      };

    firebase.initializeApp(firebaseConfig)

  }

firebase.initializeApp(firebaseConfig)
export const messaging = firebase.messaging()

export const getToken = () => {
  return new Promise(async (resolve, reject) => {
    const numOfAttempts = 3
    let tries = 1
    let attempting = true

    while (attempting) {
      try {
        const currentToken = await messaging.getToken({vapidKey: "BPu4FD27gHIV6Nnehlr-IhkRQ0_-_IcW6pXU4bBPKvL6coznYcQdLpnGeGpYe1RC11S0qf1kaMLc4d6cUcTYkwY"});

        if (currentToken) {
          resolve(currentToken)
          attempting = false
        }
        else {
          console.error('No registration token available. Request permission to generate one.')
          reject(true)
          attempting = false
        }
      }
      catch(err) {
        if (tries > numOfAttempts) {
          attempting = false;
          console.error('FCM | Request retries failed, Error: ', err)
        }
        else {
          console.log("FCM | Request Failed... Retrying: " + tries + " / " + numOfAttempts)
        }
      }

      tries = tries + 1
    }
  })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload)
    })
  })