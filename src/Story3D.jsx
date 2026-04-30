import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text, useCursor, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Constants
const SPACING = 5;
// Arrange 8 projects in two columns to leave the center path (X=0) completely clear.
const positions = [
  [-1, -1.5], [1, -1.5],
  [-1, -0.5], [1, -0.5],
  [-1, 0.5],  [1, 0.5],
  [-1, 1.5],  [1, 1.5]
];

// --- Environment Props ---

function WarehouseBuilding() {
  return (
    <group position={[0, 0, -16]} scale={[0.55, 0.55, 0.55]}>
      {/* Bottom Half (White) */}
      <mesh position={[0, 3, -15]} castShadow receiveShadow>
        <boxGeometry args={[60, 6, 40]} />
        <meshStandardMaterial color="#f0efe9" roughness={0.9} />
      </mesh>
      
      {/* Top Half (Dark Gray) */}
      <mesh position={[0, 9, -15]} castShadow receiveShadow>
        <boxGeometry args={[60, 6, 40]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} />
      </mesh>
      
      {/* White Corrugated Facade Block */}
      <mesh position={[0, 7, 5.5]} castShadow receiveShadow>
        <boxGeometry args={[16, 14, 1]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      {/* Left Pillar */}
      <mesh position={[-6, 7, 6.2]} castShadow receiveShadow>
        <boxGeometry args={[4, 14, 0.5]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      {/* Vertical Ribs (Corrugated Metal Effect) */}
      {Array.from({length: 16}).map((_, i) => (
         <mesh key={i} position={[-7.5 + i * 1, 7, 6.1]}>
            <boxGeometry args={[0.1, 14, 0.1]} />
            <meshStandardMaterial color="#d5d3cc" />
         </mesh>
      ))}

      {/* Main Overhang/Sign Backing */}
      <mesh position={[0, 5.5, 6.5]} castShadow receiveShadow>
        <boxGeometry args={[16, 1.5, 1]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>
      
      {/* University Full Text */}
      <Text position={[1.5, 5.5, 7.05]} fontSize={0.5} color="#fcfbf8" anchorX="center" anchorY="middle" maxWidth={12}>
        Universidad Nacional de Villa Mercedes
      </Text>
      
      {/* Big UNViMe Text on the Left Pillar */}
      <Text position={[-6, 11, 6.5]} fontSize={1.4} color="#2a2f35" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#2a2f35" fontWeight="bold">
        UNViMe
      </Text>

      {/* Ground Floor Entrance */}
      <mesh position={[0, 2.5, 6]}>
        <boxGeometry args={[8, 5, 0.2]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Second Floor Windows */}
      <mesh position={[0, 9, 6]}>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Side Windows (Dark top half) */}
      {[-24, -18, -12, 12, 18, 24].map((x) => (
         <mesh key={`win_top_${x}`} position={[x, 9, 5.1]} castShadow>
            <boxGeometry args={[3, 3, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
         </mesh>
      ))}

      {/* Lower windows / doors (White bottom half) */}
      {[-24, -18, -12, 12, 24].map((x) => (
         <mesh key={`win_low_${x}`} position={[x, 3, 5.1]} castShadow>
            <boxGeometry args={[2, 4, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
         </mesh>
      ))}

      {/* White Corrugated Window Boxes on Right Side (like photo) */}
      {[12, 18, 24].map((x) => (
         <mesh key={`box_${x}`} position={[x, 6, 5.5]} castShadow>
            <boxGeometry args={[3.5, 3, 1]} />
            <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
         </mesh>
      ))}
      
      {/* Balcony Base */}
      <mesh position={[0, 5, 7.5]} castShadow>
         <boxGeometry args={[16, 0.2, 3]} />
         <meshStandardMaterial color="#333" />
      </mesh>

      {/* Simple Balcony Railing */}
      <mesh position={[0, 7, 8.9]}>
         <boxGeometry args={[16, 0.1, 0.1]} />
         <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 6.5, 8.9]}>
         <boxGeometry args={[16, 0.1, 0.1]} />
         <meshStandardMaterial color="#111" />
      </mesh>

      {/* Right Side External Stairs leading UP and LEFT to balcony */}
      <group position={[8, 0, 7.5]}>
         {Array.from({length: 15}).map((_, i) => {
            const fraction = i / 14;
            const xOffset = fraction * 7; // bottom step is 7 units to the right
            const yOffset = 5 - (fraction * 5); // bottom step is at y=0
            return (
               <mesh key={`stair_${i}`} position={[xOffset, yOffset, 0]} castShadow>
                  <boxGeometry args={[0.6, 0.6, 2.5]} />
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
    <group position={position} scale={[scale, scale, scale]} castShadow receiveShadow>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1, 5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>
      {/* Leaves */}
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
      // Gentle flutter animation
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      flagRef.current.position.y = 7 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Square concrete base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
      </mesh>
      
      {/* Silver Mast */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Flag */}
      <group ref={flagRef} position={[0, 7, 0]}>
        {/* Attached to the mast (offset right) */}
        <group position={[1.5, 0, 0]}>
          {/* Top Blue Strip */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#75AADB" roughness={1} />
          </mesh>
          {/* Middle White Strip */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" roughness={1} />
          </mesh>
          {/* Sun */}
          <mesh position={[0, 0, 0.03]}>
             <boxGeometry args={[0.3, 0.3, 0.05]} />
             <meshStandardMaterial color="#F6EB61" roughness={1} />
          </mesh>
          {/* Bottom Blue Strip */}
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#75AADB" roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Removed Cloud component

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
      phase: Math.random() * Math.PI * 2
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
        p.z + Math.cos(state.clock.elapsedTime * p.speed + p.phase) * 0.5
      );
      dummy.rotation.set(
        state.clock.elapsedTime * p.speed, 
        state.clock.elapsedTime * p.speed, 
        0
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshBasicMaterial color="#6b9b88" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function MovingCar({ startPos, speed, color, axis = 'x' }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position[axis] += speed * delta;
      if (speed > 0 && ref.current.position[axis] > 100) ref.current.position[axis] = -100;
      if (speed < 0 && ref.current.position[axis] < -100) ref.current.position[axis] = 100;
    }
  });

  return (
    <group ref={ref} position={startPos} rotation={[0, axis === 'z' ? Math.PI / 2 : 0, 0]}>
      {/* Car Base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[3, 0.6, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Car Top */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-1, 0.1, 0.7]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[1, 0.1, 0.7]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-1, 0.1, -0.7]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[1, 0.1, -0.7]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
  );
}

function MainGate({ position }) {
  return (
    <group position={position}>
      {/* Left tall pillar */}
      <mesh position={[-2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      {/* Right tall pillar */}
      <mesh position={[2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[4.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      
      {/* Inner Gate Details (solid open doors) */}
      <mesh position={[-1.9, 1.25, -0.8]} rotation={[0, -Math.PI / 4, 0]} castShadow>
         <planeGeometry args={[1.8, 2.4]} />
         <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      <mesh position={[1.9, 1.25, -0.8]} rotation={[0, Math.PI / 4, 0]} castShadow>
         <planeGeometry args={[1.8, 2.4]} />
         <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ConcretePaths() {
  return (
    <group position={[0, -0.04, 0]}>
      {/* Main path from building door through the gate to the outer sidewalk */}
      <mesh position={[0, 0.092, -1]} receiveShadow>
        <boxGeometry args={[3, 0.02, 28]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.9} />
      </mesh>
    </group>
  );
}

function LBand({ color, roughness, y, innerX, innerZ, width, extX, extZ, showGrid, showDashes }) {
  const cX = innerX - width / 2;
  const cZ = innerZ + width / 2;
  
  const frontLen = extX - innerX;
  const frontCX = innerX + frontLen / 2;
  
  const leftLen = innerZ - extZ;
  const leftCZ = innerZ - leftLen / 2;
  
  return (
    <group position={[0, y, 0]}>
      {/* Front Leg */}
      <mesh position={[frontCX, 0, cZ]} receiveShadow>
        <boxGeometry args={[frontLen, 0.1, width]} />
        <meshStandardMaterial color={color} roughness={roughness} />
        {showGrid && (
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[frontLen, width, Math.floor(frontLen/2), 1]} />
             <meshBasicMaterial color="#a3a098" wireframe transparent opacity={0.3} />
          </mesh>
        )}
        {showDashes && Array.from({length: Math.floor(frontLen/4)}).map((_, i) => (
           <mesh key={`dash_f_${i}`} position={[-frontLen/2 + 2 + i*4, 0.06, 0]}>
             <boxGeometry args={[2, 0.02, 0.2]} />
             <meshStandardMaterial color="#fff" />
           </mesh>
        ))}
      </mesh>

      {/* Left Leg */}
      <mesh position={[cX, 0, leftCZ]} receiveShadow>
        <boxGeometry args={[width, 0.1, leftLen]} />
        <meshStandardMaterial color={color} roughness={roughness} />
        {showGrid && (
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[width, leftLen, 1, Math.floor(leftLen/2)]} />
             <meshBasicMaterial color="#a3a098" wireframe transparent opacity={0.3} />
          </mesh>
        )}
        {showDashes && Array.from({length: Math.floor(leftLen/4)}).map((_, i) => (
           <mesh key={`dash_l_${i}`} position={[0, 0.06, -leftLen/2 + 2 + i*4]}>
             <boxGeometry args={[0.2, 0.02, 2]} />
             <meshStandardMaterial color="#fff" />
           </mesh>
        ))}
      </mesh>

      {/* Corner Piece */}
      <mesh position={[cX, 0, cZ]} receiveShadow>
        <boxGeometry args={[width, 0.1, width]} />
        <meshStandardMaterial color={color} roughness={roughness} />
        {showGrid && (
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[width, width, 1, 1]} />
             <meshBasicMaterial color="#a3a098" wireframe transparent opacity={0.3} />
          </mesh>
        )}
      </mesh>
    </group>
  );
}

function SidewalkAndStreet() {
  const extX = 100;
  const extZ = -100;

  return (
    <group position={[0, -0.14, 0]}>
      <LBand color="#6b8c54" roughness={1} y={0.05} innerX={-14} innerZ={9} width={3} extX={extX} extZ={extZ} />
      <LBand color="#d5d3cc" roughness={0.9} y={0.06} innerX={-17} innerZ={12} width={2} extX={extX} extZ={extZ} showGrid />
      <LBand color="#8b7355" roughness={1} y={0.04} innerX={-19} innerZ={14} width={2} extX={extX} extZ={extZ} />
      <LBand color="#3a3c3f" roughness={0.8} y={0.02} innerX={-21} innerZ={16} width={10} extX={extX} extZ={extZ} showDashes />
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
        <mesh key={`post_${i}`} position={[-length/2 + i * step, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 6]} />
          <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Scenery() {
  return (
    <group>
      {/* Warehouse Building in background */}
      <WarehouseBuilding />

      {/* Argentine Flag (moved more left) */}
      <ArgentineFlag position={[-12, 0, 4]} />

      {/* Fences */}
      <FenceSegment position={[-8, 0, 9]} length={12} /> {/* Front Left */}
      <FenceSegment position={[51, 0, 9]} length={98} />  {/* Front Right (Extended to infinity) */}
      <FenceSegment position={[-14, 0, -2]} rotation={[0, Math.PI / 2, 0]} length={22} /> {/* Side Left */}

      {/* Main Entrance Gate */}
      <MainGate position={[0, 0, 9]} />

      {/* Sidewalk and Street */}
      <SidewalkAndStreet />

      {/* Concrete Paths on Grass */}
      <ConcretePaths />

      {/* Trees */}
      <LowPolyTree position={[-10, 0, -12]} scale={1.5} />
      <LowPolyTree position={[12, 0, -8]} scale={2} />
      <LowPolyTree position={[-14, 0, 8]} scale={1.2} />
      <LowPolyTree position={[10, 0, 14]} scale={1.8} />
      <LowPolyTree position={[-16, 0, 0]} scale={1.4} />
      <LowPolyTree position={[16, 0, 2]} scale={1.1} />
      
      {/* Moving Cars - Front Street */}
      <MovingCar startPos={[-40, 0, 19]} speed={15} color="#c0392b" axis="x" />
      <MovingCar startPos={[20, 0, 23]} speed={-12} color="#2980b9" axis="x" />
      <MovingCar startPos={[-80, 0, 19]} speed={18} color="#27ae60" axis="x" />
      <MovingCar startPos={[60, 0, 23]} speed={-14} color="#f39c12" axis="x" />

      {/* Moving Cars - Left Street */}
      <MovingCar startPos={[-24, 0, 40]} speed={-16} color="#8e44ad" axis="z" />
      <MovingCar startPos={[-28, 0, -20]} speed={14} color="#16a085" axis="z" />
      <MovingCar startPos={[-24, 0, -60]} speed={-15} color="#d35400" axis="z" />
      <MovingCar startPos={[-28, 0, 80]} speed={17} color="#2c3e50" axis="z" />
    </group>
  );
}

// --- Characters ---

function WalkingSprite({ url, scale = 1.5 }) {
  const ref = useRef();
  const groupRef = useRef();
  
  // State for random behavior logic
  const stateRef = useRef({
    pos: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20),
    target: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20),
    isWalking: true,
    waitTime: 0,
    speed: 2 + Math.random() * 2, // units per second
    facingRight: true
  });
  
  useFrame((state, delta) => {
    if (!ref.current || !groupRef.current) return;
    const s = stateRef.current;
    
    if (s.isWalking) {
      // Move towards target
      const dir = s.target.clone().sub(s.pos);
      const dist = dir.length();
      
      if (dist < 0.1) {
        // Reached target -> wait
        s.isWalking = false;
        s.waitTime = 1 + Math.random() * 4; // wait 1-5 seconds
      } else {
        dir.normalize();
        // Move position
        s.pos.add(dir.multiplyScalar(s.speed * delta));
        
        // Face movement direction
        if (dir.x > 0) s.facingRight = true;
        else if (dir.x < 0) s.facingRight = false;
        
        // Walk animation (bob and rotate)
        ref.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.15 + (scale * 0.4);
        ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.05;
      }
    } else {
      // Idle state
      s.waitTime -= delta;
      
      // Idle animation (gentle breathe)
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05 + (scale * 0.4);
      ref.current.rotation.z = 0;
      
      if (s.waitTime <= 0) {
        // Pick new random target within 30x30 area
        s.isWalking = true;
        s.target.set((Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30);
        s.speed = 1.5 + Math.random() * 2.5; // New random speed
      }
    }
    
    // Apply position
    groupRef.current.position.copy(s.pos);
    
    // Apply scale to flip sprite horizontally
    ref.current.scale.x = s.facingRight ? scale : -scale;
    ref.current.scale.y = scale;
  });

  return (
    <group ref={groupRef}>
      {/* Aligned parallel to the scene grid (Z axis facing) */}
      <group ref={ref} rotation={[0, 0, 0]}>
         <Image 
           url={import.meta.env.BASE_URL + url} 
           transparent 
           scale={[1, 1]} // Scale handled by ref.current.scale in useFrame
         />
      </group>
    </group>
  );
}

function ProjectFrame({ project, index, activeId, setActiveId }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isActive = activeId === index;

  useCursor(hovered);

  // Parse image
  const imgUrl = project.image || (Array.isArray(project.images) ? project.images[0] : null);
  // Use a fallback if it's a video or missing
  const isVideo = typeof imgUrl === 'string' && imgUrl.endsWith('.mp4');
  let safeImg = isVideo ? '/www.citax.com.ar_.png' : imgUrl || '/willitrain.png'; // fallback
  
  // Avoid CORS errors for external URLs in WebGL texture loader
  if (safeImg.includes('github')) {
    safeImg = '/snake.png';
  }
  
  const resolve = (p) => {
    if (!p) return '';
    if (p.startsWith('http')) return p;
    const clean = p.startsWith('/public/') ? p.slice(8) : p.startsWith('public/') ? p.slice(7) : p.startsWith('/') ? p.slice(1) : p;
    return import.meta.env.BASE_URL + encodeURI(clean);
  };

  const gridX = positions[index][0] * SPACING;
  const gridZ = positions[index][1] * SPACING;
  const pedHeight = 0.5 + (index % 3) * 0.8; 
  
  const imgRef = useRef();

  useFrame((state, delta) => {
    // Float the image slightly
    if (imgRef.current) {
      const baseImgY = pedHeight + 1.5;
      const hoverOffset = hovered || isActive ? 0.4 : 0;
      const tY = baseImgY + hoverOffset + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      imgRef.current.position.y = THREE.MathUtils.lerp(imgRef.current.position.y, tY, 5 * delta);
    }
  });

  return (
    <group 
      position={[gridX, 0, gridZ]}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(isActive ? null : index);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
    >
      {/* Low-Poly Pedestal */}
      <mesh position={[0, pedHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, pedHeight, 2.5]} />
        <meshStandardMaterial 
          color={isActive ? "#6b9b88" : hovered ? "#d5d3cc" : "#e5e3dc"} 
          roughness={0.9} 
          metalness={0.1}
        />
        {/* Wireframe overlay for the low-poly look */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.501, pedHeight + 0.001, 2.501]} />
          <meshBasicMaterial color={isActive ? "#fff" : "#a3a098"} wireframe transparent opacity={0.3} />
        </mesh>
      </mesh>

      {/* Floating 2.5D Billboard */}
      <group ref={imgRef}>
        <Billboard>
          {/* Frame backplate */}
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
          {/* Title below painting */}
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

      {/* HTML Overlay when Active */}
      {isActive && (
        <Html position={[2, pedHeight + 2, 2]} center zIndexRange={[100, 0]}>
          <div 
            style={{
              width: 'min(85vw, 380px)',
              padding: '24px',
              background: 'rgba(252,251,248,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '12px',
              color: '#1a1814',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease forwards',
              opacity: 0,
              boxShadow: '0 20px 40px rgba(26,24,20,0.1)',
              pointerEvents: 'auto'
            }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6b9b88' }}>{project.tag}</span>
              <span style={{ fontSize: '11px', color: '#8a837a' }}>{project.year}</span>
            </div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', margin: '0 0 16px', fontWeight: 600 }}>{project.name}</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7a736a', marginBottom: '4px' }}>El desafío</strong>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#3a3834', margin: 0 }}>{project.problem}</p>
            </div>
            
            <div>
              <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7a736a', marginBottom: '4px' }}>La solución</strong>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#3a3834', margin: 0 }}>{project.solution}</p>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.1)',
                color: '#1a1814',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontSize: '10px',
                letterSpacing: '0.1em'
              }}
            >
              Cerrar
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

function SceneGroup({ projects, activeId, setActiveId }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    let tX = 0, tY = 0, tZ = 0;
    if (activeId !== null) {
      tX = -positions[activeId][0] * SPACING;
      tZ = -positions[activeId][1] * SPACING;
      tY = -(0.5 + (activeId % 3) * 0.8) + 1; // offset down so pedestal centers
    }
    
    // Add subtle mouse parallax when no active item
    if (activeId === null) {
       tX += (state.pointer.x * 2);
       tZ += (state.pointer.y * 2);
    }

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, tX, 4 * delta);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, tY, 4 * delta);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, tZ, 4 * delta);

    // Zoom camera using orthographic zoom
    const isMobile = window.innerWidth < 768;
    const activeZoom = isMobile ? 60 : 90;
    const idleZoom = isMobile ? 25 : 40;
    const tZoom = activeId !== null ? activeZoom : idleZoom;
    
    state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, tZoom, 4 * delta);
    state.camera.updateProjectionMatrix();
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
      
      {/* Background Sprites */}
      <WalkingSprite url="dinoCharacter.png" scale={1.5} />
      <WalkingSprite url="botdia.png" scale={1.8} />
      
      {/* Environment Props */}
      <Scenery />
      <Particles />
      
      {/* Grass Patch under projects (extended right) */}
      <mesh position={[43, -0.05, -2]} receiveShadow>
        <boxGeometry args={[114, 0.1, 22]} />
        <meshStandardMaterial color="#6b8c54" roughness={1} />
        {/* Grass grid overlay */}
        <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[114, 22, 57, 11]} />
           <meshBasicMaterial color="#82a568" wireframe transparent opacity={0.6} />
        </mesh>
      </mesh>

      {/* Main Low-Poly Floor */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[200, 0.1, 200]} />
        <meshStandardMaterial color="#f6f4ee" roughness={1} />
        {/* Floor grid */}
        <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[200, 200, 100, 100]} />
           <meshBasicMaterial color="#e5e3dc" wireframe transparent opacity={0.6} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function Story3D({ projects, active, onClose }) {
  const [activeId, setActiveId] = useState(null);

  // Reset active ID when scene closes
  useEffect(() => {
    if (!active) {
      setActiveId(null);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: '#fcfbf8',
      overflow: 'hidden'
    }}>
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          zIndex: 70,
          background: 'rgba(0,0,0,0.05)',
          border: 'none',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          color: '#1a1814',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Helper text */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 70,
        color: 'rgba(26,24,20,0.5)',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        pointerEvents: 'none'
      }}>
        {activeId === null ? 'Vista Isométrica · Click en un bloque para explorar' : 'Click fuera o en cerrar para volver'}
      </div>

      {/* 3D Canvas */}
      <Canvas 
        shadows 
        orthographic 
        camera={{ position: [20, 20, 20], zoom: 50, near: -100, far: 100 }}
        onClick={(e) => {
          // If clicking empty space
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        <color attach="background" args={['#fcfbf8']} />
        
        {/* Crisp lighting for low-poly look */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        
        <SceneGroup projects={projects} activeId={activeId} setActiveId={setActiveId} />
        
        {/* Soft fog matching background */}
        <fog attach="fog" args={['#fcfbf8', 20, 60]} />
      </Canvas>
    </div>
  );
}
