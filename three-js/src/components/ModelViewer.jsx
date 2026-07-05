import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'

const T_SHIRT_URL = '/models/tshirt.glb'
const POLO_URL = '/models/polo_tshirt.glb'

function Model({ url, position }) {
  const { scene } = useGLTF(url)
  return (
    <group position={position}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

export default function ModelViewer() {
  return (
    <>
      <color attach="background" args={['#14141f']} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, 4, -5]} intensity={0.4} />
      <directionalLight position={[0, -5, 0]} intensity={0.2} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Models side by side */}
      <Model url={T_SHIRT_URL} position={[-1.8, 0, 0]} />
      <Model url={POLO_URL} position={[1.8, 0, 0]} />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.6}
        scale={12}
        blur={2.5}
        far={4}
      />

      {/* Controls */}
      <OrbitControls
        makeDefault
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={8}
      />
    </>
  )
}
