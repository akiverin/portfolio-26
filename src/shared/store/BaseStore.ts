import { runInAction } from "mobx";
import { Meta } from "utils/meta";

export abstract class BaseStore {
  meta: Meta = Meta.initial;
  error: string | null = null;

  protected setLoading() {
    runInAction(() => {
      this.meta = Meta.loading;
      this.error = null;
    });
  }

  protected setSuccess() {
    runInAction(() => {
      this.meta = Meta.success;
    });
  }

  protected setError(error: unknown) {
    runInAction(() => {
      this.error = error instanceof Error ? error.message : String(error);
      this.meta = Meta.error;
    });
  }

  protected reset() {
    runInAction(() => {
      this.meta = Meta.initial;
      this.error = null;
    });
  }
}
