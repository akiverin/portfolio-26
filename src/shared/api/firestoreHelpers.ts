import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  limit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
  DocumentData,
  CollectionReference,
  Query,
} from 'firebase/firestore';
import { db } from './firebase';
import { BaseResponse, PaginatedResponse, PaginationT } from './types';
import { Cursors } from 'shared/lib/cursors';

/**
 * Fetches all documents from a Firestore collection with given constraints.
 */
export async function fetchCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  mapper: (docSnap: DocumentSnapshot<DocumentData>) => T | Promise<T>,
): Promise<BaseResponse<T[]>> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    const items = await Promise.all(snapshot.docs.map((d) => mapper(d)));
    return { isError: false, data: items };
  } catch (error) {
    return { isError: true, data: null, error };
  }
}

/**
 * Fetches a single document from Firestore by ID.
 */
export async function fetchDocument<T>(
  collectionName: string,
  docId: string,
  mapper: (docSnap: DocumentSnapshot<DocumentData>) => T | Promise<T>,
): Promise<BaseResponse<T>> {
  try {
    const ref = doc(db, collectionName, docId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      return { isError: true, data: null, error: new Error('Document not found') };
    }
    const data = await Promise.resolve(mapper(snapshot));
    return { isError: false, data };
  } catch (error) {
    return { isError: true, data: null, error };
  }
}

/**
 * Fetches documents with cursor-based pagination.
 */
export async function fetchPaginatedCollection<T>(
  collectionName: string,
  page: number,
  pageSize: number,
  cursorsManager: Cursors,
  mapper: (docSnap: DocumentSnapshot<DocumentData>) => T | Promise<T>,
  baseConstraints: QueryConstraint[] = [],
): Promise<BaseResponse<PaginatedResponse<T>>> {
  try {
    const ref = collection(db, collectionName);
    const baseQuery = query(ref, ...baseConstraints);

    const cursorSnapshot = await cursorsManager.getCursorSnapshot(
      page,
      pageSize,
      baseQuery,
      ref as CollectionReference<DocumentData>,
    );

    let paginatedQuery: Query<DocumentData>;
    if (cursorSnapshot) {
      paginatedQuery = query(baseQuery, startAfter(cursorSnapshot), limit(pageSize));
    } else {
      paginatedQuery = query(baseQuery, limit(pageSize));
    }

    const snapshot = await getDocs(paginatedQuery);

    if (!snapshot.empty) {
      cursorsManager.setCursor(page, snapshot.docs[snapshot.docs.length - 1]);
    }

    const items = await Promise.all(snapshot.docs.map((d) => mapper(d)));

    // Get total count
    const totalSnapshot = await getDocs(query(ref));
    const total = totalSnapshot.size;
    const pageCount = Math.ceil(total / pageSize);

    const pagination: PaginationT = { page, pageSize, pageCount, total };

    return { isError: false, data: { data: items, pagination } };
  } catch (error) {
    return { isError: true, data: null, error };
  }
}
