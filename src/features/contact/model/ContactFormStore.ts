import { makeAutoObservable, runInAction } from 'mobx';
import { validateEmail } from 'shared/lib/validators';
import { ILocalStore } from 'shared/types/ILocalStore';
import { Meta } from 'shared/lib/meta';
import { sendContactMessage } from '../api/sendContactMessage';

type ContactFields = 'name' | 'email' | 'message';

export class ContactFormStore implements ILocalStore {
  name = '';
  email = '';
  message = '';
  errors: Record<ContactFields, string> = {
    name: '',
    email: '',
    message: '',
  };
  meta: Meta = Meta.initial;

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: ContactFields, value: string): void {
    this[field] = value;
    this.errors[field] = '';
  }

  private _validateName(): string {
    if (!this.name.trim()) return 'Имя обязательно';
    if (this.name.trim().length < 2) return 'Имя должно содержать не менее 2 символов';
    return '';
  }

  private _validateMessage(): string {
    if (!this.message.trim()) return 'Сообщение обязательно';
    if (this.message.trim().length < 10) return 'Сообщение должно содержать не менее 10 символов';
    return '';
  }

  validateAll(): boolean {
    const nameErr = this._validateName();
    const emailErr = validateEmail(this.email);
    const msgErr = this._validateMessage();

    runInAction(() => {
      this.errors = { name: nameErr, email: emailErr, message: msgErr };
    });

    return !nameErr && !emailErr && !msgErr;
  }

  async submit(): Promise<void> {
    if (!this.validateAll()) return;

    this.meta = Meta.loading;

    const response = await sendContactMessage({
      name: this.name.trim(),
      email: this.email.trim(),
      message: this.message.trim(),
    });

    if (response.isError) {
      runInAction(() => {
        this.meta = Meta.error;
      });
      return;
    }

    runInAction(() => {
      this.meta = Meta.success;
      this.name = '';
      this.email = '';
      this.message = '';
    });
  }

  reset(): void {
    this.name = '';
    this.email = '';
    this.message = '';
    this.errors = { name: '', email: '', message: '' };
    this.meta = Meta.initial;
  }

  destroy(): void {
    // No cleanup needed
  }
}
