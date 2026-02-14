import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "config/api";
import { User } from "entities/user/types";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

export const usersCollection = () => collection(db, "users");
export const userDocRef = (uid: string) => doc(db, "users", uid);

export async function ensureUserDoc(
  uid: string,
  initialData: Partial<User> = {}
) {
  const ref = userDocRef(uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      ...initialData,
      createdAt: serverTimestamp(),
    });
  }
  return ref;
}

export async function getUserProfileFromFirestore(uid: string) {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

export async function updateUserProfileInFirestore(
  uid: string,
  patch: Partial<User>
) {
  const ref = userDocRef(uid);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function signOutFirebase() {
  return signOut(auth);
}

export async function signInWithGooglePopup() {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function resetPasswordEmail(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function updateProfileInFirebase(patch: Partial<User>) {
  if (!auth.currentUser) return;
  await updateProfile(auth.currentUser, patch);
}

export async function getIdTokenFromFirebase(force = false) {
  if (!auth.currentUser) return null;
  return await getIdToken(auth.currentUser, force);
}
