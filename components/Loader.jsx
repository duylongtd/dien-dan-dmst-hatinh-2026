'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 600);
      }
    }, 180);
    return () => clearInterval(id);
  }, []);

  if (gone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--void-2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.4rem',
        opacity: progress >= 100 ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: progress >= 100 ? 'none' : 'auto',
      }}
    >
      <div
        className="telemetry"
        style={{ letterSpacing: '0.4em', color: 'var(--muted)' }}
      >
        ĐANG KHỞI TẠO KHÔNG GIAN
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(progress).padStart(3, '0')}
        <span style={{ color: 'var(--cyan)' }}>%</span>
      </div>
      <div
        style={{
          width: 220,
          height: 2,
          background: 'rgba(143,166,216,0.2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--azure), var(--cyan))',
            transition: 'width 0.2s',
          }}
        />
      </div>
    </div>
  );
}
