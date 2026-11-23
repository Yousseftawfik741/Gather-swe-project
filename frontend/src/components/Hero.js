
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <span className="hero-eyebrow">
          MAKE EVERY MOMENT SPECIAL
        </span>

        <h1>
          Every occasion
          <br />
          deserves to be
          <br />
          <span>unforgettable.</span>
        </h1>

        <p className="hero-description">
          From beautiful weddings to unforgettable celebrations,
          discover everything you need to bring your special
          moments to life with Gather.
        </p>

        <div className="hero-actions">
          <a href="#venues" className="hero-primary-button">
            <span>Explore Venues</span>
            <span>↗</span>
          </a>

          <a href="#events" className="hero-secondary-button">
            Discover Events
          </a>
        </div>

        <div className="hero-note">
          <span className="hero-note-dot"></span>
          <span>Your moments, beautifully planned.</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-main-image">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85"
            alt="Elegant outdoor wedding celebration"
          />

          <div className="hero-image-label">
            <span>01</span>
            <span>Beautiful beginnings</span>
          </div>
        </div>

        <div className="hero-small-image hero-birthday-image">
          <img
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=85"
            alt="Colorful birthday celebration"
          />
          <span>Celebrations</span>
        </div>

        <div className="hero-small-image hero-event-image">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=85"
            alt="Live music event with an audience"
          />
          <span>Live Experiences</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
