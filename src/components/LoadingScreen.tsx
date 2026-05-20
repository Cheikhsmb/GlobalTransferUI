import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onComplete, minDuration = 2200 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      // Ease-out cubic for natural feel
      const raw = Math.min(1, elapsed / minDuration);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(eased * 100);
      if (elapsed < minDuration) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, minDuration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Chargement de l'expérience"
        >
          <motion.div
            className="loading-screen__glow"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="loading-screen__content">
            <p className="loading-screen__eyebrow">GlobalTransfer</p>
            <h2 className="loading-screen__title">Initialisation du flux</h2>
            <motion.div
              className="loading-screen__bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              style={{ transformOrigin: 'left center' }}
              transition={{ duration: 0.08 }}
            />
            <p className="loading-screen__percent">{Math.round(progress)}%</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
