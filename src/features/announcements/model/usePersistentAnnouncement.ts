import { useCallback, useEffect, useRef, useState } from 'react';
import {
  dismissAnnouncement,
  getAnnouncementStorageKey,
  isAnnouncementEligible,
} from './persistence';
import type { PersistentAnnouncement } from './persistence';

const MAX_TIMEOUT_MS = 2_147_483_647;

export const usePersistentAnnouncement = (
  { id, expiresAt }: PersistentAnnouncement,
  enabled: boolean,
) => {
  const [visible, setVisible] = useState(false);
  const dismissedHere = useRef<string | null>(null);
  const refreshRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    let timeout: number | undefined;
    const refresh = () => {
      window.clearTimeout(timeout);
      const now = Date.now();
      const eligible =
        dismissedHere.current !== id && isAnnouncementEligible({ id, expiresAt }, now);
      setVisible(eligible);
      if (eligible) {
        // Browser timeouts overflow past ~25 days; long campaigns must be scheduled in chunks.
        timeout = window.setTimeout(refresh, Math.min(expiresAt - now, MAX_TIMEOUT_MS));
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === getAnnouncementStorageKey(id)) refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    refreshRef.current = refresh;
    refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      refreshRef.current = null;
      window.clearTimeout(timeout);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, id, expiresAt]);

  const close = useCallback(() => {
    dismissedHere.current = id;
    dismissAnnouncement(id);
    setVisible(false);
    refreshRef.current?.();
  }, [id]);

  return { visible: enabled && visible, close };
};
