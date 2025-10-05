import { NextResponse } from "next/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "../../../firebase.config";

(global as any).__firebase_config = JSON.stringify(firebaseConfig);
(global as any).__app_id = firebaseConfig.appId;

// Initialize Firebase only once
function getDb() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getFirestore();
}

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, "user_preferences"));
    const data = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
