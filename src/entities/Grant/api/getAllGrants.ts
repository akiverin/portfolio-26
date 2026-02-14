import { orderBy } from 'firebase/firestore';
import { fetchCollection } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Grant } from '../model/types';
import { snapshotToGrant } from './snapshotToGrant';

export const getAllGrants = (): Promise<BaseResponse<Grant[]>> =>
  fetchCollection('grants', [orderBy('startDate', 'desc')], snapshotToGrant);
