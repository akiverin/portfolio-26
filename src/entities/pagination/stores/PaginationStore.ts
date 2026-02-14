import { makeAutoObservable } from "mobx";
import { PaginationT } from "../types";

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
    const newPage = Math.max(1, Math.min(page, this.pageCount));
    this.page = newPage;
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

  get startItem(): number {
    return Math.min((this.page - 1) * this.pageSize + 1, this.total);
  }

  get endItem(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  get isEmpty(): boolean {
    return this.total === 0;
  }

  getPageRange(maxVisible: number = 5): number[] {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.page - half);
    const end = Math.min(this.pageCount, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
