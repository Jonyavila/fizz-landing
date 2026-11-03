'use client'

import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function CanModel() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y += (state.pointer.x * 0.18 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-state.pointer.y * 0.08 - group.current.rotation.x) * 0.04
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.08
  })
  return <group ref={group} rotation={[0, -0.18, 0]}>
    <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.24}>
      <mesh castShadow>
        <cylinderGeometry args={[0.72, 0.72, 2.15, 64]} />
        <MeshDistortMaterial color="#ff6500" roughness={0.2} metalness={0.72} distort={0.035} speed={1.5} />
      </mesh>
      <mesh position={[0, 1.09, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.035, 64]} />
        <meshStandardMaterial color="#c9d4d2" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[0, -1.09, 0]}>
        <torusGeometry args={[0.62, 0.08, 16, 64]} />
        <meshStandardMaterial color="#bdc9c7" metalness={0.95} roughness={0.2} />
      </mesh>
    </Float>
  </group>
}

export default function FizzScene() {
  return <Canvas dpr={[1, 2]} camera={{ position: [0, 0.1, 4.2], fov: 34 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.4} />
    <directionalLight position={[3, 4, 4]} intensity={4} color="#fff0d0" />
    <pointLight position={[-3, 0, 2]} intensity={3} color="#31c8ff" />
    <CanModel />
    <Sparkles count={42} scale={[3, 4, 2]} size={2.5} speed={0.35} color="#fff4c2" />
  </Canvas>
}
