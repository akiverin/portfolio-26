import type { FirebaseApp } from 'firebase/app';

type AuthApp = Pick<FirebaseApp, 'name' | 'options'>;

export const getAuthSessionStorageKey = (app: AuthApp): string =>
  'andkiv:auth-session:' + app.name + ':' + (app.options.projectId ?? 'default');

/** A display hint only. Firebase still restores and validates the actual session. */
export const hasStoredAuthSession = (app: AuthApp): boolean => {
  try {
    if (localStorage.getItem(getAuthSessionStorageKey(app)) === '1') return true;

    // Support sessions saved by Firebase's browserLocalPersistence before the hint existed.
    const legacyKey = 'firebase:authUser:' + app.options.apiKey + ':' + app.name;
    const raw = localStorage.getItem(legacyKey);
    if (!raw) return false;
    const user: unknown = JSON.parse(raw);
    return (
      typeof user === 'object' &&
      user !== null &&
      'uid' in user &&
      typeof user.uid === 'string' &&
      user.uid.length > 0
    );
  } catch {
    // Guests can still open the site when storage is unavailable or contains invalid JSON.
    return false;
  }
};

export const writeAuthSessionHint = (app: AuthApp, signedIn: boolean): void => {
  try {
    const key = getAuthSessionStorageKey(app);
    if (signedIn) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {
    // A storage restriction must not prevent signing in or out.
  }
};
