import {
  makeAutoObservable,
  runInAction,
  IReactionDisposer,
  reaction,
} from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Achievement } from '../model/types';
import { getAllAchievements } from '../api/getAllAchievements';
import { PaginationStore } from 'shared/stores/PaginationStore';

const PAGE_SIZE = 6;

export type SortField = 'date' | 'title';
export type SortDirection = 'asc' | 'desc';

export class AchievementListStore implements ILocalStore {
  private _allAchievements: Achievement[] = [];
  private _disposers: IReactionDisposer[] = [];

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

    // Keep pagination total in sync with filtered results
    this._disposers.push(
      reaction(
        () => this.filteredAchievements.length,
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

  /** Filtered achievements based on search query */
  get filteredAchievements(): Achievement[] {
    if (!this.search.trim()) {
      return this._allAchievements;
    }

    const query = this.search.toLowerCase().trim();

    return this._allAchievements.filter(
      (a) => a.title.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query),
    );
  }

  /** Current page of achievements */
  get achievements(): Achievement[] {
    const start = (this.pagination.page - 1) * PAGE_SIZE;
    return this.filteredAchievements.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAchievements.length / PAGE_SIZE));
  }

  get hasNextPage(): boolean {
    return this.pagination.page < this.totalPages;
  }

  get hasPrevPage(): boolean {
    return this.pagination.page > 1;
  }

  /** Fetch achievements from Firebase with current sort order */
  async fetchAchievements(): Promise<void> {
    this.meta = Meta.loading;
    this.error = '';

    const response = await getAllAchievements(this.sortField, this.sortDirection);

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
  }

  setSort(field: SortField, direction: SortDirection): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.fetchAchievements();
  }

  setPage(page: number): void {
    this.pagination.setPage(Math.min(page, this.totalPages));
  }

  destroy(): void {
    this._disposers.forEach((d) => d());
  }
}
