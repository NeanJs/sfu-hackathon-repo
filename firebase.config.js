import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCJ3hdV0kJgn8zX47vBStd6znOZH43U-q4",
  authDomain: "leadger-4e59c.firebaseapp.com",
  projectId: "leadger-4e59c",
  storageBucket: "leadger-4e59c.firebasestorage.app",
  messagingSenderId: "1015238957515",
  appId: "1:1015238957515:web:cdb56484f864b440c47e4e",
  measurementId: "G-0N675MTVMY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

