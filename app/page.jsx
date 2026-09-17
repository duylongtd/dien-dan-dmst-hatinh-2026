'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import gsap from 'gsap';

import Nav from '@/components/ui/Nav';
import Loader from '@/components/Loader';
import Hero from '@/components/sections/Hero';
import Journey from '@/components/sections/Journey';
import Speakers from '@/components/sections/Speakers';
import TechShowcase from '@/components/sections/TechShowcase';
import EventInfo from '@/components/sections/EventInfo';
import { scene as store } from '@/lib/store';

// WebGL canvas must be client-only (no SSR)
const Experience = dynamic(() => import('@/components/Experience'), {
  ssr: false,
});

// 'off'  -> user asked for reduced motion: static background only
// 'lite' -> phone / small screen / weak CPU: no bloom, fewer particles, dpr 1
// 'full' -> desktop
function detectGlMode() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 820;
  const weak =
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4;
  return coarse || small || weak ? 'lite' : 'full';
}

export default function Page() {
  const [glMode, setGlMode] = useState(null);

  // Mount the WebGL layer only after the display font is available so the
  // particle text is sampled with the real typeface, and after first paint so
  // the hero HTML never waits on shader compilation.
  useEffect(() => {
    let alive = true;
    const mode = detectGlMode();
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const timeout = new Promise((r) => setTimeout(r, 1500));
    Promise.race([fonts, timeout]).then(() => {
      if (alive) setGlMode(mode);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    // --- smooth scroll ---
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    store.lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // --- bridge scroll -> WebGL store ---
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      store.scroll = p;
      // cycle the particle field through its 3 morph targets as you travel
      store.morph = p * 3;
    };
    lenis.on('scroll', onScroll);
    onScroll();

    // --- assemble particles shortly after mount (the load moment) ---
    const assemble = setTimeout(() => {
      store.scatter = 0;
      store.ready = true;
    }, 900);

    // --- one orchestrated reveal per section via IntersectionObserver ---
    const reveals = gsap.utils.toArray('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(e.target, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              delay: parseFloat(e.target.dataset.delay || 0),
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(assemble);
      lenis.destroy();
      store.lenis = null;
      io.disconnect();
    };
  }, []);

  return (
    <>
      <Loader />
      {glMode && glMode !== 'off' && <Experience lite={glMode === 'lite'} />}
      <Nav />
      <main className="content-layer">
        <Hero />
        <Journey />
        <Speakers />
        <TechShowcase />
        <EventInfo />
      </main>
    </>
  );
}
