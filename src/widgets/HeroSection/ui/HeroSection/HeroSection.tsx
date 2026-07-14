import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconArrowDown, IconArrowUpRight, IconSparkles } from '@tabler/icons-react';
import styles from './HeroSection.module.scss';
import Text from 'shared/ui/Text';
import AnimatedText from './AnimatedText';
import { ANCHORS } from 'shared/configs/routes';

const CAPABILITIES = ['Frontend', 'UI/UX design', 'Creative development'] as const;

const HeroSection: React.FC = () => {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 22 });
  const auroraX = useTransform(smoothX, [0, 1], ['-8%', '12%']);
  const auroraY = useTransform(smoothY, [0, 1], ['-6%', '10%']);
  const ringX = useTransform(smoothX, [0, 1], [-24, 24]);
  const ringY = useTransform(smoothY, [0, 1], [-18, 18]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <section
      className={styles.hero}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className={styles.hero__background} aria-hidden="true">
        <div className={styles.hero__grid} />
        <motion.div className={styles.hero__aurora} style={{ x: auroraX, y: auroraY }} />
        <motion.div className={styles.hero__orbital} style={{ x: ringX, y: ringY }}>
          <span />
          <span />
        </motion.div>
        <div className={styles.hero__beam} />
        <div className={styles.hero__grain} />
      </div>

      <motion.div
        className={styles.hero__topline}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className={styles.hero__availability}>
          <span className={styles.hero__availabilityDot} />
          <Text tag="span" view="p-12" weight="medium">
            Открыт интересным проектам
          </Text>
        </div>
        <Text tag="span" view="p-12" className={styles.hero__location}>
          Москва · UTC+3 · 2026
        </Text>
      </motion.div>

      <div className={styles.hero__content}>
        <motion.div
          className={styles.hero__eyebrow}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
        >
          <IconSparkles size={15} stroke={1.6} />
          <Text tag="span" view="p-12" weight="medium" uppercase>
            Creative developer &amp; designer
          </Text>
        </motion.div>

        <AnimatedText text="Андрей Киверин" />

        <motion.div
          className={styles.hero__lead}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.05 }}
        >
          <Text tag="p" view="p-18" className={styles.hero__desc}>
            Превращаю сложные идеи в понятные цифровые продукты — соединяю инженерную точность,
            выразительный дизайн и живую анимацию.
          </Text>
          <div className={styles.hero__actions}>
            <Link to={ANCHORS.PROJECTS} className={styles.hero__primaryAction}>
              Смотреть проекты
              <IconArrowUpRight size={18} stroke={1.7} />
            </Link>
            <Link to={ANCHORS.CONTACT} className={styles.hero__secondaryAction}>
              Обсудить задачу
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.hero__footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <ul className={styles.hero__capabilities} aria-label="Основные направления">
          {CAPABILITIES.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
        <Link to={ANCHORS.ABOUT} className={styles.hero__scroll} aria-label="Перейти к блоку обо мне">
          <span>Scroll to explore</span>
          <IconArrowDown size={16} stroke={1.5} />
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
