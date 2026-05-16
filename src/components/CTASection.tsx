import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { MagneticButton } from '@/components/MagneticButton';

export function CTASection() {
  return (
    <section className="cta-section section-block">
      <ScrollReveal>
        <div className="cta-panel glass-panel">
          <p className="eyebrow">Prêt pour la démonstration</p>
          <h2 className="section-heading__title">
            Lancez votre transfert XOF dans un environnement cinématique.
          </h2>
          <p className="cta-panel__description">
            Accédez au dashboard interactif, testez les flux de conversion et explorez
            l'interface complète — sans frais, sans engagement.
          </p>
          <div className="cta-panel__actions">
            <Link to="/experience" className="inline-flex">
              <MagneticButton className="cta-panel__btn-primary">
                Ouvrir l'expérience
                <ArrowRight size={16} className="ml-2" />
              </MagneticButton>
            </Link>
            <MagneticButton className="cta-panel__btn-ghost">
              Voir la documentation
            </MagneticButton>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
