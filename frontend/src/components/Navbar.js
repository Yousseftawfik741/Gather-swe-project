
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Venues', href: '#venues' },
    { label: 'Services', href: '#services' },
    { label: 'Packages', href: '#packages' },
    { label: 'My Events', href: '#events' }
  ];

  return (
    <header className="navbar">
      <a href="#home" className="navbar-logo">
        Gather<span>.</span>
      </a>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
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
          <a href="#login" className="navbar-login">Log In</a>
          <a href="#signup" className="navbar-signup">Sign Up</a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
