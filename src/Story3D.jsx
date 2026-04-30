import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text, useCursor, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Constants
const SPACING = 5;
const positions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1]
];

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
              width: '380px',
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
    const tZoom = activeId !== null ? 90 : 50; // Increased default zoom from 30 to 50
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
      
      {/* Low-Poly Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[40, 0.2, 40]} />
        <meshStandardMaterial color="#f6f4ee" roughness={1} />
        {/* Floor grid */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[40, 40, 20, 20]} />
           <meshBasicMaterial color="#e5e3dc" wireframe transparent opacity={0.6} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function Story3D({ projects, active, onClose }) {
  const [activeId, setActiveId] = useState(null);
  const audioRef = useRef(null);

  // Manage audio
  useEffect(() => {
    if (active) {
      const audioUrl = import.meta.env.BASE_URL + 'story-music.mp3';
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveId(null);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
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
