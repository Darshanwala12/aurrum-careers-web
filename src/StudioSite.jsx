import { useState, useEffect } from 'react';
import { siteData } from './data/siteContent.js';
import './studio-site.css';

export default function StudioSite({ currentSite, onSwitchSite }) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSegment, setSelectedSegment] = useState(siteData.segments[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', stage: 'Students', service: 'Tailoring CV and Cover Letter', message: '' });

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
    setSubmitted(true);
  };

  return (
    <div className="std-site">
      {/* Top Banner & Switcher */}
      <div className="std-topbar">
        <div className="std-container std-topbar-content">
          <div className="std-topbar-tag">SITE 2: STUDIO CANVAS</div>
          <p className="std-topbar-desc">Modern Editorial Swiss Studio Identity</p>
          {onSwitchSite && (
            <button className="std-switch-btn" onClick={() => onSwitchSite('minimalism')}>
              Switch to Site 1 (Minimalism Red Idea) ➔
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Header */}
      <header className="std-header">
        <div className="std-container std-header-content">
          <button className="std-brand" onClick={() => navigateTo('home')}>
            <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers Logo" style={{ height: '42px', width: 'auto' }} />
          </button>

          <nav className="std-nav">
            <button className={activeTab === 'home' ? 'is-active' : ''} onClick={() => navigateTo('home')}>Home</button>
            <button className={activeTab === 'about' ? 'is-active' : ''} onClick={() => navigateTo('about')}>About</button>
            <button className={activeTab === 'contact' ? 'is-active' : ''} onClick={() => navigateTo('contact')}>Contact</button>
          </nav>

          <button className="std-btn std-btn-primary" onClick={() => navigateTo('contact')}>
            15-day free trial ↗
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="std-main">
        {activeTab === 'home' && (
          <div className="std-home">
            {/* Hero Section */}
            <section className="std-hero">
              <div className="std-container">
                <div className="std-hero-badge">YOUR PERSONALISED CAREER COMPANION</div>
                <h1 className="std-hero-title">{siteData.headline}</h1>
                <p className="std-hero-subtitle">{siteData.subHeadline}</p>

                <div className="std-hero-cta-group">
                  <button className="std-btn std-btn-primary std-btn-lg" onClick={() => navigateTo('contact')}>
                    Start 15-Day Free Trial ↗
                  </button>
                  <a href="#services" className="std-btn std-btn-outline std-btn-lg">
                    Explore Services ↓
                  </a>
                </div>

                <div className="std-trial-strip">
                  <span className="std-pill-tag">15days free trial</span>
                  <span>Personalised support for every step of your career move</span>
                </div>
              </div>
            </section>

            {/* Candidate Journey Stepper Header */}
            <section className="std-sequence-bar">
              <div className="std-container">
                <div className="std-seq-flex">
                  <span className="std-seq-title">Simple Website Pathway:</span>
                  <div className="std-seq-list">
                    {siteData.journeySequence.map((step, idx) => (
                      <span key={step} className="std-seq-chip">
                        <b>{step}</b> {idx < siteData.journeySequence.length - 1 ? '→' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="std-section std-bg-card">
              <div className="std-container">
                <div className="std-section-head">
                  <span className="std-kicker">SERVICES WE HAVE</span>
                  <h2>Comprehensive Career Support</h2>
                  <p>Everything you need to navigate job searching with clarity and confidence.</p>
                </div>

                <div className="std-services-grid">
                  {siteData.services.map((item) => (
                    <div key={item.title} className="std-service-box">
                      <div className="std-service-icon-wrap">{item.icon}</div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Segment-Specific Support */}
            <section className="std-section">
              <div className="std-container">
                <div className="std-section-head">
                  <span className="std-kicker">SEGMENT-SPECIFIC SUPPORT</span>
                  <h2>Specialised Guidance For Every Career Stage</h2>
                </div>

                <div className="std-segments-layout">
                  <div className="std-segment-pills">
                    {siteData.segments.map((seg) => (
                      <button
                        key={seg.id}
                        className={`std-segment-pill ${selectedSegment === seg.id ? 'is-active' : ''}`}
                        onClick={() => setSelectedSegment(seg.id)}
                      >
                        {seg.title}
                      </button>
                    ))}
                  </div>

                  <div className="std-segment-display">
                    {siteData.segments.filter(s => s.id === selectedSegment).map((seg) => (
                      <div key={seg.id} className="std-segment-panel">
                        <span className="std-panel-kicker">TAILORED STRATEGY</span>
                        <h3>{seg.title}</h3>
                        <div className="std-segment-summary-box">
                          <p><strong>Focus:</strong> {seg.summary}</p>
                        </div>
                        <p className="std-segment-body">{seg.details}</p>
                        <button className="std-btn std-btn-primary" onClick={() => navigateTo('contact')}>
                          Get Started for {seg.title} ↗
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* The Process */}
            <section className="std-section std-bg-dark">
              <div className="std-container">
                <div className="std-section-head std-head-dark">
                  <span className="std-kicker">THE PROCESS</span>
                  <h2>Your Route To Success</h2>
                  <p>Less guesswork. More direction. Smarter outcomes.</p>
                </div>

                <div className="std-process-grid">
                  {siteData.process.map((p) => (
                    <div key={p.title} className="std-process-card">
                      <div className="std-process-emoji">{p.icon}</div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Candidate Journey */}
            <section className="std-section">
              <div className="std-container">
                <div className="std-section-head">
                  <span className="std-kicker">CANDIDATE JOURNEY</span>
                  <h2>Aurrum Careers — Candidate Journey</h2>
                  <p className="std-seq-sub">Discover → Review → Position → Optimise → Match → Apply → Prepare → Progress → Grow</p>
                </div>

                <div className="std-journey-container">
                  <div className="std-journey-timeline">
                    {siteData.journey.map((step, idx) => (
                      <button
                        key={step.short}
                        className={`std-journey-node ${activeStep === idx ? 'is-active' : ''}`}
                        onClick={() => setActiveStep(idx)}
                      >
                        <span className="std-node-dot"></span>
                        <span className="std-node-label">{step.short}</span>
                      </button>
                    ))}
                  </div>

                  <div className="std-journey-card">
                    {(() => {
                      const cur = siteData.journey[activeStep];
                      return (
                        <div className="std-journey-card-inner">
                          <div className="std-card-top">
                            <span className="std-card-step-badge">STEP {activeStep + 1} OF 9</span>
                            <h3>{cur.title}</h3>
                          </div>
                          <p className="std-card-desc">{cur.desc}</p>
                          <div className="std-card-outcome">
                            <strong>Outcome:</strong> {cur.outcome}
                          </div>
                          <div className="std-card-nav">
                            <button
                              className="std-btn std-btn-outline"
                              disabled={activeStep === 0}
                              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                            >
                              ← Previous
                            </button>
                            <button
                              className="std-btn std-btn-primary"
                              disabled={activeStep === siteData.journey.length - 1}
                              onClick={() => setActiveStep(prev => Math.min(siteData.journey.length - 1, prev + 1))}
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

            {/* CTA Strip */}
            <section className="std-cta-strip">
              <div className="std-container std-cta-strip-inner">
                <div>
                  <h2>Ready for a smarter approach?</h2>
                  <p>Start your 15-day free trial with Aurrum Careers today.</p>
                </div>
                <button className="std-btn std-btn-light std-btn-lg" onClick={() => navigateTo('contact')}>
                  15-Day Free Trial ↗
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="std-about">
            <section className="std-section">
              <div className="std-container">
                <div className="std-about-header">
                  <span className="std-kicker">ABOUT AURRUM CAREERS</span>
                  <h1>{siteData.about.hero}</h1>
                </div>

                <div className="std-about-content">
                  <div className="std-about-main">
                    {siteData.about.paragraphs.map((para, i) => (
                      <p key={i} className={i === 1 ? 'std-lead-paragraph' : ''}>{para}</p>
                    ))}
                    
                    <div className="std-quote-banner">
                      <p>{siteData.about.closing}</p>
                    </div>
                  </div>

                  <aside className="std-about-aside">
                    <div className="std-diff-box">
                      <h3>The Difference</h3>
                      <div className="std-diff-items">
                        {siteData.about.differences.map((diff) => (
                          <div key={diff.title} className="std-diff-item">
                            <h4>{diff.title}</h4>
                            <p>{diff.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="std-aside-cta">
                      <h4>Start Your Journey</h4>
                      <p>Claim your 15-day free trial today.</p>
                      <button className="std-btn std-btn-primary" onClick={() => navigateTo('contact')}>
                        15-Day Free Trial ↗
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="std-contact">
            <section className="std-section">
              <div className="std-container">
                <div className="std-contact-layout">
                  <div className="std-contact-intro">
                    <span className="std-kicker">GET IN TOUCH</span>
                    <h1>Claim Your 15-Day Free Trial</h1>
                    <p>Tell us where you want your career to go. We'll provide the direction, tools, and support to get you there.</p>

                    <div className="std-perks-list">
                      <div className="std-perk">
                        <span className="std-perk-check">✓</span>
                        <div>
                          <strong>15-Day Free Trial</strong>
                          <p>Explore personalised guidance without initial commitment.</p>
                        </div>
                      </div>
                      <div className="std-perk">
                        <span className="std-perk-check">✓</span>
                        <div>
                          <strong>No Fake Promises</strong>
                          <p>Honest feedback and tailored positioning strategy.</p>
                        </div>
                      </div>
                      <div className="std-perk">
                        <span className="std-perk-check">✓</span>
                        <div>
                          <strong>Real Human Support</strong>
                          <p>Dedicated career advice at every step.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="std-contact-card">
                    {submitted ? (
                      <div className="std-submitted-message">
                        <span className="std-sub-icon">✉️</span>
                        <h3>Request Received!</h3>
                        <p>Thank you <strong>{form.name}</strong>. Your 15-day free trial details have been submitted.</p>
                        <p>We will email you at <strong>{form.email}</strong> to begin your personalised career roadmap.</p>
                        <button className="std-btn std-btn-outline" onClick={() => setSubmitted(false)}>
                          Submit Another Request
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="std-form">
                        <h3>Start Your Free Trial</h3>

                        <div className="std-field">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                          />
                        </div>

                        <div className="std-field">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                          />
                        </div>

                        <div className="std-field">
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

                        <div className="std-field">
                          <label>Primary Service Needed</label>
                          <select
                            value={form.service}
                            onChange={e => setForm({ ...form, service: e.target.value })}
                          >
                            {siteData.services.map(s => (
                              <option key={s.title} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="std-field">
                          <label>Tell Us About Your Career Goal</label>
                          <textarea
                            rows="4"
                            placeholder="Describe your current situation or target roles..."
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                          ></textarea>
                        </div>

                        <button type="submit" className="std-btn std-btn-primary std-btn-full">
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

      {/* Footer */}
      <footer className="std-footer">
        <div className="std-container std-footer-grid">
          <div className="std-footer-brand">
            <img src="/brand/aurrum-careers-transparent.png" alt="Aurrum Careers Logo" style={{ height: '42px', width: 'auto' }} />
            <p>Your personalised career companion — from finding the right role to preparing for the interview.</p>
          </div>

          <div className="std-footer-nav">
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('about')}>About</button>
            <button onClick={() => navigateTo('contact')}>Contact</button>
          </div>

          <div className="std-footer-copy">
            <p>© {new Date().getFullYear()} Aurrum Careers. 15days free trial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
