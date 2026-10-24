import assert from 'node:assert/strict';
import test from 'node:test';
import { DESIGN_UPDATE_ANNOUNCEMENT } from '../config/designUpdate.ts';
import {
  dismissAnnouncement,
  getAnnouncementStorageKey,
  isAnnouncementEligible,
} from './persistence.ts';

const withStorage = (run: (values: Map<string, string>) => void) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  try {
    run(values);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
};

test('the local deadline includes the last millisecond of December 31, 2026', () => {
  withStorage(() => {
    const notice = DESIGN_UPDATE_ANNOUNCEMENT;
    assert.equal(
      isAnnouncementEligible(notice, new Date(2026, 11, 31, 23, 59, 59, 999).getTime()),
      true,
    );
    assert.equal(isAnnouncementEligible(notice, new Date(2027, 0, 1).getTime()), false);
    assert.equal(isAnnouncementEligible(notice, new Date(2027, 1, 1).getTime()), false);
  });
});

test('dismissal survives subsequent reads and is scoped to the campaign', () => {
  withStorage((values) => {
    const notice = DESIGN_UPDATE_ANNOUNCEMENT;
    const now = new Date(2026, 9, 24).getTime();
    assert.equal(isAnnouncementEligible(notice, now), true);
    dismissAnnouncement(notice.id);
    assert.equal(values.get(getAnnouncementStorageKey(notice.id)), '1');
    assert.equal(isAnnouncementEligible(notice, now), false);
    assert.equal(isAnnouncementEligible({ ...notice, id: 'next-campaign' }, now), true);
  });
});

test('unrelated account storage does not dismiss the announcement', () => {
  withStorage((values) => {
    values.set('andkiv:auth-session:example', '1');
    assert.equal(
      isAnnouncementEligible(DESIGN_UPDATE_ANNOUNCEMENT, new Date(2026, 9, 24).getTime()),
      true,
    );
  });
});

test('blocked storage does not crash rendering or closing', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw new Error('Storage is unavailable');
    },
  });
  try {
    assert.equal(
      isAnnouncementEligible(DESIGN_UPDATE_ANNOUNCEMENT, new Date(2026, 9, 24).getTime()),
      true,
    );
    assert.doesNotThrow(() => dismissAnnouncement(DESIGN_UPDATE_ANNOUNCEMENT.id));
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
