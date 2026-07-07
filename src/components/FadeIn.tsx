import { motion, HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> {
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
}

// Scroll-triggered rise-and-fade wrapper. Starts hidden regardless of
// whether the element is already on screen at first paint, and only
// animates in once per element (viewport.once), so revisiting the page
// via back/forward doesn't replay every block at once.
export function FadeIn({ delay = 0, duration = 0.7, y = 40, x = 0, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
