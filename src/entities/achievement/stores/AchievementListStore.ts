import { makeAutoObservable, runInAction, IReactionDisposer, reaction } from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Achievement, Badge } from '../model/types';
import { getAllAchievements } from '../api/getAllAchievements';
import { PaginationStore } from 'shared/stores/PaginationStore';

const PAGE_SIZE = 6;

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

export class AchievementListStore implements ILocalStore {
  private _allAchievements: Achievement[] = [];
  private _disposers: IReactionDisposer[] = [];

  sortField: SortField = 'date';
  sortDirection: SortDirection = 'desc';
  selectedBadgeIds: string[] = [];

  readonly pagination: PaginationStore;
  meta: Meta = Meta.initial;
  error: string = '';

  constructor() {
    this.pagination = new PaginationStore();
    this.pagination.setPagination({ page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 });

    makeAutoObservable(this);

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

  /** Unique badges extracted from all loaded achievements */
  get availableBadges(): Badge[] {
    const map = new Map<string, Badge>();
    for (const a of this._allAchievements) {
      if (a.badges) {
        for (const b of a.badges) {
          if (!map.has(b.id)) map.set(b.id, b);
        }
      }
    }
    return Array.from(map.values());
  }

  /** Achievements filtered by selected badges */
  get filteredAchievements(): Achievement[] {
    if (this.selectedBadgeIds.length === 0) return this._allAchievements;
    return this._allAchievements.filter((a) =>
      a.badges?.some((b) => this.selectedBadgeIds.includes(b.id)),
    );
  }

  /** Current page slice */
  get achievements(): Achievement[] {
    const start = (this.pagination.page - 1) * PAGE_SIZE;
    return this.filteredAchievements.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAchievements.length / PAGE_SIZE));
  }

  /** Combined sort value for the Select component */
  get sortValue(): SortValue {
    return `${this.sortField}-${this.sortDirection}`;
  }

  /** Fetch achievements from Firebase */
  async fetchAchievements(): Promise<void> {
    if (this.meta === Meta.loading) return;

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

  setSortValue(value: string): void {
    const [field, direction] = value.split('-') as [SortField, SortDirection];
    if (this.sortField === field && this.sortDirection === direction) return;
    this.sortField = field;
    this.sortDirection = direction;
    this.meta = Meta.initial;
    this.fetchAchievements();
  }

  toggleBadge(badgeId: string): void {
    const idx = this.selectedBadgeIds.indexOf(badgeId);
    if (idx >= 0) {
      this.selectedBadgeIds.splice(idx, 1);
    } else {
      this.selectedBadgeIds.push(badgeId);
    }
    this.pagination.setPage(1);
  }

  clearBadgeFilter(): void {
    this.selectedBadgeIds.length = 0;
    this.pagination.setPage(1);
  }

  setPage(page: number): void {
    this.pagination.setPage(Math.min(page, this.totalPages));
  }

  destroy(): void {
    this._disposers.forEach((d) => d());
  }
}
