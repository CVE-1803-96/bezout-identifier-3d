import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { BezoutSolution } from '../utils/math';

interface SceneContentProps {
  a: number;
  b: number;
  g: number;
  solutions: BezoutSolution[];
  range: number;
}

function AxisLabels({ range }: { range: number }) {
  const r = range + 2;
  return (
    <>
      {/* X axis */}
      <Line points={[[-r, 0, 0], [r, 0, 0]]} color="#ef4444" lineWidth={2} />
      <Text position={[r + 1, 0, 0]} fontSize={0.8} color="#ef4444" anchorX="center">X</Text>
      {/* Y axis */}
      <Line points={[[0, -r, 0], [0, r, 0]]} color="#22c55e" lineWidth={2} />
      <Text position={[0, r + 1, 0]} fontSize={0.8} color="#22c55e" anchorX="center">Y</Text>
      {/* Z axis */}
      <Line points={[[0, 0, -r], [0, 0, r]]} color="#3b82f6" lineWidth={2} />
      <Text position={[0, 0, r + 1]} fontSize={0.8} color="#3b82f6" anchorX="center">Z</Text>

      {/* Tick marks on axes - show every 5 for clarity */}
      {Array.from({ length: Math.floor(r) * 2 + 1 }, (_, i) => i - Math.floor(r)).map((v) => {
        if (v === 0 || v % 5 !== 0) return null;
        return (
          <group key={`tick-${v}`}>
            <Text position={[v, -0.7, 0]} fontSize={0.4} color="#94a3b8" anchorX="center">{v}</Text>
            <Text position={[-0.7, v, 0]} fontSize={0.4} color="#94a3b8" anchorX="center">{v}</Text>
          </group>
        );
      })}
    </>
  );
}

function SurfacePlane({ a, b, range }: { a: number; b: number; range: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const r = range;
    const zMax = r * 3; // Limit z range
    const segments = 40;
    const geom = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -r + (2 * r * i) / segments;
        const y = -r + (2 * r * j) / segments;
        const z = Math.max(-zMax, Math.min(zMax, a * x + b * y));
        vertices.push(x, y, z);

        // Color based on z value
        const t = (z + zMax) / (2 * zMax || 1);
        const clamped = Math.max(0, Math.min(1, t));
        colors.push(0.15 + 0.35 * clamped, 0.05 + 0.15 * clamped, 0.4 + 0.5 * clamped);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a1 = i * (segments + 1) + j;
        const b1 = a1 + 1;
        const c1 = (i + 1) * (segments + 1) + j;
        const d1 = c1 + 1;
        indices.push(a1, b1, c1);
        indices.push(b1, d1, c1);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [a, b, range]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

function SurfaceWireframe({ a, b, range }: { a: number; b: number; range: number }) {
  const lines = useMemo(() => {
    const r = range;
    const zMax = r * 3;
    const segments = 20;
    const result: [number, number, number][][] = [];

    // Lines along x
    for (let j = 0; j <= segments; j++) {
      const y = -r + (2 * r * j) / segments;
      const pts: [number, number, number][] = [];
      for (let i = 0; i <= segments; i++) {
        const x = -r + (2 * r * i) / segments;
        const z = Math.max(-zMax, Math.min(zMax, a * x + b * y));
        pts.push([x, y, z]);
      }
      result.push(pts);
    }

    // Lines along y
    for (let i = 0; i <= segments; i++) {
      const x = -r + (2 * r * i) / segments;
      const pts: [number, number, number][] = [];
      for (let j = 0; j <= segments; j++) {
        const y = -r + (2 * r * j) / segments;
        const z = Math.max(-zMax, Math.min(zMax, a * x + b * y));
        pts.push([x, y, z]);
      }
      result.push(pts);
    }

    return result;
  }, [a, b, range]);

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#6366f1" lineWidth={0.5} transparent opacity={0.15} />
      ))}
    </>
  );
}

function GcdPlane({ g, range }: { g: number; range: number }) {
  const r = range;
  return (
    <mesh position={[0, 0, g]} rotation={[0, 0, 0]}>
      <planeGeometry args={[r * 2, r * 2]} />
      <meshStandardMaterial
        color="#fbbf24"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function IntersectionLine({ a, b, g, range }: { a: number; b: number; g: number; range: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const r = range;

    if (b !== 0) {
      for (let i = 0; i <= 200; i++) {
        const x = -r + (2 * r * i) / 200;
        const y = (g - a * x) / b;
        if (Math.abs(y) <= r) {
          pts.push([x, y, g]);
        }
      }
    } else if (a !== 0) {
      const x = g / a;
      if (Math.abs(x) <= r) {
        for (let i = 0; i <= 200; i++) {
          const y = -r + (2 * r * i) / 200;
          pts.push([x, y, g]);
        }
      }
    }

    return pts;
  }, [a, b, g, range]);

  if (points.length < 2) return null;

  return (
    <Line points={points} color="#fbbf24" lineWidth={3} />
  );
}

function SolutionPoints({ solutions, g }: { solutions: BezoutSolution[]; g: number }) {
  const showLabels = solutions.length <= 15;
  
  return (
    <group>
      {solutions.map((sol, i) => (
        <group key={`${sol.x}-${sol.y}-${i}`} position={[sol.x, sol.y, g]}>
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Label - only show if not too many points */}
          {showLabels && (
            <Text
              position={[0, 0.5, 0.3]}
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="bottom"
            >
              {`(${sol.x},${sol.y})`}
            </Text>
          )}
          {/* Vertical drop line to z=0 */}
          <Line
            points={[[0, 0, -g], [0, 0, 0]]}
            color="#f97316"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        </group>
      ))}
    </group>
  );
}

function ProjectionPoints({ solutions }: { solutions: BezoutSolution[] }) {
  return (
    <group>
      {solutions.map((sol, i) => (
        <mesh key={`proj-${sol.x}-${sol.y}-${i}`} position={[sol.x, sol.y, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#f97316"
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ a, b, g, solutions, range }: SceneContentProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, 5]} intensity={0.3} />
      <pointLight position={[0, 0, 20]} intensity={0.5} />

      {/* Grid at z=0 */}
      <Grid
        args={[range * 2, range * 2]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={range * 3}
        infiniteGrid={false}
      />

      {/* Axes */}
      <AxisLabels range={range} />

      {/* Surface z = ax + by */}
      <SurfacePlane a={a} b={b} range={range} />
      <SurfaceWireframe a={a} b={b} range={range} />

      {/* Horizontal plane at z = gcd(a,b) */}
      {g > 0 && <GcdPlane g={g} range={range} />}

      {/* Intersection line */}
      {g > 0 && <IntersectionLine a={a} b={b} g={g} range={range} />}

      {/* Solution points */}
      <SolutionPoints solutions={solutions} g={g} />
      <ProjectionPoints solutions={solutions} />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={80}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

interface BezoutSceneProps {
  a: number;
  b: number;
  g: number;
  solutions: BezoutSolution[];
  range: number;
}

export default function BezoutScene({ a, b, g, solutions, range }: BezoutSceneProps) {
  return (
    <Canvas
      camera={{ position: [range * 1.5, range * 1.5, range * 1.2], fov: 50, near: 0.1, far: 500 }}
      style={{ background: '#0f172a' }}
      gl={{ antialias: true }}
    >
      <SceneContent a={a} b={b} g={g} solutions={solutions} range={range} />
    </Canvas>
  );
}
