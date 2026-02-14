import { Grant } from './types';

export class GrantModel {
  private readonly _data: Grant;

  constructor(data: Grant) {
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

  get icon(): string {
    return this._data.icon || '';
  }

  get sum(): number {
    return this._data.sum;
  }

  get startDate(): string {
    return this._data.startDate.toString();
  }

  get endDate(): string {
    return this._data.endDate.toString();
  }
}
