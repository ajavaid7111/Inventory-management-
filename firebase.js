// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_ITEM,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_NEXT,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_FIRST,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_LAST,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CENTER,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_FIRE,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}