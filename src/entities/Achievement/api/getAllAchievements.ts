import { orderBy, OrderByDirection } from 'firebase/firestore';
import { fetchCollection } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Achievement } from '../model/types';
import { snapshotToAchievement } from './snapshotToAchievement';

export const getAllAchievements = (
  sortField: 'date' | 'title' = 'date',
  sortDirection: OrderByDirection = 'desc',
): Promise<BaseResponse<Achievement[]>> =>
  fetchCollection('achievements', [orderBy(sortField, sortDirection)], snapshotToAchievement);
