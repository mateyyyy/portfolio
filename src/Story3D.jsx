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
  Text3D,
  Center,
  KeyboardControls,
  useKeyboardControls,
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

function LandingSteps({ position }) {
  return (
    <group position={position}>
      <mesh position={[0.3, 0.1, 0.2]}>
        <boxGeometry args={[1.9, 0.2, 1.9]} />
        <meshStandardMaterial color="#c0beb6" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.3, 0.1]}>
        <boxGeometry args={[1.7, 0.2, 1.7]} />
        <meshStandardMaterial color="#c0beb6" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#c0beb6" roughness={0.9} />
      </mesh>
    </group>
  );
}

function InfoSign({ position, title, content }) {
  const [active, setActive] = useState(false);
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setActive(!active); }}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <Text position={[0, 1.5, 0.06]} fontSize={0.12} color="#fff" anchorX="center" anchorY="middle">
        {title}
      </Text>
      {active && (
        <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            background: "#fdfbf2",
            padding: "15px",
            borderRadius: "8px",
            border: "2px solid #8b7355",
            width: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            color: "#1a1814",
            pointerEvents: "auto"
          }}>
            <h4 style={{ margin: "0 0 10px", color: "#8b7355", textTransform: "uppercase", fontSize: "12px" }}>{title}</h4>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.6" }}>{content}</p>
            <div onClick={() => setActive(false)} style={{ marginTop: "12px", textAlign: "right", fontSize: "10px", cursor: "pointer", textDecoration: "underline" }}>Cerrar</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Stairs({ position = [0, 0, 0], rotation = [2, 0, 0], steps }) {
  const stepHeight = 0.5;
  const stepDepth = 0.6;

  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh
          key={i}
          position={[0, i * stepHeight, -i * stepDepth]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3, stepHeight, stepDepth]} />
          <meshStandardMaterial color="#c0beb6" roughness={0.9} />
        </mesh>
      ))}

      
    </group>
  );
}

function Chair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      <mesh position={[0, 0.8, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.05]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.225, p[1]]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.45]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

function InstancedRibs({ count, getPosition, getRotation, getScale, args, color, opacity = 1 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(...getPosition(i));
      if (getRotation) dummy.rotation.set(...getRotation(i));
      if (getScale) dummy.scale.set(...getScale(i));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, getPosition, getRotation, getScale, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
    </instancedMesh>
  );
}

function Speaker({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tripode - Patas */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.4, 0.25]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
            <meshStandardMaterial color="#111" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Poste central */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
        <meshStandardMaterial color="#111" metalness={0.8} />
      </mesh>
      {/* Caja del parlante */}
      <group position={[0, 2.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* Frente del parlante (Malla) */}
        <mesh position={[0, 0, 0.41]}>
          <boxGeometry args={[0.7, 1.1, 0.05]} />
          <meshStandardMaterial color="#222" roughness={1} wireframe />
        </mesh>
        {/* Logo pequeño bose-style */}
        <mesh position={[0, -0.3, 0.44]}>
          <boxGeometry args={[0.15, 0.05, 0.01]} />
          <meshStandardMaterial color="#eee" />
        </mesh>
      </group>
    </group>
  );
}

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
      
    </group>
  );
}

function WarehouseBuilding({ playerPos }) {
  const isInside = playerPos && 
    playerPos.x > -12.2 && playerPos.x < 26.2 && 
    playerPos.z < -12.3 && playerPos.z > -56.2; 
  
  const isOnUpperFloor = playerPos && playerPos.y > 3;
    
  const wallOpacity = 1;
  const roofOpacity = 1;
  const interiorOpacity = isInside ? 1 : 0;

  // Stable functions for InstancedRibs
  const getRoofRibPosLeft = useMemo(() => (i) => [11 - 17.5, 14.6 - 0.58, -54.25 + i * 0.4], []);
  const getRoofRibPosRight = useMemo(() => (i) => [11 + 17.5, 14.6 - 0.58, -54.25 + i * 0.4], []);
  
  const getColRibPos = useMemo(() => (i) => {
    const xPos = -7.875 + i * 0.25;
    let yPos = 7.02;
    let zPos = 8.58;
    if (xPos > -3.9 && xPos < 3.7) yPos = 13.52;
    return [xPos, yPos, zPos];
  }, []);

  const getColRibScale = useMemo(() => (i) => {
    const xPos = -7.875 + i * 0.25;
    let height = 15.5;
    if (xPos > -3.9 && xPos < 3.7) height = 2.5;
    return [1, height, 1];
  }, []);

  return (
    <group position={[0, 0, -16]} scale={[0.55, 0.55, 0.55]} renderOrder={10}>
      {/* Luz interior cálida - solo visible adentro */}
      {isInside && (
        <>
          <pointLight position={[11, 8, -15]} intensity={40} distance={50} decay={2} color="#ffe4a0" />
          <pointLight position={[-5, 8, -25]} intensity={25} distance={35} decay={2} color="#ffd580" />
          <pointLight position={[30, 8, -10]} intensity={25} distance={35} decay={2} color="#ffe4a0" />
          <ambientLight intensity={0.4} color="#fff0cc" />
        </>
      )}
      {/* Piso interior hormigon oscuro */}
      {isInside && (
        <mesh position={[11, 0.15, -25]} receiveShadow>
          <boxGeometry args={[70, 0.08, 60]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
        </mesh>
      )}
      <group>
        <mesh position={[11, 3, -54.75]}>
          <boxGeometry args={[70.5, 6, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[-24.25, 3, -25]}>
          <boxGeometry args={[0.5, 6, 60]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[46.25, 3, -25]}>
          <boxGeometry args={[0.5, 6, 60]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[11, 0.1, -25]} receiveShadow>
          <boxGeometry args={[70, 0.2, 59]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[11, 0.25, 4.75]} visible={!isInside}>
          <boxGeometry args={[70.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} />
        </mesh>
        <mesh position={[11, 5.25, 4.75]} visible={!isInside}>
          <boxGeometry args={[70.5, 1.5, 0.5]} />
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
          <mesh key={`p_${i}`} position={[p.x, 2.5, 4.75]} visible={!isInside}>
            <boxGeometry args={[p.width, 4, 0.5]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} />
          </mesh>
        ))}
        <RoundTable position={[14, 0.2, 3.2]} />
        <Chair position={[12, 0, 2.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[15.5, 0, 2.9]} rotation={[0, -Math.PI/2, 0]} />

        <RoundTable position={[21, 0.2, 3.2]} />
        <Chair position={[18.5, 0, 2.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[22.5, 0, 2.9]} rotation={[0, -Math.PI/2, 0]} />
        
        <RoundTable position={[28, 0.2, 3.2]} />
        <Chair position={[26, 0, 2.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[29.5, 0, 2.9]} rotation={[0, -Math.PI/2, 0]} />

        <RoundTable position={[14, 0.2, -7.2]} />
        <Chair position={[12, 0, -7.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[15.5, 0, -7.9]} rotation={[0, -Math.PI/2, 0]} />

        <RoundTable position={[21, 0.2, -7.2]} />
        <Chair position={[18.5, 0, -7.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[22.5, 0, -7.9]} rotation={[0, -Math.PI/2, 0]} />
        
        <RoundTable position={[28, 0.2, -7.2]} />
        <Chair position={[26, 0, -7.9]} rotation={[0, Math.PI/2, 0]} />
        <Chair position={[29.5, 0, -7.9]} rotation={[0, -Math.PI/2, 0]} />

        {/* Segundo piso de la cafetería - Solo se ve el techo si estás arriba */}
        <group position={[14.4, 6, -3]} visible={interiorOpacity > 0.01 && isOnUpperFloor}>
          {/* Piso mezzanine oscuro */}
          <mesh receiveShadow>
            <boxGeometry args={[63, 0.2, 13]} />
            <meshStandardMaterial color="#333" roughness={0.8} transparent opacity={interiorOpacity} />
          </mesh>

          {/* Paredes de arriba - Tono hueso suave */}
          <mesh position={[12.5, 2.1, -6.4]}>
            <boxGeometry args={[35, 4, 0.2]} />
            <meshStandardMaterial color="#fcfaf2" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          <mesh position={[12.5, 2.1, 6.4]}>
            <boxGeometry args={[35, 4, 0.2]} />
            <meshStandardMaterial color="#fcfaf2" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          {/*Sillas de auditorio*/}
          
          {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[0 + i*2, 1, -3]} rotation={[0, Math.PI/2, 0]} />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[0 + i*2.5, 1, -1]} rotation={[0, Math.PI/2, 0]} />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[0 + i*2.5, 1, 1]} rotation={[0, Math.PI/2, 0]} />
          );
        })}  
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[0 + i*2.5, 1, 3]} rotation={[0, Math.PI/2, 0]} />
          );
        })}  
        
          {/* Pared Frontal con Puertas */}
          <group position={[-5, 2.1, -.05]} rotation={[0, Math.PI/2, 0]}>
            <mesh>
              <boxGeometry args={[13.05, 4, 0.2]} />
              <meshStandardMaterial color="#fcfaf2" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Puertas en los costados */}
            {[-4.5, 4.5].map((x, i) => (
              <group key={`front_wall_door_${i}`} position={[x, -0.75, 0.11]}>
                <mesh>
                  <boxGeometry args={[1.5, 2.5, 0.05]} />
                  <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
                </mesh>
                <mesh position={[0.5, 0, 0.03]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
          {/*Baranda*/}
          <mesh position={[-17, 0.7, -6.5]} rotation={[0,Math.PI/2,0]}>
            <boxGeometry args={[0.1, 1.4, 18.8]} />
            <meshStandardMaterial color="#6f6b64" transparent opacity={interiorOpacity} />
          </mesh>

         

          

          <RoundTable position={[-11, 0.2, 1]} />
          <Chair position={[-13, 0, 1]} rotation={[0, Math.PI/2, 0]} />
          <Chair position={[-9.6, 0, 1]} rotation={[0, -Math.PI/2, 0]} />

          <RoundTable position={[-11, 0.2, -4]} />
          <Chair position={[-13, 0, -4]} rotation={[0, Math.PI/2, 0]} />
          <Chair position={[-9.6, 0, -4]} rotation={[0, -Math.PI/2, 0]} />

          {/* Parlantes en el piso superior */}
          <Speaker position={[26, 0, -4]} rotation={[0, -Math.PI / 4, 0]} />
          <Speaker position={[26, 0, 3]} rotation={[0, Math.PI /4, 0]} />
        </group>
       
        <Stairs position={[-21, 0, -6.5]} rotation={[0, -Math.PI, 0]} steps={6}/>
        {/* Baranda escalera inferior */}
        <group position={[-19.65, 1.5, -6.5]} rotation={[0, -Math.PI, 0]} visible={interiorOpacity > 0.01}>
           <mesh rotation={[Math.atan2(3, 4), 0, 0]}>
             <boxGeometry args={[0.05, 1.2, 5.5]} />
             <meshStandardMaterial color="#a0c0e0" transparent opacity={0.3 * interiorOpacity} roughness={0.1} />
           </mesh>
           <mesh position={[0, 0.6, 0]} rotation={[Math.atan2(3, 4), 0, 0]}>
             <boxGeometry args={[0.08, 0.08, 5.6]} />
             <meshStandardMaterial color="#222" />
           </mesh>
        </group>

        <Stairs position={[-18, 3, -3.5]} rotation={[0,0, 0]} steps={7}/>
        

        {/*Entre piso escalera*/}
         <group position={[-19.1, 3.075, 0]} visible={interiorOpacity > 0.01}>
          <mesh receiveShadow>
            <boxGeometry args={[6, 0.25, 5]} />
            <meshStandardMaterial color="#d3d0c8" roughness={0.85} transparent opacity={interiorOpacity} />
          </mesh>
          {/* Baranda entrepiso escalera */}
          <group position={[3.01, 0.6, 0]}>
            <mesh>
              <boxGeometry args={[0.05, 1.2, 5]} />
              <meshStandardMaterial color="#a0c0e0" transparent opacity={0.3 * interiorOpacity} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.08, 0.08, 5.1]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </group>
          {/*Baranda piso intermedio escalera*/}
            <group position={[3.01, 4, -1.5]}>
            <mesh>
              <boxGeometry args={[0.05, 1.2, 10]} />
              <meshStandardMaterial color="#a0c0e0" transparent opacity={0.3 * interiorOpacity} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.08, 0.08, 10.1]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </group>
          {/*Baranda piso intermedio escalera Frente*/}
          <group position={[-2.5, 4, -7]} rotation={[0, Math.PI/2, 0]}>
            <mesh>
              <boxGeometry args={[0.05, 1.2, 4.2]} />
              <meshStandardMaterial color="#a0c0e0" transparent opacity={0.3 * interiorOpacity} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.08, 0.08, 4.3]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </group>

        </group>


        {/* Pared interior con ventanas (unificada) */}
        <group position={[26, 3, -10]} rotation={[0, Math.PI, 0]} visible={interiorOpacity > 0.01}>
          {/* Parte Inferior */}
          <mesh position={[0, -2, 0]}>
            <boxGeometry args={[40, 2, 0.5]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
          </mesh>
          {/* Parte Superior */}
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[40, 1, 0.5]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
          </mesh>
          {/* Pilares verticales */}
          {[ -16.5, -5.5, 5.5, 16.5 ].map((x, i) => (
            <mesh key={`wall_pillar_${i}`} position={[x, 0.5, 0]}>
              <boxGeometry args={[7, 3, 0.5]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
            </mesh>
          ))}
        </group>
        {/* Mostrador Kiosko */}
        <mesh position={[37, 0.5, -4.7]} rotation={[0, Math.PI/2, 0]} visible={interiorOpacity > 0.01}>
          <boxGeometry args={[10, 3.5, 0.5]} />
          <meshStandardMaterial color="#4b4b4b" roughness={0.9} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[41.75, 0.5, -0]} rotation={[0, Math.PI, 0]} visible={interiorOpacity > 0.01}>
          <boxGeometry args={[9, 3.5, 0.5]} />
          <meshStandardMaterial color="#4b4b4b" roughness={0.9} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>

        {/* Entrepiso / Piso intermedio */}
        <group position={[-18, 5.9, -31]} visible={interiorOpacity > 0.01}>
          <mesh receiveShadow>
            <boxGeometry args={[12, 0.25, 47]} />
            <meshStandardMaterial color="#333" roughness={0.8} transparent opacity={interiorOpacity} />
          </mesh>
          {/* Baranda del entrepiso */}
          <mesh position={[6, 0.7, -1]}>
            <boxGeometry args={[0.1, 1.4, 45]} />
            <meshStandardMaterial color="#6f6b64" transparent opacity={interiorOpacity} />
          </mesh>

          {/* Pared de Aulas - Beige claro */}
          <group position={[2.5, 2.1, -3.5]}>
            <mesh>
              <boxGeometry args={[0.2, 4, 40]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Paredes laterales (divisorias) */}
            {[-20, -14, -5, 4, 13, 20 ].map((z, i) => (
              <mesh key={`class_divider_${i}`} position={[-4.1, 0, z]}>
                <boxGeometry args={[8.25, 4, 0.2]} />
                <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
            ))}
            {/* Pared trasera de las aulas (Pared del galpón) */}
            <mesh position={[-8, 0, 0]}>
              <boxGeometry args={[0.2, 4, 40]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>

            {/* Puertas de las aulas */}
            {[-15, -13, -6, -4, 3, 5, 12, 14].map((z, i) => (
              <group key={`classroom_door_${i}`} position={[0.11, -0.75, z]}>
                <mesh>
                  <boxGeometry args={[0.05, 2.5, 1.5]} />
                  <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
                </mesh>
                <mesh position={[0.03, 0, 0.5]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* Pared detallada debajo del entrepiso (Oficinas) */}
        <group position={[-14.9, 3, -32]} visible={interiorOpacity > 0.01}>
          {/* Pared Principal */}
          <mesh receiveShadow>
            <boxGeometry args={[0.2, 6, 45]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          
          {/* Puertas (2 unidades) */}
          {[-7, 7].map((z, i) => (
            <group key={`office_door_${i}`} position={[0.1, -1.75, z]}>
              {/* Marco/Puerta madera */}
              <mesh>
                <boxGeometry args={[0.05, 2.5, 1.4]} />
                <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
              </mesh>
              {/* Vidrio puerta */}
              <mesh position={[0.03, 0.4, 0]}>
                <boxGeometry args={[0.01, 1, 0.8]} />
                <meshStandardMaterial color="#c8d8e8" transparent opacity={0.3 * interiorOpacity} />
              </mesh>
            </group>
          ))}

          {/* Ventanas de oficina */}
          {[-2.5, 2.5].map((z, i) => (
            <group key={`office_win_${i}`} position={[0.1, 1, z]}>
              {/* Marco negro ventana */}
              <mesh>
                <boxGeometry args={[0.05, 1.6, 2.6]} />
                <meshStandardMaterial color="#1a1e24" roughness={0.7} transparent opacity={interiorOpacity} />
              </mesh>
              {/* Vidrio */}
              <mesh position={[0.03, 0, 0]}>
                <boxGeometry args={[0.01, 1.4, 2.4]} />
                <meshStandardMaterial color="#c8d8e8" transparent opacity={0.4 * interiorOpacity} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      <mesh position={[11, 9, -25]} visible={!isInside}>
        <boxGeometry args={[70.5, 6, 60]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} />
      </mesh>

      <mesh
        position={[11, 13.1667, -25]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[40.7, 1, 2.3333]}
        visible={!isInside}
      >
        <cylinderGeometry args={[1, 1, 60, 3]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} flatShading />
      </mesh>

      <group visible={!isInside}>
        <InstancedRibs
          count={149}
          args={[35, 0.05, 0.12]}
          color="#1a2026"
          getPosition={getRoofRibPosLeft}
          getRotation={() => [0, 0, 0.11]}
        />
        <InstancedRibs
          count={149}
          args={[35, 0.05, 0.12]}
          color="#1a2026"
          getPosition={getRoofRibPosRight}
          getRotation={() => [0, 0, -0.11]}
        />
      </group>

      <group visible={!isInside}>
        <group key="win_front_left">
        <mesh position={[-16, 9.5, 5.05]}>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={wallOpacity}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <mesh position={[-16, 6, 5.3]}>
          <boxGeometry args={[4.2, 3, 0.6]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
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
              transparent
              opacity={wallOpacity}
              polygonOffset
              polygonOffsetFactor={1}
            />
          </mesh>
          <mesh position={[x, 6, 5.3]}>
            <boxGeometry args={[4.2, 3, 0.6]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
          </mesh>
        </group>
      ))}

      </group>{/* fin visible={!isInside} - ventanas frontales */}

      {/* Soporte superior de la entrada (Dintel) */}
      <mesh position={[-1.375, 13.5, 6.75]} visible={!isInside}>
        <boxGeometry args={[13.25, 2.5, 3.5]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>
      
      {/* Pilares laterales entrada */}
      <mesh position={[-6, 7, 6.75]} visible={!isInside}>
        <boxGeometry args={[4, 14, 3.5]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>
      <mesh position={[4.5, 7, 8]} visible={!isInside}>
        <boxGeometry args={[1.5, 14, 1]} />
        <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
      </mesh>

      {/* Entrada despejada con dos puertas de vidrio */}
      {[-2, 2].map((x, i) => (
        <group key={`entrance_door_${i}`} position={[x, 3, 5]} visible={!isInside}>
          {/* Vidrio */}
          <mesh>
            <boxGeometry args={[3.8, 6, 0.1]} />
            <meshStandardMaterial color="#a0c0e0" transparent opacity={0.3} roughness={0.1} />
          </mesh>
          {/* Marco negro */}
          <mesh>
            <boxGeometry args={[4, 6.2, 0.05]} />
            <meshStandardMaterial color="#111" wireframe />
          </mesh>
          {/* Picaporte */}
          <mesh position={[x > 0 ? -1.7 : 1.7, 0, 0.1]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#888" metalness={0.8} />
          </mesh>
        </group>
      ))}

      <InstancedRibs
        count={53}
        args={[0.15, 1, 0.25]}
        color="#c0beb6"
        getPosition={getColRibPos}
        getScale={getColRibScale}
        opacity={!isInside ? 1 : 0}
      />

      <mesh position={[-0.125, 6, 8.25]} visible={!isInside}>
        <boxGeometry args={[7.75, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
      </mesh>

      <Text
        position={[-0.125, 6, 8.55]}
        fontSize={0.4}
        color="#fcfbf8"
        anchorX="center"
        anchorY="middle"
        maxWidth={7.5}
        textAlign="center"
        visible={!isInside}
      >
        Universidad Nacional de Villa Mercedes
      </Text>

      <group position={[-6, 11, 8.8]} visible={!isInside}>
        <Center>
          <Text3D
            font="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json"
            size={1.2}
            height={0.1}
            curveSegments={12}
          >
            UNViMe
            <meshStandardMaterial color="#2a2f35" roughness={0.3} metalness={0.8} />
          </Text3D>
          {/* Outline/Backing */}
          <Text3D
            font="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json"
            size={1.25}
            height={0.02}
            curveSegments={12}
            position={[0, 0, -0.1]}
          >
            UNViMe
            <meshBasicMaterial color="#ffffff" />
          </Text3D>
        </Center>
      </group>

      {/* Puertas de entrada eliminadas por pedido - bloque solido removido */}

      <mesh position={[-0.125, 6.75, 6.75]} castShadow visible={!isInside}>
        <boxGeometry args={[7.75, 0.2, 3.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.125, 7.75, 8.4]} visible={!isInside}>
        <boxGeometry args={[7.75, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.125, 7.25, 8.4]} visible={!isInside}>
        <boxGeometry args={[7.75, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <group position={[4.2, 0, 6.5]} visible={!isInside}>
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

function LowPolyTree({ position, scale = 1, isNewton = false }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        if (isNewton) {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }
      }}
    >
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[1.2, 1.8, 5]} />
        <meshStandardMaterial color="#6b9b88" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.9, 1.5, 5]} />
        <meshStandardMaterial color="#7bac99" roughness={0.8} />
      </mesh>

      {isNewton && (
        <>
          <mesh position={[0.4, 1.8, 0.4]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#d12e2e" emissive="#4d0000" roughness={0.3} />
          </mesh>
          {showInfo && (
            <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
              <div style={{
                background: "#fdfbf2",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #6b9b88",
                width: "160px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                color: "#1a1814",
                fontSize: "11px",
                lineHeight: "1.4",
                pointerEvents: "auto"
              }}>
                <div style={{ fontWeight: "bold", color: "#6b9b88", marginBottom: "4px", textTransform: "uppercase", fontSize: "10px" }}>
                  Manzano de Newton
                </div>
                Aquí cayó la manzana que inspiró la teoría de la gravedad.
                <div 
                  onClick={() => setShowInfo(false)}
                  style={{ marginTop: "8px", textAlign: "right", color: "#8a837a", cursor: "pointer", fontSize: "9px", textDecoration: "underline" }}
                >
                  Cerrar
                </div>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  );
}

function ArgentineFlag({ position, rotation = [0, 0, 0] }) {
  const flagRef = useRef();
  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      flagRef.current.position.y =
        7 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05;
      invalidate();
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={flagRef} position={[0, 7, 0]}>
        <group position={[1.5, 0, 0]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#75AADB" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3, 0.6, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial color="#F6EB61" roughness={1} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
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
      const time = state.clock.getElapsedTime();
      dummy.position.set(
        p.x + Math.sin(time * p.speed + p.phase) * 0.5,
        p.y,
        p.z + Math.cos(time * p.speed + p.phase) * 0.5,
      );
      dummy.rotation.set(
        time * p.speed,
        time * p.speed,
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
        position={[-2.4, 1.25, 0.8]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      <mesh
        position={[2.6, 1.25, 0.8]}
        rotation={[0, -Math.PI / 4, 0]}
        castShadow
      >
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ConcretePaths({
  boxArgs = [3, 0.02, 28],
  position = [0, 0.092, -1],
}) {
  return (
    <group position={[0, -0.04, 0]}>
      <mesh position={position} receiveShadow>
        <boxGeometry args={boxArgs} />
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
        innerX={-18}
        innerZ={9}
        width={3}
        extX={extX}
        extZ={extZ}
      />
      <LBand
        color="#d5d3cc"
        roughness={0.9}
        y={0.06}
        innerX={-21}
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
        innerX={-23}
        innerZ={14}
        width={2}
        extX={extX}
        extZ={extZ}
      />
      <LBand
        color="#3a3c3f"
        roughness={0.8}
        y={0.02}
        innerX={-25}
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

function ConcreteBench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Top slab */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 0.8]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.8} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-1.4, 0.225, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.45, 0.8]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.8} />
      </mesh>
      {/* Right leg */}
      <mesh position={[1.4, 0.225, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.45, 0.8]} />
        <meshStandardMaterial color="#d5d3cc" roughness={0.8} />
      </mesh>
    </group>
  );
}

function BicycleRack({ position, rotation = [0, 0, 0] }) {
  const count = 6;
  const spacing = 0.8;
  return (
    <group position={position} rotation={rotation}>
      {/* Base rails */}
      <mesh position={[0, 0.05, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[count * spacing - 0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.05, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[count * spacing - 0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Arches */}
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[-((count - 1) * spacing) / 2 + i * spacing, 0.05, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <torusGeometry args={[0.3, 0.03, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
    </group>
  );
}

function Scenery({ playerPos }) {
  return (
    <group>
      <WarehouseBuilding playerPos={playerPos} />
      <ArgentineFlag position={[-15, 0, 4]} rotation={[0, 1, 0]}/>
      <FenceSegment position={[-8.6, 0, 9]} length={15} />
      <FenceSegment position={[51, 0, 9]} length={98} />
      <FenceSegment
        position={[-19, 0, -11.5]}
        rotation={[0, Math.PI / 2, 0]}
        length={35}
      />
      <FenceSegment
        position={[-17.5, 0, 7.5]}
        rotation={[0, -0.785398, 0]}
        length={3.5}
      />
      <MainGate position={[0, 0, 9]} />
      <SidewalkAndStreet />
      <ConcretePaths boxArgs={[3, 0.02, 3]} position={[0, 0.1, 10.6]} />
     {Array.from({ length: 8 }).map((_, i) => (
      <ConcretePaths
        key={i}
        boxArgs={[3, 0.02, 1.5]}
        position={[0, 0.1, 11.6 - i*2.6]}
      />
    ))}
      <ConcretePaths
        key={12}
        boxArgs={[3, 0.02, 1.5]}
        position={[0, 0.1, 11.6-2.6]}
      />  
      <ConcretePaths
        key={13}
        boxArgs={[3, 0.02, 3]}
        position={[0, 0.1, -10.1]}
      />  
      <ConcretePaths
        key="path_13"
        boxArgs={[5, 0.02, 1.8]}
        position={[0, 0.1, -12.1]}
      />
      <ConcretePaths
        key="path_14"
        boxArgs={[23, 0.02, 1.8]}
        position={[-4, 0.1, -9.35]}
      />
      <ConcretePaths
        key="path_16"
        boxArgs={[2.5, 0.02, 5]}
        position={[7, 0.1, -10.35]}
      />  
      <ConcretePaths
        key="CaminoIzquierdo"
        boxArgs={[1.8, 0.02, 30]}
        position={[-15.9, 0.1, -23.45]}
      />  
      <ConcretePaths
        key="path_18"
        boxArgs={[20, 0.02, 2]}
        position={[16.5, 0.1, -11.45]}
      />  

      <ConcretePaths
        key="path_19"
        boxArgs={[2.5, 0.02, 3]}
        position={[20.2, 0.1, -12.35]}
      />  

      <LowPolyTree position={[-11, 0, -2]} scale={1.1} isNewton={true} />
      <LandingSteps position={[6.4, 0, -12.2]} />
      <ConcreteBench position={[-9, 0, -11.5]} />
      <BicycleRack position={[15, 0, 7]} rotation={[0, 0, 0]} />
      <BicycleRack position={[19, 0, 7]} rotation={[0, 0, 0]} />

    </group>
  );
}

// --- Characters ---

function WalkingSprite({ url, scale = 1.5 }) {
  const ref = useRef();
  const groupRef = useRef();
  const dir = useMemo(() => new THREE.Vector3(), []);
  const imgUrl = useMemo(() => import.meta.env.BASE_URL + url, [url]);

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
      dir.copy(s.target).sub(s.pos);
      const dist = dir.length();
      if (dist < 0.1) {
        s.isWalking = false;
        s.waitTime = 1 + Math.random() * 4;
      } else {
        dir.normalize();
        s.pos.add(dir.multiplyScalar(s.speed * delta));
        if (dir.x > 0) s.facingRight = true;
        else if (dir.x < 0) s.facingRight = false;
        const time = state.clock.getElapsedTime();
        ref.current.position.y =
          Math.abs(Math.sin(time * 15)) * 0.15 + scale * 0.4;
        ref.current.rotation.z = Math.sin(time * 15) * 0.05;
      }
    } else {
      s.waitTime -= delta;
      const time = state.clock.getElapsedTime();
      ref.current.position.y =
        Math.sin(time * 3) * 0.05 + scale * 0.4;
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
        <Image key={imgUrl} url={imgUrl} transparent scale={[1, 1]} />
      </group>
    </group>
  );
}

function PlayerDino({ url, scale = 1.5, onPositionUpdate, teleportPos }) {
  const ref = useRef();
  const groupRef = useRef();
  const [, getKeys] = useKeyboardControls();
  const pos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const velocity = useMemo(() => new THREE.Vector3(), []);
  const speed = 10;

  useFrame((state, delta) => {
    if (!ref.current || !groupRef.current) return;
    const { forward, backward, left, right } = getKeys();

    velocity.set(0, 0, 0);
    if (forward) velocity.z -= 1;
    if (backward) velocity.z += 1;
    if (left) velocity.x -= 1;
    if (right) velocity.x += 1;

    // Teletransporte
    if (teleportPos) {
      pos.copy(teleportPos);
    }

    if (velocity.length() > 0) {
      velocity.normalize().multiplyScalar(speed * delta);
      pos.add(velocity);

      // Look at move direction (left/right)
      if (Math.abs(velocity.x) > 0.1) {
        ref.current.scale.x = velocity.x < 0 ? -scale : scale;
      }
      const time = state.clock.getElapsedTime();
      ref.current.position.y = Math.abs(Math.sin(time * 15)) * 0.15 + scale * 0.4;
      ref.current.rotation.z = Math.sin(time * 15) * 0.05;
    } else {
      const time = state.clock.getElapsedTime();
      ref.current.position.y = Math.sin(time * 3) * 0.05 + scale * 0.4;
      ref.current.rotation.z = 0;
    }

    const isInside = pos.x > -12.2 && pos.x < 26.2 && pos.z < -12.3 && pos.z > -56.2;
    
    // Cálculo de altura (Y) - Simplificado: solo pisos, no escaleras auto
    let targetY = 0;
    
    // Entrepiso oficinas
    if (pos.x > -22.8 && pos.x < -14.8 && pos.z < -13 && pos.z > -37) {
      targetY = 6;
    }

    // Entrepiso cafetería (Ajustado a local posZ=-3, height=6, scale=0.55)
    // World Z = -16 + (-3 * 0.55) = -17.65
    // World Y = 6 * 0.55 = 3.3
    if (pos.x > -12 && pos.x < 26 && pos.z < -5 && pos.z > -30) {
      targetY = 6 * 0.55; // 3.3
    }

    if (pos.y < 2.5 && targetY > 0) {
       // Si está en el suelo y entra en zona de entrepiso, no sube solo (necesita botón)
    } else {
       pos.y = THREE.MathUtils.lerp(pos.y, targetY, 5 * delta);
    }

    groupRef.current.position.copy(pos);
    onPositionUpdate?.(pos.clone());
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <group ref={ref} rotation={[0, 0, 0]}>
        <Image url={import.meta.env.BASE_URL + url} transparent scale={[1, 1]} />
      </group>
    </group>
  );
}

// ── CAMERA ZOOM via useThree (works with frameloop="demand") ──────────────────
function CameraController({ activeId, playerPos }) {
  const { camera, invalidate: inv } = useThree();
  const targetZoom = useRef(50);
  const targetCamPos = useRef(new THREE.Vector3(15, 15, 20));

  useFrame((state, delta) => {
    const isMobile = window.innerWidth < 768;

    let baseZoom = isMobile ? 15 : 40; 
    if (activeId !== null) baseZoom = isMobile ? 45 : 90;
    targetZoom.current = baseZoom;

    const cam = state.camera;
    cam.position.set(15, 15, 20); 
    cam.zoom = THREE.MathUtils.lerp(cam.zoom, targetZoom.current, 4 * delta);
    cam.updateProjectionMatrix();
    inv();
    invalidate();
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
      const time = state.clock.getElapsedTime();
      const tY =
        baseImgY +
        hoverOffset +
        Math.sin(time * 2 + index) * 0.1;
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

function SceneGroup({ projects, activeId, setActiveId, teleportPos, onPlayerPosChange }) {
  const groupRef = useRef();
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));
  const [showHint, setShowHint] = useState(true);

  useFrame((state, delta) => {
    let tX = 0,
      tY = 0,
      tZ = 0;
      
    if (showHint && (Math.abs(playerPos.x) > 0.1 || Math.abs(playerPos.z) > 0.1)) {
      setShowHint(false);
    }
    if (activeId !== null) {
      tX = -positions[activeId][0] * SPACING;
      tZ = -positions[activeId][1] * SPACING;
      tY = -(0.5 + (activeId % 3) * 0.8) + 1;
    }
    const isMobile = window.innerWidth < 768;
    if (activeId === null) {
      tX = -playerPos.x;
      tZ = -playerPos.z + 5;
      tY = -playerPos.y; // Seguir altura del dino

      // Mouse effect removed as requested
    }

    const px = groupRef.current.position.x;
    const py = groupRef.current.position.y;
    const pz = groupRef.current.position.z;
    groupRef.current.position.x = THREE.MathUtils.lerp(px, tX, 4 * delta);
    groupRef.current.position.y = THREE.MathUtils.lerp(py, tY, 4 * delta);
    groupRef.current.position.z = THREE.MathUtils.lerp(pz, tZ, 4 * delta);

    // Smoothly rotate the group - Fixed perspective
    const baseRot = 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRot, 5 * delta);

    const moved =
      Math.abs(groupRef.current.position.x - px) > 0.001 ||
      Math.abs(groupRef.current.position.y - py) > 0.001 ||
      Math.abs(groupRef.current.position.z - pz) > 0.001 ||
      Math.abs(groupRef.current.rotation.y - baseRot) > 0.001;
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
      <PlayerDino 
        url="dinoCharacter.png" 
        scale={1.5} 
        onPositionUpdate={(p) => {
          setPlayerPos(p);
          onPlayerPosChange?.(p);
        }} 
        teleportPos={teleportPos} 
      />
      <CameraController activeId={activeId} playerPos={playerPos} />
      {showHint && (
        <Html position={[0, 2, 0]} center>
          <div style={{
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            pointerEvents: "none"
          }}>
            Moverse con WASD o FLECHAS
          </div>
        </Html>
      )}
      <WalkingSprite url="botdia.png" scale={1.8} />
      <Scenery playerPos={playerPos} />
      
      <Particles />

      <mesh position={[41, -0.05, -2]} receiveShadow>
        <boxGeometry args={[118, 0.1, 22]} />
        <meshStandardMaterial color="#6b8c54" roughness={1} />
      </mesh>

      <mesh position={[45, -0.05, -28]} receiveShadow>
        <boxGeometry args={[70, 0.1, 30]} />
        <meshStandardMaterial color="#6b8c54" roughness={1} />
      </mesh>

      {/* Relleno de pasto lateral izquierdo */}
      <mesh position={[-16, -0.05, -15]} receiveShadow>
        <boxGeometry args={[5, 0.1, 50]} />
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
export default function Story3D({ projects, active, onClose }) {
  const [activeId, setActiveId] = useState(null);
  const [viewRotation, setViewRotation] = useState(0);

  const [teleportPos, setTeleportPos] = useState(null);

  // Expose to window for simpler cross-component access in this specific architecture
  useEffect(() => {
    window.storyViewRotation = viewRotation;
  }, [viewRotation]);

  useEffect(() => {
    if (teleportPos) {
      // Reset teleport flag after one frame
      const timer = setTimeout(() => setTeleportPos(null), 100);
      return () => clearTimeout(timer);
    }
  }, [teleportPos]);

  // Memoize state setter for ProjectFrame
  const handleSetActiveId = useCallback((id) => setActiveId(id), []);

  useEffect(() => {
    if (!active) setActiveId(null);
  }, [active]);

  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));
  const isInside = playerPos.x > -12.2 && playerPos.x < 26.2 && playerPos.z < -12.3 && playerPos.z > -56.2;
  const isGroundFloor = playerPos.y < 2;

  if (!active) return null;

  // Adaptive reflector resolution: lower on mobile/low-end
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
      ]}
    >
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
            background: "rgba(26,24,20,0.85)", // Mas oscuro para contraste
            border: "none",
            width: 48,
            height: 48,
            borderRadius: "50%",
            color: "#ffffff", // X blanca
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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

        {/* Rotate Camera */}
        {/* Botón rotación removido por bugs */}

        {/* Botones de Navegación Interior - Solo visibles cuando el dino está adentro */}
        <div style={{
            position: "absolute",
            bottom: "clamp(80px, 12vw, 100px)",
            right: "clamp(16px, 4vw, 32px)",
            zIndex: 70,
            display: isInside ? "flex" : "none",
            flexDirection: "column",
            gap: "10px"
          }}>
            <button
              onClick={() => setTeleportPos(new THREE.Vector3(playerPos.x, 0.1, -15))}
              style={{
                padding: "12px 24px",
                background: isGroundFloor ? "rgba(200,160,80,0.9)" : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "30px",
                color: isGroundFloor ? "white" : "#1a1814",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
            >
              Ver Planta Baja
            </button>
            <button
              onClick={() => setTeleportPos(new THREE.Vector3(11.55, 3.4, -17.65))}
              style={{
                padding: "12px 24px",
                background: !isGroundFloor ? "rgba(200,160,80,0.9)" : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "30px",
                color: !isGroundFloor ? "white" : "#1a1814",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
            >
              Ver Segundo Piso
            </button>
          </div>

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
            ? "Mover Dino: WASD / Flechas · Click en bloque para explorar"
            : "Click fuera o en cerrar para volver"}
        </div>

        {/* ── Canvas: frameloop="demand" → only renders when invalidate() called ── */}
        <Canvas
          orthographic
          frameloop="demand"
          camera={{ position: [15, 15, 20], zoom: 50, near: -100, far: 100 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveId(null);
          }}
          gl={{ antialias: true, maxTextureSize: 2048 }}
        >
          <color attach="background" args={["#fdfbf2"]} />
          <fog attach="fog" args={["#fdfbf2", 30, 90]} />
          <ambientLight intensity={1.1} color="#ffffff" />
          <directionalLight
            position={[15, 25, 10]}
            intensity={1.8}
            color="#fffaf0"
          />

          <SceneGroup
            projects={projects}
            activeId={activeId}
            setActiveId={handleSetActiveId}
            teleportPos={teleportPos}
            onPlayerPosChange={setPlayerPos}
          />
          <Preload all />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}
