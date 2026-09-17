'use client';

import { useState } from 'react';
import { JOURNEY, STATS } from '@/lib/data';

export default function Journey() {
  const [active, setActive] = useState(0);

  return (
    <section id="journey" className="section content-layer blueprint">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '2.5rem', maxWidth: 720 }}>
          <div className="kicker" style={{ marginBottom: '1rem' }}>
            Hành trình thương mại hoá
          </div>
          <h2
            style={{
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              lineHeight: 1.05,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Năm bước đưa một ý tưởng{' '}
            <span className="text-cyan-grad">ra thị trường</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '1rem', lineHeight: 1.6 }}>
            Diễn đàn tư vấn trực tiếp về mô hình kinh doanh, sản phẩm, công nghệ,
            sở hữu trí tuệ, thị trường và khả năng huy động nguồn lực.
          </p>
        </header>

        {/* interactive step rail */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1px',
            background: 'rgba(56,208,255,0.12)',
            border: '1px solid rgba(56,208,255,0.12)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {JOURNEY.map((step, i) => {
            const on = i === active;
            return (
              <button
                key={step.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{
                  textAlign: 'left',
                  padding: '1.6rem 1.4rem',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--paper)',
                  background: on
                    ? 'linear-gradient(160deg, rgba(26,79,216,0.5), rgba(5,11,46,0.88))'
                    : 'rgba(5,11,46,0.86)',
                  transition: 'background 0.35s',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: on ? 'var(--gold)' : 'var(--muted)',
                    transition: 'color 0.35s',
                  }}
                >
                  {step.n}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    marginTop: '0.6rem',
                    color: on ? 'var(--cyan)' : 'var(--paper)',
                    transition: 'color 0.35s',
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    marginTop: '0.8rem',
                    fontSize: '0.9rem',
                    color: 'var(--muted)',
                    lineHeight: 1.55,
                    opacity: on ? 1 : 0.55,
                    transition: 'opacity 0.35s',
                  }}
                >
                  {step.desc}
                </div>
                {/* progress connector */}
                <div
                  style={{
                    marginTop: 'auto',
                    height: 3,
                    background: on ? 'var(--cyan)' : 'rgba(143,166,216,0.25)',
                    transition: 'background 0.35s',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* stats */}
        <div
          style={{
            marginTop: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {STATS.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1,
                }}
              >
                {s.value}
                <span style={{ color: 'var(--cyan)' }}>{s.suffix}</span>
              </div>
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.88rem',
                  marginTop: '0.4rem',
                }}
              >
                {s.label}
                {s.hint ? (
                  <span className="telemetry" style={{ marginLeft: 6 }}>
                    ({s.hint})
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
