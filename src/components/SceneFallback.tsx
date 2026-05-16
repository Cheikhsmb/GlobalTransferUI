import { motion } from 'framer-motion';

interface SceneFallbackProps {
  label?: string;
}

export function SceneFallback({ label = 'Chargement…' }: SceneFallbackProps) {
  return (
    <div className="scene-fallback-orb">
      <motion.div
        className="scene-fallback-orb__core"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="scene-fallback-orb__ring"
        style={{ width: 200, height: 200 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="scene-fallback-orb__ring scene-fallback-orb__ring--inner"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <p style={{ position: 'absolute', bottom: '2rem', color: '#475569', fontSize: '0.82rem' }}>
        {label}
      </p>
    </div>
  );
}
