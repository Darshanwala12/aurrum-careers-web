import { useRef, useState } from 'react';
import './career-demo.css';

const stages = [
  { label: 'Just starting out', title: 'Big ambitions. A clear first step.', copy: 'Your experience is only part of your story. Let’s turn your potential into a profile that opens doors.', tags: ['Graduate opportunities', 'Your first CV', 'Interview confidence'] },
  { label: 'Ready for a change', title: 'New direction. Same great potential.', copy: 'Make your next chapter feel possible. Discover your transferable skills and build a practical plan for a new field.', tags: ['Transferable skills', 'Career clarity', 'A transition plan'] },
  { label: 'Looking to grow', title: 'You’ve come far. Go even further.', copy: 'Find opportunities that recognise your experience, sharpen your professional story, and prepare for your next big move.', tags: ['Career progression', 'Personal positioning', 'Targeted applications'] },
];
const services = [
  ['01', 'Find your direction', 'A little clarity changes everything. Get a career plan built around your strengths, goals, and what matters to you.', 'Career counselling', '↗'],
  ['02', 'Tell your story', 'Make your experience stand out with a thoughtful CV, a stronger LinkedIn profile, and a portfolio that feels like you.', 'CV & personal brand', '✳'],
  ['03', 'Make your next move', 'From finding relevant roles to preparing for interviews, get practical support at every step of your search.', 'Applications & interviews', '↗'],
];
function Arrow() { return <span aria-hidden="true">↗</span>; }
function Brand() { return <span className="cd-brand"><span className="cd-brand-mark" aria-hidden="true">a.</span><span>aurrum<span className="cd-brand-sub">CAREERS</span></span></span>; }

export default function CareerDemo() {
  const [stage, setStage] = useState(0);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const dialog = useRef(null);
  const openTrial = () => { setSaved(false); dialog.current.showModal(); };
  const current = stages[stage];
  return <div className="career-site">
    <a className="cd-skip" href="#main">Skip to content</a>
    <header className="cd-header">
      <a href="#" aria-label="Aurrum Careers home"><Brand /></a>
      <button className="cd-menu" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="cd-nav" onClick={() => setMenu(!menu)}>{menu ? 'Close −' : 'Menu +'}</button>
      <nav id="cd-nav" className={menu ? 'is-open' : ''} aria-label="Main navigation">
        <a href="#approach" onClick={() => setMenu(false)}>Our approach</a><a href="#services" onClick={() => setMenu(false)}>How we help</a><a href="#journey" onClick={() => setMenu(false)}>Your journey</a>
      </nav>
      <button className="cd-button cd-header-cta" onClick={openTrial}>Let’s get started <Arrow /></button>
    </header>
    <main id="main">
      <section className="cd-hero">
        <div className="cd-hero-copy"><p className="cd-eyebrow"><span className="cd-dot" /> YOUR NEXT CHAPTER STARTS HERE</p>
          <h1>A career that<br />feels more<br />like <em>you.</em><span className="cd-spark" aria-hidden="true">✳</span></h1>
          <p className="cd-lede">Less second-guessing. More moving forward.<br className="desktop-break" /> Personalised career support to help you find your direction — and take the next step.</p>
          <div className="cd-hero-actions"><button className="cd-button" onClick={openTrial}>Find your next step <Arrow /></button><a className="cd-text-link" href="#services">Explore how we help <span>↓</span></a></div>
          <p className="cd-fine"><span>✓</span> 15-day free trial <i /> A little support. A lot of possibility.</p>
        </div>
        <div className="cd-hero-art">
          <div className="cd-photo"><img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85" alt="Bright, plant-filled workspace with room for your next chapter" /><div className="cd-photo-label">ROOM TO GROW.<br /><span>Space to become.</span></div></div>
          <div className="cd-orbit" aria-hidden="true">YOUR FUTURE<br /><b>↗</b><br />LOOKS GOOD</div>
          <div className="cd-progress"><span className="cd-progress-icon">↗</span><div><small>YOUR NEXT CHAPTER</small><strong>Closer than you think.</strong><div className="cd-progress-line"><span /></div></div><span className="cd-progress-star">✦</span></div>
          <span className="cd-art-caption">A NEW PERSPECTIVE CHANGES EVERYTHING. ↗</span>
        </div>
      </section>
      <div className="cd-belief"><span>MORE THAN A JOB SEARCH.</span><p>A little clarity. <b>Real human support.</b> A way forward.</p><span aria-hidden="true">✳</span></div>
      <section id="approach" className="cd-stage cd-section">
        <div className="cd-section-intro"><p className="cd-eyebrow">01 / BUILT AROUND YOU</p><h2>Wherever you are,<br />let’s start <em>there.</em></h2><p>There’s no one-size-fits-all career path.<br />So your support shouldn’t be either.</p></div>
        <div className="cd-stage-picker"><div className="cd-tabs" role="tablist" aria-label="Your career stage">{stages.map((item, index) => <button role="tab" id={`stage-${index}`} aria-controls="stage-panel" aria-selected={stage === index} key={item.label} onClick={() => setStage(index)}>{item.label}</button>)}</div>
          <div role="tabpanel" id="stage-panel" aria-labelledby={`stage-${stage}`} className="cd-stage-panel"><span className="cd-small-star" aria-hidden="true">✳</span><h3>{current.title}</h3><p>{current.copy}</p><div className="cd-tags">{current.tags.map(tag => <span key={tag}>✓ {tag}</span>)}</div><button className="cd-text-link" onClick={openTrial}>Let’s make a plan <Arrow /></button></div>
        </div>
      </section>
      <section id="services" className="cd-services cd-section"><div className="cd-section-heading"><div><p className="cd-eyebrow">02 / GOOD SUPPORT. REAL PROGRESS.</p><h2>Your potential.<br /><em>Our starting point.</em></h2></div><p>From “what’s next?” to “I’m ready.”<br />We’re here for the moments in between.</p></div>
        <div className="cd-service-grid">{services.map(([number, title, copy, tag, icon]) => <article className="cd-service" key={number}><div className="cd-service-top"><span>{number} /</span><span className="cd-service-icon" aria-hidden="true">{icon}</span></div><h3>{title}</h3><p>{copy}</p><button onClick={openTrial}>{tag}<Arrow /></button></article>)}</div>
      </section>
      <section id="journey" className="cd-journey cd-section"><div><p className="cd-eyebrow">03 / SMALL STEPS. BIG POSSIBILITIES.</p><h2>You don’t need<br />all the answers.<br /><em>Just a beginning.</em></h2><button className="cd-button cd-lime" onClick={openTrial}>Take your first step <Arrow /></button></div><ol>{[['Let’s get to know you', 'Your goals, your experience, your aspirations. We listen first, so every next step makes sense for you.'], ['Build your way forward', 'Together, we create a focused plan — from strengthening your profile to finding opportunities that fit.'], ['Move with confidence', 'Get hands-on application and interview support, with someone in your corner as you progress.']].map(([title, copy], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>
      <section className="cd-faq cd-section"><div><p className="cd-eyebrow">A LITTLE MORE CLARITY</p><h2>Good questions.<br /><em>Honest answers.</em></h2></div><div>{[['Who is Aurrum Careers for?', 'Students, fresh graduates, career changers, and experienced professionals. Wherever you are in your working life, we help you take a more considered next step.'], ['What can I get help with?', 'Career direction, CVs and cover letters, LinkedIn, portfolio building, targeted applications, interview preparation, and your longer-term professional positioning.'], ['Do you guarantee a job?', 'No. We focus on practical support, stronger applications, and informed decisions. Hiring outcomes depend on employers and the job market, so we never promise a guaranteed job.'], ['How do I get started?', 'Choose “Let’s get started” and explore the 15-day trial demo. This preview lets you outline your goals; it does not submit your information or create a paid subscription.']].map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="cd-final"><span aria-hidden="true">✳</span><p className="cd-eyebrow">YOUR FUTURE IS STILL BEING WRITTEN.</p><h2>Make the next chapter<br /><em>a good one.</em></h2><button className="cd-button" onClick={openTrial}>Start your 15-day free trial <Arrow /></button><p>More direction. More confidence. More you.</p></section>
    </main>
    <footer className="cd-footer"><a href="#" aria-label="Aurrum Careers home"><Brand /></a><p>Your ambition. Our support.</p><div><a href="#approach">Our approach</a><a href="#services">How we help</a><button onClick={openTrial}>Get in touch ↗</button></div><small>© {new Date().getFullYear()} Aurrum Careers. All rights reserved.</small><small>Made for your next chapter.</small></footer>
    <dialog ref={dialog} className="cd-dialog" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}><button className="cd-close" onClick={() => dialog.current.close()} aria-label="Close trial form">×</button><p className="cd-eyebrow">LET’S FIND YOUR NEXT STEP</p><h2>{saved ? 'A clearer beginning.' : 'Tell us a little about you.'}</h2>{saved ? <div role="status"><p>Your demo plan is ready: start by reviewing your current CV, choose two target roles, and list the skills you’d like to build.</p><p>This is a preview. Your details have not been submitted or stored.</p><button className="cd-button" onClick={() => dialog.current.close()}>Keep exploring <Arrow /></button></div> : <form onSubmit={event => { event.preventDefault(); setSaved(true); }}><p>Explore your 15-day trial. This demo won’t send or store your details.</p><label>Your name<input name="name" autoComplete="name" placeholder="Full name" required /></label><label>Email address<input name="email" autoComplete="email" type="email" placeholder="you@example.com" required /></label><label>Where are you in your journey?<select key={stage} defaultValue={stages[stage].label}>{stages.map(item => <option key={item.label}>{item.label}</option>)}</select></label><button className="cd-button" type="submit">Preview my next step <Arrow /></button></form>}</dialog>
  </div>;
}
