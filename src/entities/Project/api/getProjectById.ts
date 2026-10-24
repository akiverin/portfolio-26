import { fetchDocument } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Project } from '../model/types';
import { snapshotToProject } from './snapshotToProject';

export const getProjectById = (id: string): Promise<BaseResponse<Project>> =>
  fetchDocument('projects', id, snapshotToProject);
