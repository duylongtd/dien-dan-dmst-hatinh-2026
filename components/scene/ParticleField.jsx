'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertex, particleFragment } from '../shaders/particles';
import { scene as store } from '@/lib/store';

// --- target builders ---------------------------------------------------------

// next/font renames the family; read the real name from the CSS variable so the
// sampled text uses the display face instead of silently falling back to Arial.
function displayFont() {
  if (typeof document === 'undefined') return 'Arial, sans-serif';
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-display')
    .trim();
  return v ? `${v}, Arial, sans-serif` : '"Be Vietnam Pro", Arial, sans-serif';
}

// Sample points from a word rendered to an offscreen canvas.
function textTarget(word, count) {
  const w = 1024;
  const h = 320;
  const cv =
    typeof document !== 'undefined' ? document.createElement('canvas') : null;
  const pts = [];
  if (cv) {
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 210px ${displayFont()}`;
    ctx.fillText(word, w / 2, h / 2 + 10);
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > 128) {
          // map pixel -> world coords, scale to ~ 11 units wide
          const px = (x / w - 0.5) * 11;
          const py = -(y / h - 0.5) * 3.4;
          const pz = (Math.random() - 0.5) * 0.5;
          pts.push([px, py, pz]);
        }
      }
    }
  }
  // resample to exactly `count`
  const out = new Float32Array(count * 3);
  if (pts.length === 0) {
    for (let i = 0; i < count; i++) {
      out[i * 3] = (Math.random() - 0.5) * 10;
      out[i * 3 + 1] = (Math.random() - 0.5) * 3;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return out;
  }
  for (let i = 0; i < count; i++) {
    const p = pts[(Math.random() * pts.length) | 0];
    out[i * 3] = p[0] + (Math.random() - 0.5) * 0.04;
    out[i * 3 + 1] = p[1] + (Math.random() - 0.5) * 0.04;
    out[i * 3 + 2] = p[2];
  }
  return out;
}

// Fibonacci sphere
function sphereTarget(count, radius = 3.4) {
  const out = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

// A rippling data field / terrain grid — evokes a scanned map
function fieldTarget(count) {
  const out = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const gx = i % side;
    const gz = Math.floor(i / side);
    const x = (gx / side - 0.5) * 12;
    const z = (gz / side - 0.5) * 8;
    const y =
      Math.sin(x * 0.9 + z * 0.6) * 0.5 +
      Math.cos(x * 0.4 - z * 0.8) * 0.4 -
      1.2;
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export default function ParticleField({ morphRef, scatterRef, count = 14000 }) {
  const matRef = useRef();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p0 = textTarget('HÀ TĨNH', count);
    const p1 = sphereTarget(count);
    const p2 = fieldTarget(count);

    const colors = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const cyan = new THREE.Color('#38D0FF');
    const azure = new THREE.Color('#1A4FD8');
    const gold = new THREE.Color('#F5C542');
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      if (r > 0.94) c.copy(gold); // rare gold sparkle = the accent
      else c.copy(azure).lerp(cyan, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      rand[i] = Math.random();
    }

    g.setAttribute('position', new THREE.BufferAttribute(p0.slice(), 3));
    g.setAttribute('aPos0', new THREE.BufferAttribute(p0, 3));
    g.setAttribute('aPos1', new THREE.BufferAttribute(p1, 3));
    g.setAttribute('aPos2', new THREE.BufferAttribute(p2, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 0.11 },
      uScale: { value: 384 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseForce: { value: 0.9 },
      uScatter: { value: 1 },
      uFade: { value: 1 },
    }),
    []
  );

  useFrame((state, delta) => {
    const u = uniforms;
    // clamp so a background tab / long frame doesn't snap the animation
    const dt = Math.min(delta, 0.05);
    u.uTime.value += dt;

    // morph target comes from parent (driven by scroll section)
    const targetMorph = morphRef.current ?? 0;
    u.uMorph.value = THREE.MathUtils.damp(u.uMorph.value, targetMorph, 2.2, dt);

    // scatter -> assemble on load
    const targetScatter = scatterRef.current ?? 0;
    u.uScatter.value = THREE.MathUtils.damp(u.uScatter.value, targetScatter, 3, dt);

    // dim the field once the reader has scrolled past the hero so panels and
    // body text stay legible on top of it (bloom dims with it)
    const fadeTarget = 1 - 0.55 * THREE.MathUtils.smoothstep(store.scroll, 0.04, 0.2);
    u.uFade.value = THREE.MathUtils.damp(u.uFade.value, fadeTarget, 4, dt);

    // size attenuation inputs (CSS px + pixel ratio, both live values)
    u.uScale.value = state.size.height / 2;
    u.uPixelRatio.value = state.viewport.dpr;

    // pointer to world XY on the z=0 plane, respecting the moving camera
    const vp = state.viewport.getCurrentViewport(state.camera);
    u.uMouse.value.set(
      (state.pointer.x * vp.width) / 2,
      (state.pointer.y * vp.height) / 2
    );
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
