import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { ScrollReveal } from '@/components/ScrollReveal';

const testimonials = [
  {
    quote: 'GlobalTransfer transforme nos flux transfrontaliers en une expérience digne des meilleures fintechs mondiales.',
    author: 'Aminata Diallo',
    role: 'Directrice trésorerie, Dakar',
    initials: 'AD',
  },
  {
    quote: 'La clarté visuelle et la vitesse d\'exécution rassurent nos équipes comme nos partenaires bancaires.',
    author: 'Karim Benali',
    role: 'COO, Casablanca',
    initials: 'KB',
  },
  {
    quote: 'Enfin une interface stablecoin qui parle le langage du premium sans sacrifier la précision opérationnelle.',
    author: 'Sophie Laurent',
    role: 'Head of Payments, Paris',
    initials: 'SL',
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const active = testimonials[index];

  return (
    <section className="testimonials-section section-block">
      <SectionHeading
        subtitle="Témoignages"
        title="Adopté par les équipes qui pilotent le flux."
        description="Des décideurs financiers à travers l'Afrique et l'Europe font confiance à une expérience pensée pour la clarté et la vitesse."
      />

      <ScrollReveal className="testimonials-carousel">
        <AnimatePresence mode="wait">
          <motion.article
            key={active.author}
            className="testimonial-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Quote className="testimonial-card__icon" size={24} aria-hidden />
            <p className="testimonial-card__quote">« {active.quote} »</p>
            <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(67,97,238,0.2))',
                display: 'grid', placeItems: 'center',
                fontSize: '0.7rem', fontWeight: 600, color: '#00e5ff', letterSpacing: '0.04em'
              }}>
                {active.initials}
              </div>
              <div>
                <strong>{active.author}</strong>
                <span>{active.role}</span>
              </div>
            </footer>
          </motion.article>
        </AnimatePresence>

        <div className="testimonials-dots" role="tablist" aria-label="Témoignages">
          {testimonials.map((item, i) => (
            <button
              key={item.author}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Témoignage ${i + 1}`}
              className={i === index ? 'testimonials-dots__dot active' : 'testimonials-dots__dot'}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
