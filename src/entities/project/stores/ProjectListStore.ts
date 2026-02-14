import { makeObservable, observable, action, runInAction } from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Project } from '../model/types';
import { getAllProjects } from '../api/getAllProjects';

export class ProjectListStore implements ILocalStore {
  projects: Project[] = [];
  meta: Meta = Meta.initial;
  error: string = '';

  constructor() {
    makeObservable(this, {
      projects: observable,
      meta: observable,
      error: observable,
      fetchAllProjects: action.bound,
    });
  }

  async fetchAllProjects(): Promise<void> {
    this.meta = Meta.loading;
    this.error = '';

    const response = await getAllProjects();

    if (response.isError) {
      runInAction(() => {
        this.error = response.error instanceof Error ? response.error.message : 'Unknown error';
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this.projects = response.data;
      this.meta = Meta.success;
    });
  }

  destroy(): void {
    // Cleanup if needed
  }
}
