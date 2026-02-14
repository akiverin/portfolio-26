import { UserStore } from "entities/user/stores/UserStore";

export class RootStore {
  userStore: UserStore;

  constructor() {
    this.userStore = new UserStore(this);
  }
}

let store: RootStore | null = null;

export function initRootStore() {
  if (typeof window === "undefined") return new RootStore();
  if (!store) store = new RootStore();
  return store;
}
