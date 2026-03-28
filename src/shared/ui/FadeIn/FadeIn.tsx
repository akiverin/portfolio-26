import React from 'react';
import { motion, type Variants } from 'framer-motion';

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
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
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
  return (
    <motion.div
      className={className}
      variants={getVariants(direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
