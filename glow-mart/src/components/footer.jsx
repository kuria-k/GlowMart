function Footer() {
  const currentYear = new Date().getFullYear();
  
  // WhatsApp contact details
  const whatsappNumber = "254704040171"; // Kenya format without leading 0
  const whatsappMessage = "Hello Glowmart! I have a question about your products. Could you please assist me?";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400&display=swap');

        .footer-root {
          font-family: 'Jost', sans-serif;
          background-color: #1a1714;
          color: #c4b09a;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grain texture overlay */
        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* Top warm glow line */
        .footer-topline {
          height: 1px;
          background: linear-gradient(90deg, transparent, #b89b7b55, #b89b7b, #b89b7b55, transparent);
        }

        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 48px;
          position: relative;
          z-index: 1;
        }

        /* Upper grid — 4 cols on desktop */
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid #2e2a26;
        }

        /* Brand column */
        .brand-col {}

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          text-decoration: none;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #c9a882, #9a7d5e);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(184, 155, 123, 0.2);
          flex-shrink: 0;
        }

        .brand-letter {
          font-family: 'Cormorant Garamond', serif;
          color: white;
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: #e8ddd3;
        }

        .brand-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 15px;
          font-weight: 300;
          color: #7a6a5a;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .brand-desc {
          font-size: 12px;
          font-weight: 300;
          color: #5e5245;
          line-height: 1.9;
          letter-spacing: 0.03em;
          max-width: 240px;
        }

        /* Social icons */
        .socials {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .social-link {
          width: 34px;
          height: 34px;
          border: 1px solid #2e2a26;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #7a6a5a;
          font-size: 13px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .social-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #c9a882, #b89b7b);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-link:hover {
          color: #fff;
          border-color: transparent;
        }

        .social-link:hover::before {
          transform: scale(1);
        }

        .social-link svg {
          position: relative;
          z-index: 1;
        }

        /* WhatsApp special styling */
        .social-link-wa {
          border-color: #25D36630;
        }
        
        .social-link-wa:hover {
          border-color: #25D366;
        }

        /* Link columns */
        .link-col {}

        .col-heading {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: #b89b7b;
          text-transform: uppercase;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 12px;
        }

        .col-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 20px;
          height: 1px;
          background: #b89b7b;
          opacity: 0.5;
        }

        .col-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .col-links a {
          text-decoration: none;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #5e5245;
          transition: color 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .col-links a::before {
          content: '—';
          font-size: 10px;
          color: #3a3028;
          transition: color 0.25s ease, transform 0.25s ease;
          display: inline-block;
        }

        .col-links a:hover {
          color: #c4b09a;
        }

        .col-links a:hover::before {
          color: #b89b7b;
          transform: translateX(3px);
        }

        /* Newsletter column */
        .newsletter-col {}

        .newsletter-text {
          font-size: 12px;
          font-weight: 300;
          color: #5e5245;
          line-height: 1.9;
          letter-spacing: 0.03em;
          margin-bottom: 20px;
        }

        .email-wrap {
          display: flex;
          border: 1px solid #2e2a26;
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .email-wrap:focus-within {
          border-color: #b89b7b55;
        }

        .email-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 11px 14px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #c4b09a;
          min-width: 0;
        }

        .email-input::placeholder {
          color: #3a3028;
        }

        .email-btn {
          background: linear-gradient(135deg, #c9a882, #b89b7b);
          border: none;
          cursor: pointer;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 13px;
          transition: opacity 0.25s ease;
          flex-shrink: 0;
        }

        .email-btn:hover {
          opacity: 0.85;
        }

        .newsletter-note {
          margin-top: 10px;
          font-size: 10px;
          font-weight: 300;
          color: #3a3028;
          letter-spacing: 0.04em;
          line-height: 1.7;
        }

        /* Bottom bar */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 28px 40px;
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-copy {
          font-size: 11px;
          font-weight: 300;
          color: #3a3028;
          letter-spacing: 0.08em;
        }

        .footer-copy span {
          color: #5e5245;
        }

        .footer-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-legal a {
          text-decoration: none;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #3a3028;
          transition: color 0.25s ease;
        }

        .footer-legal a:hover {
          color: #b89b7b;
        }

        /* Decorative large G watermark */
        .footer-watermark {
          position: absolute;
          bottom: -20px;
          right: 32px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 180px;
          font-weight: 300;
          color: #ffffff04;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        /* ═══════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ═══════════════════════════════════ */

        /* Tablet: ≤1024px — 2×2 grid */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-main {
            padding: 56px 32px 40px;
          }
          .footer-bottom {
            padding: 24px 32px;
          }
          .brand-desc {
            max-width: 100%;
          }
        }

        /* Small tablet: ≤768px — newsletter full width, links side by side */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px 28px;
          }
          /* Brand spans full width on small tablet */
          .brand-col {
            grid-column: 1 / -1;
          }
          /* Newsletter spans full width */
          .newsletter-col {
            grid-column: 1 / -1;
          }
          .footer-main {
            padding: 48px 24px 36px;
          }
          .footer-bottom {
            padding: 20px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .footer-watermark {
            font-size: 120px;
            right: 16px;
          }
        }

        /* Mobile: ≤480px — single column stack */
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .brand-col,
          .newsletter-col {
            grid-column: auto;
          }
          .footer-main {
            padding: 40px 20px 28px;
          }
          .footer-bottom {
            padding: 18px 20px;
            gap: 14px;
          }
          .footer-legal {
            gap: 12px;
          }
          .footer-watermark {
            font-size: 80px;
            right: 12px;
            bottom: -10px;
          }
          /* Make social icons slightly larger for touch */
          .social-link {
            width: 38px;
            height: 38px;
          }
          /* Email input comfortable on small screens */
          .email-input {
            font-size: 13px;
            padding: 13px 14px;
          }
          .email-btn {
            padding: 13px 18px;
          }
        }

        /* Very small: ≤360px */
        @media (max-width: 360px) {
          .footer-main {
            padding: 32px 16px 24px;
          }
          .footer-bottom {
            padding: 16px;
          }
          .footer-legal {
            gap: 10px;
          }
          .footer-legal a {
            font-size: 9px;
          }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-topline" />

        <div className="footer-main">
          <div className="footer-grid">

            {/* Brand */}
            <div className="brand-col">
              <a href="/home" className="brand-logo">
                <div className="brand-icon">
                  <span className="brand-letter">G</span>
                </div>
                <span className="brand-name">GLOWMART</span>
              </a>
              <p className="brand-tagline">Beauty, refined.</p>
              <p className="brand-desc">
                Curated skincare and beauty essentials for those who believe that feeling beautiful is an everyday ritual, not an occasion.
              </p>
              <div className="socials">
                {/* Instagram */}
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="#" className="social-link" aria-label="TikTok">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.18 8.18 0 004.78 1.52V7.12a4.85 4.85 0 01-1.01-.43z"/>
                  </svg>
                </a>
                {/* Pinterest */}
                {/* <a href="#" className="social-link" aria-label="Pinterest">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </a> */}
                {/* YouTube */}
                {/* <a href="#" className="social-link" aria-label="YouTube">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </a> */}
                {/* WhatsApp - New */}
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link social-link-wa"
                  aria-label="WhatsApp"
                >
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.032 2.004c-5.524 0-10 4.476-10 10 0 1.764.46 3.5 1.336 5.02l-1.44 4.988 5.136-1.324c1.464.796 3.12 1.224 4.832 1.224 5.524 0 10-4.476 10-10s-4.476-10-10-10zm0 18.392c-1.484 0-2.932-.4-4.192-1.152l-.3-.176-3.048.784.808-2.972-.196-.312c-.856-1.32-1.308-2.856-1.308-4.44 0-4.584 3.728-8.312 8.312-8.312s8.312 3.728 8.312 8.312-3.728 8.312-8.312 8.312zm4.56-6.228c-.248-.124-1.464-.724-1.692-.804-.228-.084-.392-.124-.56.124-.168.248-.652.804-.8.968-.148.164-.296.184-.544.06-.248-.124-1.048-.388-1.996-1.236-.736-.66-1.236-1.476-1.38-1.724-.144-.248-.016-.384.108-.508.108-.108.248-.28.372-.42.124-.14.164-.24.248-.4.084-.16.04-.3-.02-.42-.06-.12-.56-1.352-.764-1.848-.2-.484-.404-.412-.556-.416-.144-.004-.308-.004-.476-.004-.168 0-.44.064-.672.324-.232.26-.884.864-.884 2.104 0 1.24.904 2.436 1.032 2.604.124.168 1.78 2.728 4.316 3.824.604.26 1.072.416 1.44.532.604.192 1.152.164 1.584.1.484-.072 1.464-.596 1.672-1.176.208-.58.208-1.076.144-1.18-.064-.104-.236-.168-.484-.292z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div className="link-col">
              <h4 className="col-heading">Shop</h4>
              <ul className="col-links">
                <li><a href="/stocks">All Collections</a></li>
                <li><a href="/stocks?category=skincare">Skincare</a></li>
                <li><a href="/stocks?category=makeup">Makeup</a></li>
                <li><a href="/stocks?category=fragrance">Fragrance</a></li>
                <li><a href="/stocks?category=bundles">Gift Sets</a></li>
                <li><a href="/stocks?sort=newest">New Arrivals</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="link-col">
              <h4 className="col-heading">Company</h4>
              <ul className="col-links">
                <li><a href="/about">Our Story</a></li>
                <li><a href="/blogs">Journal</a></li>
                {/* <li><a href="/sustainability">Sustainability</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/press">Press</a></li>
                <li><a href="/contact">Contact Us</a></li> */}
              </ul>
            </div>

            {/* Newsletter & Support */}
            <div className="newsletter-col">
              {/* <h4 className="col-heading">Stay in the Glow</h4>
              <p className="newsletter-text">
                Join our inner circle for exclusive drops, rituals, and beauty wisdom delivered to your inbox.
              </p>
              <div className="email-wrap">
                <input
                  type="email"
                  className="email-input"
                  placeholder="your@email.com"
                />
                <button className="email-btn" aria-label="Subscribe">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <p className="newsletter-note">No spam. Unsubscribe anytime. Pure glow, always.</p> */}
              
              {/* WhatsApp Support */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #2e2a26' }}>
                <h4 className="col-heading">Need Help?</h4>
                <p className="newsletter-text" style={{ marginBottom: '12px' }}>
                  Chat with us directly on WhatsApp for quick assistance
                </p>
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#25D366',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#20b859';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#25D366';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.032 2.004c-5.524 0-10 4.476-10 10 0 1.764.46 3.5 1.336 5.02l-1.44 4.988 5.136-1.324c1.464.796 3.12 1.224 4.832 1.224 5.524 0 10-4.476 10-10s-4.476-10-10-10zm0 18.392c-1.484 0-2.932-.4-4.192-1.152l-.3-.176-3.048.784.808-2.972-.196-.312c-.856-1.32-1.308-2.856-1.308-4.44 0-4.584 3.728-8.312 8.312-8.312s8.312 3.728 8.312 8.312-3.728 8.312-8.312 8.312zm4.56-6.228c-.248-.124-1.464-.724-1.692-.804-.228-.084-.392-.124-.56.124-.168.248-.652.804-.8.968-.148.164-.296.184-.544.06-.248-.124-1.048-.388-1.996-1.236-.736-.66-1.236-1.476-1.38-1.724-.144-.248-.016-.384.108-.508.108-.108.248-.28.372-.42.124-.14.164-.24.248-.4.084-.16.04-.3-.02-.42-.06-.12-.56-1.352-.764-1.848-.2-.484-.404-.412-.556-.416-.144-.004-.308-.004-.476-.004-.168 0-.44.064-.672.324-.232.26-.884.864-.884 2.104 0 1.24.904 2.436 1.032 2.604.124.168 1.78 2.728 4.316 3.824.604.26 1.072.416 1.44.532.604.192 1.152.164 1.584.1.484-.072 1.464-.596 1.672-1.176.208-.58.208-1.076.144-1.18-.064-.104-.236-.168-.484-.292z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
                <p className="newsletter-note" style={{ marginTop: '12px' }}>
                  Quick replies Mon-Fri, 9am-6pm
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} <span>GLOWMART</span>. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/cookies">Cookie Preferences</a>
          </div>
        </div>

        {/* Watermark */}
        <div className="footer-watermark">G</div>
      </footer>
    </>
  );
}

export default Footer;