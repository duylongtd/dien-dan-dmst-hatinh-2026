'use client';

import { useEffect, useState } from 'react';
import { EVENT } from '@/lib/data';

function diff(target) {
  const now = Date.now();
  let ms = new Date(target).getTime() - now;
  if (ms < 0) ms = 0;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

export default function Countdown() {
  const [t, setT] = useState(() => diff(EVENT.datetimeISO));

  useEffect(() => {
    const id = setInterval(() => setT(diff(EVENT.datetimeISO)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { v: t.d, l: 'ngày' },
    { v: t.h, l: 'giờ' },
    { v: t.m, l: 'phút' },
    { v: t.s, l: 'giây' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      {units.map((u, i) => (
        <div
          key={i}
          className="glass hud-frame"
          style={{
            minWidth: 70,
            padding: '0.8rem 0.6rem',
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <div
            style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--paper)',
            }}
          >
            {String(u.v).padStart(2, '0')}
          </div>
          <div
            className="telemetry"
            style={{ marginTop: 6, textTransform: 'uppercase' }}
          >
            {u.l}
          </div>
        </div>
      ))}
    </div>
  );
}
