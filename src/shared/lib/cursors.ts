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
  Query,
} from 'firebase/firestore';

/**
 * Manages Firestore cursor-based pagination via sessionStorage.
 * Stores document IDs for each page to enable efficient startAfter queries.
 */
export class Cursors {
  private readonly _storageKey: string;
  private _cursors: Record<number, string> | null = null;

  constructor(storageKey: string) {
    this._storageKey = storageKey;
  }

  private get cursors(): Record<number, string> {
    if (this._cursors === null) {
      this._cursors = this._load();
    }
    return this._cursors;
  }

  private _load(): Record<number, string> {
    if (typeof window === 'undefined') return {};
    try {
      const saved = sessionStorage.getItem(this._storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  private _persist(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(this._storageKey, JSON.stringify(this.cursors));
    } catch {
      // Ignore if sessionStorage is blocked
    }
  }

  async getCursorSnapshot(
    page: number,
    pageSize: number,
    baseQuery: Query<DocumentData>,
    ref: CollectionReference<DocumentData>,
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    if (page <= 1) return null;

    const cursorId = this.cursors[page - 1];
    let cursorSnapshot: QueryDocumentSnapshot<DocumentData> | null = null;

    if (cursorId) {
      const docRef = doc(ref, cursorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        cursorSnapshot = docSnap as unknown as QueryDocumentSnapshot<DocumentData>;
      }
    } else {
      const tmpQuery = query(baseQuery, limit((page - 1) * pageSize));
      const tmpSnap = await getDocs(tmpQuery);
      if (!tmpSnap.empty) {
        cursorSnapshot = tmpSnap.docs[tmpSnap.docs.length - 1];
        this.cursors[page - 1] = cursorSnapshot.id;
        this._persist();
      }
    }

    return cursorSnapshot;
  }

  setCursor(page: number, snapshot: DocumentSnapshot<DocumentData>): void {
    if (snapshot.id) {
      this.cursors[page] = snapshot.id;
      this._persist();
    }
  }
}
