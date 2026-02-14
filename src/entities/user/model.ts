import { DocumentReference } from "firebase/firestore";
import { User } from "./types";

export class UserModel {
  private readonly _data: User;

  constructor(data: User) {
    this._data = data;
  }

  get id(): string {
    return this._data.id;
  }

  get displayName(): string {
    return this._data.displayName;
  }

  get createdAt(): { seconds: number; nanoseconds: number } | null | undefined {
    return this._data.createdAt;
  }

  get email(): string {
    return this._data.email;
  }
}
