import { getDoc, DocumentReference } from 'firebase/firestore';
import { Badge } from '../model/types';

export const resolveBadges = async (genreRefs: DocumentReference[]): Promise<Badge[]> => {
  const badges: Badge[] = [];

  for (const ref of genreRefs) {
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      badges.push({
        id: snapshot.id,
        title: snapshot.data().title || '',
        color: snapshot.data().color || '',
        icon: snapshot.data().icon || '',
      });
    }
  }

  return badges;
};
