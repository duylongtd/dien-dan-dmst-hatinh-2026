'use client';

import { useEffect } from 'react';
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

export default function Page() {
  useEffect(() => {
    // --- smooth scroll ---
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
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
      io.disconnect();
    };
  }, []);

  return (
    <>
      <Loader />
      <Experience />
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
