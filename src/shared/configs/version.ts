import { version } from '../../../package.json';

// Keep the footer in sync with the release version; display 2.1.0 as 2.1.
export const SITE_VERSION = version.replace(/\.0$/, '');
