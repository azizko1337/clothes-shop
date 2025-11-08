"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

type Props = {
  modelPath: string
  auto?: boolean          // czy ma się ruszać automatycznie
  reactToMouse?: boolean  // czy ma reagować na mysz
  fov?: number            // zmiana przybliżenia (domyślnie 50)
}

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1} rotation={[0, 180, 0]} />;
}

// Automatyczny ruch kamery po orbicie
function AutoCamera() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const radius = 4;
    camera.position.x = Math.sin(t * 0.2) * radius;
    camera.position.z = Math.cos(t * 0.2) * radius;
    camera.position.y = 2;
    camera.lookAt(0, 1, 0);
  });
  return null;
}

// Reagowanie na pozycję myszy (łagodne podążanie)
function MouseCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  useFrame(() => {
    // wyższa czułość: większe mnożniki
    const targetX = mouse.current.x * 3;       // było 1.5
    const targetY = 1 + mouse.current.y * 1.5; // było 0.8
    // szybsza reakcja: większy współczynnik wygładzania
    const lerp = 0.18; // było 0.05

    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0); // poprawione: pełny wektor
  });
  return null;
}

export default function CarModel(props: Props) {
  return (
    <div
      className="w-full h-full absolute inset-0 -z-10"
      style={{ pointerEvents: "none" }} // brak interakcji
    >
      <Canvas
        camera={{ position: [0, 2, 5], fov: props.fov ?? 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} />
        <Model path={props.modelPath} />
        {props.auto && <AutoCamera />}
        {props.reactToMouse && <MouseCamera />}
      </Canvas>
    </div>
  );
}