import { makeAutoObservable, runInAction } from 'mobx';
import { validateDisplayName, validateEmail, validatePassword } from 'shared/lib/validators';
import { ILocalStore } from 'shared/types/ILocalStore';

export class RegisterFormStore implements ILocalStore {
  displayName = '';
  email = '';
  password = '';
  errors: Record<'displayName' | 'email' | 'password', string> = {
    displayName: '',
    email: '',
    password: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: 'displayName' | 'email' | 'password', value: string): void {
    this[field] = value;
    this.errors[field] = '';
  }

  validateAll(): boolean {
    const e1 = validateDisplayName(this.displayName);
    const e2 = validateEmail(this.email);
    const e3 = validatePassword(this.password);
    runInAction(() => {
      this.errors = { displayName: e1, email: e2, password: e3 };
    });
    return !e1 && !e2 && !e3;
  }

  reset(): void {
    this.displayName = '';
    this.email = '';
    this.password = '';
    this.errors = { displayName: '', email: '', password: '' };
  }

  destroy(): void {
    // No cleanup needed
  }
}
