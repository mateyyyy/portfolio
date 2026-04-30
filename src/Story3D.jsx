import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import {
  Image,
  Text,
  useCursor,
  Html,
  Billboard,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";

// Constants
const SPACING = 5;
const positions = [
  [-1, -1.5],
  [1, -1.5],
  [-1, -0.5],
  [1, -0.5],
  [-1, 0.5],
  [1, 0.5],
  [-1, 1.5],
  [1, 1.5],
];

// --- Environment Props ---

function RoundTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.2, 0.4, Math.sin(angle) * 1.2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.3, 0.3, 0.8, 12]} />
            <meshStandardMaterial color="#555" />
          </mesh>
        );
      })}
    </group>
  );
}

function WarehouseBuilding() {
  return (
    <group position={[0, 0, -16]} scale={[0.55, 0.55, 0.55]}>
      <group>
        <mesh position={[11, 3, -34.75]} castShadow receiveShadow>
          <boxGeometry args={[70, 6, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[-23.75, 3, -15]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 6, 40]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[45.75, 3, -15]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 6, 40]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[11, 0.1, -15]} receiveShadow>
          <boxGeometry args={[69, 0.2, 39]} />
          <meshStandardMaterial color="#e0ded8" />
        </mesh>
        <mesh position={[11, 0.25, 4.75]} castShadow receiveShadow>
          <boxGeometry args={[70, 0.5, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[11, 5.25, 4.75]} castShadow receiveShadow>
          <boxGeometry args={[70, 1.5, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        {[
          { x: -20.75, width: 6.5 },
          { x: -9.25, width: 10.5 },
          { x: 8.25, width: 8.5 },
          { x: 17.5, width: 4 },
          { x: 24.5, width: 4 },
          { x: 37.5, width: 16 },
        ].map((p, i) => (
          <mesh
            key={`p_${i}`}
            position={[p.x, 2.5, 4.75]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[p.width, 4, 0.5]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} />
          </mesh>
        ))}
        <RoundTable position={[-16, 0.2, 0]} />
        <RoundTable position={[-16, 0.2, -6]} />
        <RoundTable position={[14, 0.2, 0]} />
        <RoundTable position={[14, 0.2, -6]} />
        <RoundTable position={[21, 0.2, -3]} />
        <RoundTable position={[28, 0.2, 0]} />
        <RoundTable position={[28, 0.2, -7]} />
      </group>

      <mesh position={[11, 9, -15]} castShadow receiveShadow>
        <boxGeometry args={[70, 6, 40]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} />
      </mesh>

      <mesh
        position={[11, 13.1667, -15]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[40.41, 1, 2.3333]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1, 1, 40, 3]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} flatShading />
      </mesh>

      <group key="win_front_left">
        <mesh position={[-16, 9.5, 5.05]}>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[-16, 6, 5.3]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 3, 0.6]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[-16, 2.5, 5.05]}>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshStandardMaterial
            color="#2a3548"
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {[14, 21, 28].map((x, j) => (
        <group key={`win_front_right_${j}`}>
          <mesh position={[x, 9.5, 5.05]}>
            <boxGeometry args={[3, 4, 0.2]} />
            <meshStandardMaterial
              color="#4a5568"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[x, 6, 5.3]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 3, 0.6]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} />
          </mesh>
          <mesh position={[x, 2.5, 5.05]}>
            <boxGeometry args={[3, 4, 0.2]} />
            <meshStandardMaterial
              color="#2a3548"
              roughness={0.1}
              metalness={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[-6, 7, 6.75]} castShadow receiveShadow>
        <boxGeometry args={[4, 14, 3.5]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      <mesh position={[4.5, 7, 8]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 14, 1]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      <mesh position={[-1.375, 13.5, 6.75]} castShadow receiveShadow>
        <boxGeometry args={[13.25, 2.5, 3.5]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      {/* Unified Vertical Ribs (More noticeable effect requested) */}
      {Array.from({ length: 53 }).map((_, i) => {
        const xPos = -7.875 + i * 0.25;

        // Determine whether this rib is on the left pillar, the middle roof overhang, or the right pillar
        let height = 15.5;
        let yPos = 7;
        let zPos = 8.58;

        // If it's in the gap between the two pillars, it only covers the Top Overhang height
        if (xPos > -3.9 && xPos < 3.7) {
          height = 2.5; // Match overhang height
          yPos = 13.5;
        }

        // Right Pillar has slightly different Z depth
        if (xPos >= 3.7) {
          zPos = 8.58;
        }

        return (
          <mesh
            key={`rib_all_${i}`}
            position={[xPos, yPos, zPos]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.15, height, 0.25]} />
            <meshStandardMaterial color="#c0beb6" roughness={0.9} />
          </mesh>
        );
      })}

      <mesh position={[-0.125, 6, 8.25]} castShadow receiveShadow>
        <boxGeometry args={[7.75, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      <Text
        position={[-0.125, 6, 8.55]}
        fontSize={0.4}
        color="#fcfbf8"
        anchorX="center"
        anchorY="middle"
        maxWidth={7.5}
        textAlign="center"
      >
        Universidad Nacional de Villa Mercedes
      </Text>

      <Text
        position={[-6, 11, 8.8]}
        fontSize={1.4}
        color="#2a2f35"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#2a2f35"
        fontWeight="bold"
      >
        UNViMe
      </Text>

      <mesh position={[0, 7, 5]} castShadow receiveShadow>
        <boxGeometry args={[8, 14, 0.5]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
      </mesh>

      <group position={[-2, 2.6, 5.3]}>
        <mesh>
          <boxGeometry args={[3, 5.2, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.8, 5]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.05, 5, 0.02]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
      <group position={[2, 2.6, 5.3]}>
        <mesh>
          <boxGeometry args={[3, 5.2, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.8, 5]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.05, 5, 0.02]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      <group position={[-2, 9.5, 5.3]}>
        <mesh>
          <boxGeometry args={[3, 5.2, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.8, 5]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.05, 5, 0.02]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
      <group position={[2, 9.5, 5.3]}>
        <mesh>
          <boxGeometry args={[3, 5.2, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.8, 5]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.05, 5, 0.02]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      <mesh position={[-0.125, 6.75, 6.75]} castShadow>
        <boxGeometry args={[7.75, 0.2, 3.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.125, 7.75, 8.4]}>
        <boxGeometry args={[7.75, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.125, 7.25, 8.4]}>
        <boxGeometry args={[7.75, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <group position={[4.2, 0, 6.5]}>
        {Array.from({ length: 15 }).map((_, i) => {
          const fraction = i / 14;
          const xOffset = fraction * 7;
          const yOffset = 6.75 - fraction * 6.75;
          return (
            <mesh
              key={`stair_${i}`}
              position={[xOffset, yOffset, 0]}
              castShadow
            >
              <boxGeometry args={[0.6, 0.6, 2]} />
              <meshStandardMaterial color="#a3a098" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function LowPolyTree({ position, scale = 1 }) {
  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
    >
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1, 5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1.2, 1.8, 5]} />
        <meshStandardMaterial color="#6b9b88" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 5]} />
        <meshStandardMaterial color="#7bac99" roughness={0.8} />
      </mesh>
    </group>
  );
}

function ArgentineFlag({ position }) {
  const flagRef = useRef();
  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      flagRef.current.position.y =
        7 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      invalidate();
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={flagRef} position={[0, 7, 0]}>
        <group position={[1.5, 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#75AADB" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial color="#F6EB61" roughness={1} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#75AADB" roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Particles() {
  const count = 50;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 15,
      z: (Math.random() - 0.5) * 40,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y += 0.01 * p.speed;
      if (p.y > 15) p.y = 0;
      dummy.position.set(
        p.x + Math.sin(state.clock.elapsedTime * p.speed + p.phase) * 0.5,
        p.y,
        p.z + Math.cos(state.clock.elapsedTime * p.speed + p.phase) * 0.5,
      );
      dummy.rotation.set(
        state.clock.elapsedTime * p.speed,
        state.clock.elapsedTime * p.speed,
        0,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    invalidate();
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshBasicMaterial color="#6b9b88" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function MainGate({ position }) {
  return (
    <group position={position}>
      <mesh position={[-2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh position={[2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[4.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh
        position={[-1.9, 1.25, -0.8]}
        rotation={[0, -Math.PI / 4, 0]}
        castShadow
      >
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      <mesh
        position={[1.9, 1.25, -0.8]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ConcretePaths() {
  return (
    <group position={[0, -0.04, 0]}>
      <mesh position={[0, 0.092, -1]} receiveShadow>
        <boxGeometry args={[3, 0.02, 28]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.9} />
      </mesh>
    </group>
  );
}

function LBand({
  color,
  roughness,
  y,
  innerX,
  innerZ,
  width,
  extX,
  extZ,
  showGrid,
  showDashes,
}) {
  const cX = innerX - width / 2;
  const cZ = innerZ + width / 2;
  const frontLen = extX - innerX;
  const frontCX = innerX + frontLen / 2;
  const leftLen = innerZ - extZ;
  const leftCZ = innerZ - leftLen / 2;

  return (
    <group position={[0, y, 0]}>
      <mesh position={[frontCX, 0, cZ]} receiveShadow>
        <boxGeometry args={[frontLen, 0.1, width]} />
        <meshStandardMaterial color={color} roughness={roughness} />
        {showGrid && (
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry
              args={[frontLen, width, Math.floor(frontLen / 2), 1]}
            />
            <meshBasicMaterial
              color="#a3a098"
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
        {showDashes &&
          Array.from({ length: Math.floor(frontLen / 4) }).map((_, i) => (
            <mesh
              key={`dash_f_${i}`}
              position={[-frontLen / 2 + 2 + i * 4, 0.06, 0]}
            >
              <boxGeometry args={[2, 0.02, 0.2]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
          ))}
      </mesh>
      <mesh position={[cX, 0, leftCZ]} receiveShadow>
        <boxGeometry args={[width, 0.1, leftLen]} />
        <meshStandardMaterial color={color} roughness={roughness} />
        {showGrid && (
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry
              args={[width, leftLen, 1, Math.floor(leftLen / 2)]}
            />
            <meshBasicMaterial
              color="#a3a098"
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
        {showDashes &&
          Array.from({ length: Math.floor(leftLen / 4) }).map((_, i) => (
            <mesh
              key={`dash_l_${i}`}
              position={[0, 0.06, -leftLen / 2 + 2 + i * 4]}
            >
              <boxGeometry args={[0.2, 0.02, 2]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
          ))}
      </mesh>
      <mesh position={[cX, 0, cZ]} receiveShadow>
        <boxGeometry args={[width, 0.1, width]} />
        <meshStandardMaterial color={color} roughness={roughness} />
      </mesh>
    </group>
  );
}

function SidewalkAndStreet() {
  const extX = 100;
  const extZ = -100;
  return (
    <group position={[0, -0.14, 0]}>
      <LBand
        color="#6b8c54"
        roughness={1}
        y={0.05}
        innerX={-14}
        innerZ={9}
        width={3}
        extX={extX}
        extZ={extZ}
      />
      <LBand
        color="#d5d3cc"
        roughness={0.9}
        y={0.06}
        innerX={-17}
        innerZ={12}
        width={2}
        extX={extX}
        extZ={extZ}
        showGrid
      />
      <LBand
        color="#8b7355"
        roughness={1}
        y={0.04}
        innerX={-19}
        innerZ={14}
        width={2}
        extX={extX}
        extZ={extZ}
      />
      <LBand
        color="#3a3c3f"
        roughness={0.8}
        y={0.02}
        innerX={-21}
        innerZ={16}
        width={10}
        extX={extX}
        extZ={extZ}
        showDashes
      />
    </group>
  );
}

function FenceSegment({ position, rotation = [0, 0, 0], length }) {
  const segments = Math.max(1, Math.floor(length / 2));
  const step = length / segments;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <planeGeometry args={[length, 1.2]} />
        <meshBasicMaterial color="#888" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      {Array.from({ length: segments + 1 }).map((_, i) => (
        <mesh
          key={`post_${i}`}
          position={[-length / 2 + i * step, 0.6, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.1, 1.4, 6]} />
          <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── SCENERY: autos ──────────────────────────────────────────────────
function Scenery() {
  return (
    <group>
      <WarehouseBuilding />
      <ArgentineFlag position={[-12, 0, 4]} />
      <FenceSegment position={[-8, 0, 9]} length={12} />
      <FenceSegment position={[51, 0, 9]} length={98} />
      <FenceSegment
        position={[-14, 0, -2]}
        rotation={[0, Math.PI / 2, 0]}
        length={22}
      />
      <MainGate position={[0, 0, 9]} />
      <SidewalkAndStreet />
      <ConcretePaths />
      <LowPolyTree position={[-10, 0, -6]} scale={1.5} />
      <LowPolyTree position={[13, 0, -8]} scale={2} />
      <LowPolyTree position={[-12, 0, 8]} scale={1.2} />
      <LowPolyTree position={[15, 0, 5]} scale={1.8} />
      <LowPolyTree position={[-16, 0, 0]} scale={1.4} />
      <LowPolyTree position={[20, 0, 2]} scale={1.1} />
    </group>
  );
}

// --- Characters ---

function WalkingSprite({ url, scale = 1.5 }) {
  const ref = useRef();
  const groupRef = useRef();

  const stateRef = useRef({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20,
    ),
    target: new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20,
    ),
    isWalking: true,
    waitTime: 0,
    speed: 2 + Math.random() * 2,
    facingRight: true,
  });

  useFrame((state, delta) => {
    if (!ref.current || !groupRef.current) return;
    const s = stateRef.current;

    if (s.isWalking) {
      const dir = s.target.clone().sub(s.pos);
      const dist = dir.length();
      if (dist < 0.1) {
        s.isWalking = false;
        s.waitTime = 1 + Math.random() * 4;
      } else {
        dir.normalize();
        s.pos.add(dir.multiplyScalar(s.speed * delta));
        if (dir.x > 0) s.facingRight = true;
        else if (dir.x < 0) s.facingRight = false;
        ref.current.position.y =
          Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.15 + scale * 0.4;
        ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.05;
      }
    } else {
      s.waitTime -= delta;
      ref.current.position.y =
        Math.sin(state.clock.elapsedTime * 3) * 0.05 + scale * 0.4;
      ref.current.rotation.z = 0;
      if (s.waitTime <= 0) {
        s.isWalking = true;
        s.target.set((Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30);
        s.speed = 1.5 + Math.random() * 2.5;
      }
    }

    groupRef.current.position.copy(s.pos);
    ref.current.scale.x = s.facingRight ? scale : -scale;
    ref.current.scale.y = scale;
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <group ref={ref} rotation={[0, 0, 0]}>
        <Image
          url={import.meta.env.BASE_URL + url}
          transparent
          scale={[1, 1]}
        />
      </group>
    </group>
  );
}

// ── CAMERA ZOOM via useThree (works with frameloop="demand") ──────────────────
function CameraController({ activeId }) {
  const { camera, invalidate: inv } = useThree();
  const targetZoom = useRef(50);
  const targetGroupPos = useRef(new THREE.Vector3());

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    targetZoom.current =
      activeId !== null ? (isMobile ? 45 : 90) : isMobile ? 15 : 40;
    inv();
  }, [activeId, inv]);

  useFrame((state, delta) => {
    const prev = state.camera.zoom;
    state.camera.zoom = THREE.MathUtils.lerp(
      prev,
      targetZoom.current,
      4 * delta,
    );
    if (Math.abs(state.camera.zoom - prev) > 0.01) {
      state.camera.updateProjectionMatrix();
      invalidate();
    }
  });

  return null;
}

const ProjectFrame = React.memo(function ProjectFrame({
  project,
  index,
  activeId,
  setActiveId,
}) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isActive = activeId === index;

  useCursor(hovered);

  const imgUrl =
    project.image || (Array.isArray(project.images) ? project.images[0] : null);
  const isVideo = typeof imgUrl === "string" && imgUrl.endsWith(".mp4");
  let safeImg = isVideo
    ? "/www.citax.com.ar_.png"
    : imgUrl || "/willitrain.png";
  if (safeImg.includes("github")) safeImg = "/snake.png";

  const resolve = useCallback((p) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    const clean = p.startsWith("/public/")
      ? p.slice(8)
      : p.startsWith("public/")
        ? p.slice(7)
        : p.startsWith("/")
          ? p.slice(1)
          : p;
    return import.meta.env.BASE_URL + encodeURI(clean);
  }, []);

  const gridX = positions[index][0] * SPACING;
  const gridZ = positions[index][1] * SPACING;
  const pedHeight = 0.5 + (index % 3) * 0.8;
  const imgRef = useRef();

  useFrame((state, delta) => {
    if (imgRef.current) {
      const baseImgY = pedHeight + 1.5;
      const hoverOffset = hovered || isActive ? 0.4 : 0;
      const tY =
        baseImgY +
        hoverOffset +
        Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      const prev = imgRef.current.position.y;
      imgRef.current.position.y = THREE.MathUtils.lerp(prev, tY, 5 * delta);
      if (Math.abs(imgRef.current.position.y - prev) > 0.001) invalidate();
    }
  });

  return (
    <group
      position={[gridX, 0, gridZ]}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(isActive ? null : index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        invalidate();
      }}
      onPointerOut={() => {
        setHover(false);
        invalidate();
      }}
    >
      <mesh position={[0, pedHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, pedHeight, 2.5]} />
        <meshStandardMaterial
          color={isActive ? "#6b9b88" : hovered ? "#d5d3cc" : "#e5e3dc"}
          roughness={0.9}
          metalness={0.1}
        />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.501, pedHeight + 0.001, 2.501]} />
          <meshBasicMaterial
            color={isActive ? "#fff" : "#a3a098"}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </mesh>

      <group ref={imgRef}>
        <Billboard>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.2, 3.2 * 0.65 + 0.6]} />
            <meshBasicMaterial color={isActive ? "#e5e3dc" : "#fcfbf8"} />
          </mesh>
          <Image
            url={resolve(safeImg)}
            transparent
            position={[0, 0.2, 0]}
            scale={[3, 3 * 0.65]}
          />
          <Text
            position={[0, -1.1, 0]}
            fontSize={0.25}
            color={isActive ? "#1a1814" : "#5a5854"}
            anchorX="center"
            anchorY="top"
          >
            {project.name}
          </Text>
        </Billboard>
      </group>

      {isActive && (
        <Html position={[2, pedHeight + 2, 2]} center zIndexRange={[100, 0]}>
          <div
            style={{
              width: "min(85vw, 380px)",
              padding: "24px",
              background: "rgba(252,251,248,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "12px",
              color: "#1a1814",
              textAlign: "left",
              animation: "fadeIn 0.4s ease forwards",
              opacity: 0,
              boxShadow: "0 20px 40px rgba(26,24,20,0.1)",
              pointerEvents: "auto",
            }}
          >
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#6b9b88",
                }}
              >
                {project.tag}
              </span>
              <span style={{ fontSize: "11px", color: "#8a837a" }}>
                {project.year}
              </span>
            </div>
            <h3
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "24px",
                margin: "0 0 16px",
                fontWeight: 600,
              }}
            >
              {project.name}
            </h3>
            <div style={{ marginBottom: "12px" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#7a736a",
                  marginBottom: "4px",
                }}
              >
                El desafío
              </strong>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#3a3834",
                  margin: 0,
                }}
              >
                {project.problem}
              </p>
            </div>
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#7a736a",
                  marginBottom: "4px",
                }}
              >
                La solución
              </strong>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#3a3834",
                  margin: 0,
                }}
              >
                {project.solution}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(null);
              }}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "10px",
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#1a1814",
                borderRadius: "6px",
                cursor: "pointer",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "0.1em",
              }}
            >
              Cerrar
            </button>
          </div>
        </Html>
      )}
    </group>
  );
});

function SceneGroup({ projects, activeId, setActiveId }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    let tX = 0,
      tY = 0,
      tZ = 0;
    if (activeId !== null) {
      tX = -positions[activeId][0] * SPACING;
      tZ = -positions[activeId][1] * SPACING;
      tY = -(0.5 + (activeId % 3) * 0.8) + 1;
    }
    const isMobile = window.innerWidth < 768;
    if (activeId === null && !isMobile) {
      tX += state.pointer.x * 2;
      tZ += state.pointer.y * 2;
    }

    const px = groupRef.current.position.x;
    const py = groupRef.current.position.y;
    const pz = groupRef.current.position.z;
    groupRef.current.position.x = THREE.MathUtils.lerp(px, tX, 4 * delta);
    groupRef.current.position.y = THREE.MathUtils.lerp(py, tY, 4 * delta);
    groupRef.current.position.z = THREE.MathUtils.lerp(pz, tZ, 4 * delta);

    const moved =
      Math.abs(groupRef.current.position.x - px) > 0.001 ||
      Math.abs(groupRef.current.position.y - py) > 0.001 ||
      Math.abs(groupRef.current.position.z - pz) > 0.001;
    if (moved) invalidate();
  });

  return (
    <group ref={groupRef}>
      {projects.map((p, i) => (
        <ProjectFrame
          key={p.name + i}
          project={p}
          index={i}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      ))}
      <WalkingSprite url="dinoCharacter.png" scale={1.5} />
      <WalkingSprite url="botdia.png" scale={1.8} />
      <Scenery />
      <Particles />

      <mesh position={[43, -0.05, -2]} receiveShadow>
        <boxGeometry args={[114, 0.1, 22]} />
        <meshStandardMaterial color="#6b8c54" roughness={1} />
      </mesh>

      <mesh position={[45, -0.05, -28]} receiveShadow>
        <boxGeometry args={[70, 0.1, 30]} />
        <meshStandardMaterial color="#6b8c54" roughness={1} />
      </mesh>

      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[200, 0.1, 200]} />
        <meshStandardMaterial color="#f6f4ee" roughness={1} />
        <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200, 100, 100]} />
          <meshBasicMaterial
            color="#e5e3dc"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </mesh>
    </group>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
// Dispose geometries and materials on unmount
function CleanupOnUnmount() {
  const { gl } = useThree();
  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl]);
  return null;
}

export default function Story3D({ projects, active, onClose }) {
  const [activeId, setActiveId] = useState(null);

  // Memoize state setter for ProjectFrame
  const handleSetActiveId = useCallback((id) => setActiveId(id), []);

  useEffect(() => {
    if (!active) setActiveId(null);
  }, [active]);

  if (!active) return null;

  // Adaptive reflector resolution: lower on mobile/low-end
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "#fdfbf2",
        overflow: "hidden",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "clamp(16px,4vw,32px)",
          right: "clamp(16px,4vw,32px)",
          zIndex: 70,
          background: "rgba(0,0,0,0.05)",
          border: "none",
          width: 48,
          height: 48,
          borderRadius: "50%",
          color: "#1a1814",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(16px,4vw,32px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 70,
          color: "rgba(26,24,20,0.5)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          pointerEvents: "none",
          width: "90%",
          textAlign: "center",
        }}
      >
        {activeId === null
          ? "Vista Isométrica · Click en un bloque para explorar"
          : "Click fuera o en cerrar para volver"}
      </div>

      {/* ── Canvas: frameloop="demand" → only renders when invalidate() called ── */}
      <Canvas
        shadows
        orthographic
        frameloop="demand"
        camera={{ position: [20, 20, 20], zoom: 50, near: -100, far: 100 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
        gl={{ antialias: !isMobile, maxTextureSize: 1024 }}
      >
        <color attach="background" args={["#fdfbf2"]} />
        <fog attach="fog" args={["#fdfbf2", 30, 90]} />
        <ambientLight intensity={1.1} color="#ffffff" />
        <directionalLight
          position={[15, 25, 10]}
          intensity={1.8}
          color="#fffaf0"
          castShadow
          shadow-mapSize={[isMobile ? 512 : 1024, isMobile ? 512 : 1024]}
          shadow-bias={-0.0001}
        />

        <CameraController activeId={activeId} />
        <SceneGroup
          projects={projects}
          activeId={activeId}
          setActiveId={handleSetActiveId}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}
