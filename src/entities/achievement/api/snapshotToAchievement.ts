import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Achievement } from '../model/types';
import { resolveBadges } from './resolveBadges';

export const snapshotToAchievement = async (
  snapshot: DocumentSnapshot<DocumentData>,
): Promise<Achievement> => {
  const data = snapshot.data();
  if (!data) throw new Error('No data found');

  const badges = await resolveBadges(data.badges || []);

  return {
    ...data,
    id: snapshot.id,
    badges,
  } as Achievement;
};
