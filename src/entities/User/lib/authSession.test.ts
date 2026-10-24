import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAuthSessionStorageKey,
  hasStoredAuthSession,
  writeAuthSessionHint,
} from './authSession.ts';

const app = {
  name: '[DEFAULT]',
  options: { projectId: 'portfolio-test', apiKey: 'test-api-key' },
};

const withStorage = (run: (values: Map<string, string>) => void) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  try {
    run(values);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
};

test('empty or unrelated storage does not request a startup loader', () => {
  withStorage((values) => {
    assert.equal(hasStoredAuthSession(app), false);
    values.set('admin-dark-mode', 'true');
    values.set('andkiv:notice:dismissed', '1');
    assert.equal(hasStoredAuthSession(app), false);
  });
});

test('the session marker is scoped to the current Firebase app and removed on logout', () => {
  withStorage(() => {
    writeAuthSessionHint(app, true);
    assert.equal(hasStoredAuthSession(app), true);
    assert.equal(hasStoredAuthSession({ ...app, name: 'other-app' }), false);
    assert.equal(
      hasStoredAuthSession({ ...app, options: { ...app.options, projectId: 'other-project' } }),
      false,
    );
    writeAuthSessionHint(app, false);
    assert.equal(hasStoredAuthSession(app), false);
  });
});

test('valid legacy Firebase browser-local sessions are recognized', () => {
  withStorage((values) => {
    const key = 'firebase:authUser:test-api-key:[DEFAULT]';
    values.set(key, JSON.stringify({ uid: 'returning-user' }));
    assert.equal(hasStoredAuthSession(app), true);
    values.set(key, JSON.stringify({ uid: '' }));
    assert.equal(hasStoredAuthSession(app), false);
    values.set(key, '{broken-json');
    assert.equal(hasStoredAuthSession(app), false);
    values.set(key, 'null');
    assert.equal(hasStoredAuthSession(app), false);
  });
});

test('other projects and malformed marker values are ignored', () => {
  withStorage((values) => {
    values.set('firebase:authUser:other-api-key:[DEFAULT]', JSON.stringify({ uid: 'other-user' }));
    values.set(getAuthSessionStorageKey(app), 'false');
    assert.equal(hasStoredAuthSession(app), false);
  });
});

test('unavailable storage does not block opening the site or signing out', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw new Error('Storage is unavailable');
    },
  });
  try {
    assert.equal(hasStoredAuthSession(app), false);
    assert.doesNotThrow(() => writeAuthSessionHint(app, true));
    assert.doesNotThrow(() => writeAuthSessionHint(app, false));
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
