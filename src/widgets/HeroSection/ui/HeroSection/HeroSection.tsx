import { ActionLink } from 'shared/ui/ActionButton';
import ActionButton from 'shared/ui/ActionButton';
import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import { ANCHORS } from 'shared/configs/routes';
import logo from 'assets/brand/logo-07-blue.svg';
import AsciiLandscape from '../AsciiLandscape';
import styles from './HeroSection.module.scss';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
      data-hero="clear-passage"
      data-motion={paused || reducedMotion ? 'paused' : 'playing'}
    >
      <AsciiLandscape
        className={styles.hero__landscape}
        containerRef={sectionRef}
        paused={paused}
      />
      <div className={styles.hero__atmosphere} aria-hidden="true" />
      <div className={styles.hero__topline}>
        <span className={styles.hero__brand}>
          <img src={logo} alt="andkiv" width={142} height={40} data-brand-variant="07" />
        </span>
        <div className={styles.hero__topTools}>
          <span className={styles.hero__availability}>
            <span className={styles.hero__availabilityDot} aria-hidden="true" />
            Открыт интересным проектам
          </span>
          {!reducedMotion && (
            <ActionButton
              variant="icon"
              size="sm"
              type="button"
              className={styles.hero__motionToggle}
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Включить анимацию фона' : 'Остановить анимацию фона'}
              aria-pressed={paused}
              title={paused ? 'Включить анимацию фона' : 'Остановить анимацию фона'}
            >
              {paused ? (
                <PlayIcon size={16} weight="fill" aria-hidden="true" />
              ) : (
                <PauseIcon size={16} weight="fill" aria-hidden="true" />
              )}
            </ActionButton>
          )}
        </div>
      </div>
      <div className={styles.hero__content}>
        <p className={styles.hero__eyebrow}>Дизайн с характером. Разработка со смыслом.</p>
        <h1 id="hero-title" className={styles.hero__title}>
          <span>Сложное внутри.</span>
          <span>Понятное снаружи.</span>
        </h1>
        <p className={styles.hero__description}>
          Превращаю сложные задачи в ясные интерфейсы
          <br className={styles.hero__desktopBreak} /> и продуманные веб-продукты.
        </p>
        <div className={styles.hero__actions}>
          <ActionLink
            variant="primary"
            surface="light"
            href={ANCHORS.PROJECTS}
            className={styles.hero__primaryAction}
          >
            Как это выглядит
          </ActionLink>
          <ActionLink
            variant="text"
            surface="light"
            chevron
            href={ANCHORS.CONTACT}
            className={styles.hero__secondaryAction}
          >
            Обсудить проект
          </ActionLink>
        </div>
      </div>
      <div className={styles.hero__footer}>
        <div className={styles.hero__signature}>
          <span>Андрей Киверин</span>
          <span className={styles.hero__signatureDivider} aria-hidden="true">
            /
          </span>
          <span>Creative developer &amp; designer</span>
        </div>
        <Link to={ANCHORS.ABOUT} className={styles.hero__scroll}>
          <span>Чуть ближе</span>
          <ArrowDownIcon size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
export default HeroSection;
