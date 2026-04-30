import { Text } from "@react-three/drei";

export function WarehouseBuilding({ interiorMode = false }) {
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
      </group>

      {!interiorMode && (
        <mesh position={[11, 9, -15]} castShadow receiveShadow>
          <boxGeometry args={[70, 6, 40]} />
          <meshStandardMaterial color="#2a2f35" roughness={0.9} />
        </mesh>
      )}

      {!interiorMode && (
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
      )}

      {/* Ventanas laterales grandes con marco negro - lado derecho (como en foto del balcon) */}
      {[14, 21, 28, 35].map((z, j) => (
        <group key={`win_side_right_${j}`}>
          {/* Marco negro */}
          <mesh position={[45.4, 9, z - 34.75 + 19]} castShadow>
            <boxGeometry args={[0.3, 5.5, 5.5]} />
            <meshStandardMaterial color="#1a1e24" roughness={0.7} />
          </mesh>
          {/* Vidrio */}
          <mesh position={[45.4, 9, z - 34.75 + 19]}>
            <boxGeometry args={[0.18, 5, 5]} />
            <meshStandardMaterial
              color="#c8d8e8"
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.28}
            />
          </mesh>
          {/* Travesaño horizontal */}
          <mesh position={[45.4, 9, z - 34.75 + 19]}>
            <boxGeometry args={[0.25, 0.12, 5]} />
            <meshStandardMaterial color="#1a1e24" roughness={0.7} />
          </mesh>
          {/* Travesaño vertical */}
          <mesh position={[45.4, 9, z - 34.75 + 19]}>
            <boxGeometry args={[0.25, 5, 0.12]} />
            <meshStandardMaterial color="#1a1e24" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {!interiorMode && (
        <mesh position={[-6, 7, 6.75]} castShadow receiveShadow>
          <boxGeometry args={[4, 14, 3.5]} />
          <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
        </mesh>
      )}

      {!interiorMode && (
        <mesh position={[4.5, 7, 8]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 14, 1]} />
          <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
        </mesh>
      )}

      {!interiorMode && (
        <mesh position={[-1.375, 13.5, 6.75]} castShadow receiveShadow>
          <boxGeometry args={[13.25, 2.5, 3.5]} />
          <meshStandardMaterial color="#e5e3dc" roughness={0.8} />
        </mesh>
      )}

      {!interiorMode &&
        Array.from({ length: 53 }).map((_, i) => {
        const xPos = -7.875 + i * 0.25;
        let height = 15.5;
        let yPos = 7;
        let zPos = 8.58;
        if (xPos > -3.9 && xPos < 3.7) {
          height = 2.5;
          yPos = 13.5;
        }
        if (xPos >= 3.7) zPos = 8.58;

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

      {!interiorMode && (
        <mesh position={[-0.125, 6, 8.25]} castShadow receiveShadow>
          <boxGeometry args={[7.75, 1.5, 0.5]} />
          <meshStandardMaterial color="#1a202c" roughness={0.8} />
        </mesh>
      )}

      {!interiorMode && (
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
      )}

      {!interiorMode && (
        <>
          <Text
            position={[-6, 10.9, 8.66]}
            fontSize={1.4}
            color="#0b0b0b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0}
            fontWeight="bold"
          >
            UNViMe
          </Text>
          <Text
            position={[-6, 10.95, 8.73]}
            fontSize={1.4}
            color="#2a2a2a"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0}
            fontWeight="bold"
          >
            UNViMe
          </Text>
          <Text
            position={[-6, 11, 8.8]}
            fontSize={1.4}
            color="#f7f5ef"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#111111"
            fontWeight="bold"
          >
            UNViMe
          </Text>
        </>
      )}

      {!interiorMode && (
        <mesh position={[0, 7, 5]} castShadow receiveShadow>
          <boxGeometry args={[8, 14, 0.5]} />
          <meshStandardMaterial color="#d5d3cc" roughness={0.9} />
        </mesh>
      )}

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
            transparent
            opacity={0.22}
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
            transparent
            opacity={0.22}
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
            transparent
            opacity={0.22}
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
            transparent
            opacity={0.22}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.05, 5, 0.02]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {!interiorMode && (
        <>
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
        </>
      )}

      {!interiorMode && <group position={[4.2, 0, 6.5]}>
        {Array.from({ length: 15 }).map((_, i) => {
          const fraction = i / 14;
          const xOffset = fraction * 7;
          const yOffset = 6.75 - fraction * 6.75;
          return (
            <mesh key={`stair_${i}`} position={[xOffset, yOffset, 0]} castShadow>
              <boxGeometry args={[0.6, 0.6, 2]} />
              <meshStandardMaterial color="#a3a098" />
            </mesh>
          );
        })}
      </group>}

      {interiorMode && (
        <group>
          {/* Entrepiso/balcon interior sobre lado calle */}
          <mesh position={[-18.8, 6.15, -15]} receiveShadow>
            <boxGeometry args={[8, 0.25, 34]} />
            <meshStandardMaterial color="#d3d0c8" roughness={0.85} />
          </mesh>
          <mesh position={[-14.85, 6.85, -15]} receiveShadow>
            <boxGeometry args={[0.18, 1.35, 34]} />
            <meshStandardMaterial color="#6f6b64" roughness={0.7} />
          </mesh>
          {Array.from({ length: 13 }).map((_, i) => (
            <mesh key={`balcony_post_${i}`} position={[-14.85, 6.55, -31 + i * 2.65]}>
              <boxGeometry args={[0.12, 0.75, 0.12]} />
              <meshStandardMaterial color="#6f6b64" roughness={0.7} />
            </mesh>
          ))}

          {/* Puertas internas sobre balcon */}
          {[-29.5, -20, -11, -2, 7].map((z, i) => (
            <group key={`inside_door_${i}`} position={[-23.45, 7.3, z]}>
              <mesh>
                <boxGeometry args={[0.08, 2.5, 1.45]} />
                <meshStandardMaterial color="#8f3f2e" roughness={0.75} />
              </mesh>
              <mesh position={[0.08, 1.45, 0]}>
                <boxGeometry args={[0.08, 0.3, 1.7]} />
                <meshStandardMaterial color="#c4b8a6" roughness={0.8} />
              </mesh>
            </group>
          ))}

          {/* Vigas techo interiores */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`inside_beam_${i}`}
              position={[-18 + i * 8.2, 11.35, -15]}
              rotation={[0, 0, Math.PI / 16]}
            >
              <boxGeometry args={[0.45, 0.45, 38]} />
              <meshStandardMaterial color="#5a6470" roughness={0.65} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

