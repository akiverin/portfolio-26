import { MediaEntity } from 'shared/api/mediaApi';

const VIDEO_EXTENSION = /\.(?:mp4|webm|mov)(?:[?#].*)?$/i;
const CARD_ASPECT_RATIO = 16 / 10;
const ASPECT_RATIO_TOLERANCE = 0.05;

export type ImageFit = 'portrait' | 'landscape' | null;

export const getMediaUrl = (cover: string | undefined | null, entity: MediaEntity): string => {
  if (!cover) return '';
  if (/^(?:https?:)?\/\//i.test(cover) || cover.startsWith('/media/')) return cover;

  return `https://andkiv.com/assets/${entity}/${encodeURIComponent(cover)}`;
};

export const isVideoMedia = (cover: string | undefined | null, coverType?: string): boolean =>
  coverType === 'video' || VIDEO_EXTENSION.test(cover ?? '');

/**
 * Chooses the presentation for an image that would otherwise be cropped by a 16:10 card.
 * A small tolerance keeps near-native covers visually unchanged.
 */
export const getImageFit = (width: number, height: number): ImageFit => {
  if (!width || !height) return null;

  const aspectRatio = width / height;

  if (aspectRatio < CARD_ASPECT_RATIO * (1 - ASPECT_RATIO_TOLERANCE)) return 'portrait';
  if (aspectRatio > CARD_ASPECT_RATIO * (1 + ASPECT_RATIO_TOLERANCE)) return 'landscape';

  return null;
};
