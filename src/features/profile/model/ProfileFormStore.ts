import { makeAutoObservable, runInAction } from 'mobx';
import { validateDisplayName, validateEmail } from 'shared/lib/validators';
import { ILocalStore } from 'shared/types/ILocalStore';
import { User } from 'entities/User/model/types';
import { Meta } from 'shared/lib/meta';

export class ProfileFormStore implements ILocalStore {
  displayName = '';
  email = '';
  photoURL = '';
  meta: Meta = Meta.initial;
  successMessage = '';

  errors: Record<'displayName' | 'email', string> = {
    displayName: '',
    email: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  get isDirty(): boolean {
    return this._original !== null && (
      this.displayName !== this._original.displayName ||
      this.email !== this._original.email ||
      this.photoURL !== (this._original.photoURL ?? '')
    );
  }

  private _original: Pick<User, 'displayName' | 'email' | 'photoURL'> | null = null;

  populateFromUser(user: User): void {
    runInAction(() => {
      this.displayName = user.displayName ?? '';
      this.email = user.email ?? '';
      this.photoURL = user.photoURL ?? '';
      this._original = {
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        photoURL: user.photoURL ?? '',
      };
      this.errors = { displayName: '', email: '' };
      this.successMessage = '';
    });
  }

  setField(field: 'displayName' | 'email' | 'photoURL', value: string): void {
    this[field] = value;
    if (field in this.errors) {
      this.errors[field as 'displayName' | 'email'] = '';
    }
    this.successMessage = '';
  }

  validateAll(): boolean {
    const e1 = validateDisplayName(this.displayName);
    const e2 = validateEmail(this.email);
    runInAction(() => {
      this.errors = { displayName: e1, email: e2 };
    });
    return !e1 && !e2;
  }

  setMeta(meta: Meta): void {
    this.meta = meta;
  }

  setSuccessMessage(msg: string): void {
    this.successMessage = msg;
  }

  getPatch(): Partial<User> {
    const patch: Partial<User> = {};
    if (this._original && this.displayName !== this._original.displayName) {
      patch.displayName = this.displayName;
    }
    if (this._original && this.photoURL !== (this._original.photoURL ?? '')) {
      patch.photoURL = this.photoURL || null;
    }
    return patch;
  }

  destroy(): void {
    // No cleanup needed
  }
}
