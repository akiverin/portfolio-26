export type PersistentAnnouncement = {
  id: string;
  expiresAt: number;
};

export const getAnnouncementStorageKey = (id: string): string =>
  'andkiv:announcements:' + id + ':dismissed';

export const isAnnouncementEligible = (
  announcement: PersistentAnnouncement,
  now = Date.now(),
): boolean => {
  if (now >= announcement.expiresAt) return false;
  try {
    return localStorage.getItem(getAnnouncementStorageKey(announcement.id)) !== '1';
  } catch {
    return true;
  }
};

export const dismissAnnouncement = (id: string): void => {
  try {
    localStorage.setItem(getAnnouncementStorageKey(id), '1');
  } catch {
    // The hook also remembers dismissal for this page when storage is unavailable.
  }
};
