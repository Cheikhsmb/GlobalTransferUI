import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Group, PerspectiveCamera } from 'three';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SceneFallback } from '@/components/SceneFallback';

/* ── Camera Rig — smooth cursor-follow ── */
function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const cam = camera as PerspectiveCamera;
    target.current.x = state.pointer.x * 0.4;
    target.current.y = state.pointer.y * 0.25;
    cam.position.x += (target.current.x - cam.position.x) * 0.03;
    cam.position.y += (target.current.y - cam.position.y) * 0.03;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

/* ── World Globe — representing global connectivity ── */
function WorldGlobe() {
  const globeRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
      globeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float floatIntensity={0.8} rotationIntensity={0.1} speed={1.5}>
      <group ref={globeRef}>
        {/* Wireframe Grid representing latitude/longitude */}
        <mesh>
          <sphereGeometry args={[1.5, 24, 24]} />
          <meshBasicMaterial
            color="#4361ee"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Solid Inner Core */}
        <mesh scale={0.98}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshPhysicalMaterial
            color="#030508"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.2}
            emissive="#00e5ff"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Transfer Orbits — glowing packets representing cross-border transfers ── */
function TransferOrbits() {
  const orbit1 = useRef<Group>(null);
  const orbit2 = useRef<Group>(null);
  const orbit3 = useRef<Group>(null);

  useFrame((state, delta) => {
    if (orbit1.current) orbit1.current.rotation.z += delta * 0.8;
    if (orbit2.current) orbit2.current.rotation.x -= delta * 0.6;
    if (orbit3.current) orbit3.current.rotation.y += delta * 0.9;
  });

  return (
    <group>
      {/* Route 1 */}
      <group ref={orbit1} rotation={[Math.PI / 4, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[1.9, 0.005, 16, 100]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.2} />
        </mesh>
        <mesh position={[1.9, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
      </group>

      {/* Route 2 */}
      <group ref={orbit2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.2, 0.005, 16, 100]} />
          <meshBasicMaterial color="#4361ee" transparent opacity={0.2} />
        </mesh>
        <mesh position={[2.2, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#4361ee" />
        </mesh>
      </group>
      
      {/* Route 3 */}
      <group ref={orbit3} rotation={[0, -Math.PI / 4, Math.PI / 5]}>
        <mesh>
          <torusGeometry args={[2.0, 0.005, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
        <mesh position={[2.0, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

/* ── Scene Content ── */
function SceneContent() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-4, 3, 2]} intensity={0.6} color="#00e5ff" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#4361ee" />
      
      <Sparkles count={40} scale={10} size={1.5} speed={0.15} color="#00e5ff" opacity={0.4} />
      
      <WorldGlobe />
      <TransferOrbits />
      
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={10} blur={4} far={5} />
      <Environment preset="city" environmentIntensity={0.2} />
    </>
  );
}

/* ── Canvas Wrapper ── */
function HeroCanvas() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dpr: [number, number] = isMobile ? [1, 1] : [1, 1.75];

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 32 }}
      dpr={dpr}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}

/* ── Exported Component ── */
export function HeroScene() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const useFallback = isMobile || prefersReducedMotion;

  return (
    <div className="scene-shell">
      {useFallback ? (
        <SceneFallback label="Flux XOF en mouvement" />
      ) : (
        <HeroCanvas />
      )}
    </div>
  );
}
