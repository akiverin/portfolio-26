import { ActionLink } from 'shared/ui/ActionButton';
import ActionButton from 'shared/ui/ActionButton';
import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
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
          {!reducedMotion && (
            <ActionButton
              variant="icon"
              surface="dark"
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
        <h1 id="hero-title" className={styles.hero__title}>
          <span>Создаю сайты</span>
          <span>и веб-приложения.</span>
        </h1>
        <p className={styles.hero__description}>
          Проектирую интерфейсы и пишу код на React и TypeScript.
        </p>
        <div className={styles.hero__actions}>
          <ActionLink
            variant="primary"
            surface="light"
            href={ANCHORS.PROJECTS}
            className={styles.hero__primaryAction}
          >
            Смотреть проекты
          </ActionLink>
          <ActionLink
            variant="text"
            surface="light"
            chevron
            href={ANCHORS.CONTACT}
            className={styles.hero__secondaryAction}
          >
            Связаться
          </ActionLink>
        </div>
      </div>
      <div className={styles.hero__footer}>
        <div className={styles.hero__signature}>
          <span>Андрей Киверин</span>
        </div>
        <ActionLink href={ANCHORS.ABOUT} variant="text" surface="dark" size="sm" chevron>
          Обо мне
        </ActionLink>
      </div>
    </section>
  );
};
export default HeroSection;
