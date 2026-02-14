import { makeAutoObservable, runInAction } from 'mobx';
import { validateDisplayName, validateEmail, validatePassword } from 'shared/lib/validators';
import { ILocalStore } from 'shared/types/ILocalStore';

export class RegisterFormStore implements ILocalStore {
  displayName = '';
  email = '';
  password = '';
  termsAccepted = false;
  errors: Record<'displayName' | 'email' | 'password' | 'terms', string> = {
    displayName: '',
    email: '',
    password: '',
    terms: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: 'displayName' | 'email' | 'password', value: string): void {
    this[field] = value;
    this.errors[field] = '';
  }

  setTermsAccepted(value: boolean): void {
    this.termsAccepted = value;
    this.errors.terms = '';
  }

  validateAll(): boolean {
    const e1 = validateDisplayName(this.displayName);
    const e2 = validateEmail(this.email);
    const e3 = validatePassword(this.password);
    const e4 = this.termsAccepted ? '' : 'Необходимо принять условия';

    runInAction(() => {
      this.errors = { displayName: e1, email: e2, password: e3, terms: e4 };
    });

    return !e1 && !e2 && !e3 && !e4;
  }

  reset(): void {
    this.displayName = '';
    this.email = '';
    this.password = '';
    this.termsAccepted = false;
    this.errors = { displayName: '', email: '', password: '', terms: '' };
  }

  destroy(): void {
    // No cleanup needed
  }
}
