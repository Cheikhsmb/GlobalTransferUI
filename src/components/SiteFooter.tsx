import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Globe2 } from 'lucide-react';

const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Expérience', to: '/experience' },
  { label: 'Sécurité', to: '#' },
  { label: 'Documentation', to: '#' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__border" aria-hidden />
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">
            <Globe2 size={14} style={{ display: 'inline', marginRight: '0.35rem', color: '#00e5ff' }} />
            XOF Transfer
          </p>
          <p className="site-footer__tagline">
            Transferts stablecoin premium pour les marchés XOF — propulsé par la blockchain Sepolia.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Pied de page">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className="site-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__social">
          <a href="mailto:contact@xoftransfer.app" className="site-footer__icon" aria-label="Email">
            <Mail size={16} />
          </a>
          <a href="#" className="site-footer__icon" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href="#" className="site-footer__icon" aria-label="GitHub">
            <Github size={16} />
          </a>
        </div>
      </div>

      <p className="site-footer__legal">
        © {new Date().getFullYear()} XOF Transfer — Projet Blockchain par CAPSI Boyz. Interface conceptuelle.
      </p>
    </footer>
  );
}
