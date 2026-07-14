import { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import classNames from 'classnames';
import styles from './AnimatedText.module.scss';

type AnimatedTextProps = {
  text: string;
  className?: string;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.25 },
  },
};

const letterVariants: Variants = {
  hidden: {
    y: '115%',
    opacity: 0,
    rotateX: -72,
    rotateZ: 3,
    filter: 'blur(14px)',
  },
  visible: (index: number) => ({
    y: '0%',
    opacity: 1,
    rotateX: 0,
    rotateZ: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 125,
      mass: 0.72,
      delay: index * 0.045,
    },
  }),
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  const words = useMemo(() => text.split(' '), [text]);
  let letterIndex = 0;

  return (
    <motion.h1
      className={classNames(styles.animatedText, className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word) => (
        <span key={word} className={styles.word} aria-hidden="true">
          {Array.from(word).map((char) => {
            const index = letterIndex++;
            return (
              <motion.span
                key={`${char}-${index}`}
                className={styles.letter}
                variants={letterVariants}
                custom={index}
                whileHover={{ y: '-7%', transition: { duration: 0.18 } }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
      <motion.span
        className={styles.accent}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 1.05, stiffness: 160, damping: 16 }}
        aria-hidden="true"
      />
    </motion.h1>
  );
};

export default AnimatedText;
