import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  User,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import { logActivity } from "../services/activityService"; // ✅ ADDED

const provider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, provider);

  await setDoc(
    doc(db, "users", result.user.uid),
    {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || "",
      photoURL: result.user.photoURL || "",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return result.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function signup(email: string, password: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // ✅ ADDED LOG
  await logActivity('New account registered', email);

  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: "",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  await sendEmailVerification(cred.user);

  return cred.user;
}

export async function resendVerificationEmail(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("No logged-in user found.");
  }

  await sendEmailVerification(auth.currentUser);
}

export async function refreshCurrentUser() {
  if (!auth.currentUser) {
    return null;
  }

  await reload(auth.currentUser);
  return auth.currentUser;
}

export async function login(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function watchAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}