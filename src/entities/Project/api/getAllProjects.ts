import { orderBy } from 'firebase/firestore';
import { fetchCollection } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Project } from '../model/types';
import { snapshotToProject } from './snapshotToProject';

export const getAllProjects = (): Promise<BaseResponse<Project[]>> =>
  fetchCollection('projects', [orderBy('date', 'desc')], snapshotToProject);
