import mascot from 'assets/brand/mascot.svg';
import styles from './StartupLoader.module.scss';

const StartupLoader: React.FC = () => (
  <div
    className={styles.loader}
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Загрузка портфолио"
  >
    <div className={styles.loader__content}>
      <div className={styles.loader__scene} aria-hidden="true">
        <span className={styles.loader__halo} />
        <span className={styles.loader__orbit} />
        <span className={styles.loader__orbitInner} />
        <img
          src={mascot}
          width={88}
          height={88}
          alt=""
          className={styles.loader__mascot}
          fetchPriority="high"
        />
      </div>
      <span className={styles.loader__wordmark} aria-hidden="true">
        andkiv
      </span>
      <p className={styles.loader__caption}>Готовим ваше пространство</p>
      <span className={styles.loader__progress} aria-hidden="true">
        <span />
      </span>
    </div>
    <span className={styles.loader__signature} aria-hidden="true">
      DESIGN · CODE · MOTION
    </span>
  </div>
);

export default StartupLoader;
