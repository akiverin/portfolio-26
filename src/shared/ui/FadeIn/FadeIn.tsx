import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: string;
};

const getVariants = (direction: string, distance: number): Variants => {
  const offsets = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = offsets[direction as keyof typeof offsets] ?? offsets.none;

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  direction = 'up',
  distance = 30,
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = '-80px',
}) => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={getVariants(reducedMotion ? 'none' : direction, distance)}
      initial={reducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once, margin: threshold }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
