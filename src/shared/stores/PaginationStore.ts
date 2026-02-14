import { makeAutoObservable } from 'mobx';
import { PaginationT } from 'shared/api/types';

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL = 0;

export class PaginationStore {
  page: number = DEFAULT_PAGE;
  pageSize: number = DEFAULT_PAGE_SIZE;
  total: number = DEFAULT_TOTAL;

  constructor() {
    makeAutoObservable(this);
  }

  setPagination({ page, pageSize, total }: PaginationT): void {
    this.page = Math.max(1, page);
    this.pageSize = Math.max(1, pageSize);
    this.total = Math.max(0, total);
  }

  setPage(page: number): void {
    this.page = Math.max(1, Math.min(page, this.pageCount));
  }

  nextPage(): boolean {
    if (this.page < this.pageCount) {
      this.page += 1;
      return true;
    }
    return false;
  }

  prevPage(): boolean {
    if (this.page > 1) {
      this.page -= 1;
      return true;
    }
    return false;
  }

  reset(): void {
    this.page = DEFAULT_PAGE;
    this.pageSize = DEFAULT_PAGE_SIZE;
    this.total = DEFAULT_TOTAL;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get hasNextPage(): boolean {
    return this.page < this.pageCount;
  }

  get hasPrevPage(): boolean {
    return this.page > 1;
  }

  get isEmpty(): boolean {
    return this.total === 0;
  }
}
