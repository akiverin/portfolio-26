import { getDoc, DocumentReference } from 'firebase/firestore';
import { Badge } from '../model/types';

/** In-memory cache for badge documents to avoid N+1 getDoc calls */
const badgeCache = new Map<string, Badge>();

export const resolveBadges = async (genreRefs: DocumentReference[]): Promise<Badge[]> => {
  const badges: Badge[] = [];
  const uncachedRefs: DocumentReference[] = [];

  // Separate cached vs uncached
  for (const ref of genreRefs) {
    const cached = badgeCache.get(ref.path);
    if (cached) {
      badges.push(cached);
    } else {
      uncachedRefs.push(ref);
    }
  }

  // Fetch all uncached in parallel
  if (uncachedRefs.length > 0) {
    const snapshots = await Promise.all(uncachedRefs.map((ref) => getDoc(ref)));

    for (const snapshot of snapshots) {
      if (snapshot.exists()) {
        const badge: Badge = {
          id: snapshot.id,
          title: snapshot.data().title || '',
          color: snapshot.data().color || '',
          icon: snapshot.data().icon || '',
        };
        badgeCache.set(snapshot.ref.path, badge);
        badges.push(badge);
      }
    }
  }

  return badges;
};
