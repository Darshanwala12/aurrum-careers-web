import { useState, useEffect } from 'react';
import { siteData } from './data/siteContent.js';
import './minimalism-site.css';

export default function MinimalismSite({ currentSite, onSwitchSite }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSegment, setActiveSegment] = useState(siteData.segments[0].id);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', stage: 'Students', service: 'Tailoring CV and Cover Letter', message: '' });

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'about', 'contact'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-site">
      {/* Top Brand Notification / Site Switcher Bar */}
      <div className="min-topbar">
        <div className="min-container min-topbar-inner">
          <span className="min-topbar-badge">SITE 1: MINIMALISM (RED IDEA)</span>
          <p className="min-topbar-text">Minimalist Red & Cream Brand Identity</p>
          {onSwitchSite && (
            <button className="min-switch-btn" onClick={() => onSwitchSite('studio')}>
              Switch to Site 2 (Studio Canvas) ➔
            </button>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="min-header">
        <div className="min-container min-header-inner">
          <button className="min-logo" onClick={() => navigateTo('home')}>
            <span className="min-logo-accent"></span>
            <span className="min-logo-text">AURRUM<small>CAREERS</small></span>
          </button>

          <nav className="min-nav">
            <button className={activeTab === 'home' ? 'is-active' : ''} onClick={() => navigateTo('home')}>Home</button>
            <button className={activeTab === 'about' ? 'is-active' : ''} onClick={() => navigateTo('about')}>About</button>
            <button className={activeTab === 'contact' ? 'is-active' : ''} onClick={() => navigateTo('contact')}>Contact</button>
          </nav>

          <div className="min-header-cta">
            <button className="min-btn min-btn-red" onClick={() => navigateTo('contact')}>
              15-day free trial
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="min-main">
        {activeTab === 'home' && (
          <div className="min-home">
            {/* Hero Section */}
            <section className="min-hero">
              <div className="min-container min-hero-grid">
                <div className="min-hero-content">
                  <div className="min-kicker">
                    <span className="min-dot min-dot-red"></span>
                    <span>PERSONALISED CAREER COMPANION</span>
                  </div>
                  <h1 className="min-headline">{siteData.headline}</h1>
                  <p className="min-subheadline">{siteData.subHeadline}</p>
                  
                  <div className="min-hero-actions">
                    <button className="min-btn min-btn-red min-btn-lg" onClick={() => navigateTo('contact')}>
                      Start 15-day free trial ➔
                    </button>
                    <a href="#services" className="min-link-btn">
                      Explore Services ↓
                    </a>
                  </div>

                  <div className="min-hero-trust">
                    <span className="min-trust-tag">15 days free trial</span>
                    <span className="min-trust-sep">•</span>
                    <span>No fake promises</span>
                    <span className="min-trust-sep">•</span>
                    <span>Real human support</span>
                  </div>
                </div>

                {/* Minimalist Graphic Poster Visual (Inspired by "The Red Idea" Brand Image) */}
                <div className="min-hero-poster">
                  <div className="min-poster-card">
                    <div className="min-poster-sun" title="Ochre Sun Accent"></div>
                    <div className="min-poster-red-block">
                      <span>THE RED IDEA.</span>
                      <small>Smarter applications. Better direction.</small>
                    </div>
                    <div className="min-poster-art">
                      <div className="min-poster-figure">
                        <div className="min-poster-red-book">
                          <span>YOUR NEXT</span>
                          <b>CHAPTER</b>
                        </div>
                      </div>
                    </div>
                    <div className="min-poster-caption">
                      <p><b>134 Creative Dept.©</b></p>
                      <p>Less scrolling. More direction.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Sequence Navigation Bar */}
            <section className="min-seq-bar">
              <div className="min-container">
                <div className="min-seq-track">
                  <span className="min-seq-label">Candidate Journey:</span>
                  <div className="min-seq-items">
                    {siteData.journeySequence.map((step, idx) => (
                      <span key={step} className="min-seq-item">
                        {step} {idx < siteData.journeySequence.length - 1 ? '→' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="min-section min-bg-alt">
              <div className="min-container">
                <div className="min-section-header">
                  <span className="min-kicker"><span className="min-dot min-dot-yellow"></span>SERVICES WE HAVE</span>
                  <h2>Personalised career services designed for impact.</h2>
                  <p>From crafting market-ready CVs to strategic interview preparation.</p>
                </div>

                <div className="min-services-grid">
                  {siteData.services.map((service) => (
                    <div key={service.title} className="min-service-card">
                      <div className="min-service-icon">{service.icon}</div>
                      <h3 className="min-service-title">{service.title}</h3>
                      <p className="min-service-desc">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Segment-Specific Support Section */}
            <section className="min-section">
              <div className="min-container">
                <div className="min-section-header">
                  <span className="min-kicker"><span className="min-dot min-dot-red"></span>SEGMENT-SPECIFIC SUPPORT</span>
                  <h2>Tailored support for every stage of your career journey.</h2>
                </div>

                <div className="min-segments-wrapper">
                  <div className="min-segments-nav" role="tablist">
                    {siteData.segments.map((segment) => (
                      <button
                        key={segment.id}
                        role="tab"
                        aria-selected={activeSegment === segment.id}
                        className={`min-segment-tab ${activeSegment === segment.id ? 'is-active' : ''}`}
                        onClick={() => setActiveSegment(segment.id)}
                      >
                        {segment.title}
                      </button>
                    ))}
                  </div>

                  <div className="min-segment-content">
                    {siteData.segments.filter(s => s.id === activeSegment).map((segment) => (
                      <div key={segment.id} className="min-segment-card">
                        <span className="min-badge">TARGET AUDIENCE</span>
                        <h3>{segment.title}</h3>
                        <p className="min-segment-summary">{segment.summary}</p>
                        <p className="min-segment-details">{segment.details}</p>
                        <button className="min-btn min-btn-red" onClick={() => navigateTo('contact')}>
                          Get Started for {segment.title} ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* The Process Section */}
            <section className="min-section min-bg-dark">
              <div className="min-container">
                <div className="min-section-header min-header-light">
                  <span className="min-kicker"><span className="min-dot min-dot-yellow"></span>THE PROCESS</span>
                  <h2>6 simple steps from searching to landing your role.</h2>
                </div>

                <div className="min-process-grid">
                  {siteData.process.map((item) => (
                    <div key={item.title} className="min-process-card">
                      <span className="min-process-icon">{item.icon}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Aurrum Careers — Candidate Journey */}
            <section className="min-section">
              <div className="min-container">
                <div className="min-section-header">
                  <span className="min-kicker"><span className="min-dot min-dot-red"></span>CANDIDATE JOURNEY</span>
                  <h2>Aurrum Careers — 9-Step Candidate Journey</h2>
                  <p className="min-seq-headline">Discover → Review → Position → Optimise → Match → Apply → Prepare → Progress → Grow</p>
                </div>

                <div className="min-journey-layout">
                  <div className="min-journey-steps">
                    {siteData.journey.map((step, index) => (
                      <button
                        key={step.short}
                        className={`min-journey-step-btn ${activeJourneyStep === index ? 'is-active' : ''}`}
                        onClick={() => setActiveJourneyStep(index)}
                      >
                        <span className="min-journey-step-name">{step.title}</span>
                      </button>
                    ))}
                  </div>

                  <div className="min-journey-detail">
                    {(() => {
                      const current = siteData.journey[activeJourneyStep];
                      return (
                        <div className="min-journey-card">
                          <span className="min-journey-badge">STAGE {activeJourneyStep + 1} OF 9</span>
                          <h3>{current.title}</h3>
                          <p className="min-journey-desc">{current.desc}</p>
                          <div className="min-journey-outcome">
                            <strong>Outcome:</strong> <span>{current.outcome}</span>
                          </div>
                          <div className="min-journey-nav-btns">
                            <button
                              disabled={activeJourneyStep === 0}
                              onClick={() => setActiveJourneyStep(prev => Math.max(0, prev - 1))}
                            >
                              ← Previous Step
                            </button>
                            <button
                              disabled={activeJourneyStep === siteData.journey.length - 1}
                              onClick={() => setActiveJourneyStep(prev => Math.min(siteData.journey.length - 1, prev + 1))}
                            >
                              Next Step →
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Banner */}
            <section className="min-cta-banner">
              <div className="min-container min-cta-inner">
                <h2>Ready to transform your job search?</h2>
                <p>Start your 15-day free trial today. Less scrolling. More direction.</p>
                <button className="min-btn min-btn-yellow min-btn-lg" onClick={() => navigateTo('contact')}>
                  Start 15-Day Free Trial Now ➔
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="min-about">
            <section className="min-section">
              <div className="min-container">
                <div className="min-about-hero">
                  <span className="min-kicker"><span className="min-dot min-dot-red"></span>ABOUT AURRUM CAREERS</span>
                  <h1>{siteData.about.hero}</h1>
                </div>

                <div className="min-about-grid">
                  <div className="min-about-text">
                    {siteData.about.paragraphs.map((p, i) => (
                      <p key={i} className={i === 1 ? 'min-highlight-text' : ''}>{p}</p>
                    ))}
                    
                    <div className="min-quote-box">
                      <p>{siteData.about.closing}</p>
                    </div>
                  </div>

                  <div className="min-about-sidebar">
                    <div className="min-diff-card">
                      <h3>The Difference</h3>
                      <ul className="min-diff-list">
                        {siteData.about.differences.map((diff) => (
                          <li key={diff.title}>
                            <b>{diff.title}:</b> {diff.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="min-sidebar-cta">
                      <h4>Experience the difference</h4>
                      <p>Try Aurrum Careers for 15 days free.</p>
                      <button className="min-btn min-btn-red" onClick={() => navigateTo('contact')}>
                        Start 15-Day Free Trial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="min-contact">
            <section className="min-section">
              <div className="min-container">
                <div className="min-contact-grid">
                  <div className="min-contact-info">
                    <span className="min-kicker"><span className="min-dot min-dot-red"></span>CONTACT & TRIAL</span>
                    <h1>Start Your 15-Day Free Trial</h1>
                    <p>Tell us where you want to go. We’ll help you get there with real human support and smarter applications.</p>
                    
                    <div className="min-contact-highlights">
                      <div className="min-ch-item">
                        <span className="min-ch-icon">✓</span>
                        <div>
                          <b>15-Day Free Trial</b>
                          <p>Full access to personalized career guidance and CV review.</p>
                        </div>
                      </div>
                      <div className="min-ch-item">
                        <span className="min-ch-icon">✓</span>
                        <div>
                          <b>No Fake Promises</b>
                          <p>Practical strategy and authentic career positioning.</p>
                        </div>
                      </div>
                      <div className="min-ch-item">
                        <span className="min-ch-icon">✓</span>
                        <div>
                          <b>Dedicated Human Support</b>
                          <p>Your companion through every step of your application journey.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="min-contact-form-card">
                    {formSubmitted ? (
                      <div className="min-success-state">
                        <span className="min-success-icon">🎉</span>
                        <h3>You're All Set!</h3>
                        <p>Thank you, <strong>{formData.name}</strong>. Your 15-day free trial request has been submitted successfully.</p>
                        <p>Our team will reach out to you at <strong>{formData.email}</strong> shortly.</p>
                        <button className="min-btn min-btn-red" onClick={() => setFormSubmitted(false)}>
                          Submit Another Enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="min-form">
                        <h3>Get Started in Seconds</h3>
                        
                        <div className="min-form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="min-form-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>

                        <div className="min-form-group">
                          <label>Career Stage</label>
                          <select
                            value={formData.stage}
                            onChange={e => setFormData({ ...formData, stage: e.target.value })}
                          >
                            {siteData.segments.map(s => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="min-form-group">
                          <label>Primary Service Interested In</label>
                          <select
                            value={formData.service}
                            onChange={e => setFormData({ ...formData, service: e.target.value })}
                          >
                            {siteData.services.map(s => (
                              <option key={s.title} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="min-form-group">
                          <label>Tell Us About Your Career Goal</label>
                          <textarea
                            rows="4"
                            placeholder="What role, industry, or challenge are you working on?"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                          ></textarea>
                        </div>

                        <button type="submit" className="min-btn min-btn-red min-btn-block">
                          Start My 15-Day Free Trial ➔
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

      {/* Footer */}
      <footer className="min-footer">
        <div className="min-container min-footer-inner">
          <div className="min-footer-brand">
            <button className="min-logo" onClick={() => navigateTo('home')}>
              <span className="min-logo-accent"></span>
              <span className="min-logo-text">AURRUM<small>CAREERS</small></span>
            </button>
            <p>Your personalised career companion — from finding the right role to preparing for the interview.</p>
          </div>

          <div className="min-footer-links">
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('about')}>About</button>
            <button onClick={() => navigateTo('contact')}>Contact</button>
          </div>

          <div className="min-footer-copy">
            <p>© {new Date().getFullYear()} Aurrum Careers. All rights reserved.</p>
            <p>15 days free trial • Less scrolling. More direction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
