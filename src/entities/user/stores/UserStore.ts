import { auth } from "config/api";
import { User } from "../types";
import { computed, makeObservable, observable, runInAction } from "mobx";
import {
  ensureUserDoc,
  getIdTokenFromFirebase,
  getUserProfileFromFirestore,
  resetPasswordEmail,
  signInWithEmail,
  signInWithGooglePopup,
  signOutFirebase,
  signUpWithEmail,
  updateProfileInFirebase,
  updateUserProfileInFirestore,
} from "entities/user/api";
import { BaseStore } from "shared/store/BaseStore";
import { RootStore } from "shared/store/RootStore";
import { User as FirebaseUser } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export class UserStore extends BaseStore {
  root: RootStore;
  currentUser: User | null = null;
  isInitialized: boolean = false;
  unsubscribeAuth: (() => void) | null = null;

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeObservable(
      this,
      {
        currentUser: observable,
        isInitialized: observable,
        isAuth: computed,
      },
      { autoBind: true }
    );
  }

  get isAuth() {
    return Boolean(this.currentUser);
  }

  initAuthListener() {
    this.unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        runInAction(() => {
          this.currentUser = null;
          this.reset();
          this.isInitialized = true;
        });
        return;
      }

      try {
        await this.bootstrapUser(firebaseUser);
      } catch (e) {
        console.error("Error in bootstrapUser:", e);
      } finally {
        runInAction(() => {
          this.isInitialized = true;
        });
      }
    });
  }

  private async bootstrapUser(firebaseUser: FirebaseUser) {
    try {
      await ensureUserDoc(firebaseUser.uid, {
        email: firebaseUser.email || undefined,
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || null,
      });

      const profile = await getUserProfileFromFirestore(firebaseUser.uid);
      runInAction(() => {
        this.currentUser = profile;
        this.setSuccess();
      });
    } catch (e) {
      console.error("Error in bootstrapUser:", e);
      this.setError(e);
    }
  }

  destroy() {
    this.unsubscribeAuth?.();
  }

  async signIn(email: string, password: string) {
    this.setLoading();
    try {
      return await signInWithEmail(email, password);
    } catch (e) {
      this.setError(e);
      throw e;
    } finally {
      this.setSuccess();
    }
  }

  async signUp(email: string, password: string, displayName?: string) {
    this.setLoading();
    try {
      return await signUpWithEmail(email, password, displayName);
    } catch (e) {
      this.setError(e);
      throw e;
    } finally {
      this.setSuccess();
    }
  }

  async signOut() {
    this.setLoading();
    try {
      await signOutFirebase();
      runInAction(() => (this.currentUser = null));
    } catch (e) {
      this.setError(e);
      throw e;
    } finally {
      this.reset();
    }
  }

  async signInWithGoogle() {
    this.setLoading();
    try {
      const user = await signInWithGooglePopup();
      await this.bootstrapUser(user);
    } catch (e) {
      // обработка отмены пользователем
      if ((e as FirebaseError).code === "auth/cancelled-popup-request") {
        this.reset();
        return;
      }
      this.setError(e);
      throw e;
    }
  }

  async resetPassword(email: string) {
    this.setLoading();
    try {
      await resetPasswordEmail(email);
    } finally {
      this.setSuccess();
    }
  }

  async updateProfile(patch: Partial<User>) {
    if (!this.currentUser) throw new Error("No user");

    this.setLoading();
    try {
      await updateProfileInFirebase(patch);
      await updateUserProfileInFirestore(this.currentUser.id, patch);

      const refreshed = await getUserProfileFromFirestore(this.currentUser.id);
      runInAction(() => (this.currentUser = refreshed));
    } finally {
      this.setSuccess();
    }
  }

  async getIdToken(force = false) {
    return getIdTokenFromFirebase(force);
  }

  async refreshUser() {
    if (!this.currentUser) throw new Error("No user");
    const profile = await getUserProfileFromFirestore(this.currentUser.id);
    runInAction(() => (this.currentUser = profile));
    return profile;
  }
}
