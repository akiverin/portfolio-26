import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowsMaximize, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import styles from './MediaLightbox.module.scss';

type MediaLightboxProps = {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
};

type Point = { x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

const MediaLightbox: React.FC<MediaLightboxProps> = ({ isOpen, src, alt, onClose }) => {
  const [scale, setScale] = useState(MIN_SCALE);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const dragStart = useRef<{ pointerX: number; pointerY: number; position: Point } | null>(null);

  const resetView = () => {
    setScale(MIN_SCALE);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    resetView();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setScale((value) => clampScale(value + SCALE_STEP));
      }

      if (event.key === '-') {
        event.preventDefault();
        setScale((value) => clampScale(value - SCALE_STEP));
      }

      if (event.key === '0') {
        event.preventDefault();
        resetView();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setScale((value) => clampScale(value - event.deltaY * 0.002));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scale === MIN_SCALE) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      position,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;

    setPosition({
      x: dragStart.current.position.x + event.clientX - dragStart.current.pointerX,
      y: dragStart.current.position.y + event.clientY - dragStart.current.pointerY,
    });
  };

  const stopDragging = () => {
    dragStart.current = null;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.lightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр изображения: ${alt}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <img src={src} className={styles.lightbox__backdrop} alt="" aria-hidden="true" />
          <div className={styles.lightbox__topbar}>
            <span className={styles.lightbox__hint}>Колесо — масштаб · перетаскивание — навигация</span>
            <button type="button" className={styles.lightbox__iconButton} onClick={onClose} aria-label="Закрыть просмотр">
              <IconX size={21} stroke={1.7} />
            </button>
          </div>

          <div
            className={styles.lightbox__stage}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            data-dragging={scale > MIN_SCALE}
          >
            <motion.img
              src={src}
              alt={alt}
              draggable={false}
              className={styles.lightbox__image}
              animate={{ scale, x: position.x, y: position.y }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          <div className={styles.lightbox__controls}>
            <button type="button" className={styles.lightbox__iconButton} onClick={() => setScale((value) => clampScale(value - SCALE_STEP))} aria-label="Уменьшить масштаб">
              <IconMinus size={19} stroke={1.8} />
            </button>
            <output className={styles.lightbox__scale}>{Math.round(scale * 100)}%</output>
            <button type="button" className={styles.lightbox__iconButton} onClick={() => setScale((value) => clampScale(value + SCALE_STEP))} aria-label="Увеличить масштаб">
              <IconPlus size={19} stroke={1.8} />
            </button>
            <button type="button" className={styles.lightbox__iconButton} onClick={resetView} aria-label="Сбросить масштаб и положение">
              <IconArrowsMaximize size={18} stroke={1.8} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default MediaLightbox;
