'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// A cut-out drone rendered as a textured, self-lit plane that drifts and
// banks toward the pointer — cheap but reads as a real object in the scene.
export default function Drone({
  src,
  position = [0, 0, 0],
  scale = 3,
  speed = 1,
  phase = 0,
}) {
  const ref = useRef();
  const tex = useTexture(src);
  const { pointer } = useThree();

  // keep aspect ratio of the source texture
  const aspect =
    tex.image && tex.image.width ? tex.image.width / tex.image.height : 2;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(t * 0.5) * 0.4;
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.28;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.05 + pointer.x * 0.08;
    ref.current.rotation.y = pointer.x * 0.12;
  });

  return (
    <mesh ref={ref} position={position} scale={[scale * aspect, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.96}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
