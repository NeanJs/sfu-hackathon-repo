import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
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
import { UserPreferences, ProfileQuestion } from "./types";

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

let auth: Auth;
let db: Firestore;
let app: FirebaseApp;

function initializeFirebase() {
  if (!getApps().length) {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

const ANONYMOUS_USER_ID_KEY = "anonymous_user_id";

function getAnonymousUserId(): string {
  // Check if we're on the server side
  if (typeof window === "undefined") {
    return `server-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
  }

  // Client-side code
  let anonymousId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
  if (!anonymousId) {
    anonymousId = `anon-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    localStorage.setItem(ANONYMOUS_USER_ID_KEY, anonymousId);
  }
  return anonymousId;
}

const getOnboardingQuestionsDocRef = () => {
  return doc(db, `artifacts/${__app_id}/config/onboarding_questions`);
};

/**
 * Saves the onboarding questions and their criteria to Firestore.
 * @param questions The array of ProfileQuestion objects to save.
 */
export async function saveOnboardingQuestions(
  questions: ProfileQuestion[]
): Promise<void> {
  initializeFirebase();
  try {
    const docRef = getOnboardingQuestionsDocRef();
    await setDoc(docRef, { questions }, { merge: true });
    console.log("Onboarding questions and criteria saved successfully.");
  } catch (error) {
    console.error("Error saving onboarding questions:", error);
    throw error;
  }
}

/**
 * Loads the onboarding questions and their criteria from Firestore.
 * @returns {Promise<ProfileQuestion[] | null>} The array of ProfileQuestion objects or null if not found.
 */
export async function loadOnboardingQuestions(): Promise<
  ProfileQuestion[] | null
> {
  initializeFirebase();
  try {
    const docRef = getOnboardingQuestionsDocRef();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Onboarding questions and criteria loaded successfully.");
      return docSnap.data().questions as ProfileQuestion[];
    }
    console.log("No onboarding questions and criteria found.");
    return null;
  } catch (error) {
    console.error("Error loading onboarding questions:", error);
    throw error;
  }
}

/**
 * Handles the initial session using a custom token or anonymous sign-in.
 */
export async function initializeAuth(): Promise<void> {
  initializeFirebase();
  try {
    if (auth.currentUser) {
      console.log("User already authenticated.");
      return;
    }
    if (__initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
    console.log("Authentication initialized successfully.");
  } catch (error) {
    console.error("Error during initial authentication:", error);
    try {
      await signInAnonymously(auth);
      console.log("Fell back to anonymous authentication.");
    } catch (anonError) {
      console.error("Anonymous sign-in fallback failed:", anonError);
    }
  }
}

/**
 * Handles explicit Google Sign-In using a popup.
 */
export async function signInWithGoogle(): Promise<void> {
  initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    console.log("Successfully signed in with Google.");
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Gets the current user's UID.
 * @returns {string | null} The user's UID or null if not authenticated.
 */
export function getCurrentUserId(): string | null {
  if (!auth) {
    initializeFirebase();
  }
  return auth.currentUser ? auth.currentUser.uid : null;
}

const getPreferencesDocRef = () => {
  const userId = getCurrentUserId() || getAnonymousUserId(); // Use anonymous ID if not authenticated
  if (!userId) throw new Error("User ID not available.");
  return doc(db, `user_preferences/${userId}`);
};

/**
 * Saves user preferences to Firestore.
 * @param {UserPreferences} preferences - The user's preferences to save.
 */
export async function saveUserPreferences(
  preferences: UserPreferences
): Promise<void> {
  initializeFirebase();
  try {
    const docRef = getPreferencesDocRef();
    await setDoc(docRef, preferences, { merge: true });
    console.log("User preferences saved successfully.");
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
}

/**
 * Loads user preferences from Firestore.
 * @returns {Promise<UserPreferences | null>} The user's preferences or null if not found.
 */
export async function loadUserPreferences(): Promise<UserPreferences | null> {
  initializeFirebase();
  try {
    const docRef = getPreferencesDocRef();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("User preferences loaded successfully.");
      return docSnap.data() as UserPreferences;
    }
    console.log("No user preferences found for the current user.");
    return null;
  } catch (error) {
    console.error("Error loading user preferences:", error);
    throw error;
  }
}
