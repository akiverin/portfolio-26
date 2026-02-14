// src/lib/Cursors.ts
import {
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export class Cursors {
  private _storageKey: string;
  private _cursors: Record<number, string> | null = null; // ← null до первого использования

  constructor(storageKey: string) {
    this._storageKey = storageKey;
  }

  // Ленивая инициализация курсоров
  private get cursors(): Record<number, string> {
    if (this._cursors === null) {
      this._cursors = this.load();
    }
    return this._cursors;
  }

  private load(): Record<number, string> {
    // Проверяем, что мы в браузере
    if (typeof window === "undefined") {
      return {};
    }
    try {
      const saved = sessionStorage.getItem(this._storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  private persist() {
    // Проверяем, что мы в браузере
    if (typeof window === "undefined") {
      return;
    }
    try {
      sessionStorage.setItem(this._storageKey, JSON.stringify(this.cursors));
    } catch {
      // Игнорируем ошибки (например, если sessionStorage заблокирован)
    }
  }

  /**
   * Получить снапшот для конкретной страницы
   */
  async getCursorSnapshot(
    page: number,
    pageSize: number,
    baseQuery: ReturnType<typeof query>,
    ref: CollectionReference<DocumentData>
  ): Promise<QueryDocumentSnapshot<unknown, DocumentData> | null> {
    if (page <= 1) return null;

    const cursorId = this.cursors[page - 1];
    let cursorSnapshot: QueryDocumentSnapshot<unknown, DocumentData> | null =
      null;

    if (cursorId) {
      const docRef = doc(ref, cursorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        cursorSnapshot = docSnap as QueryDocumentSnapshot<
          unknown,
          DocumentData
        >;
      }
    } else {
      // Создаем курсор, если его нет
      const tmpQuery = query(baseQuery, limit((page - 1) * pageSize));
      const tmpSnap = await getDocs(tmpQuery);
      if (!tmpSnap.empty) {
        cursorSnapshot = tmpSnap.docs[tmpSnap.docs.length - 1];
        this.cursors[page - 1] = cursorSnapshot.id;
        this.persist();
      }
    }

    return cursorSnapshot;
  }

  /**
   * Обновить курсор для текущей страницы
   */
  setCursor(page: number, snapshot: DocumentSnapshot<DocumentData>) {
    if (snapshot.id) {
      this.cursors[page] = snapshot.id;
      this.persist();
    }
  }
}
