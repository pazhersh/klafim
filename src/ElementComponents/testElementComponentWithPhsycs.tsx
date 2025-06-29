import { RigidBody } from "@react-three/rapier";

export function TestElementComponentWithPhysics() {

    return <RigidBody>
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={'orange'} />
        </mesh>
    </RigidBody>;
}