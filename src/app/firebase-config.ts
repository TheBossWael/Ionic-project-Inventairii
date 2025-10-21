import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBZCfwhkfly0sgwHpa1qZ9HO4wfjo2Fwzs",
  authDomain: "inventairii.firebaseapp.com",
  projectId: "inventairii",
  storageBucket: "inventairii.firebasestorage.app",
  messagingSenderId: "1036440727073",
  appId: "1:1036440727073:web:986d55693709f8fa3c7d60"
};

// Initialize Firebase and firebase auth and firebase storage
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
