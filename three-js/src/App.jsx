import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ModelViewer from './components/ModelViewer'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>3D T-Shirt Viewer</h1>
        <p>Drag to orbit &bull; Scroll to zoom</p>
      </header>
      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          gl={{ antialias: true, toneMapping: 3 }}
        >
          <Suspense fallback={null}>
            <ModelViewer />
          </Suspense>
        </Canvas>
      </div>
      <div className="model-labels">
        <span>T-Shirt</span>
        <span>Polo T-Shirt</span>
      </div>
    </div>
  )
}

export default App
