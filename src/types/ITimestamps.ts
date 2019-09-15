import { IFormattedDate } from './IFormattedDate';

export interface ITimestamps {
  createdAt: IFormattedDate;
  updatedAt: IFormattedDate;
  deletedAt?: IFormattedDate;
}
