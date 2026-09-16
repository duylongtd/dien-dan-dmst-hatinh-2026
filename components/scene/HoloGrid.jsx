'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A glowing wireframe plane that fades into the distance — the "lab floor".
export default function HoloGrid() {
  const ref = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#38D0FF') },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        float grid(vec2 uv, float n){
          vec2 g = abs(fract(uv * n - 0.5) - 0.5) / fwidth(uv * n);
          float line = min(g.x, g.y);
          return 1.0 - min(line, 1.0);
        }
        void main(){
          vec2 uv = vUv;
          uv.y += uTime * 0.03;
          float g = grid(uv, 28.0);
          // fade toward the far edge and the near camera
          float depthFade = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
          float alpha = g * depthFade * 0.5;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -4.2, -2]}
      material={material}
    >
      <planeGeometry args={[60, 60, 1, 1]} />
    </mesh>
  );
}
