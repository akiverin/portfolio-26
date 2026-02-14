import { Project } from "./types";

export class ProjectModel {
  private readonly _data: Project;

  constructor(data: Project) {
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

  get coverType(): string {
    return this._data.coverType;
  }

  get date(): string {
    return this._data.date.toString();
  }

  get link(): string {
    return this._data.link || "";
  }

  get github(): string {
    return this._data.github || "";
  }

  get behance(): string {
    return this._data.behance || "";
  }

  get cover(): string {
    return this._data.cover || "";
  }
}
