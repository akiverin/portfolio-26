import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "config/api";
import { PaginationT } from "entities/pagination/types";
import { Project } from "./types";
import { Cursors } from "utils/cursors";

export const snapshotToObject = async (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
) => {
  const data = snapshot.data();
  if (!data) throw new Error("No data found");
  return {
    ...data,
    id: snapshot.id,
  } as Project;
};

/**
 * Получение проекта по id
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const ref = doc(db, "projects", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Project not found");
  }

  return { ...(snapshot.data() as Project) };
};

/**
 * Получение проектов с пагинацией и фильтрацией
 */
const cursorsManager = new Cursors("project_pagination_cursors");

export const getPaginatedProjects = async (
  page: number,
  pageSize: number,
  filters?: Record<string, string | number | boolean | null>
): Promise<{ data: Project[]; pagination: PaginationT }> => {
  let baseQuery = query(collection(db, "projects"));
  if (filters?.title) {
    baseQuery = query(baseQuery, where("title", ">=", filters.title));
  }

  let q = baseQuery;
  const ref = collection(db, "projects");

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

  const projects: Project[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as Project),
    id: doc.id,
  }));

  const totalSnapshot = await getDocs(collection(db, "projects"));
  const total = totalSnapshot.size;
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: projects,
    pagination: {
      page,
      pageSize,
      pageCount,
      total,
    },
  };
};

/**
 * Получение всех проектов без пагинации
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, "projects"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  const projects: Project[] = await Promise.all(
    snapshot.docs.map((doc) => snapshotToObject(doc))
  );
  return projects;
};
