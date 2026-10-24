import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import { doc } from 'firebase/firestore';
import styles from './EditModal.module.scss';
import { FieldDef } from 'features/admin/model/types';
import { db } from 'shared/api/firebase';
import classNames from 'classnames';
import Badge, { ColorsBadgeT, IconsBadgeT } from 'shared/ui/Badge';
import { AdminOption } from 'features/admin/model/types';
import { MediaEntity, UploadedMedia, isManagedMediaUrl } from 'shared/api/mediaApi';
import { isVideoMedia } from 'shared/lib/media';

const timestampToDateStr = (val: unknown): string => {
  if (!val) return '';
  if (typeof val === 'object' && val !== null && 'seconds' in val) {
    const ts = val as { seconds: number };
    return new Date(ts.seconds * 1000).toISOString().split('T')[0];
  }
  if (typeof val === 'string') return val;
  return '';
};

type EditModalProps = {
  isOpen: boolean;
  title: string;
  fields: FieldDef[];
  data: Record<string, unknown> | null;
  loading?: boolean;
  asyncOptions?: Record<string, AdminOption[]>;
  darkMode?: boolean;
  onSave: (data: Record<string, unknown>, mediaChanges: MediaChange[]) => Promise<void> | void;
  onUploadMedia?: (entity: MediaEntity, file: File) => Promise<UploadedMedia>;
  onDeleteMedia?: (url: string) => Promise<void>;
  onClose: () => void;
};

export type MediaChange = {
  fieldKey: string;
  previousUrl?: string;
  uploadedUrl?: string | null;
};

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  title,
  fields,
  data,
  loading,
  asyncOptions,
  darkMode,
  onSave,
  onUploadMedia,
  onDeleteMedia,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [mediaChanges, setMediaChanges] = useState<MediaChange[]>([]);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const converted: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data)) {
        const field = fields.find((f) => f.key === k);
        if (field?.type === 'multiselect' && Array.isArray(v)) {
          converted[k] = v.map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item !== null && 'id' in item) {
              return (item as { id: string }).id;
            }
            return String(item);
          });
        } else if (
          field?.type === 'date' &&
          v &&
          typeof v === 'object' &&
          'seconds' in (v as Record<string, unknown>)
        ) {
          converted[k] = timestampToDateStr(v);
        } else {
          converted[k] = v;
        }
      }
      setFormData(converted);
    } else {
      setFormData({});
    }
    setMediaChanges([]);
    setMediaError(null);
  }, [data, fields]);

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateMediaChange = (change: MediaChange) => {
    setMediaChanges((previous) => {
      const otherChanges = previous.filter((item) => item.fieldKey !== change.fieldKey);
      return [...otherChanges, change];
    });
  };

  const handleMediaUpload = async (fieldKey: string, entity: MediaEntity, file: File) => {
    if (!onUploadMedia) return;

    const currentUrl = String(formData[fieldKey] ?? '');
    const currentChange = mediaChanges.find((item) => item.fieldKey === fieldKey);
    setUploadingField(fieldKey);
    setMediaError(null);

    try {
      const uploaded = await onUploadMedia(entity, file);
      if (currentChange?.uploadedUrl && isManagedMediaUrl(currentChange.uploadedUrl) && onDeleteMedia) {
        await onDeleteMedia(currentChange.uploadedUrl);
      }

      updateMediaChange({
        fieldKey,
        previousUrl: (currentChange?.previousUrl ?? currentUrl) || undefined,
        uploadedUrl: uploaded.url,
      });
      setFormData((previous) => ({
        ...previous,
        [fieldKey]: uploaded.url,
        ...(fieldKey === 'cover' ? { coverType: uploaded.mediaType } : {}),
      }));
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Не удалось загрузить файл.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleMediaUrlChange = async (fieldKey: string, value: string) => {
    const currentUrl = String(formData[fieldKey] ?? '');
    const currentChange = mediaChanges.find((item) => item.fieldKey === fieldKey);

    if (currentChange?.uploadedUrl && currentChange.uploadedUrl !== value && isManagedMediaUrl(currentChange.uploadedUrl) && onDeleteMedia) {
      try {
        await onDeleteMedia(currentChange.uploadedUrl);
      } catch {
        setMediaError('Не удалось удалить временно загруженный файл.');
      }
    }

    if (value !== currentUrl) {
      updateMediaChange({
        fieldKey,
        previousUrl: (currentChange?.previousUrl ?? currentUrl) || undefined,
        uploadedUrl: null,
      });
    }
    handleChange(fieldKey, value);
  };

  const handleRemoveMedia = async (fieldKey: string) => {
    const currentUrl = String(formData[fieldKey] ?? '');
    const currentChange = mediaChanges.find((item) => item.fieldKey === fieldKey);
    setMediaError(null);

    if (currentChange?.uploadedUrl && isManagedMediaUrl(currentChange.uploadedUrl) && onDeleteMedia) {
      try {
        await onDeleteMedia(currentChange.uploadedUrl);
      } catch (error) {
        setMediaError(error instanceof Error ? error.message : 'Не удалось удалить файл.');
        return;
      }
    }

    if (currentChange?.previousUrl || currentUrl) {
      updateMediaChange({
        fieldKey,
        previousUrl: (currentChange?.previousUrl ?? currentUrl) || undefined,
        uploadedUrl: null,
      });
    }
    setFormData((previous) => ({ ...previous, [fieldKey]: '', ...(fieldKey === 'cover' ? { coverType: 'image' } : {}) }));
  };

  const handleClose = () => {
    const uploadedUrls = mediaChanges
      .map((change) => change.uploadedUrl)
      .filter((url): url is string => Boolean(url && isManagedMediaUrl(url)));

    if (uploadedUrls.length > 0 && onDeleteMedia) {
      void Promise.allSettled(uploadedUrls.map((url) => onDeleteMedia(url))).finally(onClose);
      return;
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const processed: Record<string, unknown> = { ...formData };
    for (const field of fields) {
      if (field.type === 'date' && processed[field.key]) {
        const dateStr = String(processed[field.key]);
        if (dateStr) {
          const d = new Date(dateStr);
          processed[field.key] = { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
        }
      }
      if (field.key === 'disabled' && typeof processed[field.key] === 'string') {
        processed[field.key] = processed[field.key] === 'true';
      }
      if (field.type === 'multiselect' && field.asyncOptions) {
        const raw = processed[field.key];
        const ids = Array.isArray(raw) ? raw.map(String) : [];
        processed[field.key] = ids.map((id) => doc(db, field.asyncOptions!, id));
      }
    }
    try {
      await onSave(processed, mediaChanges);
      setMediaChanges([]);
      setMediaError(null);
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Не удалось сохранить запись.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            data-dark={darkMode ? 'true' : undefined}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>{title}</h3>
              <button
                type="button"
                className={styles.modal__closeBtn}
                onClick={handleClose}
                aria-label="Закрыть"
              >
                <IconX size={18} stroke={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modal__form}>
              <div className={styles.modal__fields}>
                {fields.map((field) => (
                  <div key={field.key} className={styles.modal__field}>
                    <label className={styles.modal__label} htmlFor={`edit-${field.key}`}>
                      {field.label}
                      {field.required && <span className={styles.modal__required}>*</span>}
                    </label>
                    {field.type === 'media' && field.mediaEntity ? (
                      <div className={styles.modal__media}>
                        {formData[field.key] ? (
                          <div className={styles.modal__mediaPreview}>
                            {isVideoMedia(String(formData[field.key]), String(formData.coverType ?? '')) ? (
                              <video src={String(formData[field.key])} controls muted />
                            ) : (
                              <img src={String(formData[field.key])} alt="Предпросмотр обложки" />
                            )}
                          </div>
                        ) : null}
                        <input
                          id={`edit-${field.key}`}
                          className={styles.modal__input}
                          type="url"
                          value={String(formData[field.key] ?? '')}
                          onChange={(e) => void handleMediaUrlChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                        <div className={styles.modal__mediaActions}>
                          <label className={styles.modal__uploadBtn}>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
                              disabled={loading || uploadingField === field.key}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void handleMediaUpload(field.key, field.mediaEntity!, file);
                                e.currentTarget.value = '';
                              }}
                            />
                            {uploadingField === field.key ? 'Загрузка...' : 'Загрузить файл'}
                          </label>
                          {formData[field.key] ? (
                            <button
                              type="button"
                              className={styles.modal__removeMediaBtn}
                              onClick={() => void handleRemoveMedia(field.key)}
                              disabled={loading || uploadingField === field.key}
                            >
                              Удалить медиа
                            </button>
                          ) : null}
                        </div>
                        <span className={styles.modal__mediaHint}>
                          Изображения до 20 МБ; MP4, WebM и MOV до 150 МБ.
                        </span>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={`edit-${field.key}`}
                        className={styles.modal__textarea}
                        value={String(formData[field.key] ?? '')}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        required={field.required}
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        id={`edit-${field.key}`}
                        className={styles.modal__select}
                        value={String(formData[field.key] ?? '')}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Выберите...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'multiselect' ? (
                      <div className={styles.modal__multiselect}>
                        {(field.asyncOptions && asyncOptions?.[field.asyncOptions]
                          ? asyncOptions[field.asyncOptions]
                          : field.options ?? []
                        ).map((opt) => {
                          const selected = Array.isArray(formData[field.key])
                            ? (formData[field.key] as string[])
                            : [];
                          const isChecked = selected.includes(opt.value);
                          return (
                            <label
                              key={opt.value}
                              className={classNames(
                                styles.modal__multiselectItem,
                                isChecked && styles['modal__multiselectItem--selected'],
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const newVal = isChecked
                                    ? selected.filter((v) => v !== opt.value)
                                    : [...selected, opt.value];
                                  setFormData((prev) => ({ ...prev, [field.key]: newVal }));
                                }}
                                className={styles.modal__multiselectCheckbox}
                              />
                              <Badge
                                title={opt.label}
                                color={opt.color as ColorsBadgeT}
                                icon={opt.icon as IconsBadgeT}
                                className={styles.modal__badgePreview}
                              />
                              <span className={styles.modal__selectionMark} aria-hidden="true">
                                ✓
                              </span>
                            </label>
                          );
                        })}
                        {(field.asyncOptions && asyncOptions?.[field.asyncOptions]
                          ? asyncOptions[field.asyncOptions]
                          : field.options ?? []
                        ).length === 0 && (
                          <span className={styles.modal__multiselectEmpty}>Нет доступных опций</span>
                        )}
                      </div>
                    ) : field.type === 'date' ? (
                      <input
                        id={`edit-${field.key}`}
                        className={styles.modal__input}
                        type="date"
                        value={String(formData[field.key] ?? '')}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        min="1990-01-01"
                        max="2099-12-31"
                      />
                    ) : (
                      <input
                        id={`edit-${field.key}`}
                        className={styles.modal__input}
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={String(formData[field.key] ?? '')}
                        onChange={(e) =>
                          handleChange(
                            field.key,
                            field.type === 'number' ? Number(e.target.value) : e.target.value,
                          )
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.modal__actions}>
                {mediaError ? <span className={styles.modal__mediaError}>{mediaError}</span> : null}
                <button
                  type="button"
                  className={styles.modal__cancelBtn}
                  onClick={handleClose}
                  disabled={loading || uploadingField !== null}
                >
                  Отмена
                </button>
                <button type="submit" className={styles.modal__saveBtn} disabled={loading || uploadingField !== null}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;
