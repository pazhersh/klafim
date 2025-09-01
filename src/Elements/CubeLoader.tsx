import { useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useRef } from "react";
import { Mesh, TextureLoader } from "three"

const ROTATION_SPEED = 0.005;

export default function CubeLoader() {
    const colorMap = useLoader(TextureLoader, '/assets/loading.png');

    const boxRef = useRef<Mesh>(null);

    // TODO: this feels like an awful way to rotate an element...
    useFrame(() => {
        if (boxRef.current) {
            boxRef.current.rotation.x += - ROTATION_SPEED / 2;
            boxRef.current.rotation.y += ROTATION_SPEED;
        }
    });

    return <Suspense fallback={null}>
        <mesh ref={boxRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={colorMap} />
        </mesh>
    </Suspense>;
}