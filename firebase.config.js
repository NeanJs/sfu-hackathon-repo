// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = { // Added export
  apiKey: "AIzaSyCJ3hdV0kJgn8zX47vBStd6znOZH43U-q4",
  authDomain: "leadger-4e59c.firebaseapp.com",
  projectId: "leadger-4e59c",
  storageBucket: "leadger-4e59c.firebasestorage.app",
  messagingSenderId: "1015238957515",
  appId: "1:1015238957515:web:cdb56484f864b440c47e4e",
  measurementId: "G-0N675MTVMY"
};

// Initialize Firebase
// The app and analytics initialization should ideally be handled within firestore_service.ts
// or a dedicated client-side Firebase initialization file, not directly in a config file
// that's imported by server-side API routes.
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
