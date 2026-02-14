import { Achievement } from "./types";

export class AchievementModel {
  private readonly _data: Achievement;

  constructor(data: Achievement) {
    this._data = data;
  }

  get id(): string {
    return this._data.id;
  }

  get title(): string {
    return this._data.title;
  }

  get desc(): string {
    return this._data.desc;
  }

  get link(): string {
    return this._data.link || "";
  }

  get cover(): string {
    return this._data.cover || "";
  }
}
