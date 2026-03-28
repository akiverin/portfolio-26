import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './NotFoundPage.module.scss';
import Text from 'shared/ui/Text';
import { ROUTES } from 'shared/configs/routes';
import { IconArrowLeft } from '@tabler/icons-react';

const PARTICLE_COUNT = 20;

const floatingParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

const digitVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(16px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 18,
      stiffness: 100,
      delay: i * 0.15,
    },
  }),
};

const DIGITS = ['4', '0', '4'] as const;

export const NotFoundPage: React.FC = () => {

  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__bg}>
        <div className={styles.notFound__gradient} />
        <div className={styles.notFound__grid} />
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className={styles.notFound__particle}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className={styles.notFound__content}>
        <div className={styles.notFound__digits}>
          {DIGITS.map((digit, i) => (
            <motion.span
              key={`digit-${digit}-${i}`}
              className={styles.notFound__digit}
              variants={digitVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              {digit}
            </motion.span>
          ))}
        </div>

        <motion.div
          className={styles.notFound__glowLine}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />

        <motion.div
          className={styles.notFound__info}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Text tag="h2" view="p-24" weight="bold">
            Страница не найдена
          </Text>
          <Text tag="p" view="p-16" color="secondary">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link to={ROUTES.HOME} className={styles.notFound__link}>
            <IconArrowLeft size={18} stroke={2} />
            <Text view="p-16" weight="medium">
              Вернуться на главную
            </Text>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
