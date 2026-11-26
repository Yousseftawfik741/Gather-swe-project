
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Events', href: '#events' }
  ];

  return (
    <header className="navbar">
      <a
        href="#home"
        className="navbar-logo"
        onClick={() => setMenuOpen(false)}
      >
        Gather<span>.</span>
      </a>

      <button
        type="button"
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        id="main-navigation"
        className={`navbar-menu ${menuOpen ? 'active' : ''}`}
        aria-label="Main navigation"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <div className="navbar-actions">
          <Link
            to="/login"
            className="navbar-login"
            onClick={() => setMenuOpen(false)}
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="navbar-signup"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
