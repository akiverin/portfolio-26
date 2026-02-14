import { makeAutoObservable, runInAction } from "mobx";
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
} from "utils/validators";

export class RegisterFormStore {
  displayName = "";
  email = "";
  password = "";
  errors: Record<"displayName" | "email" | "password", string> = {
    displayName: "",
    email: "",
    password: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: "displayName" | "email" | "password", value: string) {
    this[field] = value;
    this.errors[field] = "";
  }

  validateAll(): boolean {
    const e1 = this._validateDisplayName();
    const e2 = this._validateEmail();
    const e3 = this._validatePassword();
    runInAction(() => {
      this.errors = { displayName: e1, email: e2, password: e3 };
    });
    return !e1 && !e2 && !e3;
  }

  private _validateDisplayName() {
    return validateDisplayName(this.displayName);
  }
  private _validateEmail() {
    return validateEmail(this.email);
  }
  private _validatePassword() {
    return validatePassword(this.password);
  }

  reset() {
    this.displayName = "";
    this.email = "";
    this.password = "";
    this.errors = { displayName: "", email: "", password: "" };
  }
}
