import { makeAutoObservable, runInAction } from "mobx";
import { Meta } from "utils/meta";
import { PaginationStore } from "entities/pagination/stores/PaginationStore";
import { LoadResponse } from "types/loadResponse";
import { errorMessage, isCancelError } from "utils/errors";
import { getAllProjects, getPaginatedProjects } from "../api";
import { Project } from "../types";
import SearchParamsModel, { UpdateUrlFn } from "entities/searchParams/model";

export class ProjectListStore {
  projects: Project[] = [];
  pagination = new PaginationStore();
  meta: Meta = Meta.initial;
  error = "";
  searchModel: SearchParamsModel;
  searchQuery = "";

  constructor(initialParams: URLSearchParams, updateUrl: UpdateUrlFn) {
    makeAutoObservable(this);
    this.searchModel = new SearchParamsModel(initialParams, updateUrl);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  private _prepareFilters(): Record<string, string | number | boolean | null> {
    const filters: Record<string, string | number | boolean | null> = {};

    if (this.searchModel.search) {
      filters.name = this.searchModel.search;
    }

    return filters;
  }

  async fetchProjects(): Promise<LoadResponse> {
    this.meta = Meta.loading;
    this.error = "";

    const page = this.searchModel.page;

    try {
      const filters = this._prepareFilters();
      const { data, pagination } = await getPaginatedProjects(
        page,
        this.pagination.pageSize,
        filters
      );
      runInAction(() => {
        this.projects = data;
        this.pagination.setPagination(pagination);
        this.meta = Meta.success;
      });
      return { success: true };
    } catch (error) {
      if (isCancelError(error)) {
        this.meta = Meta.initial;
        return { success: false };
      }
      runInAction(() => {
        this.error = errorMessage(error);
        this.meta = Meta.error;
      });
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  }

  async fetchAllProjects(): Promise<void> {
    this.meta = Meta.loading;
    this.error = "";
    try {
      const data = await getAllProjects();
      runInAction(() => {
        this.projects = data;
        this.meta = Meta.success;
      });
    } catch (error) {
      runInAction(() => {
        this.error = errorMessage(error);
        this.meta = Meta.error;
      });
    }
  }
}
