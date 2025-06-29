import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export function TestElementComponent() {
    const ref = useRef<Mesh>(null!);
    useFrame((state, delta) => (ref.current.rotation.x += delta))

    return <mesh ref={ref}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'pink'} />
    </mesh>
}