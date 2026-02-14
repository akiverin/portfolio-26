import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Grant } from '../model/types';

export const snapshotToGrant = (snapshot: DocumentSnapshot<DocumentData>): Grant => ({
  ...(snapshot.data() as Omit<Grant, 'id'>),
  id: snapshot.id,
});
