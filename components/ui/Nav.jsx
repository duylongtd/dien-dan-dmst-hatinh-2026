'use client';

import { useEffect, useState } from 'react';
import { NAV } from '@/lib/data';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="content-layer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem clamp(1.25rem, 5vw, 4rem)',
        transition: 'background 0.3s, backdrop-filter 0.3s',
        background: scrolled ? 'rgba(3,7,32,0.6)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(56,208,255,0.15)'
          : '1px solid transparent',
      }}
    >
      <button
        onClick={() => go('hero')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--paper)',
        }}
      >
        <LogoMark />
        <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>
          ĐMST <span style={{ color: 'var(--cyan)' }}>Hà Tĩnh</span>
        </span>
      </button>

      <div
        className="hidden md:flex"
        style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}
      >
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            {n.label}
          </button>
        ))}
        <button className="btn-primary" onClick={() => go('register')}>
          Đăng ký tham dự
        </button>
      </div>
    </nav>
  );
}

function LogoMark() {
  // Abstract lotus/mountain mark echoing the Hà Tĩnh emblem, in brand blue.
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#38D0FF" strokeWidth="1.4" opacity="0.5" />
      <path
        d="M20 8 L28 26 L20 21 L12 26 Z"
        fill="#F5C542"
        opacity="0.95"
      />
      <path d="M20 21 L20 32" stroke="#38D0FF" strokeWidth="1.6" />
    </svg>
  );
}
