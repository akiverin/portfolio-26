import { UserStore } from 'entities/User/stores/UserStore';

export class RootStore {
  readonly userStore: UserStore;

  constructor() {
    this.userStore = new UserStore(this);
  }
}

let store: RootStore | null = null;

export function initRootStore(): RootStore {
  if (!store) store = new RootStore();
  return store;
}
