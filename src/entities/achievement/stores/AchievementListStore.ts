import { makeObservable, observable, action, runInAction } from 'mobx';
import { Meta } from 'shared/lib/meta';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Achievement } from '../model/types';
import { getAllAchievements } from '../api/getAllAchievements';

export class AchievementListStore implements ILocalStore {
  achievements: Achievement[] = [];
  meta: Meta = Meta.initial;
  error: string = '';

  constructor() {
    makeObservable(this, {
      achievements: observable,
      meta: observable,
      error: observable,
      fetchAllAchievements: action.bound,
    });
  }

  async fetchAllAchievements(): Promise<void> {
    this.meta = Meta.loading;
    this.error = '';

    const response = await getAllAchievements();

    if (response.isError) {
      runInAction(() => {
        this.error = response.error instanceof Error ? response.error.message : 'Unknown error';
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this.achievements = response.data;
      this.meta = Meta.success;
    });
  }

  destroy(): void {
    // Cleanup if needed
  }
}
