"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";

/** Forma abstracta que responde al cursor con una inercia de resorte (sin saltos). */
function Orb() {
  const mesh = useRef<Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { pointer } = state;
    target.current.x = pointer.x * 0.6;
    target.current.y = pointer.y * 0.4;
    // Interpolación exponencial: independiente del framerate y amortiguada.
    const k = 1 - Math.exp(-6 * delta);
    const idleSpin = state.clock.elapsedTime * 0.08;
    m.rotation.y += (target.current.x + idleSpin - m.rotation.y) * k * 0.2;
    m.rotation.x += (target.current.y - m.rotation.x) * k * 0.2;
    m.position.x += (pointer.x * 0.35 - m.position.x) * k * 0.15;
    m.position.y += (pointer.y * 0.25 - m.position.y) * k * 0.15;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={mesh} scale={1.9}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial color="#8b5cf6" emissive="#4c1d95" roughness={0.18} metalness={0.4} distort={0.42} speed={2.2} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#f9a8d4" />
      <directionalLight position={[-4, -2, -3]} intensity={1.1} color="#67e8f9" />
      <Orb />
      <Sparkles count={70} scale={9} size={2.2} speed={0.4} color="#c4b5fd" opacity={0.7} />
    </Canvas>
  );
}
