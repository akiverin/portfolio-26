import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'shared/api/firebase';
import { User } from '../model/types';

export const usersCollection = () => collection(db, 'users');
export const userDocRef = (uid: string) => doc(db, 'users', uid);

export async function ensureUserDoc(uid: string, initialData: Partial<User> = {}) {
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

export async function getUserProfileFromFirestore(uid: string): Promise<User | null> {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

export async function updateUserProfileInFirestore(uid: string, patch: Partial<User>) {
  const ref = userDocRef(uid);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
