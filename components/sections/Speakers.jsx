'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SPEAKERS } from '@/lib/data';

export default function Speakers() {
  // which speaker is spotlighted: 'left' (Đức Anh) | 'right' (Thuần) | null
  const [active, setActive] = useState(null);

  return (
    <section
      id="speakers"
      className="content-layer"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem 0 3rem',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '0 1.5rem',
        }}
      >
        <div className="kicker kicker--center" style={{ marginBottom: '0.8rem' }}>
          Hai góc nhìn — một cuộc đối thoại
        </div>
        <h2
          style={{
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Nhà đầu tư <span className="text-cyan-grad">gặp</span> chuyên gia
        </h2>
        <p
          style={{
            color: 'var(--muted)',
            maxWidth: 640,
            margin: '0.8rem auto 0',
            lineHeight: 1.6,
          }}
        >
          Di chuột (hoặc chạm) vào từng diễn giả để lắng nghe góc nhìn của họ.
        </p>
      </header>

      <div
        onMouseLeave={() => setActive(null)}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2px',
          minHeight: 620,
          position: 'relative',
        }}
      >
        {SPEAKERS.map((sp) => {
          const side = sp.side;
          const isActive = active === side;
          const dimmed = active && active !== side;
          return (
            <article
              key={sp.id}
              onMouseEnter={() => setActive(side)}
              onClick={() => setActive(isActive ? null : side)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                minHeight: 620,
                background:
                  side === 'left'
                    ? 'radial-gradient(120% 100% at 0% 50%, rgba(26,79,216,0.32), rgba(3,7,32,0.62))'
                    : 'radial-gradient(120% 100% at 100% 50%, rgba(245,197,66,0.16), rgba(3,7,32,0.62))',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
              }}
            >
              {/* giant word behind the cutout (One Mount style) */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '50%',
                  [side === 'left' ? 'left' : 'right']: '0',
                  transform: 'translateY(-50%)',
                  fontWeight: 900,
                  fontSize: 'clamp(3rem, 8vw, 8rem)',
                  lineHeight: 0.85,
                  color: 'transparent',
                  WebkitTextStroke: `1px ${
                    isActive ? sp.accent : 'rgba(143,166,216,0.25)'
                  }`,
                  letterSpacing: '-0.03em',
                  transition: 'opacity 0.5s, -webkit-text-stroke-color 0.5s',
                  textAlign: side === 'left' ? 'left' : 'right',
                  opacity: isActive ? 0.9 : 0.35,
                  pointerEvents: 'none',
                  textTransform: 'uppercase',
                  whiteSpace: 'pre',
                }}
              >
                {sp.bigword.replace(' ', '\n')}
              </div>

              {/* spotlight sweep */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(60% 80% at ${
                    side === 'left' ? '35%' : '65%'
                  } 60%, ${sp.accent}22, transparent 70%)`,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }}
              />

              {/* cutout — glow is a cheap gradient behind the figure instead of
                  a drop-shadow filter re-rasterised on every hover frame */}
              <div
                style={{
                  position: 'relative',
                  height: '92%',
                  width: 'auto',
                  aspectRatio: '0.55',
                  alignSelf: 'flex-end',
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'transform 0.6s cubic-bezier(.2,.8,.2,1)',
                  zIndex: 2,
                  margin: side === 'left' ? '0 0 0 2%' : '0 2% 0 0',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '-20%',
                    right: '-20%',
                    bottom: '-10%',
                    height: '70%',
                    background: `radial-gradient(50% 50% at 50% 60%, ${sp.accent}40, transparent 70%)`,
                    opacity: isActive ? 1 : 0.55,
                    transition: 'opacity 0.5s',
                    pointerEvents: 'none',
                  }}
                />
                <Image
                  src={sp.photo}
                  alt={sp.name}
                  fill
                  sizes="(max-width: 768px) 70vw, 400px"
                  quality={95}
                  draggable={false}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom',
                  }}
                />
              </div>

              {/* info card */}
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  [side === 'left' ? 'right' : 'left']: '6%',
                  bottom: '8%',
                  maxWidth: 340,
                  padding: '1.4rem',
                  borderRadius: 6,
                  zIndex: 3,
                  transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                  opacity: isActive ? 1 : 0.82,
                  transition: 'transform 0.5s, opacity 0.5s',
                }}
              >
                <div
                  className="label"
                  style={{ color: sp.accent, marginBottom: '0.45rem' }}
                >
                  {sp.role}
                </div>
                <div style={{ fontWeight: 900, fontSize: '1.6rem', lineHeight: 1.1 }}>
                  {sp.name}
                </div>
                <div
                  className="org-badge"
                  style={{ color: sp.accent, marginTop: '0.7rem' }}
                >
                  {sp.org}
                </div>
                <p
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--paper)',
                    margin: '0.6rem 0 0.9rem',
                    fontSize: '1rem',
                    lineHeight: 1.4,
                  }}
                >
                  “{sp.quote}”
                </p>
                <div
                  style={{
                    maxHeight: isActive ? 260 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease',
                  }}
                >
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {sp.creds.map((c, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--muted)',
                          paddingLeft: '0.9rem',
                          position: 'relative',
                          lineHeight: 1.45,
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 7,
                            width: 5,
                            height: 5,
                            background: sp.accent,
                            borderRadius: 99,
                          }}
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--paper)',
                      marginTop: '0.9rem',
                      lineHeight: 1.5,
                      borderTop: '1px solid rgba(56,208,255,0.15)',
                      paddingTop: '0.8rem',
                    }}
                  >
                    {sp.focus}
                  </p>
                </div>
              </div>

              {/* dim veil for the non-active side: an opacity fade on the
                  compositor instead of grayscale/brightness filters */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(3,7,32,0.6)',
                  opacity: dimmed ? 1 : 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />
            </article>
          );
        })}

        {/* central divider beam */}
        <div
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            transform: 'translateX(-50%)',
            background:
              'linear-gradient(180deg, transparent, rgba(56,208,255,0.5), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
