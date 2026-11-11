import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Configure Google Auth Provider with YouTube Data API v3 OAuth Scopes
export const googleProvider = new GoogleAuthProvider();
// Required scopes for YouTube Data API v3 access
googleProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/youtube");
googleProvider.addScope("https://www.googleapis.com/auth/youtube.force-ssl");
googleProvider.setCustomParameters({
  prompt: "consent",
  access_type: "offline",
});

// Initialize Firestore with custom database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

export {
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
};
export type { User };
