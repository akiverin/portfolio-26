import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Project } from '../model/types';

export const snapshotToProject = (snapshot: DocumentSnapshot<DocumentData>): Project => ({
  ...(snapshot.data() as Omit<Project, 'id'>),
  id: snapshot.id,
});
