export type SearchParams = {
  search: string;
  genre: string | null;
  actor: string | null;
  rating: number | null;
  page: number;
};

export type UpdateUrlFn = (params: Partial<SearchParams>) => void;

export default class SearchParamsModel {
  private _updateUrl: UpdateUrlFn;

  search: string = "";
  genre: string | null = null;
  actor: string | null = null;
  rating: number | null = null;
  page: number = 1;

  constructor(initialParams: URLSearchParams, updateUrl: UpdateUrlFn) {
    this._updateUrl = updateUrl;
    this.initFromParams(initialParams);
  }

  initFromParams(params: URLSearchParams) {
    this.search = params.get("search") || "";
    this.genre = params.get("genre") ? params.get("genre") : null;
    this.actor = params.get("actor") ? params.get("actor") : null;
    this.rating = params.get("rating") ? Number(params.get("rating")) : null;
    this.page = params.get("page") ? Number(params.get("page")) : 1;
  }

  setSearch(search: string) {
    this.search = search;
    this.page = 1;
    this._updateUrl({ search, page: 1 });
  }

  setGenre(genre: string | null) {
    this.genre = genre;
    this.page = 1;
    this._updateUrl({ genre, page: 1 });
  }

  setActor(actor: string | null) {
    this.actor = actor;
    this.page = 1;
    this._updateUrl({ actor, page: 1 });
  }

  setRating(rating: number | null) {
    this.rating = rating;
    this.page = 1;
    this._updateUrl({ rating, page: 1 });
  }

  setPage(page: number) {
    this.page = page;
    this._updateUrl({ page });
  }

  toObject(): SearchParams {
    return {
      search: this.search,
      genre: this.genre,
      actor: this.actor,
      rating: this.rating,
      page: this.page,
    };
  }
}
