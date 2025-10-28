"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";



export default function PersonModel() {
  function Model() {
    const { scene } = useGLTF("/models/cj.glb");
    return <primitive object={scene} scale={1} />;
  }

  return (
    <div style={{ width: "500px", height: "400px" }} className="border bg-red-500">
      <Canvas camera={{ position: [0, 2, 3] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
}