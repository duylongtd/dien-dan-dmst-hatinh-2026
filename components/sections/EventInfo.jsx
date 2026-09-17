'use client';

import { useState } from 'react';
import { EVENT } from '@/lib/data';

export default function EventInfo() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', org: '', email: '' });

  const submit = () => {
    if (!form.name || !form.email) return;
    // Demo: no backend. Wire this to your API / Google Form / Zalo OA later.
    setSent(true);
  };

  const mapSrc = `https://www.google.com/maps?q=${EVENT.geo.lat},${EVENT.geo.lng}&hl=vi&z=15&output=embed`;

  return (
    <section id="register" className="section content-layer blueprint">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* celebrate days */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            justifyContent: 'center',
          }}
        >
          {EVENT.celebrate.map((c, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '0.9rem 1.3rem',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
              }}
            >
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {c.d}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                {c.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {/* left: details + map */}
          <div>
            <h2
              style={{
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                margin: 0,
                lineHeight: 1.05,
                textTransform: 'uppercase',
              }}
            >
              Cùng công nghệ{' '}
              <span className="text-cyan-grad">vươn xa</span>
            </h2>

            <div style={{ marginTop: '1.6rem', display: 'grid', gap: '1rem' }}>
              <Row label="THỜI GIAN" value={EVENT.dateLabel} />
              <Row label="ĐỊA ĐIỂM" value={EVENT.venue} />
              <Row label="ĐỊA CHỈ" value={EVENT.address} />
            </div>

            <div
              className="hud-frame"
              style={{
                marginTop: '1.6rem',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid rgba(56,208,255,0.22)',
                height: 260,
              }}
            >
              <iframe
                title="Bản đồ Khách sạn Đại Bàng"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) invert(0.9) hue-rotate(180deg)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* right: register */}
          <div
            className="glass"
            style={{ borderRadius: 10, padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            <div className="kicker" style={{ marginBottom: '0.8rem' }}>
              Đăng ký tham dự
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>
              Giữ chỗ tại diễn đàn
            </h3>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.9rem',
                marginTop: '0.5rem',
                lineHeight: 1.5,
              }}
            >
              Số lượng có hạn — dự kiến 350–400 đại biểu.
            </p>

            {sent ? (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid rgba(56,208,255,0.3)',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: '2rem' }}>✓</div>
                <div style={{ fontWeight: 700, marginTop: '0.5rem' }}>
                  Đã ghi nhận đăng ký
                </div>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                  }}
                >
                  Cảm ơn {form.name}. Ban tổ chức sẽ liên hệ qua email của bạn.
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                <Field
                  label="Họ và tên"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  label="Đơn vị / Doanh nghiệp"
                  value={form.org}
                  onChange={(v) => setForm({ ...form, org: v })}
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <button
                  className="btn-primary"
                  style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                  onClick={submit}
                >
                  Xác nhận đăng ký →
                </button>
                <p className="telemetry" style={{ textAlign: 'center' }}>
                  * Bản demo — kết nối API / Google Form / Zalo OA khi triển khai.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(56,208,255,0.15)',
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '0.92rem',
            lineHeight: 1.8,
          }}
        >
          <span style={{ fontWeight: 800, color: 'var(--paper)', letterSpacing: '0.08em' }}>
            {EVENT.host}
          </span>
          <span style={{ margin: '0 0.7rem', color: 'var(--cyan)' }}>·</span>
          <span style={{ fontWeight: 700, color: 'var(--paper)' }}>
            Sở Khoa học và Công nghệ Hà Tĩnh
          </span>
          <span style={{ margin: '0 0.7rem', color: 'var(--cyan)' }}>·</span>
          <span style={{ fontStyle: 'italic' }}>{EVENT.tagline}</span>
        </footer>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'baseline',
        borderLeft: '2px solid var(--cyan)',
        paddingLeft: '1rem',
      }}
    >
      <span className="label" style={{ minWidth: 96 }}>
        {label}
      </span>
      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block' }}>
      <span
        className="label"
        style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.74rem' }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.8rem 1rem',
          background: 'rgba(3,7,32,0.6)',
          border: '1px solid rgba(56,208,255,0.25)',
          borderRadius: 4,
          color: 'var(--paper)',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          outline: 'none',
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = 'var(--cyan)')
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(56,208,255,0.25)')
        }
      />
    </label>
  );
}
