import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { TransferPanel } from '@/components/TransferPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { BalancesPanel } from '@/components/BalancesPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SceneFallback } from '@/components/SceneFallback';
import { ScrollReveal } from '@/components/ScrollReveal';

const HeroScene = lazy(() =>
  import('@/components/HeroScene').then((m) => ({ default: m.HeroScene }))
);

export default function ExperiencePage() {
  return (
    <div className="page-shell experience-page">
      <ScrollReveal className="experience-hero">
        <div className="experience-copy">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="eyebrow"
          >
            <LayoutDashboard size={14} aria-hidden />
            Dashboard de transfert
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Interface stablecoin immersive pour vos transferts bi-directionnels (XOF ↔ EUR/USD).
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="experience-copy__description"
          >
            Connectez MetaMask, saisissez un montant et simulez un transfert international.
            L'interface est prête — les smart contracts attendent leur déploiement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="experience-actions"
          >
            <Button>
              Utiliser l'interface
              <ChevronRight size={16} className="ml-2" />
            </Button>
            <Link to="/" className="experience-back-link">
              <ArrowLeft size={14} className="mr-1.5" />
              Retour à l'accueil
            </Link>
          </motion.div>
        </div>

        <Card className="experience-hero__visual">
          <Suspense fallback={<SceneFallback label="Chargement 3D…" />}>
            <HeroScene />
          </Suspense>
        </Card>
      </ScrollReveal>

      <ScrollReveal className="dashboard-grid" stagger={0.08}>
        <BalancesPanel />
        <TransferPanel />
        <HistoryPanel />
      </ScrollReveal>
    </div>
  );
}
