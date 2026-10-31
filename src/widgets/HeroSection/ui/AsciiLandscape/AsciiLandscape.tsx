import { useEffect, useRef, useState, type RefObject } from 'react';
import sceneUrl from 'assets/hero/clear-passage.webp';
import depthUrl from 'assets/hero/clear-passage-depth.webp';
import mobileSceneUrl from 'assets/hero/clear-passage-mobile.webp';
import mobileDepthUrl from 'assets/hero/clear-passage-mobile-depth.webp';
import { createLandscapeRenderer, type LandscapeController } from './renderer';
import styles from './AsciiLandscape.module.scss';

type AsciiLandscapeProps = {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  paused?: boolean;
};

const PORTRAIT_SCENE_QUERY = '(max-width: 1023px) and (orientation: portrait)';

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Landscape image unavailable'));
    image.src = url;
  });

const AsciiLandscape = ({ className, containerRef, paused = false }: AsciiLandscapeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<LandscapeController | null>(null);
  const pausedRef = useRef(paused);
  const [compact, setCompact] = useState(() => window.matchMedia(PORTRAIT_SCENE_QUERY).matches);
  const [contextVersion, rebuildContext] = useState(0);

  useEffect(() => {
    const media = window.matchMedia(PORTRAIT_SCENE_QUERY);
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const restore = () => rebuildContext((version) => version + 1);
    canvas?.addEventListener('webglcontextrestored', restore);
    return () => canvas?.removeEventListener('webglcontextrestored', restore);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    rendererRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const element = rootRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!element || !canvas || !container) return;
    let disposed = false;
    element.dataset.renderer = 'loading';
    element.dataset.animating = 'false';
    Promise.all([
      loadImage(compact ? mobileSceneUrl : sceneUrl),
      loadImage(compact ? mobileDepthUrl : depthUrl),
    ])
      .then(([scene, depth]) => {
        if (disposed) return;
        rendererRef.current = createLandscapeRenderer({
          canvas,
          element,
          container,
          scene,
          depth,
          paused: pausedRef.current,
        });
      })
      .catch(() => {
        if (!disposed) {
          element.dataset.renderer = 'fallback';
          element.dataset.animating = 'false';
        }
      });
    return () => {
      disposed = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [containerRef, compact, contextVersion]);

  return (
    <div
      ref={rootRef}
      className={[styles.landscape, className].filter(Boolean).join(' ')}
      data-ascii-landscape=""
      data-renderer="loading"
      data-animating="false"
      aria-hidden="true"
    >
      <picture>
        <source media={PORTRAIT_SCENE_QUERY} srcSet={mobileSceneUrl} />
        <img className={styles.landscape__fallback} src={sceneUrl} alt="" fetchPriority="high" />
      </picture>
      <canvas className={styles.landscape__canvas} ref={canvasRef} />
    </div>
  );
};

export default AsciiLandscape;
