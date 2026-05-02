import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree, invalidate, useLoader } from "@react-three/fiber";
import {
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

// SafeImage: loads texture with fallback on CORS/404 errors
class ImageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function TextureImage({ url, scale, position }) {
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <mesh position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function FallbackPlane({ scale, position }) {
  return (
    <mesh position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial color="#c0beb6" />
    </mesh>
  );
}

function SafeImage({ url, scale, position }) {
  return (
    <ImageErrorBoundary fallback={<FallbackPlane scale={scale} position={position} />}>
      <Suspense fallback={<FallbackPlane scale={scale} position={position} />}>
        <TextureImage url={url} scale={scale} position={position} />
      </Suspense>
    </ImageErrorBoundary>
  );
}

// Constants
const SPACING = 5;

// Dynamic positions — 2-column grid, grows with project count
function buildPositions(count) {
  const cols = 2;
  const rows = Math.ceil(count / cols);
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (result.length >= count) break;
      const x = c === 0 ? -1 : 1;
      const z = -(r - (rows - 1) / 2);
      result.push([x, z]);
    }
  }
  return result;
}

// Tag-based pedestal heights for visual hierarchy
const TAG_HEIGHTS = {
  SaaS: 1.5,
  "Back-End": 1.2,
  Web: 1.0,
  Hackathon: 1.0,
  Evento: 0.8,
};
const DEFAULT_PED_HEIGHT = 0.9;

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
            <meshStandardMaterial color="#FFF" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Poste central */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
        <meshStandardMaterial color="#FFF" metalness={0.8} />
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
    playerPos.z < -12.3 && playerPos.z > -76.2; 
  
  const isOnUpperFloor = playerPos && playerPos.y > 3;
    
  const wallOpacity = 1;
  const roofOpacity = 1;
  const interiorOpacity = 1;

  // Stable functions for InstancedRibs (Depth 80)
  const getRoofRibPosLeft = useMemo(() => (i) => [11 - 17.5, 14.6 - 0.58, -74.25 + i * 0.4], []);
  const getRoofRibPosRight = useMemo(() => (i) => [11 + 17.5, 14.6 - 0.58, -74.25 + i * 0.4], []);
  
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
      {/* Piso interior hormigon oscuro (Depth 80) */}
      <mesh position={[11, 0.15, -35]} receiveShadow>
        <boxGeometry args={[70, 0.08, 80]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      <group>
        <mesh position={[11, 3, -74.75]}>
          <boxGeometry args={[70.5, 6, 0.5]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[-24.25, 3, -35]}>
          <boxGeometry args={[0.5, 6, 80]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[46.25, 3, -35]}>
          <boxGeometry args={[0.5, 6, 80]} />
          <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <mesh position={[11, 0.1, -35]} receiveShadow>
          <boxGeometry args={[70, 0.2, 79]} />
          <meshStandardMaterial color="#3a3a3a" />
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

        {/* Escenario Central (Flotante con soportes) */}
        <group position={[38, 0, -40]} rotation={[0, Math.PI/2, 0]}>
          {/* Plataforma */}
          <mesh position={[0, 1.2, 0]} receiveShadow>
            <boxGeometry args={[12, 0.4, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
          </mesh>
          {/* Soportes/Patas delgadas */}
          {[
            [-5.5, -3.5], [5.5, -3.5],
            [-5.5, 3.5], [5.5, 3.5],
            [0, -3.5], [0, 3.5]
          ].map((pos, i) => (
            <mesh key={`stage_leg_${i}`} position={[pos[0], 0.3, pos[1]]}>
              <cylinderGeometry args={[0.08, 0.08, 0.6]} />
              <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        <Speaker position={[-4, 1, -2.5]} rotation={[0, -Math.PI / 4, 0]} />
        <Speaker position={[4, 1, -2.5]} rotation={[0, Math.PI / 4, 0]} />
        </group>
        

        {/* Caja de Madera Grande al lado del escenario */}
        <group position={[40, 0, -20]}>
          <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
            <boxGeometry args={[3, 3, 4]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.8} metalness={0.1} />
            {/* Simulación de tablones con un wireframe sutil */}
            <mesh>
              <boxGeometry args={[3.01, 3.01, 4.01]} />
              <meshBasicMaterial color="#5d3a1a" wireframe transparent opacity={0.2} />
            </mesh>
          </mesh>
          {/* Refuerzos de la caja */}
          {[
            [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]
          ].map((pos, i) => (
            <mesh key={`crate_frame_${i}`} position={[pos[0] * 1.01, 1.5, pos[1] * 1.31]}>
              <boxGeometry args={[pos[0] === 0 ? 3.1 : 0.1, 3.1, pos[1] === 0 ? 4.1 : 0.1]} />
              <meshStandardMaterial color="#5d3a1a" roughness={1} />
            </mesh>
          ))}
        </group>
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
        <group position={[14.4, 6, -3]} visible={!isInside || isOnUpperFloor}>
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
          
          
          {/*Sillas de auditorio*/}
          
          {Array.from({ length: 10 }).map((_, i) => {
          return (
            <Chair position={[-1.5 + i*2.1, 1, -4]} rotation={[0, Math.PI/2, 0]} />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[-1.5 + i*2.5, 1, -1]} rotation={[0, Math.PI/2, 0]} />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[-1.5 + i*2.5, 1, 2]} rotation={[0, Math.PI/2, 0]} />
          );
        })}  
        {Array.from({ length: 9 }).map((_, i) => {
          return (
            <Chair position={[-1.5 + i*2.5, 1, 5]} rotation={[0, Math.PI/2, 0]} />
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
        {/* --- Mostrador Kiosko / Cafetería Renovado --- */}
        <group visible={interiorOpacity > 0.01}>
          {/* Parte L del mostrador (Lateral) */}
          <group position={[37, 0.5, -4.7]} rotation={[0, Math.PI/2, 0]}>
            <mesh>
              <boxGeometry args={[10, 3.5, 0.6]} />
              <meshStandardMaterial color="#2d3436" roughness={0.8} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
            </mesh>
            {/* Tapa de Madera */}
            <mesh position={[0, 1.8, 0.1]}>
              <boxGeometry args={[10.2, 0.2, 0.8]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
            </mesh>
          </group>
          {/* Parte L del mostrador (Frontal) */}
          <group position={[41.75, 0.5, 0]} rotation={[0, Math.PI, 0]}>
            <mesh>
              <boxGeometry args={[9, 3.5, 0.6]} />
              <meshStandardMaterial color="#2d3436" roughness={0.8} transparent opacity={interiorOpacity} polygonOffset polygonOffsetFactor={1} />
            </mesh>
            {/* Tapa de Madera */}
            <mesh position={[0, 1.8, 0.1]}>
              <boxGeometry args={[9.2, 0.2, 0.8]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
            </mesh>
          </group>

          {/* Heladera de Bebidas */}
          <group position={[44.5, 1.5, -4.5]}>
            <mesh>
              <boxGeometry args={[2.5, 7.5, 2.8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
            </mesh>
            {/* Puerta de Vidrio con Brillo */}
            <mesh position={[0, 0, 0.91]}>
              <boxGeometry args={[2.1, 5, 0.05]} />
              <meshStandardMaterial color="#c8d8e8" transparent opacity={0.4} emissive="#6ec9e3" emissiveIntensity={0.1} />
            </mesh>
            
          </group>

          {/* Objetos sobre el mostrador */}
          <group position={[37.3, 2.5, -2]}>
            {/* Cafetera Express */}
            <mesh position={[4, 0.6, 2.1]} rotation={[0, -Math.PI/2, 0]}>
              <boxGeometry args={[0.8, 1, 0.7]} />
              <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
            {/* Terminal POS / Caja */}
            <mesh position={[0, 0.3, -2.5]} rotation={[0, -Math.PI/2, 0]}>
              <boxGeometry args={[0.5, 0.3, 0.6]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            {/* Pequeño exhibidor de snacks */}
            <group position={[0.1, 1, -6]} rotation={[0, -Math.PI/2, 0]}>
              <mesh><boxGeometry args={[1, 2, 0.5]} /><meshStandardMaterial color="#fff" transparent opacity={0.4} /></mesh>
              <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.8, 0.4, 0.3]} /><meshStandardMaterial color="#e67e22" /></mesh>
              <mesh position={[0, -0.5, 0]}><boxGeometry args={[0.8, 0.4, 0.3]} /><meshStandardMaterial color="#22f6e4" /></mesh>
              <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.8, 0.4, 0.3]} /><meshStandardMaterial color="#522374" /></mesh>
            </group>
          </group>
        </group>

        {/* Entrepiso / Piso intermedio */}
        <group position={[-18, 5.9, -31]} visible={true}>
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
            {/* Techo de Aulas */}
            <mesh position={[-4.1, 2, 0]}>
              <boxGeometry args={[8.5, 0.1, 40]} />
              <meshStandardMaterial color="#a4a4a4" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Paredes laterales (divisorias) */}
            {[-20, -14, -5, 4, 13, 20 ].map((z, i) => (
              <mesh key={`class_divider_${i}`} position={[-4.1, 0, z]}>
                <boxGeometry args={[8.25, 4, 0.2]} />
                <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
            ))}
            {/* Pared trasera de las aulas (Pared del galpón) */}
            <mesh position={[-8.2, 0, 0]}>
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
          <mesh receiveShadow position={[0, 0, -6.5]}>
            <boxGeometry args={[0.2, 6, 33]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          {/* Pared con Ventana Grande */}
          <group position={[0, 0, 17.5]}>
            {/* Parte inferior sólida */}
            <mesh position={[-0.5, -2.25, 0]}>
              <boxGeometry args={[0.8, 1.5, 10]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Parte superior sólida */}
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[0.2, 1.5, 10]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Pared Lateral Pasillo */}
          <mesh receiveShadow rotation={[0, Math.PI/2, 0]} position={[-4.9, 0, -4.5]}>
            <boxGeometry args={[1, 6, 10]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          <mesh receiveShadow rotation={[0, Math.PI/2, 0]} position={[-4.9, 0, -7.5]}>
            <boxGeometry args={[0.2, 6, 10]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>

          </group>
          {/* Pared Lateral */}
          <mesh receiveShadow rotation={[0, Math.PI/2, 0]} position={[-4.9, 0, 22.5]}>
            <boxGeometry args={[2, 6, 10]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
          </mesh>
          
          {/* Puertas (4 unidades) */}
          {[-16, -8, 0, 8].map((z, i) => (
            <group key={`office_door_${i}`} position={[0.1, -1.75, z]}>
              <mesh>
                <boxGeometry args={[0.05, 2.5, 1.4]} />
                <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
              </mesh>
              <mesh position={[0.03, 0.4, 0]}>
                <boxGeometry args={[0.01, 1, 0.8]} />
                <meshStandardMaterial color="#c8d8e8" transparent opacity={0.3 * interiorOpacity} />
              </mesh>
            </group>
          ))}

          {/* Paredes al fondo (basadas en el dibujo blanco) */}
          <group position={[35, 0, -6]}>
            {/* Estructura Grande Izquierda (Marco) */}
            <group position={[0, 0, -28]}>
              {/* --- Primera pared fondo Corregida (1 puerta central, 2 ventanas laterales) --- */}
              <group position={[-14.75, 0, 0]}>
                {/* Dintel superior original */}
                <mesh position={[0, 2, 0]}>
                  <boxGeometry args={[20, 2, 0.5]} />
                  <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                </mesh>

                {/* Extensión superior (Pared separada) */}
                <mesh position={[15.7, 6, -4]}>
                  <boxGeometry args={[51, 6, 9]} />
                  <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                </mesh>


                {/* Pilares principales que definen los huecos */}
                {[ -8.5, -2.25, 2.25, 8.5 ].map((x, i) => (
                  <mesh key={`pilar_fondo_${i}`} position={[x, -1, 0]}>
                    <boxGeometry args={[x === 9 || x === -9 ? 3 : 2.5, 4, 0.5]} />
                    <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                  </mesh>
                ))}

                {/* Parte inferior bajo las ventanas (antepecho) */}
                {[ -5.75, 5.75 ].map((x, i) => (
                  <mesh key={`sill_fondo_${i}`} position={[x, -1.75, 0]}>
                    <boxGeometry args={[4.5, 2.5, 0.5]} />
                    <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                  </mesh>
                ))}

                {/* Puerta central (que llega al suelo) */}
                <group position={[0, -1, 0.1]}>
                  <mesh>
                    <boxGeometry args={[1.8, 4, 0.15]} />
                    <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
                  </mesh>
                  {/* Detalle Picaporte */}
                  <mesh position={[0.7, -0.2, 0.1]}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
                  </mesh>
                </group>

                {/* Ventanas (una a cada lado de la puerta) */}
                {[ -5.75, 5.75 ].map((x, i) => (
                  <group key={`win_corr_fondo_${i}`} position={[x, 0.25, 0.1]}>
                    {/* Vidrio */}
                    <mesh>
                      <boxGeometry args={[4.5, 1.5, 0.1]} />
                      <meshStandardMaterial color="#c8d8e8" transparent opacity={0.3 * interiorOpacity} />
                    </mesh>
                    {/* Marco de ventana */}
                    <mesh>
                      <boxGeometry args={[4.7, 1.7, 0.05]} />
                      <meshStandardMaterial color="#1a1e24" />
                    </mesh>
                  </group>
                ))}
              </group>

              <group position={[-12.5,0,-9]}>
                {/* --- Mobiliario Aula (Mesa, Sillas, Computadoras) - Lado A --- */}
                <group position={[-14.9, 0, 5]} rotation={[0, Math.PI/2, 0]}>
                  {/* Mesa Larga */}
                  <mesh position={[0, -1.2, 0]} receiveShadow>
                    <boxGeometry args={[10, 0.1, 2]} />
                    <meshStandardMaterial color="#d3d0c8" roughness={0.8} />
                  </mesh>
                  {/* Patas mesa */}
                  {[[-4.5, -0.8], [4.5, -0.8], [-4.5, 0.8], [4.5, 0.8]].map((p, i) => (
                    <mesh key={`table_leg_a_${i}`} position={[p[0], -2.1, p[1]]}>
                      <cylinderGeometry args={[0.05, 0.05, 1.8]} />
                      <meshStandardMaterial color="#333" />
                    </mesh>
                  ))}
                  {/* Sillas */}
                  {[-3, 0, 3].map((x, i) => (
                    <Chair key={`chair_aula_a_${i}`} position={[x, -2.1, 1]} rotation={[0, Math.PI, 0]} />
                  ))}
                  {/* Computadoras (Laptops) */}
                  {[-3, 0, 3].map((x, i) => (
                    <group key={`pc_a_${i}`} position={[x, -1.15, -0.3]}>
                      {/* Base */}
                      <mesh>
                        <boxGeometry args={[0.8, 0.04, 0.6]} />
                        <meshStandardMaterial color="#222" />
                      </mesh>
                      {/* Pantalla */}
                      <mesh position={[0, 0.3, -0.25]} rotation={[-Math.PI / 10, 0, 0]}>
                        <boxGeometry args={[0.8, 0.6, 0.02]} />
                        <meshStandardMaterial color="#111" />
                        {/* Brillo pantalla */}
                        <mesh position={[0, 0, 0.011]}>
                          <boxGeometry args={[0.7, 0.5, 0.001]} />
                          <meshStandardMaterial color="#6ec9e3" emissive="#6ec9e3" emissiveIntensity={0.2} />
                        </mesh>
                      </mesh>
                    </group>
                  ))}
                </group>
                {/* --- Mobiliario Aula (Mesa, Sillas, Computadoras) - Lado B --- */}
                <group position={[-16.9, 0, 5]} rotation={[0, -Math.PI/2, 0]}>
                  {/* Mesa Larga */}
                  <mesh position={[0, -1.2, 0]} receiveShadow>
                    <boxGeometry args={[10, 0.1, 2]} />
                    <meshStandardMaterial color="#d3d0c8" roughness={0.8} />
                  </mesh>
                  {/* Patas mesa */}
                  {[[-4.5, -0.8], [4.5, -0.8], [-4.5, 0.8], [4.5, 0.8]].map((p, i) => (
                    <mesh key={`table_leg_b_${i}`} position={[p[0], -2.1, p[1]]}>
                      <cylinderGeometry args={[0.05, 0.05, 1.8]} />
                      <meshStandardMaterial color="#333" />
                    </mesh>
                  ))}
                  {/* Sillas */}
                  {[-3, 0, 3].map((x, i) => (
                    <Chair key={`chair_aula_b_${i}`} position={[x, -2.1, 1]} rotation={[0, Math.PI, 0]} />
                  ))}
                  {/* Computadoras (Laptops) */}
                  {[-3, 0, 3].map((x, i) => (
                    <group key={`pc_b_${i}`} position={[x, -1.15, -0.3]}>
                      {/* Base */}
                      <mesh>
                        <boxGeometry args={[0.8, 0.04, 0.6]} />
                        <meshStandardMaterial color="#222" />
                      </mesh>
                      {/* Pantalla */}
                      <mesh position={[0, 0.3, -0.25]} rotation={[-Math.PI / 10, 0, 0]}>
                        <boxGeometry args={[0.8, 0.6, 0.02]} />
                        <meshStandardMaterial color="#111" />
                        {/* Brillo pantalla */}
                        <mesh position={[0, 0, 0.011]}>
                          <boxGeometry args={[0.7, 0.5, 0.001]} />
                          <meshStandardMaterial color="#6ec9e3" emissive="#6ec9e3" emissiveIntensity={0.2} />
                        </mesh>
                      </mesh>
                    </group>
                  ))}
                </group>
              </group>

              {/*Segunda pared fondo - Dividida en dos */}
              <mesh position={[5.5, 0, 0]}>
                <boxGeometry args={[7, 6, 0.5]} />
                <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
              <mesh position={[5.5, 6, 0]}>
                <boxGeometry args={[7, 6, 0.5]} />
                <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>

              {/*Tercera pared fondo - Dividida en dos */}
              <mesh position={[20.5, 0, 0]}>
                <boxGeometry args={[9, 6, 0.5]} />
                <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
              <mesh position={[20.5, 6, 0]}>
                <boxGeometry args={[9, 6, 0.5]} />
                <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
               {/* Extensión superior (Pared separada) */}
              <group position={[0, 6, -4]}>
                <mesh>
                  <boxGeometry args={[40, 6, 9]} />
                  <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                </mesh>
                
                {/* Cartel BAÑOS */}
                <group position={[-0.5, -1, 4.51]}>
                  <mesh>
                    <boxGeometry args={[3, 1.2, 0.1]} />
                    <meshStandardMaterial color="#2a2f35" />
                  </mesh>
                  <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.35}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    BAÑOS
                  </Text>
                </group>

                {/* Cartel LABORATORIO */}
                <group position={[14, -1, 4.51]}>
                  <mesh>
                    <boxGeometry args={[5, 1.2, 0.1]} />
                    <meshStandardMaterial color="#2a2f35" />
                  </mesh>
                  <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.35}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    LABORATORIO
                  </Text>
                </group>
              </group>
            </group> 
            <mesh position={[-24.5, 0, -32]} rotation={[0, Math.PI/2, 0]}>
              <boxGeometry args={[8, 6, 0.2]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Dos Paredes/Marcos más chicos a la derecha */}
            <group key={`back_wall_small_2`} position={[-5, 0, -32]}>
                 <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[4, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
                 <mesh position={[0, 2.2, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[8.5, 1.5, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
            </group>
            <group key={`back_wall_small_3`} position={[2, 0, -32]}>
                 <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[8, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
                 <mesh position={[0.1, 2.2, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[8.5, 1.5, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
            </group>
            {/*PUERTA LABORATORIO*/}
            <group key={`back_wall_small_4`} position={[9, 0, -32.5]}>
                 <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[5, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
                 
            </group>
            {/*PUERTA LABORATORIO*/}
            <group key={`back_wall_small_5`} position={[9, 0, -32.5]}>
                 <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[5, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
                 <mesh position={[0.1, 2.2, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[8.5, 1.5, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
            </group>
            {/*PARED FONDO BANIOS */}
            <group key={`back_wall_small_6`} position={[-1.5, 0, -31]}>
                 <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI, 0]}>
                   <boxGeometry args={[8, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
            </group>

            {/*PARED FONDO LABORATORIOS */}
            <group key={`back_wall_small_7`} position={[13, 0, -31]}>
                 <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI, 0]}>
                   <boxGeometry args={[8, 6, 0.2]} />
                   <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
                 </mesh>
            </group>
          </group>

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

        {/* --- EXTENSIÓN DE ESTRUCTURAS IZQUIERDAS HACIA EL FONDO --- */}
        <group visible={true}>
          {/* Extensión de Piso Mezzanine y Baranda */}
          <group position={[-18, 5.9, -64.625]}>
            <mesh receiveShadow>
              <boxGeometry args={[12, 0.25, 20.25]} />
              <meshStandardMaterial color="#333" roughness={0.8} transparent opacity={interiorOpacity} />
            </mesh>
            <mesh position={[6, 0.7, 0]}>
              <boxGeometry args={[0.1, 1.4, 20.25]} />
              <meshStandardMaterial color="#6f6b64" transparent opacity={interiorOpacity} />
            </mesh>
          </group>

          {/* Extensión de Aulas (Piso Superior) */}
          <group position={[-15.5, 8, -64.625]}>
            <mesh>
              <boxGeometry args={[0.2, 4, 20.25]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Techo de Aulas Extensión */}
            <mesh position={[-4.1, 2, 0]}>
              <boxGeometry args={[8.5, 0.1, 20.25]} />
              <meshStandardMaterial color="#a4a4a4" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Divisorias adicionales */}
            {[3, -4, -10.125].map((z, i) => (
              <mesh key={`class_div_ext_${i}`} position={[-4.1, 0, z]}>
                <boxGeometry args={[8.25, 4, 0.2]} />
                <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
              </mesh>
            ))}
            {/* Pared trasera adicional */}
            <mesh position={[-8.2, 0, 0]}>
              <boxGeometry args={[0.2, 4, 20.25]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Puertas adicionales */}
            {[6.5, -0.5, -7.5].map((z, i) => (
              <group key={`class_door_ext_${i}`} position={[0.11, -0.75, z]}>
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

          {/* Extensión de Oficinas (Planta Baja) */}
          <group position={[-14.9, 3, -64.875]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.2, 6, 19.75]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={interiorOpacity} />
            </mesh>
            {/* Puertas de oficina adicionales */}
            {[2.375, -5.625].map((z, i) => (
              <group key={`off_door_ext_${i}`} position={[0.1, -1.75, z]}>
                <mesh>
                  <boxGeometry args={[0.05, 2.5, 1.4]} />
                  <meshStandardMaterial color="#8f3f2e" roughness={0.8} transparent opacity={interiorOpacity} />
                </mesh>
                <mesh position={[0.03, 0.4, 0]}>
                  <boxGeometry args={[0.01, 1, 0.8]} />
                  <meshStandardMaterial color="#c8d8e8" transparent opacity={0.3 * interiorOpacity} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* Paredes superiores del galpón - Se mantienen visibles la trasera e izquierda al estar dentro */}
      <group position={[11, 9, -35]}>
        {/* Pared Atrás */}
        <mesh position={[0, 0, -39.75]}>
          <boxGeometry args={[70.5, 6, 0.5]} />
          <meshStandardMaterial color="#2a2f35" roughness={0.9} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        {/* Pared Izquierda */}
        <mesh position={[-35.25, 0, 0]}>
          <boxGeometry args={[0.5, 6, 80]} />
          <meshStandardMaterial color="#2a2f35" roughness={0.9} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        {/* Pared Derecha - Solo visible afuera */}
        <mesh position={[35.25, 0, 0]} visible={!isInside}>
          <boxGeometry args={[0.5, 6, 80]} />
          <meshStandardMaterial color="#2a2f35" roughness={0.9} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        {/* Pared Frente (Fraccionada para huecos de ventanas) */}
        <group position={[0, 0, 39.75]} visible={!isInside}>
          {/* Base de la pared (debajo de ventanas) */}
          <mesh position={[0, -2.25, 0]}>
            <boxGeometry args={[70.5, 1.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Top de la pared (encima de ventanas) */}
          <mesh position={[0, 2.75, 0]}>
            <boxGeometry args={[70.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Secciones verticales (entre ventanas y laterales) */}
          {/* Lateral izquierdo hasta ventana -27 (world -16) */}
          <mesh position={[-31.875, 0.25, 0]}>
            <boxGeometry args={[6.75, 4.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Entre -27 y 3 (world 14) */}
          <mesh position={[-12, 0.25, 0]}>
            <boxGeometry args={[27, 4.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Entre 3 y 10 (world 21) */}
          <mesh position={[6.5, 0.25, 0]}>
            <boxGeometry args={[4, 4.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Entre 10 y 17 (world 28) */}
          <mesh position={[13.5, 0.25, 0]}>
            <boxGeometry args={[4, 4.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          {/* Lateral derecho desde 17 */}
          <mesh position={[26.875, 0.25, 0]}>
            <boxGeometry args={[16.75, 4.5, 0.5]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
        </group>


        {/* Techo superior plano - Solo visible afuera */}
        <mesh position={[0, 3, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={!isInside}>
          <planeGeometry args={[70.5, 80]} />
          <meshStandardMaterial color="#2a2f35" roughness={0.9} />
        </mesh>
      </group>

      <mesh
        position={[11, 13.1667, -35]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[40.7, 1, 2.3333]}
        visible={!isInside}
      >
        <cylinderGeometry args={[1, 1, 80, 3]} />
        <meshStandardMaterial color="#2a2f35" roughness={0.9} flatShading />
      </mesh>

      <group visible={!isInside}>
        <InstancedRibs
          count={199}
          args={[35, 0.05, 0.12]}
          color="#1a2026"
          getPosition={getRoofRibPosLeft}
          getRotation={() => [0, 0, 0.11]}
        />
        <InstancedRibs
          count={199}
          args={[35, 0.05, 0.12]}
          color="#1a2026"
          getPosition={getRoofRibPosRight}
          getRotation={() => [0, 0, -0.11]}
        />
      </group>

      <group visible={!isInside}>
        <group key="win_front_left">
          <mesh position={[-16, 9.5, 5.05]}>
            <boxGeometry args={[3, 4, 0.05]} />
            <meshStandardMaterial
              color="#a0c0e0"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.15}
            />
          </mesh>
          <mesh position={[-16, 6, 5.3]}>
            <boxGeometry args={[4.2, 3, 0.6]} />
            <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} />
          </mesh>
        </group>

        {[14, 21, 28].map((x, j) => (
          <group key={`win_front_right_${j}`}>
            <mesh position={[x, 9.5, 5.05]}>
              <boxGeometry args={[3, 4, 0.05]} />
              <meshStandardMaterial
                color="#a0c0e0"
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.15}
              />
            </mesh>
            <mesh position={[x, 6, 5.3]}>
              <boxGeometry args={[4.2, 3, 0.6]} />
              <meshStandardMaterial color="#f0efe9" roughness={0.9} transparent opacity={wallOpacity} />
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

      {/* Entrada Balcón (detrás del letrero UNViMe) - 2 Pares de puertas dobles */}
      <group position={[-0.5, 9.25, 5]} visible={!isInside}>
        {/* Par Izquierdo */}
        <group position={[-1.5, 0, 0]}>
          {/* Marco Exterior */}
          <mesh>
            <boxGeometry args={[4.2, 5.2, 0.15]} />
            <meshStandardMaterial color="#1a1e24" />
          </mesh>
          {/* Puertas */}
          {[-1, 1].map((x) => (
            <group key={`balcony_door_l_${x}`} position={[x, 0, 0.05]}>
              <mesh>
                <boxGeometry args={[2, 4.8, 0.1]} />
                <meshStandardMaterial color="#0d0c0b" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Marco interno fino */}
              <mesh>
                <boxGeometry args={[2, 4.8, 0.1]} />
                <meshStandardMaterial color="#333" wireframe />
              </mesh>
              {/* Picaporte */}
              <mesh position={[x > 0 ? -0.8 : 0.8, 0, 0.05]}>
                <boxGeometry args={[0.05, 0.6, 0.1]} />
                <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>

        <group position={[2.5, 0, 0]}>
          {/* Marco Exterior */}
          <mesh>
            <boxGeometry args={[3.5, 5.2, 0.15]} />
            <meshStandardMaterial color="#1a1e24" />
          </mesh>
          {/* Puertas */}
          {[-1, 1].map((x) => (
            <group key={`balcony_door_l_${x}`} position={[x, 0, 0.05]}>
              <mesh>
                <boxGeometry args={[2, 4.8, 0.1]} />
                <meshStandardMaterial color="#0d0c0b" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Marco interno fino */}
              <mesh>
                <boxGeometry args={[2, 4.8, 0.1]} />
                <meshStandardMaterial color="#333" wireframe />
              </mesh>
              {/* Picaporte */}
              <mesh position={[x > 0 ? -0.8 : 0.8, 0, 0.05]}>
                <boxGeometry args={[0.05, 0.6, 0.1]} />
                <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>


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
  const extX = 65;
  const extZ = -85;
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

      <LowPolyTree position={[-15, 0, -2]} scale={1.1} isNewton={true} />
      <LandingSteps position={[6.4, 0, -12.2]} />
      <ConcreteBench position={[-9, 0, -11.5]} />
      <BicycleRack position={[15, 0, 7]} rotation={[0, 0, 0]} />
      <BicycleRack position={[19, 0, 7]} rotation={[0, 0, 0]} />

    </group>
  );
}

// --- Mobile Controls ---

function Joystick({ onChange }) {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  const handleMove = useCallback((e) => {
    if (!active) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = rect.width / 2;
    
    if (dist > maxDist) {
      dx *= maxDist / dist;
      dy *= maxDist / dist;
    }
    
    setPos({ x: dx, y: dy });
    // Map screen Y to 3D Z
    onChange({ x: dx / maxDist, z: dy / maxDist });
  }, [active, onChange]);

  const handleEnd = useCallback(() => {
    setActive(false);
    setPos({ x: 0, y: 0 });
    onChange({ x: 0, z: 0 });
  }, [onChange]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: "clamp(30px, 10vw, 60px)",
        left: "clamp(30px, 10vw, 60px)",
        width: "100px",
        height: "100px",
        background: "rgba(0,0,0,0.05)",
        borderRadius: "50%",
        touchAction: "none",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(0,0,0,0.1)",
        backdropFilter: "blur(4px)"
      }}
      onTouchStart={(e) => { setActive(true); }}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
    >
      <div style={{
        width: "40px",
        height: "40px",
        background: active ? "rgba(200,160,80,0.9)" : "rgba(0,0,0,0.2)",
        borderRadius: "50%",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: active ? "none" : "transform 0.2s ease-out"
      }} />
    </div>
  );
}

// --- Movement Controller (Direct POV) ---

function MovementController({ onPositionUpdate, teleportPos, joystickRef }) {
  const [, getKeys] = useKeyboardControls();
  const pos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const velocity = useMemo(() => new THREE.Vector3(), []);
  const speed = 12;

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    velocity.set(0, 0, 0);
    if (forward) velocity.z -= 1;
    if (backward) velocity.z += 1;
    if (left) velocity.x -= 1;
    if (right) velocity.x += 1;

    // Joystick input
    if (joystickRef?.current) {
      velocity.x += joystickRef.current.x;
      velocity.z += joystickRef.current.z;
    }

    // Teleportation logic
    if (teleportPos) {
      pos.copy(teleportPos);
    }

    if (velocity.length() > 0) {
      velocity.normalize().multiplyScalar(speed * delta);
      pos.add(velocity);
    }

    // Limit movement boundaries
    // X: From left fence to right area
    pos.x = THREE.MathUtils.clamp(pos.x, -22, 55);
    // Z: From deep inside the lab to the front gate area
    pos.z = THREE.MathUtils.clamp(pos.z, -75, 12);

    onPositionUpdate?.(pos.clone());
    invalidate();
  });

  return null;
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
  positions,
  activeId,
  setActiveId,
  onOpenOverlay,
}) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isActive = activeId === index;

  useCursor(hovered);

  const pedHeight = TAG_HEIGHTS[project.tag] ?? DEFAULT_PED_HEIGHT;

  // Robust image resolution — explicit fallback prop, no string-sniffing
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

  // Pick display image: prefer first non-video from images[], else fallback
  const rawImg = useMemo(() => {
    const candidates = [
      ...(Array.isArray(project.images) ? project.images : []),
      project.image,
    ].filter(Boolean);
    const nonVideo = candidates.find((p) => !p.endsWith(".mp4"));
    return nonVideo || "/SimpleBuyPedidos.png";
  }, [project]);

  const safeImg = resolve(rawImg);

  const gridX = positions[index][0] * SPACING;
  const gridZ = positions[index][1] * SPACING;
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
        if (isActive) {
          setActiveId(null);
        } else {
          setActiveId(index);
          onOpenOverlay?.(index);
        }
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
          <SafeImage
            url={safeImg}
            scale={[3, 3 * 0.65]}
            position={[0, 0.2, 0]}
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
    </group>
  );
});

function SceneGroup({ projects, activeId, setActiveId, teleportPos, onPlayerPosChange, joystickRef, baseRot = 0, onOpenOverlay }) {
  const groupRef = useRef();
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));
  const [showHint, setShowHint] = useState(true);
  const positions = useMemo(() => buildPositions(projects.length), [projects.length]);

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
      tY = -(TAG_HEIGHTS[projects[activeId]?.tag] ?? DEFAULT_PED_HEIGHT) + 1;
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
          positions={positions}
          activeId={activeId}
          setActiveId={setActiveId}
          onOpenOverlay={onOpenOverlay}
        />
      ))}
      <MovementController 
        onPositionUpdate={(p) => {
          setPlayerPos(p);
          onPlayerPosChange?.(p);
        }} 
        teleportPos={teleportPos} 
        joystickRef={joystickRef}
      />
      <CameraController activeId={activeId} playerPos={playerPos} />
      {/* Old hint removed for the new onboarding cartel */}

      {/* WalkingSprite (bot antiguo) removido */}
      <Scenery playerPos={playerPos} />


      {/* Pasto base mejorado que rodea el galpón y la entrada */}
      <group position={[22, -0.05, -35]}>
        {/* Base principal que rodea el galpón */}
        <mesh receiveShadow>
          <boxGeometry args={[80, 0.1, 90]} />
          <meshStandardMaterial color="#6b8c54" roughness={1} />
        </mesh>
        {/* Relleno lateral izquierdo (Newton tree area) */}
        <mesh position={[-35, 0, 35]} receiveShadow>
          <boxGeometry args={[15, 0.1, 20]} />
          <meshStandardMaterial color="#6b8c54" roughness={1} />
        </mesh>
      </group>


      <mesh position={[10, -0.15, -35]} receiveShadow>
        <boxGeometry args={[140, 0.1, 140]} />
        <meshStandardMaterial color="#f6f4ee" roughness={1} />
        <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[140, 140, 70, 70]} />
          <meshBasicMaterial
            color="#e5e3dc"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </mesh>
    </group>
  );
}


// --- Onboarding Overlay ---

function OnboardingOverlay({ isMobile, onStart }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 100,
      background: "rgba(13, 12, 11, 0.9)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#edeae4",
      textAlign: "center",
      padding: "24px"
    }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "36px", 
          marginBottom: "16px",
          color: "#88b09d"
        }}>
          Explora la Universidad
        </h2>
        
        <div style={{ 
          background: "rgba(255,255,255,0.05)", 
          padding: "24px", 
          borderRadius: "16px", 
          marginBottom: "24px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          {isMobile ? (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                border: "2px solid #88b09d", 
                borderRadius: "50%", 
                margin: "0 auto 12px",
                position: "relative"
              }}>
                <div style={{ 
                  width: "20px", 
                  height: "20px", 
                  background: "#88b09d", 
                  borderRadius: "50%", 
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  animation: "joystickMove 2s infinite ease-in-out"
                }} />
              </div>
              <style>{`
                @keyframes joystickMove {
                  0%, 100% { transform: translate(0, 0); }
                  25% { transform: translate(10px, 0); }
                  50% { transform: translate(0, 10px); }
                  75% { transform: translate(-10px, 0); }
                }
              `}</style>
              <p style={{ fontSize: "14px", margin: 0 }}>Usa el <strong>Joystick</strong> en la parte inferior izquierda para moverte.</p>
            </div>
          ) : (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", border: "1px solid #88b09d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>W</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", border: "1px solid #88b09d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>A</div>
                <div style={{ width: "32px", height: "32px", border: "1px solid #88b09d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>S</div>
                <div style={{ width: "32px", height: "32px", border: "1px solid #88b09d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>D</div>
              </div>
              <p style={{ fontSize: "14px", margin: 0 }}>Usa las teclas <strong>WASD</strong> o las <strong>Flechas</strong> para moverte.</p>
            </div>
          )}
          
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "16px 0" }} />
          
          <p style={{ fontSize: "13px", color: "#a19d94", fontStyle: "italic" }}>
            Tip: ¡Puedes caminar dentro de la universidad para ver los laboratorios y aulas!
          </p>
        </div>

        <button 
          onClick={onStart}
          style={{
            padding: "14px 40px",
            background: "#88b09d",
            border: "none",
            borderRadius: "30px",
            color: "#0d0c0b",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.2s ease, background 0.2s ease",
            boxShadow: "0 8px 24px rgba(136, 176, 157, 0.3)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          COMENZAR EXPERIENCIA
        </button>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Story3D({ projects, active, onClose }) {

  const [activeId, setActiveId] = useState(null);
  const [viewRotation, setViewRotation] = useState(0);
  const [overlayProject, setOverlayProject] = useState(null);

  const handleOpenOverlay = useCallback((idx) => {
    setOverlayProject(projects[idx] ?? null);
  }, [projects]);

  const handleCloseOverlay = useCallback(() => {
    setOverlayProject(null);
    setActiveId(null);
  }, []);

  const [teleportPos, setTeleportPos] = useState(null);
  const joystickRef = useRef({ x: 0, z: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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

  const [showOnboarding, setShowOnboarding] = useState(true);

  // Memoize state setter for ProjectFrame
  const handleSetActiveId = useCallback((id) => setActiveId(id), []);

  useEffect(() => {
    if (!active) {
      setActiveId(null);
      setOverlayProject(null);
      setShowOnboarding(true); // Reset onboarding when closed
    }
  }, [active]);


  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));
  const isInside = playerPos.x > -12.2 && playerPos.x < 26.2 && playerPos.z < -12.3 && playerPos.z > -56.2;
  const isGroundFloor = playerPos.y < 2;

  if (!active) return null;

  // Adaptive reflector resolution: lower on mobile/low-end

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
          background: "#0d0c0b",
          overflow: "hidden",
        }}
      >
        {showOnboarding && (
          <OnboardingOverlay 
            isMobile={isMobile} 
            onStart={() => setShowOnboarding(false)} 
          />
        )}

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
        <button
          onClick={() => setViewRotation(prev => prev + Math.PI / 2)}
          style={{
            position: "absolute",
            top: "clamp(16px,4vw,32px)",
            right: "clamp(80px,10vw,100px)",
            zIndex: 70,
            background: "rgba(255,255,255,0.9)",
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          title="Rotar vista"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: `rotate(${viewRotation}rad)`, transition: "transform 0.5s ease" }}
          >
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>

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
                padding: isMobile ? "10px 20px" : "12px 24px",
                background: !isGroundFloor ? "rgba(200,160,80,0.9)" : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "30px",
                color: !isGroundFloor ? "white" : "#1a1814",
                fontSize: isMobile ? "10px" : "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
            >
              {isMobile ? "Piso 2" : "Ver Segundo Piso"}
            </button>
          </div>

        {/* Joystick para móvil */}
        {isMobile && activeId === null && (
          <Joystick onChange={(dir) => { joystickRef.current = dir; }} />
        )}

        {/* Hint */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(16px,4vw,32px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 70,
            color: "rgba(255,255,255,0.4)",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            pointerEvents: "none",
            width: "90%",
            textAlign: "center",
          }}
        >
          {activeId === null
            ? (isMobile ? "Usa el joystick para explorar · Toca los proyectos" : "Explorar: WASD / Flechas · Click en bloque para ver detalles")
            : "Click fuera o en cerrar para volver"}
        </div>

        {/* ── Project detail overlay — fixed DOM, no 3D Html clipping — */}
        {overlayProject && (
          <div
            onClick={handleCloseOverlay}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              background: "rgba(13,12,11,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(90vw, 400px)",
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "28px",
                background: "rgba(252,251,248,0.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "16px",
                color: "#1a1814",
                textAlign: "left",
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
                animation: "fadeInUp 0.3s ease forwards",
              }}
            >
              <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#6b9b88", fontWeight: 600 }}>
                  {overlayProject.tag}
                </span>
                <span style={{ fontSize: "11px", color: "#8a837a" }}>{overlayProject.year}</span>
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "26px", margin: "0 0 18px", fontWeight: 600 }}>
                {overlayProject.name}
              </h3>
              {overlayProject.problem && !overlayProject.problem.includes("←") && (
                <div style={{ marginBottom: "14px" }}>
                  <strong style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a736a", marginBottom: "6px" }}>El desafío</strong>
                  <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#3a3834", margin: 0 }}>{overlayProject.problem}</p>
                </div>
              )}
              {overlayProject.solution && !overlayProject.solution.includes("←") && (
                <div>
                  <strong style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a736a", marginBottom: "6px" }}>La solución</strong>
                  <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#3a3834", margin: 0 }}>{overlayProject.solution}</p>
                </div>
              )}
              <button
                onClick={handleCloseOverlay}
                style={{ marginTop: "22px", width: "100%", padding: "11px", background: "transparent", border: "1px solid rgba(0,0,0,0.12)", color: "#1a1814", borderRadius: "8px", cursor: "pointer", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.12em" }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ── Canvas: frameloop="demand" → only renders when invalidate() called — */}
        <Canvas
          orthographic
          frameloop="demand"
          camera={{ position: [15, 15, 20], zoom: 50, near: -100, far: 100 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveId(null);
          }}
          gl={{ antialias: true, maxTextureSize: 2048 }}
        >
          <color attach="background" args={["#0d0c0b"]} />
          <fog attach="fog" args={["#0d0c0b", 30, 90]} />
          <ambientLight intensity={1.5} color="#ffffff" />

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
            joystickRef={joystickRef}
            baseRot={viewRotation}
            onOpenOverlay={handleOpenOverlay}
          />
          <Preload all />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}
