export type MediaEntity = 'projects' | 'achievements';
export type MediaKind = 'image' | 'video';

export type UploadedMedia = {
  url: string;
  path: string;
  mediaType: MediaKind;
  mimeType: string;
  size: number;
};

type MediaErrorPayload = {
  error?: string;
};

const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API_URL ?? '/api/media';

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as MediaErrorPayload;
    if (payload.error) return payload.error;
  } catch {
    // The server may return a non-JSON error page before the API is deployed.
  }

  return `Ошибка загрузки (${response.status})`;
};

const authHeaders = (idToken: string): HeadersInit => ({
  Authorization: `Bearer ${idToken}`,
});

export const uploadMedia = async (
  entity: MediaEntity,
  file: File,
  idToken: string,
): Promise<UploadedMedia> => {
  const formData = new FormData();
  formData.append('entity', entity);
  formData.append('media', file);

  const response = await fetch(MEDIA_API_URL, {
    method: 'POST',
    headers: authHeaders(idToken),
    body: formData,
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
  return (await response.json()) as UploadedMedia;
};

export const deleteMedia = async (url: string, idToken: string): Promise<void> => {
  const response = await fetch(MEDIA_API_URL, {
    method: 'DELETE',
    headers: {
      ...authHeaders(idToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
};

export const isManagedMediaUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;

  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname.startsWith('/media/projects/') || parsed.pathname.startsWith('/media/achievements/');
  } catch {
    return false;
  }
};
