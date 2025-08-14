'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Load model from public folder and center pivot
function Model() {
  const gltf = useGLTF('/Collared-Shirt.glb') // place model.glb inside public/
  const modelRef = useRef<THREE.Object3D>(null)
  const { camera } = useThree()

  useEffect(() => {
    if (modelRef.current) {
      // Center model so pivot is at the center
      const box = new THREE.Box3().setFromObject(modelRef.current)
      const center = box.getCenter(new THREE.Vector3())
      modelRef.current.position.sub(center)

      // Move camera to face the chest area (front of shirt)
      const size = box.getSize(new THREE.Vector3())
      const frontPos = new THREE.Vector3(center.x, center.y, box.max.z + size.z)
      camera.position.set(frontPos.x, center.y, frontPos.z + 2)
      camera.lookAt(new THREE.Vector3(center.x, center.y, center.z))
    }
  }, [camera])

  return <primitive ref={modelRef} object={gltf.scene} scale={1} />
}

export default function Page() {
  return (
    <div className="h-screen w-screen bg-slate-900">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <color attach="background" args={["#707070"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 6, 5]}
          intensity={1.1}
          castShadow
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
          <OrbitControls
            enablePan
            enableZoom
            makeDefault
            rotateSpeed={0.9}
            zoomSpeed={0.9}
            minDistance={0}
            maxDistance={Infinity}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none rounded-2xl bg-black/40 px-4 py-2 text-sm text-white shadow-lg">
        Drag = rotate • Wheel = zoom • Right-drag = pan
      </div>
    </div>
  )
}

// Preload model
useGLTF.preload('/Collared-Shirt.glb')
