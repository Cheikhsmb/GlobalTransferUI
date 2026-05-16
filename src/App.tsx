import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Menu, Globe2, X, Sun, Moon } from 'lucide-react';
import HomePage from '@/pages/HomePage';
import ExperiencePage from '@/pages/ExperiencePage';
import { useLenis } from '@/hooks/useLenis';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SiteFooter } from '@/components/SiteFooter';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Accueil', path: '/' },
  { label: 'Expérience', path: '/experience' },
];

const pageTransition = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      return next;
    });
  };

  useLenis();

  return (
    <div className="app-shell">
      <div className="grain-overlay" aria-hidden />
      <div className="background-grid" />

      {loading ? <LoadingScreen onComplete={() => setLoading(false)} /> : null}

      <header className="site-header">
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <div className="brand__icon">
            <Globe2 size={18} />
          </div>
          <div>
            <p className="brand__label">XOF Transfer</p>
            <p className="brand__subtext">Stablecoin premium</p>
          </div>
        </NavLink>

        <nav className={cn('site-nav', menuOpen && 'site-nav--open')} aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn('nav-link', isActive && 'active')}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="nav-action"
            onClick={toggleTheme}
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="nav-action"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          {...pageTransition}
          className="page-content"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/experience" element={<ExperiencePage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}

export default App;
