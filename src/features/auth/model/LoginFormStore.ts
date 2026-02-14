import { makeAutoObservable, runInAction } from 'mobx';
import { validateEmail, validatePassword } from 'shared/lib/validators';
import { ILocalStore } from 'shared/types/ILocalStore';

export class LoginFormStore implements ILocalStore {
  identifier = '';
  password = '';
  errors: Record<'identifier' | 'password', string> = {
    identifier: '',
    password: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: 'identifier' | 'password', value: string): void {
    this[field] = value;
    this.errors[field] = '';
  }

  private _validateIdentifier(): string {
    return validateEmail(this.identifier);
  }

  private _validatePassword(): string {
    return validatePassword(this.password);
  }

  validateAll(): boolean {
    const e1 = this._validateIdentifier();
    const e2 = this._validatePassword();
    runInAction(() => {
      this.errors = { identifier: e1, password: e2 };
    });
    return !e1 && !e2;
  }

  reset(): void {
    this.identifier = '';
    this.password = '';
    this.errors = { identifier: '', password: '' };
  }

  destroy(): void {
    // No cleanup needed
  }
}
