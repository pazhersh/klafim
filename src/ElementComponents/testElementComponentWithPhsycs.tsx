import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Mesh } from "three";

export function TestElementComponentWithPhysics() {
    const ref = useRef<Mesh>(null!);

    return <RigidBody>
        <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'pink'} />
        </mesh>
    </RigidBody>;
}