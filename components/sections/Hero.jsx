'use client';

import { EVENT } from '@/lib/data';
import Countdown from '../ui/Countdown';
import { scrollToId } from '@/lib/store';

export default function Hero() {
  const go = scrollToId;

  return (
    <section
      id="hero"
      className="section content-layer"
      style={{ alignItems: 'center', textAlign: 'center' }}
    >
      {/* host + celebrate strip */}
      <div className="reveal" data-reveal style={{ marginBottom: '1.4rem' }}>
        <div
          className="telemetry"
          style={{ letterSpacing: '0.35em', marginBottom: '0.6rem' }}
        >
          {EVENT.host}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 999,
            border: '1px solid rgba(56,208,255,0.3)',
            background: 'rgba(56,208,255,0.06)',
            fontSize: '0.82rem',
            color: 'var(--cyan)',
            fontWeight: 600,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--gold)' }} />
          {EVENT.kicker} · ĐỔI MỚI SÁNG TẠO 2026
        </div>
      </div>

      <h1
        className="reveal"
        data-reveal
        style={{
          fontWeight: 900,
          lineHeight: 0.98,
          letterSpacing: '-0.02em',
          margin: 0,
          fontSize: 'clamp(2.4rem, 7vw, 6.2rem)',
          maxWidth: 1100,
          textTransform: 'uppercase',
        }}
      >
        Từ ý tưởng đến{' '}
        <span className="text-gold-grad">thị trường</span>
      </h1>

      <p
        className="reveal"
        data-reveal
        style={{
          marginTop: '1.4rem',
          maxWidth: 640,
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}
      >
        {EVENT.subtitle}. {EVENT.tagline}.
      </p>

      <div
        className="reveal"
        data-reveal
        style={{
          marginTop: '2.2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button className="btn-primary" onClick={() => go('register')}>
          Đăng ký tham dự →
        </button>
        <button className="btn-ghost" onClick={() => go('speakers')}>
          Gặp gỡ diễn giả
        </button>
      </div>

      <div
        className="reveal"
        data-reveal
        style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}
      >
        <Countdown />
      </div>

      {/* corner telemetry HUD */}
      <div
        className="reveal"
        data-reveal
        style={{
          position: 'absolute',
          left: 'clamp(1.25rem, 5vw, 4rem)',
          bottom: '2rem',
          textAlign: 'left',
        }}
      >
        <div className="telemetry">◦ LAT {EVENT.geo.lat.toFixed(4)}</div>
        <div className="telemetry">◦ LNG {EVENT.geo.lng.toFixed(4)}</div>
        <div className="telemetry" style={{ color: 'var(--muted)' }}>
          {EVENT.venue}
        </div>
      </div>

      <div
        className="reveal"
        data-reveal
        style={{
          position: 'absolute',
          right: 'clamp(1.25rem, 5vw, 4rem)',
          bottom: '2rem',
          textAlign: 'right',
        }}
      >
        <div className="telemetry">SỰ KIỆN</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {EVENT.dateLabel}
        </div>
      </div>
    </section>
  );
}
