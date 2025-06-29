import { RigidBody } from "@react-three/rapier";
import { ElementComponentProps } from './types';
import { Vector3 } from "three";

const width = 100;
const height = 100;
const depth = 10;

export default function Ground({ meshProps, rigidBodyProps }: ElementComponentProps) {
    return <mesh {...meshProps} >
        <mesh position={[0, -depth / 2, 0]}>
            <planeGeometry args={[width, height]} rotateX={Math.PI / 2 * -1} />
            <meshBasicMaterial color='#0000dd' />
        </mesh>
        <RigidBody type='fixed' {...rigidBodyProps}>
            <mesh position={[0, -5, 0]}>
                <boxGeometry args={[width, depth, height]} />
            </mesh>
        </RigidBody>
    </mesh>

};