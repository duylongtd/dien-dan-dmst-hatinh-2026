'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TECH } from '@/lib/data';

// icon glyphs for products without a cut-out image
function Glyph({ id, color }) {
  const common = { stroke: color, strokeWidth: 1.6, fill: 'none' };
  switch (id) {
    case 'survey':
      return (
        <svg width="64" height="64" viewBox="0 0 48 48">
          <path {...common} d="M24 6v10M24 40V30M8 24h10M40 24H30" />
          <circle {...common} cx="24" cy="24" r="7" />
          <path {...common} d="M14 42l6-12M34 42l-6-12" />
        </svg>
      );
    case 'camera-ai':
      return (
        <svg width="64" height="64" viewBox="0 0 48 48">
          <rect {...common} x="8" y="14" width="32" height="22" rx="3" />
          <circle {...common} cx="24" cy="25" r="6" />
          <path {...common} d="M18 14l3-4h6l3 4" />
        </svg>
      );
    case 'misa':
      return (
        <svg width="64" height="64" viewBox="0 0 48 48">
          <rect {...common} x="7" y="9" width="34" height="24" rx="2" />
          <path {...common} d="M18 39h12M24 33v6M13 27l6-6 4 4 8-9" />
        </svg>
      );
    case 'stem':
      return (
        <svg width="64" height="64" viewBox="0 0 48 48">
          <path {...common} d="M24 6l4 8 8 1-6 6 2 9-8-4-8 4 2-9-6-6 8-1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TechShowcase() {
  const [hover, setHover] = useState(null);

  return (
    <section id="tech" className="section content-layer">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '2.5rem', maxWidth: 760 }}>
          <div className="telemetry" style={{ marginBottom: '0.8rem' }}>
            KHÔNG GIAN GIỚI THIỆU & TRẢI NGHIỆM
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
            Sản phẩm{' '}
            <span className="text-gold-grad">công nghệ</span> hôm nay,
            cho tương lai bền vững
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '1rem', lineHeight: 1.6 }}>
            Trải nghiệm trực tiếp các công nghệ, sản phẩm và giải pháp đổi mới
            sáng tạo phù hợp với định hướng phát triển của tỉnh.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {TECH.map((item, i) => {
            const on = hover === i;
            const accent = i < 2 ? '#38D0FF' : '#F5C542';
            return (
              <article
                key={item.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="glass hud-frame"
                style={{
                  position: 'relative',
                  borderRadius: 8,
                  padding: '1.6rem',
                  minHeight: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  transform: on ? 'translateY(-6px)' : 'none',
                  transition: 'transform 0.4s',
                  borderColor: on
                    ? 'rgba(56,208,255,0.5)'
                    : 'rgba(56,208,255,0.22)',
                }}
              >
                {/* glow wash on hover */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(80% 60% at 70% 20%, ${accent}22, transparent 70%)`,
                    opacity: on ? 1 : 0,
                    transition: 'opacity 0.4s',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    height: 96,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  {item.img ? (
                    <div
                      style={{
                        position: 'relative',
                        width: 150,
                        height: 90,
                        transition: 'transform 0.5s',
                        transform: on ? 'scale(1.08) rotate(-2deg)' : 'none',
                        filter: on
                          ? `drop-shadow(0 8px 24px ${accent}66)`
                          : 'none',
                      }}
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="150px"
                        style={{ objectFit: 'contain', objectPosition: 'left' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        transition: 'transform 0.5s',
                        transform: on ? 'scale(1.1)' : 'none',
                      }}
                    >
                      <Glyph id={item.id} color={accent} />
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="telemetry"
                    style={{ color: accent, marginBottom: '0.5rem' }}
                  >
                    {String(i + 1).padStart(2, '0')} / 06
                  </div>
                  <h3
                    style={{
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.86rem',
                      marginTop: '0.5rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.tag}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
