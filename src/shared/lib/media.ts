import { MediaEntity } from 'shared/api/mediaApi';

const VIDEO_EXTENSION = /\.(?:mp4|webm|mov)(?:[?#].*)?$/i;

export const getMediaUrl = (cover: string | undefined | null, entity: MediaEntity): string => {
  if (!cover) return '';
  if (/^(?:https?:)?\/\//i.test(cover) || cover.startsWith('/media/')) return cover;

  return `https://andkiv.com/assets/${entity}/${encodeURIComponent(cover)}`;
};

export const isVideoMedia = (cover: string | undefined | null, coverType?: string): boolean =>
  coverType === 'video' || VIDEO_EXTENSION.test(cover ?? '');
