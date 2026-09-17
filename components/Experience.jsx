'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import ParticleField from './scene/ParticleField';
import Drone from './scene/Drone';
import HoloGrid from './scene/HoloGrid';
import { scene as store } from '@/lib/store';

function CameraRig() {
  const { current: v } = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    // gentle parallax on pointer + slow push-in as you scroll
    const px = state.pointer.x * 0.6;
    const py = state.pointer.y * 0.4;
    const z = 9 - store.scroll * 2.2;
    v.set(px, py, z);
    state.camera.position.lerp(v, 1 - Math.pow(0.001, delta));
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Bridges the scroll singleton into refs the particle field reads each frame.
function Bridge({ morphRef, scatterRef }) {
  useFrame(() => {
    morphRef.current = store.morph;
    scatterRef.current = store.scatter;
  });
  return null;
}

/**
 * Persistent full-screen WebGL backdrop.
 *
 * `lite` = phones / low-end devices: pixel ratio 1, fewer particles, no
 * post-processing. The DOM sits above the canvas, so pointer events are read
 * from the document root (R3F `eventSource`) instead of the canvas itself.
 */
export default function Experience({ lite = false }) {
  const morphRef = useRef(0);
  const scatterRef = useRef(1);
  // This component is loaded with ssr:false, so document is always present.
  const eventSource =
    typeof document !== 'undefined' ? document.documentElement : undefined;

  return (
    <div className="webgl-layer" data-mode={lite ? 'lite' : 'full'} aria-hidden>
      <Canvas
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: false, // post-processing makes MSAA on the backbuffer pointless
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <color attach="background" args={['#030720']} />
        <fog attach="fog" args={['#030720', 12, 26]} />

        <CameraRig />
        <Bridge morphRef={morphRef} scatterRef={scatterRef} />

        <Suspense fallback={null}>
          <ParticleField
            morphRef={morphRef}
            scatterRef={scatterRef}
            count={lite ? 5000 : 14000}
          />
          <HoloGrid />
          <group position={[0, 0, 1]}>
            <Drone
              src="/drone-multirotor.webp"
              position={[-5.2, 2.2, 0]}
              scale={2.2}
              speed={0.8}
              phase={0}
            />
            <Drone
              src="/drone-fixedwing.webp"
              position={[5.4, -1.6, -1]}
              scale={2.0}
              speed={1.1}
              phase={2}
            />
          </group>
        </Suspense>

        {!lite && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
