import {
  createUserWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from 'shared/api/firebase';
import { User } from '../model/types';

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
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
