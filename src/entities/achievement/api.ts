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
import { Achievement } from "./types";
import { Cursors } from "utils/cursors";

// Преобразование бейджиков
export const resolveBadges = async (genreRefs: DocumentReference[]) => {
  const badges = [];
  for (const ref of genreRefs) {
    const genreSnapshot = await getDoc(ref);
    if (genreSnapshot.exists()) {
      badges.push({
        id: genreSnapshot.id,
        title: genreSnapshot.data().title || "",
        color: genreSnapshot.data().color || "",
        icon: genreSnapshot.data().icon || "",
      });
    }
  }
  return badges;
};

export const snapshotToObject = async (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
) => {
  const data = snapshot.data();
  if (!data) throw new Error("No data found");
  const badges = await resolveBadges(data.badges || []);
  return {
    ...data,
    id: snapshot.id,
    badges,
  } as Achievement;
};

/**
 * Получение достижения по id
 */
export const getAchievementById = async (id: string): Promise<Achievement> => {
  const ref = doc(db, "achievements", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Project not found");
  }

  return { ...(snapshot.data() as Achievement) };
};

/**
 * Получение достижений с пагинацией и фильтрацией
 */
const cursorsManager = new Cursors("achievement_pagination_cursors");

export const getPaginatedAchievements = async (
  page: number,
  pageSize: number,
  filters?: Record<string, string | number | boolean | null>
): Promise<{ data: Achievement[]; pagination: PaginationT }> => {
  let baseQuery = query(collection(db, "achievements"));
  if (filters?.title) {
    baseQuery = query(baseQuery, where("title", ">=", filters.title));
  }

  let q = baseQuery;
  const ref = collection(db, "achievements");

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

  const achievements: Achievement[] = await Promise.all(
    snapshot.docs.map((doc) => snapshotToObject(doc))
  );

  // const achievements: Achievement[] = snapshot.docs.map((doc) => ({
  //   ...(doc.data() as Achievement),
  //   id: doc.id,
  // }));

  const totalSnapshot = await getDocs(collection(db, "achievements"));
  const total = totalSnapshot.size;
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: achievements,
    pagination: {
      page,
      pageSize,
      pageCount,
      total,
    },
  };
};

/**
 * Получение всех достижений без пагинации
 */
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const q = query(collection(db, "achievements"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  const achievements: Achievement[] = await Promise.all(
    snapshot.docs.map((doc) => snapshotToObject(doc))
  );
  return achievements;
};
