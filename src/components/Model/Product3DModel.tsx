"use client"

import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Product3DModel({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-full min-h-[300px] bg-zinc-900/50 rounded-xl overflow-hidden relative">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls autoRotate />
        </Canvas>
      </Suspense>
    </div>
  );
}
