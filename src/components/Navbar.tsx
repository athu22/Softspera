import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/internships', label: 'Courses & Internships' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <nav className="container mx-auto flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-primary/10 shrink-0 bg-white">
            <img src="/src/assets/softspera.jpeg" alt="Softspera Logo" className="w-full h-full object-cover scale-[1.8] origin-top mix-blend-multiply" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-gradient font-display pt-1">
            Softspera Technology Pvt Ltd
          </span>
        </Link>

        <ul className="hidden space-x-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`relative font-medium text-sm tracking-wide ${location.pathname === link.href
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary transition-colors'
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-2 left-0 h-[2px] w-full bg-primary rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="btn-primary hidden md:inline-flex px-6 py-2 text-sm shadow-md">
          Get Started
        </Link>

        {/* Mobile menu button */}
        <button
          className="p-2 md:hidden text-secondary hover:bg-gray-100 rounded-lg transition-colors"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((s) => !s)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full"
        >
          <div className="container flex flex-col p-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2 text-lg font-medium transition-colors ${location.pathname === link.href
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-100">
              <Link
                to="/contact"
                className="btn-primary flex justify-center w-full"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
