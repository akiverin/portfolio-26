import { makeAutoObservable, runInAction, IReactionDisposer, reaction } from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Achievement } from '../model/types';
import { getAllAchievements } from '../api/getAllAchievements';
import { PaginationStore } from 'shared/stores/PaginationStore';

const PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 400;

export type SortField = 'date' | 'title';
export type SortDirection = 'asc' | 'desc';

export class AchievementListStore implements ILocalStore {
  private _allAchievements: Achievement[] = [];
  private _disposers: IReactionDisposer[] = [];
  private _searchTimeout: ReturnType<typeof setTimeout> | null = null;

  search: string = '';
  sortField: SortField = 'date';
  sortDirection: SortDirection = 'desc';

  readonly pagination: PaginationStore;
  meta: Meta = Meta.initial;
  error: string = '';

  constructor() {
    this.pagination = new PaginationStore();
    this.pagination.setPagination({ page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 });

    makeAutoObservable(this);

    // Keep pagination total in sync with fetched results
    this._disposers.push(
      reaction(
        () => this._allAchievements.length,
        (total) => {
          this.pagination.setPagination({
            page: Math.min(this.pagination.page, Math.max(1, Math.ceil(total / PAGE_SIZE))),
            pageSize: PAGE_SIZE,
            pageCount: Math.ceil(total / PAGE_SIZE),
            total,
          });
        },
      ),
    );
  }

  /** Current page of achievements (already filtered & sorted by Firebase) */
  get achievements(): Achievement[] {
    const start = (this.pagination.page - 1) * PAGE_SIZE;
    return this._allAchievements.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this._allAchievements.length / PAGE_SIZE));
  }

  get hasNextPage(): boolean {
    return this.pagination.page < this.totalPages;
  }

  get hasPrevPage(): boolean {
    return this.pagination.page > 1;
  }

  /** Fetch achievements from Firebase with current search/sort params */
  async fetchAchievements(): Promise<void> {
    if (this.meta === Meta.loading) return;

    this.meta = Meta.loading;
    this.error = '';

    const response = await getAllAchievements(this.sortField, this.sortDirection, this.search);

    if (response.isError) {
      runInAction(() => {
        this.error = response.error instanceof Error ? response.error.message : 'Unknown error';
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this._allAchievements = response.data;
      this.meta = Meta.success;
    });
  }

  setSearch(value: string): void {
    this.search = value;
    this.pagination.setPage(1);
    this._debouncedFetch();
  }

  setSort(field: SortField, direction: SortDirection): void {
    if (this.sortField === field && this.sortDirection === direction) return;
    this.sortField = field;
    this.sortDirection = direction;
    // Reset loading guard so sort always triggers a new fetch
    this.meta = Meta.initial;
    this.fetchAchievements();
  }

  setPage(page: number): void {
    this.pagination.setPage(Math.min(page, this.totalPages));
  }

  private _debouncedFetch(): void {
    if (this._searchTimeout) clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => {
      runInAction(() => {
        // Reset guard so the debounced fetch can proceed
        if (this.meta === Meta.loading) return;
        this.fetchAchievements();
      });
    }, SEARCH_DEBOUNCE_MS);
  }

  destroy(): void {
    this._disposers.forEach((d) => d());
    if (this._searchTimeout) clearTimeout(this._searchTimeout);
  }
}
