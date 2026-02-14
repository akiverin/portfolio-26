import { orderBy, where, OrderByDirection, QueryConstraint } from 'firebase/firestore';
import { fetchCollection } from 'shared/api/firestoreHelpers';
import { BaseResponse } from 'shared/api/types';
import { Achievement } from '../model/types';
import { snapshotToAchievement } from './snapshotToAchievement';

/**
 * Fetches achievements from Firebase with optional search and sort.
 *
 * Search uses Firebase `where` prefix matching on the `title` field.
 * When searching, sort is forced to `title` due to Firestore constraints.
 * When sorting by `title`, a composite index may be required — create it in the Firebase Console.
 */
export const getAllAchievements = (
  sortField: 'date' | 'title' = 'date',
  sortDirection: OrderByDirection = 'desc',
  search: string = '',
): Promise<BaseResponse<Achievement[]>> => {
  const constraints: QueryConstraint[] = [];

  if (search.trim()) {
    const term = search.trim();
    constraints.push(
      where('title', '>=', term),
      where('title', '<=', term + '\uf8ff'),
      orderBy('title', sortDirection),
    );
  } else {
    constraints.push(orderBy(sortField, sortDirection));
  }

  return fetchCollection('achievements', constraints, snapshotToAchievement);
};
