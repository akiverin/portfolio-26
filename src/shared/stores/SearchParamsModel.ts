export type SearchParams = {
  search: string;
  page: number;
};

export type UpdateUrlFn = (params: Partial<SearchParams>) => void;

export class SearchParamsModel {
  private readonly _updateUrl: UpdateUrlFn;

  search: string = '';
  page: number = 1;

  constructor(initialParams: URLSearchParams, updateUrl: UpdateUrlFn) {
    this._updateUrl = updateUrl;
    this.initFromParams(initialParams);
  }

  initFromParams(params: URLSearchParams): void {
    this.search = params.get('search') || '';
    this.page = params.get('page') ? Number(params.get('page')) : 1;
  }

  setSearch(search: string): void {
    this.search = search;
    this.page = 1;
    this._updateUrl({ search, page: 1 });
  }

  setPage(page: number): void {
    this.page = page;
    this._updateUrl({ page });
  }

  toObject(): SearchParams {
    return {
      search: this.search,
      page: this.page,
    };
  }
}
