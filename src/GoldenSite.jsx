import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrandSite from './BrandSite.jsx';
import './golden-site.css';

gsap.registerPlugin(ScrollTrigger);

export function GoldenHero() {
 return <><section className="gz-hero ac-wrap"><div className="gz-hero-copy"><p className="ac-kicker"><span className="gz-live"/> BIG DREAMS. REAL PEOPLE. YOUR NEXT CHAPTER.</p><h1><span>Your career.</span><span>With a little</span><span className="gz-oomph">more <i>oomph.</i><b aria-hidden="true">✳</b></span></h1><p className="gz-lede">Your personalised career companion — from finding the right role to preparing for the interview.</p><p className="gz-small">Less scrolling. More direction. Smarter applications. Better opportunities.</p><div className="gz-actions"><a className="ac-button" href="/contact?trial=1">Try 15 days on us <span>↗</span></a><a href="#services" className="gz-explore">Find your groove ↓</a></div><div className="gz-human"><span aria-hidden="true">☺ ☻ ☺</span><p>Human support.<br /><strong>Main-character energy.</strong></p></div></div><div className="gz-playground" aria-label="A playful three-dimensional gold career companion surrounded by career milestone cards"><div className="gz-grid"/><span className="gz-orbit gz-orbit-one"/><span className="gz-orbit gz-orbit-two"/><div className="gz-label gz-label-top">A LITTLE DIRECTION GOES A LONG WAY ↗</div><div className="gz-sculpture"><div className="gz-mascot"><div className="gz-face"><span className="gz-eye"/><span className="gz-eye"/><span className="gz-smile"/><span className="gz-cheek"/></div><div className="gz-side"/><div className="gz-top"/></div><div className="gz-pedestal"><span>YOU’VE GOT THIS.</span></div></div><div className="gz-sticker gz-sticker-one">✦<span>A CV that<br /><b>feels like you.</b></span></div><div className="gz-sticker gz-sticker-two"><span className="gz-check">✓</span><span>Next stop?<br /><b>Your next chapter.</b></span></div><div className="gz-sticker gz-sticker-three">15<small>DAYS<br />FREE</small></div><span className="gz-spark gz-spark-one" aria-hidden="true">✳</span><span className="gz-spark gz-spark-two" aria-hidden="true">✦</span><p className="gz-art-note">LESS “WHAT IF?”<br /><b>MORE “LET’S GO.”</b></p></div><div className="gz-scroll-note">SCROLL FOR THE GOOD STUFF <span>↓</span></div></section><div className="gz-marquee" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>FIND YOUR DIRECTION <b>✳</b> OWN YOUR STORY <b>✳</b> MAKE YOUR MOVE <b>✳</b></span>)}</div></div></>;
}

export default function GoldenSite() {
 const root = useRef(null);
 const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useLayoutEffect(() => {
  const media = gsap.matchMedia();
  if (paused) return undefined;
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const ctx = gsap.context(() => {
    gsap.from('.gz-hero h1 > span', { y: 70, rotateX: -35, opacity: 0, transformPerspective: 900, stagger: .12, duration: 1, ease: 'power3.out' });
    gsap.from('.gz-playground', { scale: .8, rotate: 8, opacity: 0, duration: 1.3, ease: 'back.out(1.2)' });
    gsap.to('.gz-sculpture', { y: -17, rotationZ: 3, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.gz-sticker', { y: -12, rotation: '+=3', duration: 2.2, stagger: .35, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.gz-spark', { rotation: 360, duration: 24, repeat: -1, ease: 'none' });
    gsap.to('.gz-marquee > div', { xPercent: -50, duration: 35, repeat: -1, ease: 'none' });
    gsap.to('.gz-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    gsap.utils.toArray('.ac-section, .ac-about-hero, .ac-contact').forEach(section => {
     gsap.from(section.querySelectorAll('h2, h3, .ac-kicker'), { y: 38, opacity: 0, rotateX: -15, duration: .8, stagger: .07, scrollTrigger: { trigger: section, start: 'top 85%', once: true } });
    });
    gsap.utils.toArray('.ac-services article, .ac-process article').forEach((card,i) => {
     gsap.from(card, { y: 75, rotateX: 25, rotateZ: i % 2 ? 4 : -4, opacity: 0, transformPerspective: 1000, duration: .9, scrollTrigger: { trigger: card, start: 'top 92%', once: true } });
    });
    gsap.from('.ac-audience-card', { rotateY: -25, rotateZ: 6, x: 35, transformPerspective: 1000, scrollTrigger: { trigger: '.ac-audience-card', start: 'top bottom', end: 'center center', scrub: 1 } });
    gsap.to('.ac-end-star', { rotation: 160, y: -60, scrollTrigger: { trigger: '.ac-end', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    const playground = root.current.querySelector('.gz-playground');
    if (playground && window.matchMedia('(pointer:fine)').matches) {
     const tiltX = gsap.quickTo(playground, 'rotationX', { duration: .6 });
     const tiltY = gsap.quickTo(playground, 'rotationY', { duration: .6 });
     const move = event => { const box = playground.getBoundingClientRect(); tiltX(-(event.clientY-box.top-box.height/2)/40); tiltY((event.clientX-box.left-box.width/2)/35); };
     const leave = () => { tiltX(0); tiltY(0); };
     playground.addEventListener('pointermove', move); playground.addEventListener('pointerleave', leave);
     return () => { playground.removeEventListener('pointermove', move); playground.removeEventListener('pointerleave', leave); };
    }
   }, root);
   return () => ctx.revert();
  });
  return () => media.revert();
 }, [paused]);
 return <div ref={root} className={`gz-site ${paused ? 'gz-paused' : ''}`}><div className="gz-progress"/><button className="gz-motion" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused ? '▶ Play motion' : 'Ⅱ Pause motion'}</button><BrandSite /></div>;
}
