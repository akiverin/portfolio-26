import { orderBy } from 'firebase/firestore';
import { fetchCollection } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Achievement } from '../model/types';
import { snapshotToAchievement } from './snapshotToAchievement';

export const getAllAchievements = (): Promise<BaseResponse<Achievement[]>> =>
  fetchCollection('achievements', [orderBy('date', 'desc')], snapshotToAchievement);
