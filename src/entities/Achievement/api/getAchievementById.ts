import { fetchDocument } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Achievement } from '../model/types';
import { snapshotToAchievement } from './snapshotToAchievement';

export const getAchievementById = (id: string): Promise<BaseResponse<Achievement>> =>
  fetchDocument('achievements', id, snapshotToAchievement);
