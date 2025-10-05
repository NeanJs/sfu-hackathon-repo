import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { UserPreferences } from "./types";

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (!getApps().length) {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

export async function initializeAuth(): Promise<void> {
  initializeFirebase();
  try {
    if (auth.currentUser) return;

    if (__initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Error during initial authentication:", error);
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (anonError) {
        console.error("Anonymous sign-in fallback failed:", anonError);
      }
    }
  }
}

export async function signInWithGoogle(): Promise<void> {
  initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
}

export function getCurrentUserId(): string | null {
  initializeFirebase();
  return auth.currentUser ? auth.currentUser.uid : null;
}

const getPreferencesDocRef = () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated.");
  return doc(
    db,
    `artifacts/${__app_id}/users/${userId}/preferences/user_profile`
  );
};

export async function saveUserPreferences(
  preferences: UserPreferences
): Promise<void> {
  initializeFirebase();
  try {
    const docRef = getPreferencesDocRef();
    await setDoc(docRef, preferences, { merge: true });
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
}

export async function loadUserPreferences(): Promise<UserPreferences | null> {
  initializeFirebase();
  try {
    const docRef = getPreferencesDocRef();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserPreferences;
    }
    return null;
  } catch (error) {
    console.error("Error loading user preferences:", error);
    return null;
  }
}
