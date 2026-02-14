"use client";

import { motion, Variants } from "framer-motion";
import styles from "./AnimatedText.module.scss";
import Text from "components/Text";

type AnimatedTextProps = {
  text: string;
  className?: string;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

const letterVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const AnimatedText = ({ text, className, ...props }: AnimatedTextProps) => {
  const letters = Array.from(text);

  return (
    <motion.div
      className={`${styles.animatedText} ${className || ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} // trigger once when ~100px before entering viewport
    >
      <Text {...props} view="p-18" weight="bold" tag="h1">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            className={styles.letter}
            variants={letterVariants}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </Text>
    </motion.div>
  );
};

export default AnimatedText;
