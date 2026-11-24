
import './Footer.css';

function Footer() {
  return (
    <footer className="gather-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            Gather<span>.</span>
          </a>

          <p>
            Every occasion deserves to be unforgettable.
            Discover unique experiences and everything you need
            to celebrate life's special moments.
          </p>

          <span className="footer-brand-note">
            Your moments, beautifully planned.
          </span>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
        </div>

        <div className="footer-column">
          <h3>Occasions</h3>
          <a href="#events">Weddings</a>
          <a href="#events">Birthdays</a>
          <a href="#events">Parties & Celebrations</a>
          <a href="#events">Corporate Events</a>
          <a href="#events">Live Entertainment</a>
        </div>

        <div className="footer-contact">
          <span className="footer-eyebrow">LET'S MAKE IT SPECIAL</span>

          <h3>Have a moment worth celebrating?</h3>

          <p>
            Start exploring and find everything
            you need for your next special occasion.
          </p>

          <a href="#events" className="footer-explore-button">
            Explore Gather <span>↗</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Gather. All rights reserved.
        </p>

        <span>Made for your special moments.</span>
      </div>
    </footer>
  );
}

export default Footer;
