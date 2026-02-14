import { runInAction } from 'mobx';
import { Meta } from 'shared/lib/meta';

export abstract class BaseStore {
  meta: Meta = Meta.initial;
  error: string | null = null;

  protected setLoading(): void {
    runInAction(() => {
      this.meta = Meta.loading;
      this.error = null;
    });
  }

  protected setSuccess(): void {
    runInAction(() => {
      this.meta = Meta.success;
    });
  }

  protected setError(error: unknown): void {
    runInAction(() => {
      this.error = error instanceof Error ? error.message : String(error);
      this.meta = Meta.error;
    });
  }

  protected reset(): void {
    runInAction(() => {
      this.meta = Meta.initial;
      this.error = null;
    });
  }
}
