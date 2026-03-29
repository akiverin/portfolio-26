import { makeObservable, observable, computed, action, runInAction } from 'mobx';
import { orderBy as firestoreOrderBy } from 'firebase/firestore';
import { BaseStore } from 'shared/stores/BaseStore';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Cursors } from 'shared/lib/cursors';
import {
  fetchAdminPage,
  adminCreateDoc,
  adminUpdateDoc,
  adminDeleteDoc,
  adminBulkDelete,
  AdminRow,
} from 'shared/api/adminApi';

const PAGE_SIZE = 10;

export class AdminCollectionStore extends BaseStore implements ILocalStore {
  private readonly _collection: string;
  private readonly _cursors: Cursors;

  items: AdminRow[] = [];
  page = 1;
  pageCount = 0;
  total = 0;
  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';
  selectedIds: string[] = [];
  editingId: string | null = null;
  editingData: Record<string, unknown> | null = null;
  deleteId: string | null = null;
  showBulkDelete = false;
  showCreateModal = false;

  constructor(collectionName: string) {
    super();
    this._collection = collectionName;
    this._cursors = new Cursors(`admin-${collectionName}`);
    makeObservable(this, {
      items: observable,
      page: observable,
      pageCount: observable,
      total: observable,
      sortKey: observable,
      sortDir: observable,
      selectedIds: observable,
      editingId: observable,
      editingData: observable,
      deleteId: observable,
      showBulkDelete: observable,
      showCreateModal: observable,
      meta: observable,
      error: observable,
      sortedItems: computed,
      allSelected: computed,
      hasSelection: computed,
      setPage: action.bound,
      setSort: action.bound,
      toggleSelect: action.bound,
      toggleSelectAll: action.bound,
      clearSelection: action.bound,
      openEdit: action.bound,
      closeEdit: action.bound,
      openCreate: action.bound,
      closeCreate: action.bound,
      openDelete: action.bound,
      closeDelete: action.bound,
      openBulkDelete: action.bound,
      closeBulkDelete: action.bound,
    });
  }

  get sortedItems(): AdminRow[] {
    if (!this.sortKey) return this.items;
    return [...this.items].sort((a, b) => {
      const aVal = a[this.sortKey];
      const bVal = b[this.sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const aTs = (aVal as { seconds?: number }).seconds;
      const bTs = (bVal as { seconds?: number }).seconds;
      if (aTs !== undefined && bTs !== undefined) {
        return this.sortDir === 'asc' ? aTs - bTs : bTs - aTs;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  get allSelected(): boolean {
    return this.items.length > 0 && this.selectedIds.length === this.items.length;
  }

  get hasSelection(): boolean {
    return this.selectedIds.length > 0;
  }

  setPage(p: number): void {
    this.page = p;
    this.clearSelection();
    this.fetch(true);
  }

  setSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  toggleSelect(id: string): void {
    const idx = this.selectedIds.indexOf(id);
    if (idx === -1) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(idx, 1);
    }
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedIds = [];
    } else {
      this.selectedIds = this.items.map((i) => i.id);
    }
  }

  clearSelection(): void {
    this.selectedIds = [];
  }

  openEdit(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      this.editingId = id;
      this.editingData = { ...item };
    }
  }

  closeEdit(): void {
    this.editingId = null;
    this.editingData = null;
  }

  openCreate(): void {
    this.showCreateModal = true;
    this.editingData = {};
  }

  closeCreate(): void {
    this.showCreateModal = false;
    this.editingData = null;
  }

  openDelete(id: string): void {
    this.deleteId = id;
  }

  closeDelete(): void {
    this.deleteId = null;
  }

  openBulkDelete(): void {
    this.showBulkDelete = true;
  }

  closeBulkDelete(): void {
    this.showBulkDelete = false;
  }

  async fetch(skipCount = false): Promise<void> {
    this.setLoading();
    try {
      const result = await fetchAdminPage(
        this._collection,
        this.page,
        PAGE_SIZE,
        this._cursors,
        [firestoreOrderBy('__name__')],
        skipCount && this.total > 0 ? this.total : undefined,
      );
      runInAction(() => {
        this.items = result.items;
        this.pageCount = result.pageCount;
        this.total = result.total;
        this.setSuccess();
      });
    } catch (e) {
      this.setError(e);
    }
  }

  async create(data: Record<string, unknown>): Promise<string> {
    const id = await adminCreateDoc(this._collection, data);
    await this.fetch();
    return id;
  }

  async update(id: string, data: Record<string, unknown>): Promise<void> {
    const cleanData = { ...data };
    delete cleanData['id'];
    await adminUpdateDoc(this._collection, id, cleanData);
    await this.fetch();
  }

  async updateCell(id: string, key: string, value: unknown): Promise<void> {
    await adminUpdateDoc(this._collection, id, { [key]: value });
    runInAction(() => {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item[key] = value;
      }
    });
  }

  async remove(id: string): Promise<void> {
    await adminDeleteDoc(this._collection, id);
    await this.fetch();
  }

  async removeBulk(): Promise<void> {
    if (this.selectedIds.length === 0) return;
    await adminBulkDelete(this._collection, [...this.selectedIds]);
    runInAction(() => {
      this.selectedIds = [];
      this.showBulkDelete = false;
    });
    await this.fetch();
  }

  destroy(): void {
    /* no disposers needed */
  }
}
