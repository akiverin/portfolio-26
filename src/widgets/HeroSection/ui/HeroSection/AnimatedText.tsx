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
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  const letters = useMemo(() => Array.from(text), [text]);

  return (
    <motion.h1
      className={classNames(styles.animatedText, className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className={styles.letter}
          variants={letterVariants}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default AnimatedText;
