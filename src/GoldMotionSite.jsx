import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteData } from './data/siteContent.js';
import './gold-motion-site.css';

gsap.registerPlugin(ScrollTrigger);

export default function GoldMotionSite({ currentSite, onSwitchSite }) {
  const rootRef = useRef(null);
  const horizontalRef = useRef(null);
  const trackRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('home');
  const [activeSegment, setActiveSegment] = useState(siteData.segments[0].id);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', stage: 'Students', service: 'Tailoring CV and Cover Letter', message: '' });

  // Initial Preloader Timeline
  useEffect(() => {
    const counterObj = { val: 0 };
    const tl = gsap.timeline({
      onUpdate: () => {
        setLoadProgress(Math.floor(counterObj.val));
      },
      onComplete: () => {
        setLoadingComplete(true);
        // Refresh ScrollTrigger after loader exits
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    });

    tl.to(counterObj, { val: 100, duration: 1.2, ease: 'power2.inOut' })
      .to('.gm-preloader-logo', { scale: 1.1, opacity: 0, duration: 0.4, ease: 'power2.in' })
      .to('.gm-preloader', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' });

    return () => tl.kill();
  }, []);

  // GSAP Animations Context
  useLayoutEffect(() => {
    if (!loadingComplete) return undefined;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {

      // 1. Header scroll morph
      ScrollTrigger.create({
        start: 'top -40',
        onUpdate: (self) => {
          const header = document.querySelector('.gm-header');
          if (header) {
            if (self.direction === 1 && self.scroll() > 50) {
              header.classList.add('is-scrolled');
            } else if (self.scroll() <= 20) {
              header.classList.remove('is-scrolled');
            }
          }
        }
      });

      // 2. Hero cinematic entrance
      if (activeTab === 'home') {
        const heroTl = gsap.timeline({ delay: 0.1 });
        heroTl.from('.gm-hero-badge', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })
              .from('.gm-hero-headline .gm-word', { y: 50, opacity: 0, rotateX: -25, stagger: 0.04, duration: 0.85, ease: 'power3.out' }, '-=0.4')
              .from('.gm-hero-subheadline', { y: 25, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
              .from('.gm-hero-actions > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.4')
              .from('.gm-hero-visual', { scale: 0.85, opacity: 0, rotateY: 15, duration: 1, ease: 'power3.out' }, '-=0.8');

        // Continuous floating & mouse tilt for hero visual
        gsap.to('.gm-hero-card-float', {
          y: -12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // 3. Stagger reveals for Services
        gsap.from('.gm-service-card', {
          scrollTrigger: {
            trigger: '#services',
            start: 'top 75%'
          },
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out'
        });

        // 4. Desktop Horizontal Scroll Section for Candidate Journey
        media.add('(min-width: 901px)', () => {
          if (horizontalRef.current && trackRef.current) {
            const trackWidth = trackRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            const amountToScroll = trackWidth - viewportWidth + 120;

            gsap.to(trackRef.current, {
              x: -amountToScroll,
              ease: 'none',
              scrollTrigger: {
                trigger: horizontalRef.current,
                pin: true,
                scrub: 1,
                end: () => `+=${amountToScroll + 300}`,
                invalidateOnRefresh: true
              }
            });
          }
        });

        // 5. Process grid reveal
        gsap.from('.gm-process-card', {
          scrollTrigger: {
            trigger: '.gm-process-section',
            start: 'top 80%'
          },
          scale: 0.9,
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'back.out(1.2)'
        });
      }

      // Magnetic CTAs Effect
      const magneticBtns = document.querySelectorAll('[data-magnetic]');
      magneticBtns.forEach(btn => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });

        const mouseMove = (e) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          xTo(relX * 0.25);
          yTo(relY * 0.25);
        };

        const mouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener('mousemove', mouseMove);
        btn.addEventListener('mouseleave', mouseLeave);
      });

    }, rootRef);

    return () => {
      ctx.revert();
      media.revert();
    };
  }, [loadingComplete, activeTab]);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => ScrollTrigger.refresh(), 150);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Helper to split text into words for GSAP text animation
  const renderSplitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="gm-word-wrap">
        <span className="gm-word">{word}&nbsp;</span>
      </span>
    ));
  };

  return (
    <div ref={rootRef} className="gm-site">
      {/* GSAP Preloader Curtain */}
      {!loadingComplete && (
        <div className="gm-preloader">
          <div className="gm-preloader-content">
            <div className="gm-preloader-logo">
              <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers" />
            </div>
            <div className="gm-preloader-bar">
              <div className="gm-preloader-fill" style={{ width: `${loadProgress}%` }}></div>
            </div>
            <span className="gm-preloader-counter">{loadProgress}%</span>
            <p className="gm-preloader-tag">YOUR PERSONALISED CAREER COMPANION</p>
          </div>
        </div>
      )}

      {/* Demo Switcher Header */}
      <div className="gm-topbar">
        <div className="gm-container gm-topbar-inner">
          <span className="gm-topbar-badge">SITE 3: GOLD MOTION (BRAND #cd9228)</span>
          <p className="gm-topbar-text">GSAP Interactive Motion Experience • Color Accent #cd9228</p>
          <div className="gm-topbar-actions">
            {onSwitchSite && (
              <>
                <button onClick={() => onSwitchSite('minimalism')}>Site 1 (Minimalism)</button>
                <button onClick={() => onSwitchSite('studio')}>Site 2 (Studio)</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="gm-header">
        <div className="gm-container gm-header-inner">
          {/* Logo with uploaded brand asset */}
          <button className="gm-logo" onClick={() => navigateTo('home')}>
            <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers Logo" className="gm-logo-img" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="gm-nav">
            <button className={activeTab === 'home' ? 'is-active' : ''} onClick={() => navigateTo('home')}>Home</button>
            <button className={activeTab === 'about' ? 'is-active' : ''} onClick={() => navigateTo('about')}>About</button>
            <button className={activeTab === 'contact' ? 'is-active' : ''} onClick={() => navigateTo('contact')}>Contact</button>
          </nav>

          {/* Header Action */}
          <div className="gm-header-cta">
            <button className="gm-btn gm-btn-gold" data-magnetic onClick={() => navigateTo('contact')}>
              15-day free trial ↗
            </button>
            <button
              className={`gm-hamburger ${mobileMenuOpen ? 'is-open' : ''}`}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`gm-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="gm-drawer-inner">
          <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers" className="gm-drawer-logo" />
          <nav className="gm-drawer-nav">
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('about')}>About</button>
            <button onClick={() => navigateTo('contact')}>Contact</button>
          </nav>
          <button className="gm-btn gm-btn-gold gm-btn-block" onClick={() => navigateTo('contact')}>
            Start 15-day free trial ↗
          </button>
        </div>
      </div>

      {/* Main Pages Content */}
      <main className="gm-main">
        {activeTab === 'home' && (
          <div className="gm-home">
            {/* Hero Section */}
            <section className="gm-hero">
              <div className="gm-hero-bg-glow"></div>
              <div className="gm-container gm-hero-grid">
                <div className="gm-hero-copy">
                  <div className="gm-hero-badge">
                    <span className="gm-sparkle">✦</span>
                    <span>AURRUM CAREERS • BRAND COLOR #cd9228</span>
                  </div>

                  <h1 className="gm-hero-headline">
                    {renderSplitText(siteData.headline)}
                  </h1>

                  <p className="gm-hero-subheadline">
                    {siteData.subHeadline}
                  </p>

                  <div className="gm-hero-actions">
                    <button className="gm-btn gm-btn-gold gm-btn-lg" data-magnetic onClick={() => navigateTo('contact')}>
                      Start 15-day free trial ↗
                    </button>
                    <a href="#services" className="gm-btn-text">
                      Explore Services ↓
                    </a>
                  </div>

                  <div className="gm-hero-pill-strip">
                    <span className="gm-pill-gold">15days free trial</span>
                    <span>Less scrolling. More direction. Smarter applications.</span>
                  </div>
                </div>

                {/* Hero Interactive 3D Card Visual */}
                <div className="gm-hero-visual">
                  <div className="gm-hero-card-float">
                    <div className="gm-glass-card">
                      <div className="gm-card-glow"></div>
                      <div className="gm-card-header">
                        <span className="gm-card-dot"></span>
                        <span className="gm-card-title">CANDIDATE JOURNEY</span>
                      </div>
                      <div className="gm-card-body">
                        <h3>Your Personalised Career Companion</h3>
                        <p>From finding the right role to preparing for the interview.</p>
                        <div className="gm-card-tags">
                          <span>Tailored CVs</span>
                          <span>Mock Interviews</span>
                          <span>Strategy</span>
                        </div>
                      </div>
                      <div className="gm-card-footer">
                        <span className="gm-gold-text">15 Days Free Trial</span>
                        <span>Aurrum Careers ↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sequence Pathway Bar */}
            <section className="gm-pathway-bar">
              <div className="gm-container">
                <div className="gm-pathway-track">
                  <span className="gm-pathway-label">Candidate Pathway:</span>
                  <div className="gm-pathway-items">
                    {siteData.journeySequence.map((step, idx) => (
                      <span key={step} className="gm-pathway-chip">
                        <b>{step}</b> {idx < siteData.journeySequence.length - 1 ? '→' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Services We Have (11 Services) */}
            <section id="services" className="gm-section">
              <div className="gm-container">
                <div className="gm-section-head">
                  <span className="gm-kicker">SERVICES WE HAVE</span>
                  <h2>Targeted support designed for career results.</h2>
                  <p>Comprehensive guidance tailored to your experience and goals.</p>
                </div>

                <div className="gm-services-grid">
                  {siteData.services.map((srv) => (
                    <div key={srv.title} className="gm-service-card" data-magnetic>
                      <div className="gm-srv-icon">{srv.icon}</div>
                      <h3>{srv.title}</h3>
                      <p>{srv.desc}</p>
                      <span className="gm-srv-arrow">↗</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Segment-Specific Support */}
            <section className="gm-section gm-bg-alt">
              <div className="gm-container">
                <div className="gm-section-head">
                  <span className="gm-kicker">SEGMENT-SPECIFIC SUPPORT</span>
                  <h2>Tailored strategy for every career background.</h2>
                </div>

                <div className="gm-segments-layout">
                  <div className="gm-segment-tabs">
                    {siteData.segments.map((seg) => (
                      <button
                        key={seg.id}
                        className={`gm-segment-tab ${activeSegment === seg.id ? 'is-active' : ''}`}
                        onClick={() => setActiveSegment(seg.id)}
                      >
                        {seg.title}
                      </button>
                    ))}
                  </div>

                  <div className="gm-segment-content">
                    {siteData.segments.filter(s => s.id === activeSegment).map((seg) => (
                      <div key={seg.id} className="gm-segment-card">
                        <span className="gm-badge-gold">TARGET CATEGORY</span>
                        <h3>{seg.title}</h3>
                        <div className="gm-seg-summary">
                          <p><strong>Focus:</strong> {seg.summary}</p>
                        </div>
                        <p className="gm-seg-details">{seg.details}</p>
                        <button className="gm-btn gm-btn-gold" data-magnetic onClick={() => navigateTo('contact')}>
                          Get Started as {seg.title} ↗
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* The Process */}
            <section className="gm-section gm-process-section gm-bg-dark">
              <div className="gm-container">
                <div className="gm-section-head gm-head-light">
                  <span className="gm-kicker">THE PROCESS</span>
                  <h2>6 steps to turn application stress into job offers.</h2>
                </div>

                <div className="gm-process-grid">
                  {siteData.process.map((p) => (
                    <div key={p.title} className="gm-process-card">
                      <div className="gm-process-icon">{p.icon}</div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Horizontal Scroll Candidate Journey */}
            <section ref={horizontalRef} className="gm-horizontal-section">
              <div className="gm-horizontal-header gm-container">
                <span className="gm-kicker">CANDIDATE JOURNEY</span>
                <h2>Aurrum Careers — 9-Step Candidate Journey</h2>
                <p>Scroll vertically to explore each phase of your career progression pipeline.</p>
              </div>

              <div className="gm-horizontal-wrapper">
                <div ref={trackRef} className="gm-horizontal-track">
                  {siteData.journey.map((step, idx) => (
                    <div key={step.short} className="gm-journey-slide">
                      <div className="gm-journey-card-slide">
                        <div className="gm-slide-badge">STAGE {idx + 1} OF 9</div>
                        <h3>{step.title}</h3>
                        <p className="gm-slide-desc">{step.desc}</p>
                        <div className="gm-slide-outcome">
                          <strong>Outcome:</strong> <span>{step.outcome}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Banner */}
            <section className="gm-cta-banner">
              <div className="gm-container gm-cta-inner">
                <h2>Start your 15-day free trial today.</h2>
                <p>Less scrolling. More direction. Smarter applications. Better opportunities.</p>
                <button className="gm-btn gm-btn-gold gm-btn-lg" data-magnetic onClick={() => navigateTo('contact')}>
                  Start 15-Day Free Trial ↗
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="gm-about">
            <section className="gm-section">
              <div className="gm-container">
                <div className="gm-about-hero">
                  <span className="gm-kicker">ABOUT AURRUM CAREERS</span>
                  <h1>{siteData.about.hero}</h1>
                </div>

                <div className="gm-about-grid">
                  <div className="gm-about-text">
                    {siteData.about.paragraphs.map((p, i) => (
                      <p key={i} className={i === 1 ? 'gm-lead-p' : ''}>{p}</p>
                    ))}

                    <div className="gm-quote-card">
                      <p>{siteData.about.closing}</p>
                    </div>
                  </div>

                  <aside className="gm-about-aside">
                    <div className="gm-diff-card">
                      <h3>The Difference</h3>
                      <ul className="gm-diff-list">
                        {siteData.about.differences.map((diff) => (
                          <li key={diff.title}>
                            <b>{diff.title}:</b> {diff.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="gm-aside-cta">
                      <h4>Ready for real support?</h4>
                      <p>Start your 15-day free trial with Aurrum Careers.</p>
                      <button className="gm-btn gm-btn-gold" onClick={() => navigateTo('contact')}>
                        Start 15-Day Free Trial
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="gm-contact">
            <section className="gm-section">
              <div className="gm-container">
                <div className="gm-contact-grid">
                  <div className="gm-contact-info">
                    <span className="gm-kicker">CONTACT & TRIAL</span>
                    <h1>Start Your 15-Day Free Trial</h1>
                    <p>Tell us where you want your career to go. We are your personalised career companion through every step.</p>

                    <div className="gm-perks">
                      <div className="gm-perk-item">
                        <span className="gm-perk-check">✓</span>
                        <div>
                          <b>15-Day Free Trial</b>
                          <p>Try personalized strategy and profile review with zero obligation.</p>
                        </div>
                      </div>
                      <div className="gm-perk-item">
                        <span className="gm-perk-check">✓</span>
                        <div>
                          <b>No Fake Promises</b>
                          <p>Honest feedback and actionable positioning strategy.</p>
                        </div>
                      </div>
                      <div className="gm-perk-item">
                        <span className="gm-perk-check">✓</span>
                        <div>
                          <b>Real Human Support</b>
                          <p>Dedicated career coaching through finding roles and interview prep.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="gm-contact-card">
                    {submitted ? (
                      <div className="gm-success-box">
                        <span className="gm-success-emoji">🎉</span>
                        <h3>Request Received!</h3>
                        <p>Thank you <strong>{form.name}</strong>. Your 15-day free trial details have been received.</p>
                        <p>We will contact you at <strong>{form.email}</strong> shortly.</p>
                        <button className="gm-btn gm-btn-gold" onClick={() => setSubmitted(false)}>
                          Submit Another Request
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="gm-form">
                        <h3>Claim Your 15-Day Free Trial</h3>

                        <div className="gm-field">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Your full name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                          />
                        </div>

                        <div className="gm-field">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                          />
                        </div>

                        <div className="gm-field">
                          <label>Career Stage</label>
                          <select
                            value={form.stage}
                            onChange={e => setForm({ ...form, stage: e.target.value })}
                          >
                            {siteData.segments.map(s => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="gm-field">
                          <label>Primary Service Interested In</label>
                          <select
                            value={form.service}
                            onChange={e => setForm({ ...form, service: e.target.value })}
                          >
                            {siteData.services.map(s => (
                              <option key={s.title} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="gm-field">
                          <label>Tell Us About Your Career Goal</label>
                          <textarea
                            rows="4"
                            placeholder="What role, sector, or transition are you targeting?"
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                          ></textarea>
                        </div>

                        <button type="submit" className="gm-btn gm-btn-gold gm-btn-block" data-magnetic>
                          Start My 15-Day Free Trial ↗
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer with Logo */}
      <footer className="gm-footer">
        <div className="gm-container gm-footer-inner">
          <div className="gm-footer-brand">
            <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers Logo" className="gm-footer-logo" />
            <p>Your personalised career companion — from finding the right role to preparing for the interview.</p>
          </div>

          <div className="gm-footer-nav">
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('about')}>About</button>
            <button onClick={() => navigateTo('contact')}>Contact</button>
          </div>

          <div className="gm-footer-copy">
            <p>© {new Date().getFullYear()} Aurrum Careers. All rights reserved. Brand Accent #cd9228.</p>
            <p>15days free trial • Less scrolling. More direction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
