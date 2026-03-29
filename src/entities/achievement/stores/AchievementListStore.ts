import { makeAutoObservable, runInAction } from 'mobx';
import { orderBy, OrderByDirection } from 'firebase/firestore';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Achievement } from '../model/types';
import { fetchPaginatedCollection } from 'shared/api/firestoreHelpers';
import { snapshotToAchievement } from '../api/snapshotToAchievement';
import { PaginationStore } from 'shared/stores/PaginationStore';
import { Cursors } from 'shared/lib/cursors';

const DEFAULT_PAGE_SIZE = 6;

export type SortField = 'date' | 'title';
export type SortDirection = 'asc' | 'desc';

export type SortValue = `${SortField}-${SortDirection}`;

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'title-asc', label: 'По названию А–Я' },
  { value: 'title-desc', label: 'По названию Я–А' },
];

export { SORT_OPTIONS };

export type AchievementListStoreOptions = {
  pageSize?: number;
};

export class AchievementListStore implements ILocalStore {
  private readonly _pageSize: number;
  private _cursors: Cursors;
  private _achievements: Achievement[] = [];

  sortField: SortField = 'date';
  sortDirection: SortDirection = 'desc';

  readonly pagination: PaginationStore;
  meta: Meta = Meta.initial;
  error: string = '';

  constructor(options?: AchievementListStoreOptions) {
    this._pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
    this._cursors = new Cursors(
      `achievements-${this.sortField}-${this.sortDirection}-${this._pageSize}`,
    );
    this.pagination = new PaginationStore();
    this.pagination.setPagination({
      page: 1,
      pageSize: this._pageSize,
      pageCount: 1,
      total: 0,
    });

    makeAutoObservable(this);
  }

  get achievements(): Achievement[] {
    return this._achievements;
  }

  get totalPages(): number {
    return this.pagination.pageCount;
  }

  get sortValue(): SortValue {
    return `${this.sortField}-${this.sortDirection}`;
  }

  async fetchAchievements(): Promise<void> {
    if (this.meta === Meta.loading) return;

    runInAction(() => {
      this.meta = Meta.loading;
      this.error = '';
    });

    const response = await fetchPaginatedCollection(
      'achievements',
      this.pagination.page,
      this._pageSize,
      this._cursors,
      snapshotToAchievement,
      [orderBy(this.sortField, this.sortDirection as OrderByDirection)],
    );

    if (response.isError) {
      runInAction(() => {
        this.error = response.error instanceof Error ? response.error.message : 'Unknown error';
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this._achievements = response.data.data;
      this.pagination.setPagination(response.data.pagination);
      this.meta = Meta.success;
    });
  }

  setSortValue(value: string): void {
    const [field, direction] = value.split('-') as [SortField, SortDirection];
    if (this.sortField === field && this.sortDirection === direction) return;
    this.sortField = field;
    this.sortDirection = direction;
    this._cursors = new Cursors(`achievements-${field}-${direction}-${this._pageSize}`);
    this.pagination.setPagination({
      page: 1,
      pageSize: this._pageSize,
      pageCount: 1,
      total: 0,
    });
    this.meta = Meta.initial;
    void this.fetchAchievements();
  }

  setPage(page: number): void {
    const prev = this.pagination.page;
    this.pagination.setPage(page);
    if (this.pagination.page !== prev) {
      void this.fetchAchievements();
    }
  }

  destroy(): void {
    // Cursor state is kept in sessionStorage; no subscriptions to clear.
  }
}
