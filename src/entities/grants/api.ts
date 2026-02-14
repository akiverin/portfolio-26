import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  startAfter,
  DocumentReference,
  QueryDocumentSnapshot,
  DocumentData,
  DocumentSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "config/api";
import { PaginationT } from "entities/pagination/types";
import { Grant } from "./types";
import { Cursors } from "utils/cursors";

export const snapshotToObject = async (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
) => {
  const data = snapshot.data();
  if (!data) throw new Error("No data found");
  return {
    ...data,
    id: snapshot.id,
  } as Grant;
};

/**
 * Получение гранта по id
 */
export const getGrantById = async (id: string): Promise<Grant> => {
  const ref = doc(db, "grants", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Grant not found");
  }

  return { ...(snapshot.data() as Grant) };
};

/**
 * Получение грантов с пагинацией и фильтрацией
 */
const cursorsManager = new Cursors("grant_pagination_cursors");

export const getPaginatedGrants = async (
  page: number,
  pageSize: number,
  filters?: Record<string, string | number | boolean | null>
): Promise<{ data: Grant[]; pagination: PaginationT }> => {
  let baseQuery = query(collection(db, "grants"));
  if (filters?.title) {
    baseQuery = query(baseQuery, where("title", ">=", filters.title));
  }

  let q = baseQuery;
  const ref = collection(db, "grants");

  const cursorSnapshot = await cursorsManager.getCursorSnapshot(
    page,
    pageSize,
    baseQuery,
    ref
  );

  if (cursorSnapshot) {
    q = query(baseQuery, startAfter(cursorSnapshot), limit(pageSize));
  } else {
    q = query(baseQuery, limit(pageSize));
  }

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    cursorsManager.setCursor(page, snapshot.docs[snapshot.docs.length - 1]);
  }

  const grants: Grant[] = await Promise.all(
    snapshot.docs.map((doc) => snapshotToObject(doc))
  );

  const totalSnapshot = await getDocs(collection(db, "grants"));
  const total = totalSnapshot.size;
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: grants,
    pagination: {
      page,
      pageSize,
      pageCount,
      total,
    },
  };
};

/**
 * Получение всех грантов без пагинации
 */
export const getAllGrants = async (): Promise<Grant[]> => {
  const q = query(collection(db, "grants"), orderBy("startDate", "desc"));
  const snapshot = await getDocs(q);
  const grants: Grant[] = await Promise.all(
    snapshot.docs.map((doc) => snapshotToObject(doc))
  );
  return grants;
};
