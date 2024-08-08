// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp8DIvbEtn2YRM1u-NLOPBsYomGbenYUM",
  authDomain: "inventory-managment-65cd2.firebaseapp.com",
  projectId: "inventory-managment-65cd2",
  storageBucket: "inventory-managment-65cd2.appspot.com",
  messagingSenderId: "891265702021",
  appId: "1:891265702021:web:b7af5e4417e2c7d43871ec",
  measurementId: "G-BMXVDG88KV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}