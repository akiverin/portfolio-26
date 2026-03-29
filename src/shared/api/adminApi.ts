import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getCountFromServer,
  query,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  DocumentSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Cursors } from 'shared/lib/cursors';

export type AdminRow = { id: string } & Record<string, unknown>;

export type AdminPageResult = {
  items: AdminRow[];
  total: number;
  pageCount: number;
};

const rawMapper = (docSnap: DocumentSnapshot<DocumentData>): AdminRow => ({
  id: docSnap.id,
  ...docSnap.data(),
});

export async function fetchAdminPage(
  collectionName: string,
  page: number,
  pageSize: number,
  cursorsManager: Cursors,
  baseConstraints: QueryConstraint[] = [],
  cachedTotal?: number,
): Promise<AdminPageResult> {
  const ref = collection(db, collectionName);
  const baseQuery = query(ref, ...baseConstraints);

  const cursorSnapshot = await cursorsManager.getCursorSnapshot(
    page,
    pageSize,
    baseQuery,
    ref,
  );

  const paginatedQuery = cursorSnapshot
    ? query(baseQuery, startAfter(cursorSnapshot), limit(pageSize))
    : query(baseQuery, limit(pageSize));


  const snapshotPromise = getDocs(paginatedQuery);
  const countPromise =
    cachedTotal === undefined
      ? getCountFromServer(query(ref, ...baseConstraints)).then((s) => s.data().count)
      : Promise.resolve(cachedTotal);

  const [snapshot, total] = await Promise.all([snapshotPromise, countPromise]);

  if (snapshot.docs.length > 0) {
    const lastDoc = snapshot.docs.at(-1);
    if (lastDoc) cursorsManager.setCursor(page, lastDoc);
  }

  const items = snapshot.docs.map(rawMapper);
  const pageCount = Math.ceil(total / pageSize);

  return { items, total, pageCount };
}

export async function adminCreateDoc(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<string> {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function adminUpdateDoc(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function adminDeleteDoc(
  collectionName: string,
  docId: string,
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await deleteDoc(ref);
}

export async function adminBulkDelete(
  collectionName: string,
  ids: string[],
): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    batch.delete(doc(db, collectionName, id));
  });
  await batch.commit();
}
