import { makeAutoObservable, runInAction } from "mobx";
import { validateEmail, validatePassword } from "utils/validators";

export class LoginFormStore {
  identifier = "";
  password = "";
  errors: Record<"identifier" | "password", string> = {
    identifier: "",
    password: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field: "identifier" | "password", value: string) {
    this[field] = value;
    this.errors[field] = "";
  }

  private _validateIdentifier() {
    return validateEmail(this.identifier);
  }

  private _validatePassword() {
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

  reset() {
    this.identifier = "";
    this.password = "";
    this.errors = { identifier: "", password: "" };
  }
}
