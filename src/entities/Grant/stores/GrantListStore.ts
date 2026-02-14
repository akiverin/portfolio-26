import { makeObservable, observable, action, runInAction } from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Grant } from '../model/types';
import { getAllGrants } from '../api/getAllGrants';

export class GrantListStore implements ILocalStore {
  grants: Grant[] = [];
  meta: Meta = Meta.initial;
  error: string = '';

  constructor() {
    makeObservable(this, {
      grants: observable,
      meta: observable,
      error: observable,
      fetchAllGrants: action.bound,
    });
  }

  async fetchAllGrants(): Promise<void> {
    this.meta = Meta.loading;
    this.error = '';

    const response = await getAllGrants();

    if (response.isError) {
      runInAction(() => {
        this.error = response.error instanceof Error ? response.error.message : 'Unknown error';
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this.grants = response.data;
      this.meta = Meta.success;
    });
  }

  destroy(): void {
    // Cleanup if needed
  }
}
