import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Sparkles,
  Zap,
  Layers,
  LineChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatsStrip } from '@/components/StatsStrip';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { MagneticButton } from '@/components/MagneticButton';
import { SceneFallback } from '@/components/SceneFallback';

const HeroScene = lazy(() =>
  import('@/components/HeroScene').then((m) => ({ default: m.HeroScene }))
);

const features = [
  {
    icon: Zap,
    title: 'Transferts instantanés',
    description: 'Flux optimisés pour des transactions bi-directionnelles (XOF ↔ EUR/USD) ultra-rapides en quelques secondes.',
  },
  {
    icon: Layers,
    title: 'Architecture blockchain',
    description: 'Smart contracts audités sur Sepolia avec ERC-20, Oracle de taux et gestion sécurisée des transferts.',
  },
  {
    icon: LineChart,
    title: 'Traçabilité totale',
    description: 'Chaque transaction est indexée on-chain via des events, offrant une transparence complète.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="page-shell home-page">
      {/* ── Hero ── */}
      <section className="hero-panel">
        <div className="hero-copy">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <Sparkles size={14} aria-hidden />
            Transferts internationaux XOF
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Envoyez des stablecoins XOF à travers le monde, en un instant.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="hero-copy__description"
          >
            Une interface premium construite sur la blockchain Sepolia. Convertissez XOF vers EUR ou USD, et USD ou EUR vers XOF, avec des smart contracts sécurisés et une expérience cinématique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="hero-actions"
          >
            <Link to="/experience" className="inline-flex">
              <MagneticButton className="hero-cta-primary">
                Lancer l'expérience
                <ArrowRight size={16} className="ml-2" />
              </MagneticButton>
            </Link>
            <Button variant="ghost">Explorer la vision</Button>
          </motion.div>
        </div>

        <div className="hero-visual">
          <Suspense fallback={<SceneFallback label="Chargement 3D…" />}>
            <HeroScene />
          </Suspense>
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsStrip />

      {/* ── Features ── */}
      <section className="features-section section-block">
        <SectionHeading
          subtitle="Capacités"
          title="Infrastructure complète pour les flux XOF."
          description="Smart contracts, oracle de taux, et interface immersive — chaque couche est conçue pour la performance et la confiance."
        />
        <ScrollReveal className="features-grid" stagger={0.12}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`feature-card ${hoveredFeature === index ? 'feature-card--active' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-card__icon">
                  <Icon size={20} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-card__glow" aria-hidden />
              </Card>
            );
          })}
        </ScrollReveal>
      </section>

      {/* ── Detail ── */}
      <section className="detail-section section-block">
        <ScrollReveal className="detail-panel glass-panel">
          <div className="detail-panel__tag">Blockchain • Sécurisé • Transparent</div>
          <h2>Smart contracts audités, expérience premium.</h2>
          <p>
            XOFToken (ERC-20), RateOracle pour les taux de change, et TransferManager
            pour orchestrer les flux — le tout protégé par OpenZeppelin.
          </p>
          <div className="detail-list">
            <div>
              <ShieldCheck size={18} />
              <span>ReentrancyGuard & Ownable</span>
            </div>
            <div>
              <Globe2 size={18} />
              <span>Réseau Sepolia Testnet</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="detail-card glass-panel" delay={0.1}>
          <p className="detail-card__eyebrow">Démonstration live</p>
          <h3>Testez l'interface de transfert sans engagement.</h3>
          <Link to="/experience" className="detail-card__link">
            Ouvrir le dashboard <ArrowRight size={16} />
          </Link>
          <Sparkles className="detail-card__sparkle" size={18} aria-hidden />
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── CTA ── */}
      <CTASection />
    </div>
  );
}
